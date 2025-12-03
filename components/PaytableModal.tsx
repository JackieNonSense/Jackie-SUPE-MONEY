import React from 'react';
import { PAYTABLE, SYMBOLS, LINES_25 } from '../constants';
import { SymbolType } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const PaytableModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto">
            <div className="bg-gradient-to-b from-blue-900 to-black border-4 border-yellow-600 rounded-xl max-w-4xl w-full p-6 relative shadow-2xl">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded border border-red-400"
                >
                    CLOSE
                </button>

                <h2 className="text-3xl md:text-4xl font-western text-yellow-400 text-center mb-8 drop-shadow-lg">PAYTABLE</h2>

                {/* Symbols Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {Object.values(SymbolType).map((key) => {
                        const symbol = SYMBOLS[key];
                        const payouts = PAYTABLE[key];
                        // Only show if it has payout for 3,4,5
                        if (Math.max(...payouts) === 0) return null;

                        return (
                            <div key={key} className="bg-black/50 border border-blue-500/30 rounded p-2 flex flex-col items-center">
                                <div className="text-4xl mb-2">{symbol.icon || symbol.label}</div>
                                <div className="text-white text-sm w-full">
                                    <div className="flex justify-between border-b border-gray-700 pb-1"><span>5x</span> <span className="text-yellow-400 font-bold">{payouts[4]}</span></div>
                                    <div className="flex justify-between border-b border-gray-700 py-1"><span>4x</span> <span className="text-yellow-400 font-bold">{payouts[3]}</span></div>
                                    <div className="flex justify-between pt-1"><span>3x</span> <span className="text-yellow-400 font-bold">{payouts[2]}</span></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="text-center text-gray-400 text-sm mb-4">
                    <p>Wild symbol substitutes for all symbols except Scatter.</p>
                    <p>Scatter pays in any position.</p>
                </div>

                <h3 className="text-xl font-western text-yellow-400 text-center mb-4">PAYLINES</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {LINES_25.map((line, idx) => (
                        <div key={idx} className="bg-gray-800 p-1 text-[0.6rem] text-center border border-gray-600 rounded text-gray-300">
                           Line {idx + 1}
                           {/* Mini visualization of the line 5x3 */}
                           <div className="grid grid-cols-5 gap-px mt-1 opacity-70">
                               {Array.from({length: 5}).map((_, col) => (
                                   <div key={col} className="flex flex-col gap-px">
                                        {[0,1,2].map(row => (
                                            <div key={row} className={`w-2 h-2 ${line[col] === row ? 'bg-yellow-500' : 'bg-gray-900'}`}></div>
                                        ))}
                                   </div>
                               ))}
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};