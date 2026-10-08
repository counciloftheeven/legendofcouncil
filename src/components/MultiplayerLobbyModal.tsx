import React, { useState, useEffect } from 'react';
import { multiplayer, RoomPlayer } from '../utils/multiplayerManager';
import { Karakter } from '../rules';
import { sound } from '../utils/audio';
import {
  Globe,
  Users,
  Copy,
  Check,
  LogOut,
  Sparkles,
  Shield,
  Crown,
  KeyRound,
  X,
  Scroll,
  Plus,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiplayerLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  aktifKarakter: Karakter;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
}

export const MultiplayerLobbyModal: React.FC<MultiplayerLobbyModalProps> = ({
  isOpen,
  onClose,
  aktifKarakter,
  isAdminAuthenticated,
  onOpenAdminLogin,
}) => {
  const [view, setView] = useState<'status' | 'create' | 'join'>('status');
  const [roomTitle, setRoomTitle] = useState('Arava Sarayı Seferi');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState(() => multiplayer.getPlayerName() || aktifKarakter?.oyuncu || 'Seyyah');
  const [playerRole, setPlayerRole] = useState<'Anlatıcı' | 'Oyuncu'>('Oyuncu');
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newAspectInput, setNewAspectInput] = useState('');
  const [aspects, setAspects] = useState<string[]>([]);

  const isConnected = multiplayer.isConnected();
  const currentRoomId = multiplayer.getRoomId();

  useEffect(() => {
    if (isOpen) {
      multiplayer.setCharacter(aktifKarakter);
      setPlayers(multiplayer.getPlayers());
      setAspects(multiplayer.getAspects());

      const unsubscribe = multiplayer.onPlayersChange((p) => {
        setPlayers([...p]);
        setAspects(multiplayer.getAspects());
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isOpen, aktifKarakter]);

  if (!isOpen) return null;

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // If attempting to host as GM without auth, recommend logging in
    if (!isAdminAuthenticated) {
      onOpenAdminLogin();
      return;
    }

    const res = await multiplayer.createRoom(
      roomTitle.trim() || 'Stallhart Seferi',
      playerName.trim() || 'Anlatıcı (Aldris)',
      aktifKarakter
    );

    if (res.success) {
      sound.playTempleBell('uyanis');
      confetti({ particleCount: 40, spread: 60 });
      setView('status');
    } else {
      sound.playBladeClash();
      setErrorMsg(res.error || 'Oda kurulamadı.');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setErrorMsg('Lütfen 6 haneli oda kodunu giriniz.');
      return;
    }
    setErrorMsg(null);

    const res = await multiplayer.joinRoom(
      joinCode.trim(),
      playerName.trim() || aktifKarakter?.oyuncu || 'Seyyah',
      playerRole,
      aktifKarakter
    );

    if (res.success) {
      sound.playTempleBell('koruma');
      confetti({ particleCount: 30, spread: 50 });
      setView('status');
    } else {
      sound.playBladeClash();
      setErrorMsg(res.error || 'Odaya bağlanılamadı.');
    }
  };

  const handleCopyLink = () => {
    if (!currentRoomId) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${currentRoomId}`;
    navigator.clipboard.writeText(url);
    sound.playSealStamp();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    if (!currentRoomId) return;
    navigator.clipboard.writeText(currentRoomId);
    sound.playSealStamp();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    multiplayer.leaveRoom();
    sound.playBladeClash();
    setView('status');
  };

  const handleAddAspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAspectInput.trim()) return;
    const updated = [...aspects, newAspectInput.trim()];
    setAspects(updated);
    multiplayer.updateAspects(updated);
    setNewAspectInput('');
    sound.playSealStamp();
  };

  const handleRemoveAspect = (idx: number) => {
    const updated = aspects.filter((_, i) => i !== idx);
    setAspects(updated);
    multiplayer.updateAspects(updated);
    sound.playBladeClash();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full parchment-sheet rounded-2xl border-2 border-amber-600/80 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#443322] pb-3">
          <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center text-amber-200">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>ÇEVRİMİÇİ DİVAN MASASI (MULTIPLAYER)</span>
              {isConnected && (
                <span className="flex items-center gap-1 text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-2 py-0.5 rounded-full font-mono font-normal">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>CANLI</span>
                </span>
              )}
            </h2>
            <p className="text-xs text-[#eedec8] font-serif italic">
              Arkadaşlarınızla aynı anda zar atın, entrikaları ve partiyi gerçek zamanlı paylaşın.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Room Connected View */}
        {isConnected ? (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Room Code Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#21160d] to-[#2c1d10] border-2 border-amber-500/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div>
                <span className="text-[10px] font-heading font-bold text-amber-400 uppercase tracking-widest block">
                  AKTİF ODA KODU
                </span>
                <span className="font-mono text-3xl font-black text-amber-300 tracking-wider">
                  {currentRoomId}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-[#3a2615] hover:bg-[#4a321c] border border-amber-500/60 text-xs text-amber-200 font-heading font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-lg wax-seal text-xs text-white font-heading font-bold flex items-center justify-center gap-1.5 shadow hover:brightness-110"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Davet Linki</span>
                </button>
              </div>
            </div>

            {/* Connected Players List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-heading font-bold text-amber-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Masadaki Oyuncular ({players.length})</span>
                </h4>
                <span className="text-[10px] text-stone-400 font-mono">Otomatik Senkronize</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-[#140e0a] border border-[#3b2a1a] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#251810] border border-amber-600/60 flex items-center justify-center text-amber-300 text-xs font-black">
                        {p.role === 'Anlatıcı' ? <Crown className="w-4 h-4 text-amber-400" /> : <Shield className="w-4 h-4 text-stone-400" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-heading font-bold text-[#f5ecd8] block truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-amber-400/80 font-serif block truncate">
                          {p.characterName ? `${p.characterName} (${p.characterHouse || 'Hanesiz'})` : p.role}
                        </span>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Çevrimiçi" />
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Scene Aspects Board */}
            <div className="p-3.5 rounded-xl bg-[#120c08] border border-[#3b2a1a] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-amber-400 flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5" />
                  <span>Ortak Sahne Durumları (Aspects)</span>
                </span>
                <span className="text-[10px] text-stone-500 font-serif italic">Masaüstü ortak etiketleri</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {aspects.length === 0 ? (
                  <span className="text-xs text-stone-500 italic">Henüz ortak sahne durumu eklenmedi.</span>
                ) : (
                  aspects.map((asp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#271b12] text-amber-200 border border-amber-600/50 text-xs font-serif flex items-center gap-1.5 shadow-sm"
                    >
                      <span>📜 {asp}</span>
                      <button
                        onClick={() => handleRemoveAspect(idx)}
                        className="text-stone-400 hover:text-red-400 text-xs ml-1"
                        title="Durumu kaldır"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <form onSubmit={handleAddAspect} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newAspectInput}
                  onChange={(e) => setNewAspectInput(e.target.value)}
                  placeholder="Yeni sahne durumu ekle (Örn: Alev Alan Çatı)..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0c0806] border border-[#443322] text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-heading font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ekle</span>
                </button>
              </form>
            </div>

            {/* Leave Room Action */}
            <div className="pt-2 border-t border-[#3b2a1a] flex justify-end">
              <button
                onClick={handleLeave}
                className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-200 text-xs font-heading font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Odadan Ayrıl</span>
              </button>
            </div>
          </div>
        ) : (
          /* Not Connected: Choose Create or Join */
          <div className="space-y-4">
            {view === 'status' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. ODA OLUŞTUR (GM) */}
                <button
                  onClick={() => {
                    sound.playSealStamp();
                    setView('create');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#23170e] to-[#17100a] border-2 border-amber-600/70 hover:border-amber-400 text-left space-y-2 hover:scale-[1.02] transition-all shadow-xl group"
                >
                  <div className="w-12 h-12 rounded-xl wax-seal-gold flex items-center justify-center text-amber-950 shadow">
                    <Crown className="w-6 h-6 text-amber-900" />
                  </div>
                  <h3 className="font-heading font-black text-sm text-amber-300 group-hover:text-amber-200">
                    YENİ DİVAN ODASI AÇ (GM)
                  </h3>
                  <p className="text-xs text-[#eedec8] font-serif leading-relaxed">
                    Arkadaşlarınızı davet etmek için yeni bir 6 haneli oda kodu ve masası oluşturun.
                  </p>
                  <span className="text-[11px] font-mono text-amber-400 font-bold block pt-1">
                    Anlatıcı Koltuğu ▶
                  </span>
                </button>

                {/* 2. ODAYA KATIL (OYUNCU) */}
                <button
                  onClick={() => {
                    sound.playSealStamp();
                    setView('join');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#1b140e] to-[#120d09] border-2 border-[#543d28] hover:border-amber-400 text-left space-y-2 hover:scale-[1.02] transition-all shadow-xl group"
                >
                  <div className="w-12 h-12 rounded-xl wax-seal flex items-center justify-center text-amber-200 shadow">
                    <KeyRound className="w-6 h-6 text-amber-200" />
                  </div>
                  <h3 className="font-heading font-black text-sm text-[#f5ecd8] group-hover:text-amber-200">
                    MEVCUT ODAYA KATIL
                  </h3>
                  <p className="text-xs text-[#eedec8] font-serif leading-relaxed">
                    GM arkadaşınızın size verdiği 6 haneli oda kodu ile masadaki yerinizi alın.
                  </p>
                  <span className="text-[11px] font-mono text-stone-400 font-bold block pt-1">
                    Koda Göre Bağlan ▶
                  </span>
                </button>
              </div>
            )}

            {/* Create Room Form */}
            {view === 'create' && (
              <form onSubmit={handleCreateRoom} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold text-amber-400 block">
                    Sefer / Divan Başlığı
                  </label>
                  <input
                    type="text"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    placeholder="Örn: Arava Sarayı İhaneti..."
                    className="w-full px-3 py-2 rounded-xl bg-[#100b08] border border-[#4d3824] text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold text-amber-400 block">
                    Anlatıcı İsminiz
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Anlatıcı Adı..."
                    className="w-full px-3 py-2 rounded-xl bg-[#100b08] border border-[#4d3824] text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setView('status')}
                    className="w-1/2 py-2.5 rounded-xl bg-[#1f1712] text-stone-300 text-xs font-heading font-bold border border-[#4a3623]"
                  >
                    Geri
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl wax-seal-gold text-amber-950 text-xs font-heading font-black hover:brightness-110 shadow flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-900" />
                    <span>Odayı Başlat</span>
                  </button>
                </div>
              </form>
            )}

            {/* Join Room Form */}
            {view === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold text-amber-400 block">
                    6 Haneli Oda Kodu
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Örn: ARAV26"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b08] border-2 border-amber-500/80 text-amber-300 text-base font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold text-amber-400 block">
                      Oyuncu İsminiz
                    </label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Adınız..."
                      className="w-full px-3 py-2 rounded-xl bg-[#100b08] border border-[#4d3824] text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold text-amber-400 block">
                      Masa Rolü
                    </label>
                    <select
                      value={playerRole}
                      onChange={(e) => setPlayerRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#100b08] border border-[#4d3824] text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Oyuncu">Oyuncu (Karakter Sahibi)</option>
                      <option value="Anlatıcı">Anlatıcı / Yardımcı GM</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#120c08] border border-[#3b2a1a] text-[11px] text-[#eedec8]">
                  Seçili Kahramanınız: <span className="text-amber-300 font-bold">{aktifKarakter?.ad} ({aktifKarakter?.hane})</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setView('status')}
                    className="w-1/2 py-2.5 rounded-xl bg-[#1f1712] text-stone-300 text-xs font-heading font-bold border border-[#4a3623]"
                  >
                    Geri
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl wax-seal text-white text-xs font-heading font-black hover:brightness-110 shadow flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Masaya Bağlan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
