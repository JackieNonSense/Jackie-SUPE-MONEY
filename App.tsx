import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, SymbolType, WinLine, DENOMINATIONS, GameScreen, GameMode, CustomAssets } from './types';
import { SYMBOLS, PAYTABLE, REEL_STRIPS, FREE_GAME_STRIPS, LINES_5, LINES_25 } from './constants';
import { JackpotDisplay } from './components/JackpotDisplay';
import { SlotMachine } from './components/SlotMachine';
import { ControlPanel } from './components/ControlPanel';
import { PaytableModal } from './components/PaytableModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FeatureModal } from './components/FeatureModal';
import { SettingsModal } from './components/SettingsModal';
import { audio } from './utils/audio';

const INITIAL_CREDITS = 10000; // $100.00

function App() {
  const [gameState, setGameState] = useState<GameState>({
    screen: GameScreen.WELCOME,
    mode: GameMode.BASE,
    credits: INITIAL_CREDITS,
    denomination: 1, // Default 1 cent
    betMultiplier: 1,
    selectedLines: 25,
    isSpinning: false,
    grid: [
      [SymbolType.A, SymbolType.K, SymbolType.Q],
      [SymbolType.J, SymbolType.TEN, SymbolType.NINE],
      [SymbolType.BUFFALO, SymbolType.WOLF, SymbolType.EAGLE],
      [SymbolType.COUGAR, SymbolType.WILD, SymbolType.SCATTER],
      [SymbolType.A, SymbolType.K, SymbolType.Q],
    ],
    gridValues: Array(5).fill(null).map(() => Array(3).fill(null)),
    lastWinAmount: 0,
    winningLines: [],
    jackpots: {
      mini: 1000.00,
      minor: 5000.00,
      major: 50000.00,
      grand: 100000.00
    },
    showPaytable: false,
    featureWinAmount: 0,
    freeGames: { remaining: 0, totalPlayed: 0 },
    holdAndSpin: {
      respinsRemaining: 0,
      lockedPositions: Array(5).fill(null).map(() => Array(3).fill(false)),
      isGrandWon: false
    },
    featureModalType: 'NONE',
    
    // New State for Settings
    isSettingsOpen: false,
    customAssets: {},
    isMuted: false,
    isTransitioning: false,
  });

  // Ref to track spinning state instantly without waiting for re-renders
  const isSpinningRef = useRef(false);

  const [reelStatus, setReelStatus] = useState<('stopped' | 'spinning' | 'stopping')[]>(
    ['stopped', 'stopped', 'stopped', 'stopped', 'stopped']
  );

  // Sync ref with state
  useEffect(() => {
    isSpinningRef.current = gameState.isSpinning;
  }, [gameState.isSpinning]);

  // AUTO SPIN LOGIC FOR FEATURES
  useEffect(() => {
    if (
        (gameState.mode === GameMode.FREE_GAMES) &&
        !gameState.isSpinning &&
        gameState.featureModalType === 'NONE'
    ) {
        const timer = setTimeout(() => {
            handleSpin();
        }, 1000); 
        return () => clearTimeout(timer);
    }
  }, [gameState.mode, gameState.isSpinning, gameState.featureModalType]);

  const handleDenomSelect = (denomValue: number) => {
    const denomConfig = DENOMINATIONS.find(d => d.value === denomValue);
    const maxLines = denomConfig ? denomConfig.maxLines : 25;
    
    // Start Main BGM on game entry
    audio.playMainBgm();

    setGameState(prev => ({
      ...prev,
      denomination: denomValue,
      selectedLines: maxLines,
      betMultiplier: 1,
      screen: GameScreen.GAME,
      mode: GameMode.BASE
    }));
  };
  
  const handleToggleMute = () => {
      const muted = audio.toggleMute();
      setGameState(p => ({ ...p, isMuted: muted }));
  };

  // Trigger visual transition effect
  const triggerTransition = (callback?: () => void) => {
      setGameState(p => ({ ...p, isTransitioning: true }));
      setTimeout(() => {
          if (callback) callback();
          setTimeout(() => {
              setGameState(p => ({ ...p, isTransitioning: false }));
          }, 800);
      }, 500);
  };

  const getRandomOrbValue = useCallback((betMultiplier: number, denom: number) => {
    const rand = Math.random();
    if (rand < 0.02) return 'MAJOR';
    if (rand < 0.08) return 'MINOR';
    if (rand < 0.15) return 'MINI';
    
    // Cash value
    const multipliers = [100, 200, 500, 1000, 2000, 5000]; 
    const selectedMult = multipliers[Math.floor(Math.random() * multipliers.length)];
    return selectedMult * betMultiplier; 
  }, []);

  const calculateWin = (grid: SymbolType[][], lines: number, betPerLine: number, totalBet: number) => {
    const wins: WinLine[] = [];
    let totalWin = 0;

    // 1. Check Paylines
    const linesToCheck = lines <= 5 ? LINES_5 : LINES_25.slice(0, lines);

    linesToCheck.forEach((linePattern, lineIndex) => {
      const firstSymbolPos = linePattern[0];
      let firstSymbol = grid[0][firstSymbolPos];
      
      let matchSymbol = firstSymbol;
      
      if (firstSymbol === SymbolType.WILD) {
        for (let i = 0; i < 5; i++) {
          const row = linePattern[i];
          const s = grid[i][row];
          if (s !== SymbolType.WILD) {
            matchSymbol = s;
            break;
          }
        }
      }

      if (matchSymbol !== SymbolType.SCATTER && matchSymbol !== SymbolType.ORB && matchSymbol !== SymbolType.BONUS) {
        let count = 0;
        let currentCoords: number[][] = [];

        for (let col = 0; col < 5; col++) {
          const row = linePattern[col];
          const symbol = grid[col][row];
          
          if (symbol === matchSymbol || symbol === SymbolType.WILD) {
            count++;
            currentCoords.push([col, row]);
          } else {
            break;
          }
        }

        if (PAYTABLE[matchSymbol] && PAYTABLE[matchSymbol][count - 1] > 0) {
            const multiplier = PAYTABLE[matchSymbol][count - 1];
            const winAmount = multiplier * betPerLine;
            totalWin += winAmount;
            wins.push({
                lineIndex: lineIndex,
                amount: winAmount,
                symbol: matchSymbol,
                count: count,
                coords: currentCoords
            });
        }
      }
    });

    // 2. Check Scatters
    let scatterCount = 0;
    const scatterCoords: number[][] = [];
    
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 3; r++) {
            if (grid[c][r] === SymbolType.SCATTER) {
                scatterCount++;
                scatterCoords.push([c, r]);
            }
        }
    }

    if (PAYTABLE[SymbolType.SCATTER][scatterCount - 1] > 0) {
        const multiplier = PAYTABLE[SymbolType.SCATTER][scatterCount - 1];
        const winAmount = multiplier * totalBet; 
        totalWin += winAmount;
        wins.push({
            lineIndex: -1,
            amount: winAmount,
            symbol: SymbolType.SCATTER,
            count: scatterCount,
            coords: scatterCoords
        });
    }

    return { totalWin, wins };
  };

  const handleSpin = useCallback(() => {
    if (isSpinningRef.current) return;

    setGameState(currentState => {
        const currentDenom = currentState.denomination;
        const currentMult = currentState.betMultiplier;
        const currentLines = currentState.selectedLines;
        const currentMode = currentState.mode;
        
        const totalBetCents = currentDenom * currentMult * currentLines;
        
        if (currentMode === GameMode.BASE && currentState.credits < totalBetCents) {
          alert("Not enough credits!");
          return currentState; 
        }

        try { audio.playSpinSound(); } catch(e) {}

        setTimeout(() => startSpinSequence(currentState), 0);

        return {
            ...currentState,
            credits: currentMode === GameMode.BASE ? currentState.credits - totalBetCents : currentState.credits,
            isSpinning: true,
            lastWinAmount: 0,
            winningLines: []
        };
    });
  }, [getRandomOrbValue]);

  const startSpinSequence = (capturedState: GameState) => {
    const { mode, betMultiplier, denomination, holdAndSpin, gridValues, grid } = capturedState;
    const currentMult = betMultiplier;
    const currentDenom = denomination;

    if (mode === GameMode.HOLD_AND_SPIN) {
        setReelStatus(prev => prev.map((_, i) => 'spinning')); 
    } else {
        setReelStatus(['spinning', 'spinning', 'spinning', 'spinning', 'spinning']);
    }

    const newGrid: SymbolType[][] = [];
    const newValues: (number | string | null)[][] = Array(5).fill(null).map(() => Array(3).fill(null));
    const currentStrips = mode === GameMode.FREE_GAMES ? FREE_GAME_STRIPS : REEL_STRIPS;

    for (let i = 0; i < 5; i++) {
        const strip = currentStrips[i];
        const randomIndex = Math.floor(Math.random() * strip.length);
        const col: SymbolType[] = [];
        const colValues: (number|string|null)[] = [];

        for (let j = 0; j < 3; j++) {
            if (mode === GameMode.HOLD_AND_SPIN && holdAndSpin.lockedPositions[i][j]) {
                col.push(grid[i][j]);
                colValues.push(gridValues[i][j]);
            } else if (mode === GameMode.HOLD_AND_SPIN) {
                const rand = Math.random();
                if (rand < 0.1) { 
                    col.push(SymbolType.ORB);
                    colValues.push(getRandomOrbValue(currentMult, currentDenom));
                } else {
                    col.push(SymbolType.BLANK);
                    colValues.push(null);
                }
            } else {
                const symbol = strip[(randomIndex + j) % strip.length];
                col.push(symbol);
                if (symbol === SymbolType.ORB) {
                    colValues.push(getRandomOrbValue(currentMult, currentDenom));
                } else {
                    colValues.push(null);
                }
            }
        }
        newGrid.push(col);
        for(let j=0; j<3; j++) newValues[i][j] = colValues[j];
    }

    setGameState(prev => ({ 
        ...prev, 
        grid: newGrid,
        gridValues: newValues 
    }));

    const stopDelay = mode === GameMode.HOLD_AND_SPIN ? 400 : 600;

    const stopReel = (index: number) => {
        setReelStatus(prev => {
            const next = [...prev];
            next[index] = 'stopping';
            return next;
        });

        setTimeout(() => { try { audio.playReelStop(); } catch(e) {} }, 50);

        setTimeout(() => {
            setReelStatus(prev => {
                const next = [...prev];
                next[index] = 'stopped';
                return next;
            });
            if (index === 4) {
                finishSpin(newGrid, newValues);
            }
        }, 400); 
    };

    setTimeout(() => stopReel(0), stopDelay);
    setTimeout(() => stopReel(1), stopDelay + 300);
    setTimeout(() => stopReel(2), stopDelay + 600);
    setTimeout(() => stopReel(3), stopDelay + 900);
    setTimeout(() => stopReel(4), stopDelay + 1200);
  };

  const finishSpin = (finalGrid: SymbolType[][], finalValues: (number|string|null)[][]) => {
      try { audio.stopSpinSound(); } catch(e) {}

      setGameState(prev => {
          const betPerLineCents = prev.denomination * prev.betMultiplier;
          const totalBetCents = prev.denomination * prev.betMultiplier * prev.selectedLines;

          // 1. HOLD & SPIN LOGIC
          if (prev.mode === GameMode.HOLD_AND_SPIN) {
              let newOrbFound = false;
              let orbCount = 0;
              const newLocked = prev.holdAndSpin.lockedPositions.map(col => [...col]);

              for(let c=0; c<5; c++) {
                  for(let r=0; r<3; r++) {
                      if (finalGrid[c][r] === SymbolType.ORB) {
                          orbCount++;
                          if (!prev.holdAndSpin.lockedPositions[c][r]) {
                              newOrbFound = true;
                              newLocked[c][r] = true;
                          }
                      }
                  }
              }

              let nextRespins = newOrbFound ? 3 : prev.holdAndSpin.respinsRemaining - 1;
              let isGrand = orbCount === 15;

              if (newOrbFound) { try { audio.playWinSound(500); } catch(e){} }

              if (isGrand || nextRespins === 0) {
                  let totalCash = 0;
                  for(let c=0; c<5; c++) {
                    for(let r=0; r<3; r++) {
                        const val = finalValues[c][r];
                        if (val) {
                            if (typeof val === 'number') totalCash += val;
                            else if (val === 'MINI') totalCash += prev.jackpots.mini * 100;
                            else if (val === 'MINOR') totalCash += prev.jackpots.minor * 100;
                            else if (val === 'MAJOR') totalCash += prev.jackpots.major * 100;
                        }
                    }
                  }
                  if (isGrand) totalCash += prev.jackpots.grand * 100;

                  try { audio.playWinSound(totalCash); } catch(e){}
                  
                  return {
                      ...prev,
                      isSpinning: false,
                      credits: prev.credits + totalCash,
                      featureWinAmount: prev.featureWinAmount + totalCash,
                      lastWinAmount: totalCash,
                      featureModalType: 'FEATURE_SUMMARY',
                      mode: GameMode.BASE,
                      holdAndSpin: { ...prev.holdAndSpin, respinsRemaining: 0 }
                  };
              } else {
                  return {
                      ...prev,
                      isSpinning: false,
                      holdAndSpin: {
                          ...prev.holdAndSpin,
                          respinsRemaining: nextRespins,
                          lockedPositions: newLocked
                      }
                  };
              }
          }

          // 2. NORMAL / FREE GAME LOGIC
          const { totalWin, wins } = calculateWin(finalGrid, prev.selectedLines, betPerLineCents, totalBetCents);

          let newCredits = prev.credits + totalWin;
          let newFeatureWin = prev.featureWinAmount + totalWin;
          let nextMode: GameMode = prev.mode;
          let nextFeatureModal: any = 'NONE';
          let nextFreeGames = { ...prev.freeGames };
          let nextHoldAndSpin = { ...prev.holdAndSpin };

          if (totalWin > 0) { try { audio.playWinSound(totalWin); } catch(e){} }

          let orbCount = 0;
          let bonusCount = 0;
          for(let c=0; c<5; c++) {
              for(let r=0; r<3; r++) {
                  if (finalGrid[c][r] === SymbolType.ORB) orbCount++;
                  if (finalGrid[c][r] === SymbolType.BONUS) bonusCount++;
              }
          }

          if (orbCount >= 6) {
              // Trigger Hold & Spin
              nextMode = GameMode.HOLD_AND_SPIN;
              nextFeatureModal = 'HOLD_AND_SPIN';
              
              const locked = Array(5).fill(null).map(() => Array(3).fill(false));
              for(let c=0; c<5; c++){
                  for(let r=0; r<3; r++){
                      if (finalGrid[c][r] === SymbolType.ORB) locked[c][r] = true;
                  }
              }
              nextHoldAndSpin = {
                  respinsRemaining: 3,
                  lockedPositions: locked,
                  isGrandWon: false
              };
              
              try { audio.playFeatureTrigger(); } catch(e){}
              try { audio.playFeatureBg(); } catch(e){}

          } else if (bonusCount >= 3) {
              // Trigger Free Games
              const isRetrigger = prev.mode === GameMode.FREE_GAMES;
              nextMode = GameMode.FREE_GAMES;
              
              if (isRetrigger) {
                  // Don't show modal, just animate counter
                  nextFeatureModal = 'NONE'; 
                  nextFreeGames.remaining = prev.freeGames.remaining + 6;
                  try { audio.playWinSound(1000); } catch(e){}
              } else {
                  nextFeatureModal = 'FREE_GAMES';
                  nextFreeGames.remaining = 6;
                  try { audio.playFeatureTrigger(); } catch(e){}
                  try { audio.playFeatureBg(); } catch(e){}
              }

          } else if (prev.mode === GameMode.FREE_GAMES) {
              const remaining = prev.freeGames.remaining - 1;
              if (remaining <= 0) {
                  nextMode = GameMode.BASE;
                  nextFeatureModal = 'FEATURE_SUMMARY';
                  nextFreeGames.remaining = 0;
              } else {
                  nextFreeGames.remaining = remaining;
                  nextFreeGames.totalPlayed = prev.freeGames.totalPlayed + 1;
              }
          }

          return {
              ...prev,
              isSpinning: false,
              credits: newCredits,
              lastWinAmount: totalWin,
              featureWinAmount: newFeatureWin,
              winningLines: wins,
              mode: nextMode,
              featureModalType: nextFeatureModal,
              freeGames: nextFreeGames,
              holdAndSpin: nextHoldAndSpin
          };
      });
  };

  if (gameState.screen === GameScreen.WELCOME) {
      return <WelcomeScreen onSelect={handleDenomSelect} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between overflow-hidden relative font-sans text-white">
      {/* Transition Overlay */}
      {gameState.isTransitioning && (
          <div className="fixed inset-0 z-[200] bg-white animate-pulse pointer-events-none mix-blend-overlay"></div>
      )}

      {/* --- TECHNO / CLUB BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-transparent">
          {/* Strobe Overlay (Always running lightly) */}
          <div className="strobe-overlay"></div>
          
          {/* Laser Beams */}
          <div className="laser-beam laser-green left-[20%]"></div>
          <div className="laser-beam laser-pink left-[50%]"></div>
          <div className="laser-beam laser-blue left-[80%]"></div>
          <div className="laser-beam laser-green left-[35%] opacity-50 animation-delay-200"></div>
          
          {/* Moving Floor Grid */}
          <div className="techno-grid"></div>
      </div>

      {/* Neon Particles (Confetti) */}
      {Array.from({ length: 40 }).map((_, i) => (
         <div 
             key={`neon-${i}`} 
             className="neon-particle"
             style={{
                 left: `${Math.random() * 100}%`,
                 backgroundColor: ['#00ffff', '#ff00ff', '#ccff00'][Math.floor(Math.random() * 3)],
                 boxShadow: `0 0 5px ${['#00ffff', '#ff00ff', '#ccff00'][Math.floor(Math.random() * 3)]}`,
                 animationDuration: `${Math.random() * 5 + 3}s`,
                 animationDelay: `-${Math.random() * 5}s`,
             }}
         />
      ))}

      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col z-10 relative">
        <div className="pt-2">
            <JackpotDisplay amounts={gameState.jackpots} />
        </div>

        {gameState.mode === GameMode.HOLD_AND_SPIN && (
             <div className="absolute top-24 left-4 z-50 bg-black/80 border border-cyan-500 p-2 rounded animate-pulse shadow-[0_0_15px_cyan]">
                 <div className="text-cyan-400 font-bold uppercase text-xs">Respins</div>
                 <div className="text-3xl font-mono text-white text-center">{gameState.holdAndSpin.respinsRemaining}</div>
             </div>
        )}
        {gameState.mode === GameMode.FREE_GAMES && (
             <div className="absolute top-24 left-4 z-50 bg-black/80 border border-purple-500 p-2 rounded shadow-[0_0_15px_purple] animate-gold-pulse">
                 <div className="text-purple-400 font-bold uppercase text-xs">Free Games</div>
                 <div 
                    key={gameState.freeGames.remaining} 
                    className="text-3xl font-mono text-white text-center animate-bounce"
                 >
                    {gameState.freeGames.remaining}
                 </div>
             </div>
        )}

        <div className="flex-1 flex items-center justify-center relative">
            <SlotMachine 
                finalGrid={gameState.grid} 
                gridValues={gameState.gridValues}
                winningLines={gameState.winningLines}
                reelStatus={reelStatus}
                denomination={gameState.denomination}
                mode={gameState.mode}
                lockedPositions={gameState.mode === GameMode.HOLD_AND_SPIN ? gameState.holdAndSpin.lockedPositions : undefined}
                customImages={gameState.customAssets}
            />
        </div>

        <ControlPanel 
            credits={gameState.credits}
            currentDenom={gameState.denomination}
            currentBetMult={gameState.betMultiplier}
            selectedLines={gameState.selectedLines}
            isSpinning={gameState.isSpinning}
            isLocked={gameState.mode !== GameMode.BASE && gameState.mode !== GameMode.HOLD_AND_SPIN} 
            onBetChange={(m) => {
                if (gameState.isSpinning) return;
                try { audio.playClick(); } catch(e){}
                setGameState(p => ({ ...p, betMultiplier: m }));
            }}
            onLinesChange={(l) => {
                if (gameState.isSpinning) return;
                try { audio.playClick(); } catch(e){}
                setGameState(p => ({ ...p, selectedLines: l }));
            }}
            onSpin={handleSpin}
            lastWin={gameState.lastWinAmount}
            onBack={() => {
                if (gameState.isSpinning) return;
                try { audio.playClick(); } catch(e){}
                setGameState(p => ({ ...p, screen: GameScreen.WELCOME }));
            }}
        />
      </div>
      
      <div className="absolute top-2 left-2 z-50 flex gap-2">
          <button
              onClick={() => setGameState(p => ({ ...p, isSettingsOpen: true }))}
              disabled={gameState.isSpinning}
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center border border-gray-500 shadow-lg"
              title="Settings & Uploads"
          >
              ⚙️
          </button>
          <button
              onClick={handleToggleMute}
              className={`
                 rounded-full w-8 h-8 flex items-center justify-center border shadow-lg
                 ${gameState.isMuted ? 'bg-red-900 border-red-500 text-red-300' : 'bg-green-900 border-green-500 text-green-300'}
              `}
              title="Toggle Sound"
          >
              {gameState.isMuted ? '🔇' : '🔊'}
          </button>
      </div>

      <div className="absolute top-2 right-2 z-50">
          <button 
            onClick={() => {
                try { audio.playClick(); } catch(e){}
                setGameState(p => ({ ...p, showPaytable: true }));
            }}
            disabled={gameState.isSpinning}
            className="bg-blue-600/80 hover:bg-blue-500 text-white rounded-full w-8 h-8 font-bold border border-blue-400 shadow-[0_0_10px_blue]"
          >
              i
          </button>
      </div>

      <PaytableModal 
        isOpen={gameState.showPaytable} 
        onClose={() => {
            try { audio.playClick(); } catch(e){}
            setGameState(p => ({ ...p, showPaytable: false }));
        }} 
      />
      
      <SettingsModal 
          isOpen={gameState.isSettingsOpen}
          onClose={() => setGameState(p => ({ ...p, isSettingsOpen: false }))}
          assets={gameState.customAssets}
          onUpdateAssets={(newAssets) => setGameState(p => ({ ...p, customAssets: { ...p.customAssets, ...newAssets } }))}
      />

      {gameState.featureModalType !== 'NONE' && (
          <FeatureModal 
              type={gameState.featureModalType}
              winAmount={gameState.featureWinAmount}
              onClose={() => {
                  triggerTransition(() => {
                    setGameState(prev => ({ 
                        ...prev, 
                        featureModalType: 'NONE',
                        featureWinAmount: prev.featureModalType === 'FEATURE_SUMMARY' ? 0 : prev.featureWinAmount
                    }));
                    if (gameState.featureModalType === 'FEATURE_SUMMARY') {
                        try { audio.stopFeatureBg(); } catch(e){}
                    }
                  });
              }}
          />
      )}
    </div>
  );
}

export default App;