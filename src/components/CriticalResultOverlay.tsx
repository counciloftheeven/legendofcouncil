import React, { useEffect, useState } from 'react';
import { Crown, Skull, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface CriticalResultOverlayProps {
  type: 'critical_success' | 'catastrophe' | null;
  score: number;
  onDismiss: () => void;
}

export const CriticalResultOverlay: React.FC<CriticalResultOverlayProps> = ({
  type,
  score,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);

      if (type === 'critical_success') {
        sound.playTempleBell('uyanis');
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#f39c12', '#ffffff', '#e67e22'],
        });
      } else if (type === 'catastrophe') {
        sound.playBladeClash();
      }

      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [type, onDismiss]);

  if (!type || !visible) return null;

  return (
    <div
      onClick={onDismiss}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer select-none transition-all duration-300 ${
        type === 'critical_success'
          ? 'bg-amber-950/70 backdrop-blur-md animate-in fade-in'
          : 'bg-red-950/80 backdrop-blur-md animate-in fade-in animate-shake'
      }`}
    >
      {type === 'critical_success' ? (
        /* CRITICAL SUCCESS (+4) GOLDEN IMPERIAL SEAL EXPLOSION */
        <div className="relative text-center space-y-4 animate-in zoom-in-75 duration-300 max-w-md">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-10 bg-gradient-to-r from-amber-500/30 via-yellow-300/40 to-amber-500/30 rounded-full blur-2xl animate-pulse" />

          {/* Imperial Wax Seal */}
          <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full wax-seal-gold border-4 border-amber-300 shadow-2xl flex items-center justify-center text-amber-950 animate-bounce">
            <Crown className="w-16 h-16 sm:w-20 sm:h-20 text-amber-900 drop-shadow" />
          </div>

          <div className="relative space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-300 font-bold block">
              ✦ KUDRETLİ EFSANEVİ BAŞARI ✦
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-yellow-200 drop-shadow-[0_4px_16px_rgba(245,223,77,0.8)]">
              +{score} ZAFER ÇAĞRISI!
            </h2>
            <p className="text-sm font-serif italic text-amber-100/90 max-w-sm mx-auto">
              Zarlar divanın kadim kanunlarını aştı. Tüm engeller yarıldı, imparatorluk mührü onayladı!
            </p>
          </div>

          <span className="text-[11px] text-amber-300/70 font-mono block pt-2">
            Kapatmak için ekrana tıklayın
          </span>
        </div>
      ) : (
        /* CATASTROPHE (-4) BLOOD SPLATTER & CRACKED PARCHMENT SHAKE */
        <div className="relative text-center space-y-4 animate-in zoom-in-90 duration-200 max-w-md">
          {/* Red Pulse Vignette */}
          <div className="absolute -inset-12 bg-red-600/25 rounded-full blur-3xl animate-ping" />

          {/* Blood Splattered Skull Emblem */}
          <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black/90 border-4 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.8)] flex items-center justify-center text-red-500">
            <Skull className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 animate-pulse drop-shadow" />
          </div>

          <div className="relative space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold block">
              ☠ FELAKET & KAN DİYARI ☠
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-red-400 drop-shadow-[0_4px_16px_rgba(239,68,68,0.9)]">
              {score} KADER YIKIMI!
            </h2>
            <p className="text-sm font-serif italic text-red-200/90 max-w-sm mx-auto">
              Kader çizgisi yarıldı! Beklenmedik bir felaket, kan kaybı veya engizisyon şüphesi tetiklendi.
            </p>
          </div>

          <span className="text-[11px] text-red-400/70 font-mono block pt-2">
            Kapatmak için ekrana tıklayın
          </span>
        </div>
      )}
    </div>
  );
};
