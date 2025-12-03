
import React from 'react';
import { BET_MULTIPLIERS, DENOMINATIONS } from '../types';

interface ControlPanelProps {
  credits: number;
  currentDenom: number;
  currentBetMult: number;
  selectedLines: number;
  isSpinning: boolean;
  isLocked: boolean; // True during features
  onBetChange: (val: number) => void;
  onLinesChange: (val: number) => void;
  onSpin: () => void;
  lastWin: number;
  onBack: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  credits,
  currentDenom,
  currentBetMult,
  selectedLines,
  isSpinning,
  isLocked,
  onBetChange,
  onLinesChange,
  onSpin,
  lastWin,
  onBack
}) => {
  
  const denomInfo = DENOMINATIONS.find(d => d.value === currentDenom);
  const maxLines = denomInfo ? denomInfo.maxLines : 25;
  const totalBetCents = currentDenom * currentBetMult * selectedLines;
  const totalBetDollars = totalBetCents / 100;

  const lineOptions = maxLines === 5 ? [1, 2, 3, 4, 5] : [1, 5, 10, 15, 20, 25];
  
  const controlsDisabled = isSpinning || isLocked;

  const LCDScreen = ({ label, value, highlight = false, size = 'md' }: { label: string, value: string, highlight?: boolean, size?: 'sm'|'md'|'lg' }) => (
      <div className="flex flex-col items-center bg-black border-[2px] border-gray-600 rounded-lg px-3 py-1 min-w-[110px] shadow-[inset_0_2px_8px_rgba(0,0,0,1)] relative overflow-hidden">
          {/* Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 z-10">{label}</span>
          <span className={`
              font-mono font-bold tracking-tighter z-10 text-shadow-glow
              ${highlight ? 'text-yellow-400' : 'text-green-500'}
              ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'}
          `}>
              {value}
          </span>
      </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-3 relative z-20">
      
      {/* Metallic Plate Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#333] to-[#111] rounded-t-xl border-t border-gray-500 shadow-2xl -z-10"></div>
      
      {/* Top LCD Stats Row */}
      <div className="flex justify-between items-end mb-4 px-2 md:px-6 gap-2 pt-2">
         <div className="flex gap-2">
             <LCDScreen label="Credits" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(credits / 100)} />
             <LCDScreen label="Denom" value={denomInfo?.label || ''} highlight size="sm" />
         </div>
         
         <div className="flex-1 flex justify-center">
             <div className="bg-[#1a0505] border-[3px] border-[#4a1a1a] px-8 py-2 rounded-xl shadow-[inset_0_0_20px_black] relative">
                  <div className="text-[10px] text-red-500/50 uppercase text-center font-bold tracking-[0.3em] mb-1">Total Win</div>
                  <div className={`text-3xl font-mono font-black ${lastWin > 0 ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_red]' : 'text-[#3a1111]'}`}>
                       {lastWin > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lastWin / 100) : '$0.00'}
                  </div>
             </div>
         </div>

         <LCDScreen label="Total Bet" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBetDollars)} highlight />
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-end px-2 md:px-4 pb-2">
          
          {/* Button Deck */}
          <div className="flex-1 flex flex-col gap-3 w-full">
             
             {/* Lines */}
             <div className="flex items-center gap-3 bg-[#000]/30 p-2 rounded-lg border border-white/5">
                 <div className="w-16 text-right leading-none">
                     <div className="text-[10px] text-yellow-600 font-black uppercase">Select</div>
                     <div className="text-xs text-yellow-500 font-bold uppercase tracking-widest">Lines</div>
                 </div>
                 <div className="flex-1 flex gap-2">
                    {lineOptions.map(num => (
                        <button
                            key={num}
                            disabled={controlsDisabled}
                            onClick={() => onLinesChange(num)}
                            className={`
                                flex-1 h-12 rounded-md btn-physical
                                flex flex-col items-center justify-center
                                ${selectedLines === num 
                                    ? 'bg-gradient-to-b from-yellow-600 to-yellow-800 border border-yellow-400 text-white' 
                                    : 'bg-gradient-to-b from-[#444] to-[#222] border border-[#555] text-gray-400'}
                            `}
                        >
                            <span className="text-lg font-bold font-serif-display leading-none">{num}</span>
                        </button>
                    ))}
                 </div>
             </div>

             {/* Multiplier */}
             <div className="flex items-center gap-3 bg-[#000]/30 p-2 rounded-lg border border-white/5">
                 <div className="w-16 text-right leading-none">
                     <div className="text-[10px] text-blue-600 font-black uppercase">Bet</div>
                     <div className="text-xs text-blue-500 font-bold uppercase tracking-widest">Per Line</div>
                 </div>
                 <div className="flex-1 flex gap-2">
                    {BET_MULTIPLIERS.map(num => (
                        <button
                            key={num}
                            disabled={controlsDisabled}
                            onClick={() => onBetChange(num)}
                            className={`
                                flex-1 h-12 rounded-md btn-physical
                                flex flex-col items-center justify-center
                                ${currentBetMult === num 
                                    ? 'bg-gradient-to-b from-blue-600 to-blue-800 border border-blue-400 text-white' 
                                    : 'bg-gradient-to-b from-[#444] to-[#222] border border-[#555] text-gray-400'}
                            `}
                        >
                            <span className="text-lg font-bold font-serif-display leading-none">{num}x</span>
                        </button>
                    ))}
                 </div>
             </div>
          </div>

          {/* Master Controls */}
          <div className="flex gap-4 items-stretch h-[110px]">
             <button
                onClick={onBack}
                disabled={isSpinning}
                className="w-20 btn-physical rounded-lg bg-gradient-to-b from-gray-700 to-gray-900 border border-gray-500 text-gray-300 flex flex-col items-center justify-center gap-1"
             >
                <span className="text-2xl">↩</span>
                <span className="text-[9px] font-black uppercase tracking-wider">Exit</span>
             </button>

             <button
                onClick={onSpin}
                disabled={controlsDisabled || credits < totalBetCents}
                className={`
                    w-40 rounded-xl btn-physical flex flex-col items-center justify-center border-2
                    ${controlsDisabled 
                        ? 'bg-gradient-to-b from-gray-800 to-black border-gray-700 text-gray-600' 
                        : 'bg-gradient-to-b from-green-500 to-green-800 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'}
                `}
             >
                 <span className={`text-3xl font-western tracking-widest drop-shadow-md ${isSpinning ? '' : 'text-green-50'}`}>
                    {isSpinning ? '...' : 'SPIN'}
                 </span>
             </button>
          </div>

      </div>
    </div>
  );
};
