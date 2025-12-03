import React from 'react';
import { DENOMINATIONS } from '../types';
import { audio } from '../utils/audio';

interface Props {
    onSelect: (denomValue: number) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onSelect }) => {

    const handleSelect = (val: number) => {
        audio.init();
        audio.playClick();
        onSelect(val);
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/assets/images/background1.jpeg)' }}
            />

            {/* Animated Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="bokeh-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `-${Math.random() * 10}s`
                    }}
                />
            ))}

            <div className="relative z-20 flex flex-col items-center animate-fade-in-up w-full max-w-5xl">

                {/* Ornate Header */}
                <div className="mb-12 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/20 blur-[50px] rounded-full"></div>
                     <h1 className="font-western text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-800 drop-shadow-[0_4px_0_rgba(0,0,0,1)] tracking-widest text-center animate-gold-pulse">
                        JACKIE
                        <br/>
                        <span className="font-serif-display text-white text-4xl md:text-6xl tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                             SUPER MONEY
                        </span>
                        <br/>
                        <span className="font-serif-display text-yellow-300 text-2xl md:text-4xl tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] mt-2">
                             EVA EDITION
                        </span>
                     </h1>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-yellow-600/50 p-8 rounded-3xl shadow-2xl w-full max-w-4xl relative overflow-hidden group">
                     {/* Border Shine */}
                     <div className="absolute inset-0 border-2 border-yellow-500/30 rounded-3xl pointer-events-none"></div>
                     <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] animate-[shine_3s_infinite] pointer-events-none"></div>

                     <p className="text-yellow-200/80 text-center text-xl uppercase tracking-[0.2em] mb-8 font-serif-display border-b border-yellow-800/50 pb-4">
                        Select Denomination to Begin
                     </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {DENOMINATIONS.map((denom) => (
                            <button
                                key={denom.label}
                                onClick={() => handleSelect(denom.value)}
                                className="
                                    relative overflow-hidden
                                    btn-physical
                                    bg-gradient-to-b from-gray-800 to-black
                                    border border-yellow-700
                                    rounded-xl p-6
                                    flex flex-col items-center justify-center
                                    group-hover/btn:brightness-110
                                "
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                <div className="text-4xl md:text-5xl font-western text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-2 drop-shadow-sm">
                                    {denom.label}
                                </div>
                                <div className="text-xs text-yellow-500/70 font-bold uppercase tracking-widest border-t border-yellow-900/50 pt-2 w-full text-center">
                                    Max Lines: {denom.maxLines}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-yellow-700/50 font-mono text-xs text-center tracking-widest">
                    <p>CASINO ENTERTAINMENT SYSTEM • VER 2.5.1</p>
                </div>
            </div>
        </div>
    );
};