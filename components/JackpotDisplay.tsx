import React from 'react';

interface JackpotProps {
  amounts: {
    grand: number;
    major: number;
    minor: number;
    mini: number;
  };
}

const JackpotBadge = ({ label, amount, type }: { label: string; amount: number; type: 'grand'|'major'|'minor'|'mini' }) => {
    // Format currency
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    let colors = {
        grand: { bg: 'from-red-900 to-red-950', border: 'border-red-500', glow: 'shadow-red-500/80', text: 'text-red-100' },
        major: { bg: 'from-purple-900 to-purple-950', border: 'border-purple-500', glow: 'shadow-purple-500/80', text: 'text-purple-100' },
        minor: { bg: 'from-cyan-900 to-cyan-950', border: 'border-cyan-500', glow: 'shadow-cyan-500/80', text: 'text-cyan-100' },
        mini:  { bg: 'from-green-900 to-green-950', border: 'border-green-500', glow: 'shadow-green-500/80', text: 'text-green-100' },
    }[type];

    return (
        <div className={`
            flex-1 relative rounded-lg border-2 ${colors.border} 
            flex flex-col items-center justify-center py-1 overflow-hidden
            shadow-[0_0_20px_rgba(0,0,0,0.8)] ${colors.glow}
            bg-gradient-to-b ${colors.bg}
        `}>
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

            <div className={`
                text-sm md:text-xl font-black font-serif-display tracking-widest uppercase mb-0.5 z-10 ${colors.text}
                drop-shadow-[0_2px_0_rgba(0,0,0,1)]
            `}>
                {label}
            </div>
            
            <div className="w-[90%] bg-black/90 border border-white/10 rounded px-2 py-1 flex justify-center shadow-inner relative">
                <span className={`text-lg md:text-2xl font-mono font-bold ${colors.text} drop-shadow-[0_0_8px_currentColor]`}>
                    {formatted}
                </span>
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-40"></div>
            </div>
        </div>
    )
}

export const JackpotDisplay: React.FC<JackpotProps> = ({ amounts }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-4 relative z-10">
       <div className="bg-black/40 border-y-2 border-yellow-600/50 p-2 rounded-xl flex gap-3 justify-between items-stretch">
           <JackpotBadge label="Mini" amount={amounts.mini} type="mini" />
           <JackpotBadge label="Minor" amount={amounts.minor} type="minor" />
           <JackpotBadge label="Major" amount={amounts.major} type="major" />
           <JackpotBadge label="Grand" amount={amounts.grand} type="grand" />
       </div>
    </div>
  );
};