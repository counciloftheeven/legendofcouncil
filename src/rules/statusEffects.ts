export type DurumTuru = 'buff' | 'debuff';

export interface DurumEfektiTanimi {
  id: string;
  ad: string;
  ikon: string;
  tur: DurumTuru;
  aciklama: string;
  zarBonusu: number;          // 4dF zar atışına eklenen/çıkarılan modifikatör (-2, +2 vb.)
  savunmaBonusu: number;     // Savunma zarına veya zırha etki eden modifikatör
  hasarBonusu: number;        // Başarılı vuruşta eklenen ekstra hasar
  turBasiHasar: number;       // Her tur başında otomatik alınan yara/hasar (DoT)
  renk: string;               // Tailwind renk sınıfları
  bgRenk: string;
  sinif: string;              // Badge stili
}

export const CANON_STATUS_EFFECTS: DurumEfektiTanimi[] = [
  {
    id: 'kanamali',
    ad: 'Kanamalı',
    ikon: '🩸',
    tur: 'debuff',
    aciklama: 'Açık kılıç veya mızrak yarası. Her tur başı 1 Yara alır, zar atışlarına -1 ceza uygular.',
    zarBonusu: -1,
    savunmaBonusu: 0,
    hasarBonusu: 0,
    turBasiHasar: 1,
    renk: 'text-rose-300',
    bgRenk: 'bg-rose-950/80',
    sinif: 'border-rose-700 bg-rose-950/80 text-rose-300'
  },
  {
    id: 'sersemlemis',
    ad: 'Sersemlemiş',
    ikon: '💫',
    tur: 'debuff',
    aciklama: 'Ağır balyoz veya kalkan darbesiyle sarsılmış zihin. Zar atışlarına -2, Savunmaya -2 ceza.',
    zarBonusu: -2,
    savunmaBonusu: -2,
    hasarBonusu: 0,
    turBasiHasar: 0,
    renk: 'text-amber-300',
    bgRenk: 'bg-amber-950/80',
    sinif: 'border-amber-700 bg-amber-950/80 text-amber-300'
  },
  {
    id: 'kutsanmis',
    ad: 'Kutsanmış',
    ikon: '✨',
    tur: 'buff',
    aciklama: 'Denge Konseyi ilahlarının ve Era’nın kutsal nuru. Zar atışlarına +2 Kutsal Bonus, Savunmaya +1.',
    zarBonusu: 2,
    savunmaBonusu: 1,
    hasarBonusu: 0,
    turBasiHasar: 0,
    renk: 'text-yellow-300',
    bgRenk: 'bg-yellow-950/80',
    sinif: 'border-yellow-500 bg-yellow-950/80 text-yellow-200'
  },
  {
    id: 'zehirlenmis',
    ad: 'Zehirlenmiş',
    ikon: '🧪',
    tur: 'debuff',
    aciklama: 'Damarlara sızan Solgun Sızı engerek zehri. Her tur başı 1 Yara alır, zarlara -1 ceza.',
    zarBonusu: -1,
    savunmaBonusu: 0,
    hasarBonusu: 0,
    turBasiHasar: 1,
    renk: 'text-emerald-300',
    bgRenk: 'bg-emerald-950/80',
    sinif: 'border-emerald-700 bg-emerald-950/80 text-emerald-300'
  },
  {
    id: 'alevler_icinde',
    ad: 'Alevler İçinde',
    ikon: '🔥',
    tur: 'debuff',
    aciklama: 'Ejder ateşi veya yanık katranla kavrulma. Her tur başı 2 Yara alır, Savunmaya -1 ceza.',
    zarBonusu: 0,
    savunmaBonusu: -1,
    hasarBonusu: 0,
    turBasiHasar: 2,
    renk: 'text-orange-300',
    bgRenk: 'bg-orange-950/80',
    sinif: 'border-orange-600 bg-orange-950/80 text-orange-300'
  },
  {
    id: 'korlesmis',
    ad: 'Körleşmiş',
    ikon: '👁️‍🗨️',
    tur: 'debuff',
    aciklama: 'Kükürt dumanı, kireç tozu veya karanlık büyüyle görüş kaybı. Zar atışlarına -2 ceza.',
    zarBonusu: -2,
    savunmaBonusu: -2,
    hasarBonusu: 0,
    turBasiHasar: 0,
    renk: 'text-slate-300',
    bgRenk: 'bg-slate-900/80',
    sinif: 'border-slate-600 bg-slate-900/80 text-slate-300'
  },
  {
    id: 'odaklanmis',
    ad: 'Odaklanmış',
    ikon: '🎯',
    tur: 'buff',
    aciklama: 'Teyakkuzda, soğukkanlı avcı dikkati ve keskin refleks. Zar atışlarına +1 Bonus, Savunmaya +1.',
    zarBonusu: 1,
    savunmaBonusu: 1,
    hasarBonusu: 0,
    turBasiHasar: 0,
    renk: 'text-cyan-300',
    bgRenk: 'bg-cyan-950/80',
    sinif: 'border-cyan-600 bg-cyan-950/80 text-cyan-200'
  },
  {
    id: 'celik_siper',
    ad: 'Çelik Siper',
    ikon: '🛡️',
    tur: 'buff',
    aciklama: 'Galdor siperinde kenetlenmiş kalkan duvarı. Savunmaya +2 Savunma ve +1 Zırh Bonusu.',
    zarBonusu: 0,
    savunmaBonusu: 2,
    hasarBonusu: 0,
    turBasiHasar: 0,
    renk: 'text-blue-300',
    bgRenk: 'bg-blue-950/80',
    sinif: 'border-blue-600 bg-blue-950/80 text-blue-200'
  },
  {
    id: 'hiddetli',
    ad: 'Hiddetli',
    ikon: '⚡',
    tur: 'buff',
    aciklama: 'Acıyla körleşmiş vahşi öfke. Başarılı vuruşta +2 Ekstra Hasar verir fakat Savunmaya -1 ceza.',
    zarBonusu: 1,
    savunmaBonusu: -1,
    hasarBonusu: 2,
    turBasiHasar: 0,
    renk: 'text-red-400',
    bgRenk: 'bg-red-950/80',
    sinif: 'border-red-600 bg-red-950/80 text-red-300'
  },
  {
    id: 'dehset_icinde',
    ad: 'Dehşet İçinde',
    ikon: '💀',
    tur: 'debuff',
    aciklama: 'Maraz korkusu ve tiranlığın yarattığı zihinsel felç. Tüm zar atışlarına -2 Ceza.',
    zarBonusu: -2,
    savunmaBonusu: -1,
    hasarBonusu: 0,
    turBasiHasar: 0,
    renk: 'text-purple-300',
    bgRenk: 'bg-purple-950/80',
    sinif: 'border-purple-600 bg-purple-950/80 text-purple-200'
  }
];

