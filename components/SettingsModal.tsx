

import React from 'react';
import { CustomAssets } from '../types';
import { audio } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assets: CustomAssets;
  onUpdateAssets: (newAssets: Partial<CustomAssets>) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, assets, onUpdateAssets }) => {
  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof CustomAssets) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          onUpdateAssets({ [key]: url });
          
          if (key === 'mainBgm') audio.setCustomMainBgm(url);
          if (key === 'featureBgm') audio.setCustomFeatureBgm(url);
          if (key === 'spinSound') audio.setCustomSpinSound(url);
          if (key === 'featureTriggerSound') audio.setCustomFeatureTrigger(url);
      }
  };

  const FileInput = ({ label, assetKey, accept, current }: { label: string, assetKey: keyof CustomAssets, accept: string, current?: string }) => (
      <div className="mb-4">
          <label className="block text-yellow-500 font-bold mb-2 uppercase text-xs tracking-wider">{label}</label>
          <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded p-2 flex items-center justify-center text-sm text-gray-300 transition-colors">
                  <span>{current ? '✅ File Loaded (Click to Change)' : '📁 Select File...'}</span>
                  <input 
                      type="file" 
                      accept={accept} 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, assetKey)}
                  />
              </label>
              {current && (
                  <div className="w-10 h-10 border border-gray-600 rounded bg-black flex items-center justify-center overflow-hidden">
                      {accept.includes('image') ? (
                          <img src={current} alt="preview" className="w-full h-full object-contain" />
                      ) : (
                          <span className="text-xl">🎵</span>
                      )}
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-[#1a1100] border-2 border-yellow-600 rounded-xl w-full max-w-md p-6 shadow-2xl relative my-8">
            <h2 className="text-2xl font-western text-yellow-400 mb-6 text-center border-b border-yellow-800 pb-2">
                CUSTOM ASSETS
            </h2>
            
            <div className="space-y-4">
                <h3 className="text-white font-serif-display border-b border-gray-700 pb-1">AUDIO</h3>
                <FileInput 
                    label="Main Background Music (MP3)" 
                    assetKey="mainBgm" 
                    accept="audio/*" 
                    current={assets.mainBgm}
                />
                <FileInput 
                    label="Feature BGM (MP3)" 
                    assetKey="featureBgm" 
                    accept="audio/*" 
                    current={assets.featureBgm}
                />
                <FileInput 
                    label="Feature Trigger Sound (MP3)" 
                    assetKey="featureTriggerSound" 
                    accept="audio/*" 
                    current={assets.featureTriggerSound}
                />
                <FileInput 
                    label="Spin Sound (MP3)" 
                    assetKey="spinSound" 
                    accept="audio/*" 
                    current={assets.spinSound}
                />

                <h3 className="text-white font-serif-display border-b border-gray-700 pb-1 mt-6">SYMBOLS (IMAGES)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FileInput 
                        label="Orb (Fireball)" 
                        assetKey="orbImage" 
                        accept="image/*" 
                        current={assets.orbImage}
                    />
                    <FileInput 
                        label="Bonus (Gate)" 
                        assetKey="bonusImage" 
                        accept="image/*" 
                        current={assets.bonusImage}
                    />
                    <FileInput 
                        label="Wild" 
                        assetKey="wildImage" 
                        accept="image/*" 
                        current={assets.wildImage}
                    />
                    <FileInput 
                        label="Scatter" 
                        assetKey="scatterImage" 
                        accept="image/*" 
                        current={assets.scatterImage}
                    />
                     <FileInput 
                        label="Buffalo" 
                        assetKey="buffaloImage" 
                        accept="image/*" 
                        current={assets.buffaloImage}
                    />
                     <FileInput 
                        label="Eagle" 
                        assetKey="eagleImage" 
                        accept="image/*" 
                        current={assets.eagleImage}
                    />
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full mt-6 bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg uppercase tracking-widest shadow-lg"
            >
                Close & Save
            </button>
        </div>
    </div>
  );
};
