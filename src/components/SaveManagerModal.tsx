import React, { useState, useEffect } from 'react';
import { GameSaveSlot, saveManager } from '../utils/saveManager';
import { Karakter, NPC } from '../rules';
import { EyaletInfo } from '../data/initialData';
import { WeatherType } from '../components/AmbientWeatherCanvas';
import { sound } from '../utils/audio';
import {
  Save,
  RotateCcw,
  FileDown,
  FileUp,
  Trash2,
  X,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Shield,
  Scroll,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load' | 'manage';
  currentState?: {
    scenarioTitle: string;
    scenarioNotes?: string;
    activeZoneId: string;
    activeZoneName: string;
    aktifKarakterId: string;
    karakterler: Karakter[];
    npcler: NPC[];
    eyaletler?: EyaletInfo[];
    weather: WeatherType;
    gameTime?: string;
  };
  onLoadSave: (save: GameSaveSlot) => void;
}

export const SaveManagerModal: React.FC<SaveManagerModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentState,
  onLoadSave,
}) => {
  const [slots, setSlots] = useState<(GameSaveSlot | null)[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot_1');
  const [slotNameInput, setSlotNameInput] = useState<string>('');
  const [scenarioTitleInput, setScenarioTitleInput] = useState<string>('');
  const [scenarioNotesInput, setScenarioNotesInput] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadAllSlots = () => {
    setSlots(saveManager.getAllSlots());
  };

  useEffect(() => {
    if (isOpen) {
      loadAllSlots();
      if (currentState) {
        setScenarioTitleInput(currentState.scenarioTitle || 'Stallhart Seferi');
        setScenarioNotesInput(currentState.scenarioNotes || '');
        setSlotNameInput(`Kayıt: ${currentState.activeZoneName || 'Bölge'}`);
      }
    }
  }, [isOpen, currentState]);

  if (!isOpen) return null;

  const handleSaveToSlot = (slotId: string) => {
    if (!currentState) return;
    const name = slotNameInput.trim() || `Kayıt: ${currentState.activeZoneName}`;
    const saved = saveManager.saveToSlot(slotId, name, {
      ...currentState,
      scenarioTitle: scenarioTitleInput.trim() || currentState.scenarioTitle,
      scenarioNotes: scenarioNotesInput.trim(),
    });
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 50 });
    setNotification(`"${name}" başarıyla yuvaya kaydedildi.`);
    loadAllSlots();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLoadSlot = (slot: GameSaveSlot) => {
    sound.playTempleBell('uyanis');
    onLoadSave(slot);
    onClose();
  };

  const handleDeleteSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveManager.deleteSlot(slotId);
    sound.playBladeClash();
    loadAllSlots();
  };

  const handleExportSlot = (slot: GameSaveSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    saveManager.exportSlotJson(slot);
    sound.playSealStamp();
  };

  const handleImportSlotFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = saveManager.importSlotFromJson(content);
      if (imported) {
        sound.playTempleBell('koruma');
        confetti({ particleCount: 35, spread: 55 });
        loadAllSlots();
        setNotification(`"${imported.name}" yedeği başarıyla içeri aktarıldı.`);
        setTimeout(() => setNotification(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const slotLabels: Record<string, string> = {
    slot_quicksave: 'Hızlı Kayıt (Quick Save)',
    slot_1: '1. Kayıt Yuvası',
    slot_2: '2. Kayıt Yuvası',
    slot_3: '3. Kayıt Yuvası',
    slot_4: '4. Kayıt Yuvası',
    slot_5: '5. Kayıt Yuvası',
  };

  const allSlotIds = ['slot_quicksave', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full parchment-sheet rounded-2xl border-2 border-amber-600/80 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
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
            {mode === 'load' ? <RotateCcw className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg text-amber-300 uppercase tracking-wider">
              {mode === 'load'
                ? 'SEFER VE KAYIT YÜKLE (LOAD GAME)'
                : mode === 'save'
                ? 'SEFERİ VE OYUNU KAYDET (SAVE GAME)'
                : 'SEFER VE ARŞİV YÖNETİCİSİ'}
            </h2>
            <p className="text-xs text-[#eedec8] font-serif italic">
              Oyun durumu, parti kahramanları, envanter, NPC ve harita konumu.
            </p>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Save Details Inputs (Only when saving) */}
        {mode !== 'load' && currentState && (
          <div className="p-3.5 rounded-xl bg-[#140e0a] border border-[#3b2a1a] space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-heading font-bold text-amber-400 block mb-1">
                  Kayıt Başlığı
                </label>
                <input
                  type="text"
                  value={slotNameInput}
                  onChange={(e) => setSlotNameInput(e.target.value)}
                  placeholder="Kayıt Adı..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0e0a07] border border-[#443322] text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-heading font-bold text-amber-400 block mb-1">
                  Senaryo / Görev Başlığı
                </label>
                <input
                  type="text"
                  value={scenarioTitleInput}
                  onChange={(e) => setScenarioTitleInput(e.target.value)}
                  placeholder="Senaryo başlığı..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0e0a07] border border-[#443322] text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-heading font-bold text-amber-400 block mb-1">
                Senaryo &amp; Anlatıcı Notu
              </label>
              <input
                type="text"
                value={scenarioNotesInput}
                onChange={(e) => setScenarioNotesInput(e.target.value)}
                placeholder="Örn: 2. zindanın kapısında dinlenildi, büyücü yaralı..."
                className="w-full px-3 py-1.5 rounded-lg bg-[#0e0a07] border border-[#443322] text-xs text-stone-300 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Slots List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[46vh]">
          {allSlotIds.map((slotId, index) => {
            const slot = slots.find((s) => s?.id === slotId) || null;
            const isSelected = selectedSlotId === slotId;

            return (
              <div
                key={slotId}
                onClick={() => setSelectedSlotId(slotId)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#281b11] border-amber-400 shadow-lg ring-1 ring-amber-400'
                    : 'bg-[#15100c] border-[#3b2a1a] hover:border-[#634830]'
                }`}
              >
                {/* Slot Info */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-black text-amber-300">
                      {slotLabels[slotId]}
                    </span>
                    {slot ? (
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Dolu
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-500 font-mono bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                        Boş Yuva
                      </span>
                    )}
                  </div>

                  {slot ? (
                    <>
                      <h4 className="font-heading font-bold text-sm text-[#f5ecd8] truncate">
                        {slot.name}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-[#ad9b87] flex-wrap font-serif">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{slot.activeZoneName || slot.activeZoneId}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-500" />
                          <span>{slot.karakterler?.length || 0} Kahraman</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{new Date(slot.updatedAt).toLocaleString('tr-TR')}</span>
                        </span>
                      </div>
                      {slot.scenarioNotes && (
                        <p className="text-[11px] text-[#8e7e6d] italic truncate">
                          &quot;{slot.scenarioNotes}&quot;
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-stone-500 italic">
                      Bu kayıt yuvası henüz boş. Yeni sefer kaydedilebilir.
                    </p>
                  )}
                </div>

                {/* Slot Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {slot && (
                    <>
                      <button
                        onClick={() => handleLoadSlot(slot)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-heading font-black text-xs shadow flex items-center gap-1"
                        title="Bu kaydı yükle ve oyuna başla"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Yükle</span>
                      </button>

                      <button
                        onClick={(e) => handleExportSlot(slot, e)}
                        className="p-1.5 rounded-lg bg-[#201711] hover:bg-[#32241a] text-stone-300 border border-[#4d3824]"
                        title="Bu kaydı JSON olarak indir"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteSlot(slotId, e)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800"
                        title="Bu kaydı sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {mode !== 'load' && currentState && (
                    <button
                      onClick={() => handleSaveToSlot(slotId)}
                      className="px-3 py-1.5 rounded-lg wax-seal text-white font-heading font-bold text-xs shadow flex items-center gap-1 hover:brightness-110"
                      title="Mevcut oyunu bu yuvaya kaydet"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{slot ? 'Üzerine Yaz' : 'Buraya Kaydet'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions: Import JSON Save */}
        <div className="pt-2 border-t border-[#3b2a1a] flex items-center justify-between gap-2 flex-wrap">
          <label className="px-3 py-1.5 rounded-xl bg-[#1c150f] hover:bg-[#2c2016] border border-[#443322] text-xs text-amber-300 font-heading font-bold flex items-center gap-1.5 cursor-pointer shadow">
            <FileUp className="w-3.5 h-3.5" />
            <span>JSON Kayıt Dosyası Yükle</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSlotFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              sound.playSealStamp();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[#201812] text-stone-300 text-xs font-heading font-bold border border-[#4a3623] hover:text-white"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
