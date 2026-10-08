import React, { useState, useEffect } from 'react';
import { multiplayer, MultiplayerEvent } from '../utils/multiplayerManager';
import { sound } from '../utils/audio';
import { Sparkles, X, Shield, Scroll, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LivePartyEventBanner: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<MultiplayerEvent | null>(null);

  useEffect(() => {
    const unsubscribe = multiplayer.onEvent((ev) => {
      // Don't show if sent by myself
      const myName = multiplayer.getPlayerName();
      if (ev.sender.includes(myName)) return;

      setActiveEvent(ev);

      if (ev.type === 'zar') {
        sound.playDiceRoll();
        if (ev.payload?.toplam >= 4) {
          sound.playTempleBell('uyanis');
          confetti({ particleCount: 40, spread: 60 });
        }
      } else if (ev.type === 'anlati') {
        sound.playTempleBell('uyanis');
      }

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setActiveEvent((curr) => (curr?.id === ev.id ? null : curr));
      }, 6000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!activeEvent) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="parchment-sheet rounded-xl border-2 border-amber-500/80 p-3.5 shadow-2xl space-y-2 relative">
        <button
          onClick={() => setActiveEvent(null)}
          className="absolute top-2 right-2 text-stone-400 hover:text-white p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full wax-seal flex items-center justify-center text-amber-200 text-xs">
            {activeEvent.type === 'zar' ? '🎲' : <Scroll className="w-3 h-3" />}
          </div>
          <div className="min-w-0 pr-4">
            <span className="font-heading font-black text-xs text-amber-300 block truncate">
              {activeEvent.sender}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {activeEvent.timestamp} • Çevrimiçi Masadan
            </span>
          </div>
        </div>

        {/* Dice Event Payload */}
        {activeEvent.type === 'zar' && activeEvent.payload && (
          <div className="p-2.5 rounded-lg bg-[#140e0a] border border-[#3b2a1a] space-y-1.5">
            <div className="text-xs font-serif text-[#f2e6d6]">
              {activeEvent.payload.beceri || 'Yetenek Kontrolü'}:{' '}
              <span className="font-heading font-bold text-amber-300">
                {activeEvent.payload.toplam >= 0 ? `+${activeEvent.payload.toplam}` : activeEvent.payload.toplam}{' '}
                ({activeEvent.payload.basariSeviyesi || 'Standart'})
              </span>
            </div>

            {Array.isArray(activeEvent.payload.zarlar) && (
              <div className="flex gap-1">
                {activeEvent.payload.zarlar.map((z: number, i: number) => (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-black ${
                      z === 1
                        ? 'bg-amber-600/80 text-stone-950 font-bold border border-amber-400'
                        : z === -1
                        ? 'bg-red-950/80 text-red-300 border border-red-700'
                        : 'bg-[#241a12] text-stone-400 border border-[#443322]'
                    }`}
                  >
                    {z === 1 ? '+' : z === -1 ? '−' : '0'}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Narrative / Aspect Event */}
        {activeEvent.type === 'anlati' && activeEvent.payload && (
          <p className="text-xs font-serif italic text-amber-100/90 p-2 rounded bg-[#150f0b] border border-[#3d2a1a]">
            &quot;{activeEvent.payload.text}&quot;
          </p>
        )}
      </div>
    </div>
  );
};
