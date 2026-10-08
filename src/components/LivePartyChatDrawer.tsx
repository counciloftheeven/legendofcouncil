import React, { useState, useEffect } from 'react';
import { multiplayer, MultiplayerEvent, RoomPlayer } from '../utils/multiplayerManager';
import { Karakter } from '../rules';
import { sound } from '../utils/audio';
import {
  MessageSquare,
  Send,
  X,
  Lock,
  Sparkles,
  Users,
  Radio,
  Scroll,
  Crown,
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LivePartyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  aktifKarakter: Karakter;
  rol: 'Anlatıcı' | 'Oyuncu';
  spotlightPlayerId: string | null;
  onSetSpotlight: (playerId: string | null, playerName: string) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isWhisper?: boolean;
  target?: string;
}

export const LivePartyChatDrawer: React.FC<LivePartyChatDrawerProps> = ({
  isOpen,
  onClose,
  aktifKarakter,
  rol,
  spotlightPlayerId,
  onSetSpotlight,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'whisper' | 'rolls'>('chat');
  const [whisperTarget, setWhisperTarget] = useState<string>('GM');
  const [rollLogs, setRollLogs] = useState<MultiplayerEvent[]>([]);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);

  const myPlayerName = multiplayer.getPlayerName() || aktifKarakter?.oyuncu || 'Seyyah';
  const myPlayerId = multiplayer.getPlayerId();

  useEffect(() => {
    setPlayers(multiplayer.getPlayers());

    const unsubPlayers = multiplayer.onPlayersChange((p) => {
      setPlayers([...p]);
    });

    const unsubEvents = multiplayer.onEvent((ev) => {
      if (ev.type === 'chat') {
        const isWhisper = !!ev.target;
        // If whisper, only show if I'm sender or target, or if I'm GM
        if (isWhisper) {
          if (ev.target !== myPlayerId && ev.target !== myPlayerName && !ev.sender.includes(myPlayerName) && rol !== 'Anlatıcı') {
            return;
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: ev.id,
            sender: ev.sender,
            text: ev.payload?.text || '',
            timestamp: ev.timestamp,
            isWhisper,
            target: ev.target,
          },
        ]);
        sound.playSealStamp();
      } else if (ev.type === 'zar') {
        setRollLogs((prev) => [ev, ...prev.slice(0, 30)]);
      }
    });

    return () => {
      unsubPlayers();
      unsubEvents();
    };
  }, [myPlayerId, myPlayerName, rol]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const isWhisper = activeTab === 'whisper';
    const textToSend = inputText.trim();

    multiplayer.broadcast(
      'chat',
      { text: textToSend },
      isWhisper ? whisperTarget : undefined
    );

    // Add locally immediately
    setMessages((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        sender: `${aktifKarakter.ad} (${myPlayerName})`,
        text: textToSend,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isWhisper,
        target: isWhisper ? whisperTarget : undefined,
      },
    ]);

    setInputText('');
    sound.playSealStamp();
  };

  const handlePassSpotlight = (player: RoomPlayer) => {
    sound.playTempleBell('uyanis');
    confetti({ particleCount: 30, spread: 45 });
    onSetSpotlight(player.id, player.name);

    multiplayer.broadcast('sahne', {
      spotlightPlayerId: player.id,
      spotlightName: player.name,
      text: `👑 Anlatıcı sahne ışığını (Spotlight) ${player.name} oyuncusuna devretti!`,
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#100b07] border-l-2 border-amber-600/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-3.5 border-b border-[#3b291a] flex items-center justify-between bg-[#18110b]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full wax-seal flex items-center justify-center text-amber-200">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <span>DİVAN SOHBETİ &amp; FISILTI</span>
            </h3>
            <span className="text-[10px] text-stone-400 font-mono">
              Oda: {multiplayer.getRoomId() || 'Yerel Masa'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#281b11] text-stone-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Spotlight Bar (Söz Sırası Göstergesi) */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-[#21150c] via-[#2d1e12] to-[#21150c] border-b border-[#3b291a] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-amber-400 uppercase font-mono font-bold block leading-none">
              SAHNE IŞIĞI (SÖZ SIRASI)
            </span>
            <span className="text-xs font-serif font-bold text-amber-100 truncate block">
              {spotlightPlayerId ? `Söz: ${spotlightPlayerId}` : 'Serbest Sohbet (Herkes)'}
            </span>
          </div>
        </div>

        {/* Quick Spotlight Dropdown for GM */}
        {rol === 'Anlatıcı' && players.length > 0 && (
          <div className="flex items-center gap-1">
            <select
              onChange={(e) => {
                const found = players.find((p) => p.id === e.target.value);
                if (found) handlePassSpotlight(found);
              }}
              defaultValue=""
              className="text-[10px] px-2 py-1 rounded bg-[#100a06] border border-amber-600/60 text-amber-300 font-mono"
            >
              <option value="" disabled>Sözü Ver ▶</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.characterName || 'Karaktersiz'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 border-b border-[#3b291a] text-xs font-heading font-bold text-stone-400 bg-[#140e09]">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2 text-center transition-colors ${
            activeTab === 'chat'
              ? 'text-amber-300 border-b-2 border-amber-500 bg-[#1d140d]'
              : 'hover:text-stone-200'
          }`}
        >
          Genel Sohbet
        </button>
        <button
          onClick={() => setActiveTab('whisper')}
          className={`py-2 text-center transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'whisper'
              ? 'text-purple-300 border-b-2 border-purple-500 bg-[#1d140d]'
              : 'hover:text-stone-200'
          }`}
        >
          <Lock className="w-3 h-3 text-purple-400" />
          <span>Gizli Fısıltı</span>
        </button>
        <button
          onClick={() => setActiveTab('rolls')}
          className={`py-2 text-center transition-colors ${
            activeTab === 'rolls'
              ? 'text-amber-300 border-b-2 border-amber-500 bg-[#1d140d]'
              : 'hover:text-stone-200'
          }`}
        >
          Zar Defteri
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {activeTab === 'rolls' ? (
          /* Live Dice Feed */
          <div className="space-y-2">
            {rollLogs.length === 0 ? (
              <p className="text-xs text-stone-500 font-serif italic text-center py-6">
                Henüz masada bir zar atılmadı.
              </p>
            ) : (
              rollLogs.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl bg-[#140e0a] border border-[#382618] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-stone-400 font-mono text-[10px]">
                    <span className="text-amber-400 font-bold">{ev.sender}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                  <div className="font-serif text-[#ebdcc8]">
                    {ev.payload?.beceri}:{' '}
                    <strong className="text-amber-300">
                      {ev.payload?.toplam >= 0 ? `+${ev.payload?.toplam}` : ev.payload?.toplam}{' '}
                      ({ev.payload?.basariSeviyesi || 'Standart'})
                    </strong>
                  </div>
                  {Array.isArray(ev.payload?.zarlar) && (
                    <div className="flex gap-1 pt-0.5">
                      {ev.payload.zarlar.map((z: number, i: number) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[11px] ${
                            z === 1
                              ? 'bg-amber-600/80 text-black border border-amber-400'
                              : z === -1
                              ? 'bg-red-950 text-red-300 border border-red-700'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {z === 1 ? '+' : z === -1 ? '−' : '0'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Chat & Whisper Messages */
          <div className="space-y-2.5">
            {messages.length === 0 ? (
              <div className="text-center py-8 space-y-1 text-stone-500">
                <Scroll className="w-8 h-8 mx-auto opacity-40 text-amber-500" />
                <p className="text-xs font-serif italic">
                  Divan parşömeni temiz. İlk mesajı siz yazın!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs space-y-1 ${
                    msg.isWhisper
                      ? 'bg-purple-950/60 border border-purple-700/80 text-purple-200'
                      : 'bg-[#18110b] border border-[#3b291a] text-[#ecdcc8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                    <span className="font-bold flex items-center gap-1">
                      {msg.isWhisper && <Lock className="w-3 h-3 text-purple-400" />}
                      <span>{msg.sender}</span>
                      {msg.target && <span className="text-purple-400">▶ {msg.target}</span>}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="font-serif leading-relaxed text-[#f3e6d6]">
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Input Box (Chat & Whisper) */}
      {activeTab !== 'rolls' && (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#3b291a] bg-[#140e09] space-y-2">
          {activeTab === 'whisper' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[10px] font-mono text-purple-400 font-bold">Kime Fısılda:</span>
              <select
                value={whisperTarget}
                onChange={(e) => setWhisperTarget(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-[#0e0805] border border-purple-600/60 text-purple-200 text-xs font-mono"
              >
                <option value="GM">Anlatıcı (GM Gizli)</option>
                {players
                  .filter((p) => p.name !== myPlayerName)
                  .map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.characterName || 'Oyuncu'})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'whisper'
                  ? 'Gizli fısıltınızı yazın (yalnızca muhatap görür)...'
                  : 'Divan masasına mesaj yazın...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-[#0d0805] border border-[#443322] text-xs text-amber-200 focus:outline-none focus:border-amber-400 font-serif"
            />
            <button
              type="submit"
              className={`px-3 py-2 rounded-xl text-xs font-heading font-bold shadow flex items-center justify-center ${
                activeTab === 'whisper'
                  ? 'bg-purple-800 hover:bg-purple-700 text-white'
                  : 'wax-seal text-white hover:brightness-110'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
