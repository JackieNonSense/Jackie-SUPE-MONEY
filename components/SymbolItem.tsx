
import React from 'react';
import { SYMBOLS } from '../constants';
import { SymbolType } from '../types';

interface SymbolProps {
  type: SymbolType;
  isWin?: boolean;
  value?: number | string | null; // For Orb values
  isLocked?: boolean; // For Hold & Spin
  customImage?: string; // Optional override image
}

export const SymbolItem: React.FC<SymbolProps> = ({ type, isWin, value, isLocked, customImage }) => {
  const config = SYMBOLS[type];

  // Don't render anything for blank
  if (type === SymbolType.BLANK) return null;

  const isOrb = type === SymbolType.ORB;
  const isBonus = type === SymbolType.BONUS;

  // Format Orb Value
  let displayValue = '';
  let isJackpot = false;

  if (isOrb && value) {
      if (typeof value === 'string') {
          displayValue = value; // MINI, MINOR, MAJOR
          isJackpot = true;
      } else {
          // It's a number (cents)
          displayValue = new Intl.NumberFormat('en-US', {
             style: 'currency',
             currency: 'USD',
             maximumFractionDigits: 0
          }).format(value / 100);
      }
  }

  const finalImage = customImage || config.image;

  // Common styles
  const containerClass = `
      relative w-[90%] h-[90%] flex items-center justify-center rounded-md select-none
      ${isWin || isLocked ? 'z-10' : ''}
      ${isLocked ? 'scale-95 transition-transform duration-300' : ''}
  `;

  const bgClass = `
      absolute inset-0 bg-gradient-to-br from-[#222] to-[#000] rounded-md border border-[#333]
      shadow-inner
      ${isWin ? 'border-yellow-400 shadow-[0_0_15px_#FFD700]' : ''}
      ${isOrb ? 'border-orange-500 shadow-[0_0_15px_rgba(255,69,0,0.6)]' : ''}
      ${isBonus ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : ''}
  `;

  return (
    <div className={containerClass}>
        {/* Symbol Background Plate */}
        <div className={bgClass}></div>

        {/* ORB SPECIFIC RENDERING */}
        {isOrb ? (
            <div className={`
                relative flex items-center justify-center w-full h-full
                ${isWin || isLocked ? 'animate-gold-pulse' : ''}
            `}>
                {/* Use custom image for Orb if available, else CSS Fireball */}
                {finalImage ? (
                    <img src={finalImage} alt="Orb" className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_10px_orange]" />
                ) : (
                    <div className="absolute w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-orange-600 via-red-500 to-yellow-300 shadow-[0_0_20px_rgba(255,69,0,0.8)] border-2 border-yellow-200/50 flex items-center justify-center overflow-hidden">
                        {/* Internal Fire Effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,0,0.4),transparent)]"></div>
                    </div>
                )}

                {/* Value Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className={`
                        font-black drop-shadow-[0_2px_4px_black] text-white
                        ${isJackpot ? 'text-xs md:text-sm tracking-wider uppercase text-yellow-100' : 'text-base md:text-xl'}
                    `}>
                        {displayValue}
                    </span>
                </div>
            </div>
        ) : (
            // STANDARD & BONUS SYMBOL RENDERING
            <>
                {finalImage ? (
                    // Render Custom Image
                    <img
                        src={finalImage}
                        alt={config.label}
                        className={`
                            relative z-10 w-[85%] h-[85%] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]
                            ${isWin ? 'animate-pulse brightness-125' : ''}
                        `}
                    />
                ) : (
                    // Render Emoji/Text Fallback
                    <span className={`
                        relative z-10 font-western font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]
                        flex items-center justify-center text-center leading-none
                        ${config.isHighValue ? 'text-5xl md:text-6xl filter contrast-125' : 'text-5xl md:text-6xl'}
                        ${config.color}
                        ${isWin ? 'animate-pulse' : ''}
                        ${isBonus ? 'text-6xl md:text-7xl drop-shadow-[0_0_10px_rgba(168,85,247,1)]' : ''}
                    `}>
                        {config.icon || config.label}
                    </span>
                )}
            </>
        )}

        {/* Winning Border Overlay */}
        {isWin && (
            <div className="absolute inset-0 border-4 border-yellow-300 rounded-md animate-pulse opacity-70" />
        )}
    </div>
  );
};
