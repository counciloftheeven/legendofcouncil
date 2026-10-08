import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Flame, Wind, CloudRain, Sparkles } from 'lucide-react';

export const AmbienceControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ates, setAtes] = useState(true);
  const [ruzgar, setRuzgar] = useState(true);
  const [panelAcik, setPanelAcik] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      sound.startAmbience({ ates, ruzgar, yagmur: false, uultu: false }, 0.2);
    } else {
      sound.stopAmbience();
    }
  }, [isPlaying, ates, ruzgar]);

  const toggleMaster = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setPanelAcik(!panelAcik)}
        className={`px-2.5 py-1 rounded-lg border text-xs font-heading font-bold flex items-center gap-1.5 shadow transition-all ${
          isPlaying
            ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-400'
            : 'bg-[#1e1711] border-[#443322] text-[#8e7e6d] hover:text-[#d3c7b5]'
        }`}
        title="Masaüstü Ambiyans Sesleri"
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">Ambiyans</span>
      </button>

      {panelAcik && (
        <div className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl bg-[#140f0c] border-2 border-[#54412e] shadow-2xl z-50 text-xs space-y-2.5 text-[#ded1be]">
          <div className="flex items-center justify-between border-b border-[#3b2b1d] pb-1.5">
            <span className="font-heading font-black text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ambiyans Sentezleyici</span>
            </span>
            <button
              onClick={toggleMaster}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isPlaying ? 'bg-amber-600 text-stone-950' : 'bg-[#2b1f15] text-[#8e7e6d]'
              }`}
            >
              {isPlaying ? 'AÇIK' : 'KAPALI'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center justify-between p-1.5 rounded bg-[#1b140f] border border-[#312317] cursor-pointer hover:border-amber-700/60">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Ocak Ateşi Çıtırtısı</span>
              </span>
              <input
                type="checkbox"
                checked={ates}
                onChange={(e) => setAtes(e.target.checked)}
                className="rounded border-[#443322]"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded bg-[#1b140f] border border-[#312317] cursor-pointer hover:border-amber-700/60">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hudut Rüzgârı &amp; Uğultu</span>
              </span>
              <input
                type="checkbox"
                checked={ruzgar}
                onChange={(e) => setRuzgar(e.target.checked)}
                className="rounded border-[#443322]"
              />
            </label>
          </div>

          <p className="text-[9px] text-[#7d6d5c] italic font-serif text-center">
            * Web Audio ile doğrudan sentezlenir; harici veri indirmez.
          </p>
        </div>
      )}
    </div>
  );
};
