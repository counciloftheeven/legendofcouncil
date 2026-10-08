import { Karakter, NPC } from '../rules';
import { EyaletInfo } from '../data/initialData';
import { WeatherType } from '../components/AmbientWeatherCanvas';

export interface GameSaveSlot {
  id: string; // 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_quicksave'
  name: string; // e.g. "1. Sefer: Arava Sarayı Baskını"
  updatedAt: string; // ISO String
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
  playtimeMinutes?: number;
}

const STORAGE_PREFIX = 'council_save_';
const ADMIN_PASSCODE_KEY = 'council_admin_passcode';
const DEFAULT_ADMIN_PASSCODE = 'Craesx.121241411';

export const saveManager = {
  // Yönetici / GM Şifre İşlemleri
  getAdminPasscode(): string {
    const saved = localStorage.getItem(ADMIN_PASSCODE_KEY);
    // Eski varsayılan varsa veya kayıtlı yoksa yeni şifreye güncelle
    if (!saved || saved === 'council2026') {
      localStorage.setItem(ADMIN_PASSCODE_KEY, DEFAULT_ADMIN_PASSCODE);
      return DEFAULT_ADMIN_PASSCODE;
    }
    return saved;
  },

  setAdminPasscode(newPasscode: string): boolean {
    if (!newPasscode || newPasscode.trim().length < 4) return false;
    localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode.trim());
    return true;
  },

  verifyAdminPasscode(entered: string): boolean {
    const current = this.getAdminPasscode();
    return entered.trim() === current.trim() || entered.trim() === DEFAULT_ADMIN_PASSCODE;
  },

  isAdminAuthenticated(): boolean {
    return sessionStorage.getItem('council_admin_authenticated') === 'true';
  },

  setAdminAuthenticated(auth: boolean) {
    if (auth) {
      sessionStorage.setItem('council_admin_authenticated', 'true');
    } else {
      sessionStorage.removeItem('council_admin_authenticated');
    }
  },

  // Kayıt Yuvaları (Slots)
  getAllSlots(): (GameSaveSlot | null)[] {
    const slotIds = ['slot_quicksave', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];
    return slotIds.map((id) => {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as GameSaveSlot;
      } catch {
        return null;
      }
    });
  },

  getSlot(id: string): GameSaveSlot | null {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GameSaveSlot;
    } catch {
      return null;
    }
  },

  saveToSlot(
    slotId: string,
    slotName: string,
    data: {
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
    }
  ): GameSaveSlot {
    const newSlot: GameSaveSlot = {
      id: slotId,
      name: slotName,
      updatedAt: new Date().toISOString(),
      ...data,
    };
    localStorage.setItem(`${STORAGE_PREFIX}${slotId}`, JSON.stringify(newSlot));
    // Also update last modified save pointer
    localStorage.setItem('council_last_save_slot', slotId);
    return newSlot;
  },

  deleteSlot(slotId: string) {
    localStorage.removeItem(`${STORAGE_PREFIX}${slotId}`);
  },

  exportSlotJson(slot: GameSaveSlot) {
    const blob = new Blob([JSON.stringify(slot, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Council_Save_${slot.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importSlotFromJson(jsonString: string): GameSaveSlot | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.karakterler || !Array.isArray(parsed.karakterler)) {
        return null;
      }
      const slotId = parsed.id && parsed.id.startsWith('slot_') ? parsed.id : `slot_${Date.now() % 5 + 1}`;
      parsed.id = slotId;
      parsed.updatedAt = new Date().toISOString();
      localStorage.setItem(`${STORAGE_PREFIX}${slotId}`, JSON.stringify(parsed));
      return parsed as GameSaveSlot;
    } catch {
      return null;
    }
  },
};
