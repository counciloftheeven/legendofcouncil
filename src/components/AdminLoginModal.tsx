import React, { useState } from 'react';
import { saveManager } from '../utils/saveManager';
import { sound } from '../utils/audio';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [newPasscodeConfirm, setNewPasscodeConfirm] = useState('');
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Lütfen divan başmühür parolasını giriniz.');
      return;
    }

    if (saveManager.verifyAdminPasscode(passcode)) {
      saveManager.setAdminAuthenticated(true);
      sound.playTempleBell('uyanis');
      confetti({ particleCount: 40, spread: 60 });
      setErrorMsg(null);
      setPasscode('');
      onSuccess();
    } else {
      sound.playBladeClash();
      setErrorMsg('Geçersiz parola! Kurultay mührü reddedildi.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.length < 4) {
      setErrorMsg('Yeni parola en az 4 karakter olmalıdır.');
      return;
    }
    if (newPasscode !== newPasscodeConfirm) {
      setErrorMsg('Yeni parolalar birbiriyle uyuşmuyor.');
      return;
    }

    saveManager.setAdminPasscode(newPasscode);
    sound.playSealStamp();
    setChangeSuccess('Divan parolası başarıyla güncellendi.');
    setIsChangingPassword(false);
    setNewPasscode('');
    setNewPasscodeConfirm('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-md w-full parchment-sheet rounded-2xl border-2 border-amber-600/80 p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSealStamp();
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full wax-seal-gold mx-auto flex items-center justify-center text-amber-950 shadow-xl border-2 border-amber-400/50">
            <Crown className="w-7 h-7 text-amber-900 drop-shadow" />
          </div>

          <h2 className="font-heading font-black text-lg sm:text-xl text-amber-300 uppercase tracking-widest">
            OYUN YÖNETİCİSİ (GM) &amp; DİVAN GİRİŞİ
          </h2>

          <p className="text-xs text-[#d6c7b2] font-serif italic">
            &quot;Rol yapma oturumunu yönetmek, hikâyeye yön vermek ve NPC&apos;leri kontrol etmek için GM mührü gereklidir.&quot;
          </p>
        </div>

        {/* Change Password View */}
        {isChangingPassword ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#140e0a] border border-[#3b2a1a] text-xs text-[#eedec8]">
              Yeni bir divan başmühür parolası belirleyin.
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-heading font-bold text-amber-400 block">
                Yeni Parola
              </label>
              <input
                type="password"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="En az 4 karakter..."
                className="w-full px-3 py-2 rounded-xl bg-[#100b08] border border-[#4d3824] text-amber-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-heading font-bold text-amber-400 block">
                Yeni Parola (Tekrar)
              </label>
              <input
                type="password"
                value={newPasscodeConfirm}
                onChange={(e) => setNewPasscodeConfirm(e.target.value)}
                placeholder="Parolayı doğrulayın..."
                className="w-full px-3 py-2 rounded-xl bg-[#100b08] border border-[#4d3824] text-amber-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setErrorMsg(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-[#1f1712] text-stone-300 text-xs font-heading font-bold border border-[#4a3623]"
              >
                Geri
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl wax-seal-gold text-amber-950 text-xs font-heading font-black hover:brightness-110 shadow"
              >
                Parolayı Kaydet
              </button>
            </div>
          </form>
        ) : (
          /* Normal Passcode Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-bold text-amber-400">
                  GM / Başmühür Parolası
                </label>
                <span className="text-[10px] text-amber-400/70 font-mono">
                  🔒 Craesx Parola Koruması
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  autoFocus
                  placeholder="GM parolasını girin (Craesx.121241411)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120c08] border-2 border-[#4d3824] text-amber-200 text-sm focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {changeSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{changeSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl wax-seal-gold text-amber-950 text-xs font-heading font-black tracking-widest hover:brightness-110 shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <KeyRound className="w-4 h-4 text-amber-900" />
              <span>DİVANI AÇ (GİRİŞ YAP)</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#3b2a1a]">
              <span className="text-stone-400">Yönetici yetkileri gerekir</span>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(true);
                  setErrorMsg(null);
                }}
                className="text-amber-400/80 hover:text-amber-300 underline font-serif"
              >
                Parolayı Değiştir
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
