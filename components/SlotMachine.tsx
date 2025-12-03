
import React, { useEffect, useState } from 'react';
import { SymbolType, WinLine, GameMode, CustomAssets } from '../types';
import { SymbolItem } from './SymbolItem';
import { SYMBOLS } from '../constants';

interface SlotMachineProps {
  finalGrid: SymbolType[][];
  gridValues: (number | string | null)[][];
  winningLines: WinLine[];
  reelStatus: ('stopped' | 'spinning' | 'stopping')[];
  denomination: number;
  mode: GameMode;
  lockedPositions?: boolean[][]; // [col][row]
  customImages?: CustomAssets;
}

interface ReelColumnProps {
    symbols: SymbolType[]; 
    values: (number | string | null)[];
    status: 'stopped' | 'spinning' | 'stopping';
    colIdx: number;
    winningCoords: (rowIdx: number) => boolean;
    mode: GameMode;
    lockedRows?: boolean[];
    customImages?: CustomAssets;
}

const ReelColumn: React.FC<ReelColumnProps> = ({ 
    symbols, 
    values,
    status,
    colIdx, 
    winningCoords,
    mode,
    lockedRows,
    customImages
}) => {
    // Generate a longer strip for smoother looping animation
    // Include a mix of standard symbols and special symbols in the blur strip
    const blurStrip = Array.from({length: 12}).map((_, i) => 
        Object.values(SymbolType)[Math.floor((i * 3 + colIdx) % 12)]
    );

    const isRowLocked = (r: number) => mode === GameMode.HOLD_AND_SPIN && lockedRows && lockedRows[r];
    
    // Check if whole column is spinning
    const isSpinning = status === 'spinning';

    const getCustomImage = (type: SymbolType): string | undefined => {
        if (!customImages) return undefined;
        switch (type) {
            case SymbolType.ORB: return customImages.orbImage;
            case SymbolType.BONUS: return customImages.bonusImage;
            case SymbolType.WILD: return customImages.wildImage;
            case SymbolType.SCATTER: return customImages.scatterImage;
            case SymbolType.BUFFALO: return customImages.buffaloImage;
            case SymbolType.EAGLE: return customImages.eagleImage;
            default: return undefined;
        }
    };

    return (
        <div className="relative h-full w-full bg-black/20 overflow-hidden border-r border-black/50 last:border-r-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            {/* Reel Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.3),transparent_30%,transparent_70%,rgba(0,0,0,0.3))] pointer-events-none z-10"></div>

            {/* Static / Stopping Content */}
            <div className={`relative h-full flex flex-col items-center w-full z-0`}>
                <div className={`w-full h-full flex flex-col justify-around py-2`}>
                    {[0, 1, 2].map((rowIdx) => {
                        const symbol = symbols[rowIdx];
                        const val = values[rowIdx];
                        const locked = isRowLocked(rowIdx);
                        const cellWinning = winningCoords(rowIdx);
                        
                        let content = null;
                        
                        // In Hold & Spin, independent cells can spin
                        const isCellSpinning = isSpinning && mode === GameMode.HOLD_AND_SPIN && !locked;
                        
                        // In Base/Free Games, whole reel spins, so hide static unless stopping
                        const isHiddenByBlur = isSpinning && mode !== GameMode.HOLD_AND_SPIN;

                        if (isCellSpinning) {
                             // Cell specific spin - blur effect for individual cell
                             content = (
                                <div className="w-full h-full flex flex-col animate-spin-scroll opacity-80 blur-[2px]">
                                     {/* Render a tiny vertical strip of symbols passing by */}
                                     {/* Use a mix of symbols for better visuals */}
                                     <div className="flex-1 flex items-center justify-center"><SymbolItem type={SymbolType.ORB} customImage={customImages?.orbImage} /></div>
                                     <div className="flex-1 flex items-center justify-center"><SymbolItem type={SymbolType.BUFFALO} customImage={customImages?.buffaloImage} /></div>
                                     <div className="flex-1 flex items-center justify-center"><SymbolItem type={SymbolType.A} /></div>
                                </div>
                             );
                        } else if (isHiddenByBlur) {
                             // Placeholder to keep spacing correct
                             content = <div className="opacity-0 w-full h-full"><SymbolItem type={symbol} /></div>; 
                        } else {
                             // Static Symbol
                             content = (
                                 <SymbolItem 
                                    type={symbol} 
                                    value={val}
                                    isWin={mode === GameMode.BASE && cellWinning}
                                    isLocked={locked}
                                    customImage={getCustomImage(symbol)}
                                />
                             );
                        }

                        return (
                            <div key={rowIdx} className={`flex-1 w-full h-full flex items-center justify-center p-1 relative overflow-hidden`}>
                                {content}
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Full Column Blur Effect for Spin - The Animation Layer */}
            {/* Rendered ON TOP of static content when spinning */}
            {isSpinning && mode !== GameMode.HOLD_AND_SPIN && (
                 <div className="absolute -top-[150%] left-0 w-full z-20 flex flex-col animate-spin-scroll opacity-90">
                    {/* Repeat the strip twice to ensure loop coverage */}
                    {[...blurStrip, ...blurStrip].map((s, i) => (
                        <div key={i} className="h-[120px] w-full flex items-center justify-center scale-y-125 blur-[2px] my-[-10px]">
                            {/* Pass custom images to blur strip too so it looks consistent */}
                            <SymbolItem type={s} customImage={getCustomImage(s)} />
                        </div>
                    ))}
                </div>
            )}
            
            {/* Glass Glare */}
            <div className="absolute inset-0 glass-glare pointer-events-none z-30 opacity-10"></div>
        </div>
    );
};

export const SlotMachine: React.FC<SlotMachineProps> = ({ 
    finalGrid, 
    gridValues, 
    winningLines, 
    reelStatus,
    denomination,
    mode,
    lockedPositions,
    customImages
}) => {
    
    // Light Bulb Chasing Effect
    const [activeLight, setActiveLight] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveLight(prev => (prev + 1) % 20);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const isWinningCell = (colIdx: number, rowIdx: number) => {
        if (reelStatus[colIdx] !== 'stopped') return false;
        return winningLines.some(line => 
            line.coords.some(coord => coord[0] === colIdx && coord[1] === rowIdx)
        );
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto mt-2 mb-2 px-2 md:px-0">
            {/* PHYSICAL CABINET FRAME */}
            <div className={`
                relative p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#221100] transition-colors duration-1000
                ${mode === GameMode.FREE_GAMES ? 'bg-[#1a0522]' : mode === GameMode.HOLD_AND_SPIN ? 'bg-[#00111a]' : 'bg-[#1a0d00]'}
            `}>
                {/* Metallic Frame Overlay - Now handled via CSS class with simple border to avoid occlusion */}
                <div className="absolute inset-0 metal-frame"></div>
                
                {/* Feature Indicator */}
                {mode === GameMode.FREE_GAMES && (
                    <div className="absolute -top-12 left-0 right-0 text-center z-50 animate-bounce">
                        <span className="text-3xl font-western text-purple-400 drop-shadow-[0_0_10px_purple] bg-black/80 px-4 py-1 rounded-full border border-purple-500">
                            FREE GAMES
                        </span>
                    </div>
                )}
                 {mode === GameMode.HOLD_AND_SPIN && (
                    <div className="absolute -top-12 left-0 right-0 text-center z-50 animate-bounce">
                        <span className="text-3xl font-western text-cyan-400 drop-shadow-[0_0_10px_cyan] bg-black/80 px-4 py-1 rounded-full border border-cyan-500">
                            HOLD & SPIN
                        </span>
                    </div>
                )}

                {/* Light Bulbs Top */}
                <div className="absolute top-1 left-2 right-2 flex justify-between px-2 z-20 pointer-events-none">
                    {Array.from({length: 20}).map((_, i) => (
                        <div key={`top-${i}`} className={`bulb ${activeLight === i ? 'on' : ''}`}></div>
                    ))}
                </div>
                {/* Light Bulbs Bottom */}
                <div className="absolute bottom-1 left-2 right-2 flex justify-between px-2 z-20 pointer-events-none">
                     {Array.from({length: 20}).map((_, i) => (
                        <div key={`bottom-${i}`} className={`bulb ${activeLight === (19-i) ? 'on' : ''}`}></div>
                    ))}
                </div>

                {/* REEL CONTAINER (Screen) */}
                <div className="relative bg-[#001a05] rounded-lg border-4 border-black overflow-hidden shadow-[inset_0_0_40px_black] z-10">
                    
                    {/* Glass Screen Overlay */}
                    <div className="absolute inset-0 glass-screen z-40"></div>
                    
                    {/* Paylines SVG Layer */}
                    <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none opacity-80">
                         {winningLines.map((line, idx) => (
                             line.lineIndex !== -1 && (
                                <polyline 
                                    key={`${line.lineIndex}-${idx}`}
                                    points={line.coords.map(([c, r]) => {
                                        // Dynamic calculation based on 5 cols, 3 rows
                                        const x = (c * 20) + 10; 
                                        const y = (r * 33.33) + 16.66;
                                        return `${x}%, ${y}%`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke={
                                        line.symbol === SymbolType.ORB ? '#06b6d4' : 
                                        line.symbol === SymbolType.BONUS ? '#a855f7' : '#ffd700'
                                    }
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] animate-pulse"
                                />
                             )
                         ))}
                    </svg>

                    <div className="grid grid-cols-5 h-[300px] md:h-[400px]">
                        {[0, 1, 2, 3, 4].map((colIdx) => (
                            <ReelColumn 
                                key={colIdx}
                                colIdx={colIdx}
                                symbols={finalGrid[colIdx]}
                                values={gridValues[colIdx]}
                                status={reelStatus[colIdx]}
                                winningCoords={(rowIdx) => isWinningCell(colIdx, rowIdx)}
                                mode={mode}
                                lockedRows={lockedPositions ? lockedPositions[colIdx] : undefined}
                                customImages={customImages}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