// Helper Functions
export function getStatusEffect(nameOrId: string): DurumEfektiTanimi | undefined {
  const norm = nameOrId.toLowerCase().trim();
  return CANON_STATUS_EFFECTS.find(
    (e) =>
      e.id === norm ||
      e.ad.toLowerCase() === norm ||
      norm.includes(e.ad.toLowerCase()) ||
      e.ad.toLowerCase().includes(norm)
  );
}

export function parseStatusEffects(durumlar: string[] = []): DurumEfektiTanimi[] {
  const matched: DurumEfektiTanimi[] = [];
  durumlar.forEach((durum) => {
    const effect = getStatusEffect(durum);
    if (effect && !matched.some((m) => m.id === effect.id)) {
      matched.push(effect);
    }
  });
  return matched;
}

export function calculateStatusDiceModifier(durumlar: string[] = []): number {
  const effects = parseStatusEffects(durumlar);
  return effects.reduce((sum, e) => sum + e.zarBonusu, 0);
}

export function calculateStatusDefenseModifier(durumlar: string[] = []): number {
  const effects = parseStatusEffects(durumlar);
  return effects.reduce((sum, e) => sum + e.savunmaBonusu, 0);
}

export function calculateStatusDamageModifier(durumlar: string[] = []): number {
  const effects = parseStatusEffects(durumlar);
  return effects.reduce((sum, e) => sum + e.hasarBonusu, 0);
}

export function calculateStatusTurnDamage(durumlar: string[] = []): number {
  const effects = parseStatusEffects(durumlar);
  return effects.reduce((sum, e) => sum + e.turBasiHasar, 0);
}
