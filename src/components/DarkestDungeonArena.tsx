import React, { useState } from 'react';
import { Karakter, NPC, YaklasimAdi, merdivenDerecesiBul, fateAtisiHesapla } from '../rules';
import { VAHSI_HAYVANLAR, CANAVARLAR_VE_YARATIKLAR, RASTGELE_DUSMAN_NPCLER, rastgeleDusmanUret } from '../data/monstersAndBeasts';
import { sound } from '../utils/audio';
import { ContextTooltip } from './ContextTooltip';
import {
  Swords,
  Shield,
  Heart,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Crosshair,
  Award,
  Crown,
  Skull,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ArenaCombatant {
  id: string;
  ad: string;
  unvan: string;
  tur: 'Kahraman' | 'Düşman';
  side: 'sol' | 'sag';
  rank: 1 | 2 | 3 | 4; // 1 = En Ön, 4 = En Arka
  fotoUrl: string;
  fizikselKutular: [boolean, boolean, boolean];
  zihinselKutular: [boolean, boolean, boolean];
  itibarKutu: boolean;
  zirh: number;
  olcek: number;
  stresKrizde: boolean;
  durumlar: string[];
  tercihEdilenYaklasim: YaklasimAdi;
}

interface DarkestDungeonArenaProps {
  karakterler: Karakter[];
  aktifKarakter: Karakter;
  npcler: NPC[];
  onKarakterGuncelle: (yeni: Karakter) => void;
  onKapat?: () => void;
}

export const DarkestDungeonArena: React.FC<DarkestDungeonArenaProps> = ({
  karakterler,
  aktifKarakter,
  npcler,
  onKarakterGuncelle,
  onKapat,
}) => {
  // Sol Takım (4 Kahraman: Rank 4, 3, 2, 1)
  const [solTakim, setSolTakim] = useState<ArenaCombatant[]>(() => [
    {
      id: 'hero_4',
      ad: 'Wolanlı Avcı & Tazı',
      unvan: 'Gözcü & İlimci',
      tur: 'Kahraman',
      side: 'sol',
      rank: 4,
      fotoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 0,
      olcek: 2,
      stresKrizde: false,
      durumlar: ['Tazı Teyakkuzda'],
      tercihEdilenYaklasim: 'Rax-ed'
    },
    {
      id: 'hero_3',
      ad: 'Gölgeli Maskeli Bıçak',
      unvan: 'Suikastçı & Hançer',
      tur: 'Kahraman',
      side: 'sol',
      rank: 3,
      fotoUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 1,
      olcek: 2,
      stresKrizde: false,
      durumlar: ['Gölgede Saklı'],
      tercihEdilenYaklasim: 'Lodvez'
    },
    {
      id: 'hero_2',
      ad: 'Demir Muhafız Erthan',
      unvan: 'Kalkan Duvarı & Çelik',
      tur: 'Kahraman',
      side: 'sol',
      rank: 2,
      fotoUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 2,
      olcek: 4,
      stresKrizde: false,
      durumlar: ['Kalkan Siperinde'],
      tercihEdilenYaklasim: 'Lithron'
    },
    {
      id: 'hero_1',
      ad: aktifKarakter.ad || 'Prens Zeandor',
      unvan: aktifKarakter.meslek || 'Hanedan Şampiyonu',
      tur: 'Kahraman',
      side: 'sol',
      rank: 1,
      fotoUrl: aktifKarakter.fotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [
        aktifKarakter.yaraHatlari?.fiziksel?.[0] || false,
        aktifKarakter.yaraHatlari?.fiziksel?.[1] || false,
        aktifKarakter.yaraHatlari?.fiziksel?.[2] || false
      ],
      zihinselKutular: [
        aktifKarakter.yaraHatlari?.zihinsel?.[0] || false,
        aktifKarakter.yaraHatlari?.zihinsel?.[1] || false,
        aktifKarakter.yaraHatlari?.zihinsel?.[2] || false
      ],
      itibarKutu: aktifKarakter.yaraHatlari?.itibar?.[0] || false,
      zirh: 2,
      olcek: aktifKarakter.olcek || 5,
      stresKrizde: false,
      durumlar: ['Ön Safta'],
      tercihEdilenYaklasim: 'Ghardello'
    }
  ]);

  // Sağ Takım (4 Düşman: Rank 1, 2, 3, 4)
  const [sagTakim, setSagTakim] = useState<ArenaCombatant[]>(() => [
    {
      id: 'enemy_1',
      ad: 'Cüzzamlı İnfazcı',
      unvan: 'Çentikli Dev Kılıç',
      tur: 'Düşman',
      side: 'sag',
      rank: 1,
      fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 2,
      olcek: 3,
      stresKrizde: false,
      durumlar: ['Kefenli Maske', 'Ölümcül Vuruş'],
      tercihEdilenYaklasim: 'Ghardello'
    },
    {
      id: 'enemy_2',
      ad: 'Mabed Haçlı Şövalyesi',
      unvan: 'Kutsal Yeminli Zırh',
      tur: 'Düşman',
      side: 'sag',
      rank: 2,
      fotoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 3,
      olcek: 4,
      stresKrizde: false,
      durumlar: ['Ağır Zırhlı'],
      tercihEdilenYaklasim: 'Lithron'
    },
    {
      id: 'enemy_3',
      ad: 'Gölge Okültisti',
      unvan: 'Yasak Parşömen & Büyü',
      tur: 'Düşman',
      side: 'sag',
      rank: 3,
      fotoUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 0,
      olcek: 6,
      stresKrizde: false,
      durumlar: ['Leke Dokuyan'],
      tercihEdilenYaklasim: 'Loth'
    },
    {
      id: 'enemy_4',
      ad: 'Galetsha Ağır Arbaletçisi',
      unvan: 'Çelik Gerdirmeli Yay',
      tur: 'Düşman',
      side: 'sag',
      rank: 4,
      fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
      fizikselKutular: [false, false, false],
      zihinselKutular: [false, false, false],
      itibarKutu: false,
      zirh: 1,
      olcek: 3,
      stresKrizde: false,
      durumlar: ['Keskin Nişan'],
      tercihEdilenYaklasim: 'Rax-ed'
    }
  ]);

  // Aktif Seçili Savaşçı & Hedef
  const [seciliSolId, setSeciliSolId] = useState<string>('hero_1');
  const [seciliSagId, setSeciliSagId] = useState<string>('enemy_1');

  // Lomera Barışı & 1v1 Dello Modu
  const [delloModu, setDelloModu] = useState<boolean>(false);

  // Çevresel Alan ve Tehlike (Environmental Hazard)
  const [aktifTehlike, setAktifTehlike] = useState<
    'none' | 'kukurt' | 'mahzen' | 'mihrap' | 'bataklik' | 'leke_gecidi'
  >('none');

  // Hazır Arena Düşman Grupları
  const ARENA_DUSMAN_TAKIMLARI = [
    {
      id: 'engizisyon',
      ad: '⚖️ Mabed Engizisyonu',
      uyeler: [
        {
          id: 'enemy_1',
          ad: 'Cüzzamlı İnfazcı',
          unvan: 'Çentikli Dev Kılıç',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 1 as const,
          fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 2,
          olcek: 3,
          stresKrizde: false,
          durumlar: ['Kefenli Maske', 'Ölümcül Vuruş'],
          tercihEdilenYaklasim: 'Ghardello' as YaklasimAdi
        },
        {
          id: 'enemy_2',
          ad: 'Mabed Haçlı Şövalyesi',
          unvan: 'Kutsal Yeminli Zırh',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 2 as const,
          fotoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 3,
          olcek: 4,
          stresKrizde: false,
          durumlar: ['Ağır Zırhlı'],
          tercihEdilenYaklasim: 'Lithron' as YaklasimAdi
        },
        {
          id: 'enemy_3',
          ad: 'Gölge Okültisti',
          unvan: 'Yasak Parşömen & Büyü',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 3 as const,
          fotoUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 0,
          olcek: 6,
          stresKrizde: false,
          durumlar: ['Leke Dokuyan'],
          tercihEdilenYaklasim: 'Loth' as YaklasimAdi
        },
        {
          id: 'enemy_4',
          ad: 'Galetsha Ağır Arbaletçisi',
          unvan: 'Çelik Gerdirmeli Yay',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 4 as const,
          fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 1,
          olcek: 3,
          stresKrizde: false,
          durumlar: ['Keskin Nişan'],
          tercihEdilenYaklasim: 'Rax-ed' as YaklasimAdi
        }
      ]
    },
    {
      id: 'hayvanlar',
      ad: '🐺 Vahşi Hayvan Sürüsü',
      uyeler: [
        {
          id: 'enemy_b1',
          ad: VAHSI_HAYVANLAR[0].ad,
          unvan: 'Alfa Ayaz Kurdu',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 1 as const,
          fotoUrl: VAHSI_HAYVANLAR[0].fotoUrl || 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 1,
          olcek: 3,
          stresKrizde: false,
          durumlar: ['Dondurucu Isırık', 'Sürü Lideri'],
          tercihEdilenYaklasim: 'Ghardello' as YaklasimAdi
        },
        {
          id: 'enemy_b2',
          ad: VAHSI_HAYVANLAR[2].ad,
          unvan: 'Kızıl Pençeli Dev Ayı',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 2 as const,
          fotoUrl: VAHSI_HAYVANLAR[2].fotoUrl || 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 3,
          olcek: 4,
          stresKrizde: false,
          durumlar: ['Ezici Pençe', 'Kalın Yağ Tabakası'],
          tercihEdilenYaklasim: 'Lithron' as YaklasimAdi
        },
        {
          id: 'enemy_b3',
          ad: VAHSI_HAYVANLAR[3].ad,
          unvan: 'Ağaç Pusu Avcısı',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 3 as const,
          fotoUrl: VAHSI_HAYVANLAR[3].fotoUrl || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 0,
          olcek: 3,
          stresKrizde: false,
          durumlar: ['Gölge Sıçrayışı'],
          tercihEdilenYaklasim: 'Zel-vash' as YaklasimAdi
        },
        {
          id: 'enemy_b4',
          ad: VAHSI_HAYVANLAR[4].ad,
          unvan: 'Çamur Tazısı',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 4 as const,
          fotoUrl: VAHSI_HAYVANLAR[4].fotoUrl || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 0,
          olcek: 2,
          stresKrizde: false,
          durumlar: ['Paçaya Kilitlenme'],
          tercihEdilenYaklasim: 'Vizer' as YaklasimAdi
        }
      ]
    },
    {
      id: 'canavarlar',
      ad: '👹 Kadim Canavarlar',
      uyeler: [
        {
          id: 'enemy_c1',
          ad: CANAVARLAR_VE_YARATIKLAR[1].ad,
          unvan: 'Buzdan Heyula',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 1 as const,
          fotoUrl: CANAVARLAR_VE_YARATIKLAR[1].fotoUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 3,
          olcek: 5,
          stresKrizde: false,
          durumlar: ['Buz Zırhı', 'Dondurucu Aura'],
          tercihEdilenYaklasim: 'Lithron' as YaklasimAdi
        },
        {
          id: 'enemy_c2',
          ad: CANAVARLAR_VE_YARATIKLAR[0].ad,
          unvan: 'Mor Kül Hortlağı',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 2 as const,
          fotoUrl: CANAVARLAR_VE_YARATIKLAR[0].fotoUrl || 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 2,
          olcek: 3,
          stresKrizde: false,
          durumlar: ['Leke Yayan', 'Ölümsüz Beden'],
          tercihEdilenYaklasim: 'Ghardello' as YaklasimAdi
        },
        {
          id: 'enemy_c3',
          ad: CANAVARLAR_VE_YARATIKLAR[3].ad,
          unvan: 'Kozmik Dehşet',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 3 as const,
          fotoUrl: CANAVARLAR_VE_YARATIKLAR[3].fotoUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 0,
          olcek: 4,
          stresKrizde: false,
          durumlar: ['Akıl Çürütme', 'Leke İfriti'],
          tercihEdilenYaklasim: 'Loth' as YaklasimAdi
        },
        {
          id: 'enemy_c4',
          ad: CANAVARLAR_VE_YARATIKLAR[4].ad,
          unvan: 'Kan Emici Nosferat',
          tur: 'Düşman' as const,
          side: 'sag' as const,
          rank: 4 as const,
          fotoUrl: CANAVARLAR_VE_YARATIKLAR[4].fotoUrl || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80',
          fizikselKutular: [false, false, false] as [boolean, boolean, boolean],
          zihinselKutular: [false, false, false] as [boolean, boolean, boolean],
          itibarKutu: false,
          zirh: 1,
          olcek: 3,
          stresKrizde: false,
          durumlar: ['Kan Emme', 'Hızlı Hamle'],
          tercihEdilenYaklasim: 'Xes-hart' as YaklasimAdi
        }
      ]
    }
  ];

  const handleDusmanTakimiSec = (takimId: string) => {
    sound.playWarDrums();
    confetti({ particleCount: 30, spread: 60 });
    const secilen = ARENA_DUSMAN_TAKIMLARI.find((t) => t.id === takimId);
    if (secilen) {
      setSagTakim(secilen.uyeler);
      setSeciliSagId(secilen.uyeler[0].id);
      setMuharebeGunlugu((prev) => [
        `⚔️ [DÜŞMAN DEĞİŞTİ] Arenaya "${secilen.ad}" girdi!`,
        ...prev.slice(0, 30)
      ]);
    }
  };

  // Sinematik Ekran Sarsıntısı ve Kan Vignette
  const [shakeActive, setShakeActive] = useState<boolean>(false);
  const [bloodVignetteActive, setBloodVignetteActive] = useState<boolean>(false);

  const tetikleSinematik = (isCritical: boolean = false) => {
    setShakeActive(true);
    if (isCritical) {
      setBloodVignetteActive(true);
    }
    setTimeout(() => {
      setShakeActive(false);
      setBloodVignetteActive(false);
    }, 450);
  };

  // Darbe Efekti & Vurgu Banners
  const [vurusBannere, setVurusBannere] = useState<{
    metin: string;
    tur: 'kritik' | 'stres' | 'basari' | 'gedik';
  } | null>(null);

  // Savaş Günlüğü
  const [muharebeGunlugu, setMuharebeGunlugu] = useState<string[]>([
    '⚔️ ARENA BAŞLADI: İki ordu 4\'erli safta karşı karşıya geldi!',
    '📜 "Aron hanar, Edron rion" - Sancak gölgesinde kan dökülecek.'
  ]);

  const aktifSol = solTakim.find((s) => s.id === seciliSolId) || solTakim[3];
  const aktifSag = sagTakim.find((s) => s.id === seciliSagId) || sagTakim[0];

  // Sabit Eşik Kontrolü
  const olcekFarki = (aktifSag.olcek || 3) - (aktifSol.olcek || 2);
  const gedikVarMi = aktifSag.durumlar.some((d) => d.toLowerCase().includes('gedik'));
  const sabitEsikEngelliyor = olcekFarki >= 3 && !gedikVarMi;

  // Saf Değiştirme (Rank Swap)
  const handleSafDegistir = (side: 'sol' | 'sag', id: string, yon: 'ileri' | 'geri') => {
    sound.playSealStamp();
    const liste = side === 'sol' ? [...solTakim] : [...sagTakim];
    const index = liste.findIndex((c) => c.id === id);
    if (index === -1) return;

    const hedefIndex = yon === 'ileri' ? index + 1 : index - 1;
    if (hedefIndex < 0 || hedefIndex >= liste.length) return;

    // Takas
    const temp = liste[index];
    liste[index] = liste[hedefIndex];
    liste[hedefIndex] = temp;

    // Rank numaralarını güncelle (sol için 4..1, sağ için 1..4)
    if (side === 'sol') {
      liste.forEach((c, i) => {
        c.rank = (4 - i) as any;
      });
      setSolTakim(liste);
    } else {
      liste.forEach((c, i) => {
        c.rank = (i + 1) as any;
      });
      setSagTakim(liste);
    }

    setMuharebeGunlugu((prev) => [
      `🔄 ${temp.ad} saf değiştirdi (${temp.rank}. Safa geçti).`,
      ...prev
    ]);
  };

  // Eylemi Gerçekleştir (Ghardello / Rax-ed / Xes-hart / Loth)
  const handleEylem = (eylemTuru: 'Ghardello' | 'Rax-ed' | 'Xes-hart' | 'Loth' | 'Zel-vash') => {
    sound.playBladeClash();

    // Yaklaşım Değeri Hesabı
    const yaklasimDegeri = aktifKarakter.yaklasimlar?.[eylemTuru === 'Zel-vash' ? 'Zel-vash' : eylemTuru] ?? 2;
    const zorluk = 2; // Makul (+2)
    const atis = fateAtisiHesapla(yaklasimDegeri, zorluk);

    let netHasar = Math.max(0, atis.sift);
    if (atis.sonucTuru === 'Görkemli Başarı') netHasar += 1;

    // Efekt ve Banner
    if (eylemTuru === 'Xes-hart') {
      // Zihinsel Stres Saldırısı!
      sound.playSealStamp();
      setVurusBannere({ metin: `AKIL TUTULMASI! (+${Math.max(1, netHasar)} Stres)`, tur: 'stres' });

      setSagTakim((prev) =>
        prev.map((e) => {
          if (e.id === aktifSag.id) {
            const yeniZihinsel = [...e.zihinselKutular] as [boolean, boolean, boolean];
            for (let i = 0; i < 3; i++) {
              if (!yeniZihinsel[i]) {
                yeniZihinsel[i] = true;
                break;
              }
            }
            const hepsiDolu = yeniZihinsel.every(Boolean);
            return { ...e, zihinselKutular: yeniZihinsel, stresKrizde: hepsiDolu };
          }
          return e;
        })
      );

      setMuharebeGunlugu((prev) => [
        `🧠 [XES-HART] ${aktifSol.ad}, ${aktifSag.ad} üzerine baskı kurdu! (${atis.derece}, ${atis.sift} Şift) ➔ Zihinsel Stres işaretlendi.`,
        ...prev
      ]);
    } else if (eylemTuru === 'Zel-vash') {
      // Çevik Geri Çekilme
      handleSafDegistir('sol', aktifSol.id, 'geri');
      setVurusBannere({ metin: 'ÇEVİK SIYRILMA (+2 Savunma)', tur: 'basari' });
    } else {
      // Fiziksel Saldırı (Ghardello / Rax-ed / Loth)
      if (netHasar > 0) {
        const isCrit = atis.sonucTuru === 'Görkemli Başarı';
        tetikleSinematik(isCrit);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        setVurusBannere({
          metin: isCrit ? 'KRİTİK DARBE! (Görkemli)' : 'VURUŞ BAŞARILI!',
          tur: isCrit ? 'kritik' : 'basari'
        });

        // Düşman Fiziksel Kutusunu İşaretle
        setSagTakim((prev) =>
          prev.map((e) => {
            if (e.id === aktifSag.id) {
              const yeniKutular = [...e.fizikselKutular] as [boolean, boolean, boolean];
              for (let i = 0; i < 3; i++) {
                if (!yeniKutular[i]) {
                  yeniKutular[i] = true;
                  break;
                }
              }
              return { ...e, fizikselKutular: yeniKutular };
            }
            return e;
          })
        );

        setMuharebeGunlugu((prev) => [
          `🗡️ [${eylemTuru.toUpperCase()}] ${aktifSol.ad} vurdu! (${atis.derece}, ${netHasar} Hasar) ➔ ${aktifSag.ad} yaralandı.`,
          ...prev
        ]);
      } else {
        setVurusBannere({ metin: 'ISKA / SAVUŞTURULDU', tur: 'basari' });
        setMuharebeGunlugu((prev) => [
          `🛡️ ${aktifSag.ad} darbeyi savuşturdu! (${atis.derece})`,
          ...prev
        ]);
      }
    }

    setTimeout(() => {
      setVurusBannere(null);
    }, 2400);
  };

  // Çevresel Tehlikeyi Tetikle
  const handleTehlikeTetikle = () => {
    sound.playBladeClash();
    tetikleSinematik(true);

    if (aktifTehlike === 'kukurt') {
      setSagTakim((prev) =>
        prev.map((e) => (e.id === aktifSag.id ? { ...e, durumlar: Array.from(new Set([...e.durumlar, 'Alevler İçinde'])) } : e))
      );
      setVurusBannere({ metin: 'KÜKÜRT PATLAMASI! (Alevler İçinde)', tur: 'kritik' });
      setMuharebeGunlugu((prev) => [
        `🔥 [KÜKÜRT ÇUKURU] Yer yarıldı ve sülfür alevleri ${aktifSag.ad} üzerine sıçradı! (Alevler İçinde)`,
        ...prev
      ]);
    } else if (aktifTehlike === 'mahzen') {
      setVurusBannere({ metin: 'TAVAN ÇÖKTÜ! (Moloz Hasarı)', tur: 'kritik' });
      setMuharebeGunlugu((prev) => [
        `💥 [ÇÖKEN MAHZEN] Tavan kirişleri kırıldı, tonlarca moloz savaş alanına yağdı!`,
        ...prev
      ]);
    } else if (aktifTehlike === 'mihrap') {
      setSolTakim((prev) =>
        prev.map((h) => ({ ...h, durumlar: Array.from(new Set([...h.durumlar, 'Kutsanmış'])) }))
      );
      setVurusBannere({ metin: 'MİHRAP IŞILTISI! (Kutsanmış)', tur: 'basari' });
      setMuharebeGunlugu((prev) => [
        `✨ [MABED MİHRABI] Mihraptan yükselen nur sol kanattaki tüm kahramanları Kutsanmış kıldı!`,
        ...prev
      ]);
    } else if (aktifTehlike === 'bataklik') {
      setSagTakim((prev) =>
        prev.map((e) => (e.id === aktifSag.id ? { ...e, durumlar: Array.from(new Set([...e.durumlar, 'Zehirlenmiş'])) } : e))
      );
      setVurusBannere({ metin: 'ZEHİRLİ SİS! (Zehirlenmiş)', tur: 'stres' });
      setMuharebeGunlugu((prev) => [
        `🧪 [KARASU SİSİ] Zehirli bataklık dumanı ${aktifSag.ad} ciğerlerini yaktı! (Zehirlenmiş)`,
        ...prev
      ]);
    } else if (aktifTehlike === 'leke_gecidi') {
      setVurusBannere({ metin: 'BOŞLUK YARIĞI! (Dehşet)', tur: 'stres' });
      setMuharebeGunlugu((prev) => [
        `🔮 [BOŞLUK YARIĞI] Mor leke dalgası savaş alanını titretti! Büyü izleri açığa çıktı.`,
        ...prev
      ]);
    }

    setTimeout(() => setVurusBannere(null), 2400);
  };

  // Taktiksel Kombo / Zincirleme Hamle
  const handleKomboHamle = (komboTuru: 'yarayiDes' | 'zirhYikimi' | 'bogazlama' | 'ilahiGazap') => {
    sound.playBladeClash();
    tetikleSinematik(true);
    confetti({ particleCount: 50, spread: 75, origin: { y: 0.5 } });

    if (komboTuru === 'yarayiDes') {
      setSagTakim((prev) =>
        prev.map((e) => {
          if (e.id === aktifSag.id) {
            const yeniKutular = [...e.fizikselKutular] as [boolean, boolean, boolean];
            yeniKutular[0] = true;
            yeniKutular[1] = true;
            return { ...e, fizikselKutular: yeniKutular };
          }
          return e;
        })
      );
      setVurusBannere({ metin: '🩸 YARAYI DEŞTİN! (+3 KAN HASARI)', tur: 'kritik' });
      setMuharebeGunlugu((prev) => [
        `🩸 [ZİNCİRLEME KOMBO] ${aktifSol.ad}, ${aktifSag.ad} üzerindeki açık yarayı deşti! (+3 Şift Hasar)`,
        ...prev
      ]);
    } else if (komboTuru === 'zirhYikimi') {
      setSagTakim((prev) =>
        prev.map((e) => (e.id === aktifSag.id ? { ...e, zirh: 0, durumlar: [...e.durumlar, 'Gedik Açıldı'] } : e))
      );
      setVurusBannere({ metin: '💥 ZIRH YIKILDI! (Zırh: 0)', tur: 'gedik' });
      setMuharebeGunlugu((prev) => [
        `💥 [ZİNCİRLEME KOMBO] ${aktifSol.ad}, sersemlemiş düşmanın zırhını ve kalkanını parçaladı!`,
        ...prev
      ]);
    } else if (komboTuru === 'bogazlama') {
      setSagTakim((prev) =>
        prev.map((e) => {
          if (e.id === aktifSag.id) {
            const yeniKutular = [true, true, true] as [boolean, boolean, boolean];
            return { ...e, fizikselKutular: yeniKutular };
          }
          return e;
        })
      );
      setVurusBannere({ metin: '🗡️ GÖLGE İNFAZI! (ÖLÜMCÜL)', tur: 'kritik' });
      setMuharebeGunlugu((prev) => [
        `🗡️ [ZİNCİRLEME KOMBO] ${aktifSol.ad}, körleşmiş ${aktifSag.ad} arkasına süzülüp infaz etti!`,
        ...prev
      ]);
    } else if (komboTuru === 'ilahiGazap') {
      setSagTakim((prev) =>
        prev.map((e) => (e.id === aktifSag.id ? { ...e, durumlar: [...e.durumlar, 'Alevler İçinde'] } : e))
      );
      setVurusBannere({ metin: '✨ İLAHİ GAZAP! (Mabed Işığı)', tur: 'kritik' });
      setMuharebeGunlugu((prev) => [
        `✨ [ZİNCİRLEME KOMBO] ${aktifSol.ad}, Era'nın kutsal nurunu boşaltarak düşmanı alevlere boğdu!`,
        ...prev
      ]);
    }

    setTimeout(() => setVurusBannere(null), 2400);
  };

  // Gedik Açma (Sabit Eşiği Kırma)
  const handleGedikAc = () => {
    sound.playSealStamp();
    confetti({ particleCount: 35, spread: 50 });
    setVurusBannere({ metin: 'GEDİK AÇILDI! (Sabit Eşik Kırıldı)', tur: 'gedik' });

    setSagTakim((prev) =>
      prev.map((e) => (e.id === aktifSag.id ? { ...e, durumlar: [...e.durumlar, 'Gedik Açıldı'] } : e))
    );

    setMuharebeGunlugu((prev) => [
      `⚡ [GEDİK AÇILDI] Ver-ed ile ${aktifSag.ad} mecliste küçük düşürüldü! Artık doğrudan saldırılabilir.`,
      ...prev
    ]);

    setTimeout(() => setVurusBannere(null), 2400);
  };

  // Lomera Barışı & 1v1 Dello Düellosu
  const handleLomeraBarisi = () => {
    sound.playSealStamp();
    confetti({ particleCount: 50, spread: 70 });
    const yeniMod = !delloModu;
    setDelloModu(yeniMod);

    const mesaj = yeniMod
      ? '🕊️ [LOMERA BARIŞI] Mabed rahibi kireçle Denge Çemberi çizdi! İki tarafın şampiyonları meşale ışığında tekil Dello düellosuna davet edildi.'
      : '⚔️ [GENEL MUHAREBE] Dello düellosu sona erdi, tüm saflar kılıç çekti.';

    setMuharebeGunlugu((prev) => [mesaj, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 font-sans text-[#f4ebdc]">
      {/* ÜST BAR & BAŞLIK */}
      <div className="parchment-sheet p-3 sm:p-4 rounded-xl border-2 border-[#54412e] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center text-amber-200 shadow-lg">
            <Swords className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-lg sm:text-xl text-[#f5ebd7] tracking-wider">
                4v4 SAF MUHAREBESİ &amp; DELLO ARENASI
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono font-bold border border-amber-800">
                Darkest Dungeon Düzeni
              </span>
            </div>
            <p className="text-xs text-[#a49684] italic font-serif">
              Saf 1-2 (Ön Hat / Kalkan) • Saf 3-4 (Arka Hat / Menzil &amp; Büyü) • Ortada Dello Işığı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Düşman Ekibi Seçici */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1b140e] border border-[#522b2b]">
            <span className="text-[10px] text-red-400 font-bold px-1">Düşman Ekibi:</span>
            <select
              onChange={(e) => handleDusmanTakimiSec(e.target.value)}
              className="bg-[#120d09] border border-[#442828] rounded px-2 py-1 text-[11px] text-[#f1e5d4]"
              defaultValue="engizisyon"
            >
              <option value="engizisyon">⚖️ Mabed Engizisyonu</option>
              <option value="hayvanlar">🐺 Vahşi Hayvan Sürüsü</option>
              <option value="canavarlar">👹 Kadim Canavarlar</option>
            </select>
          </div>

          {/* Çevresel Alan ve Tehlike */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1b140e] border border-[#443020]">
            <span className="text-[10px] text-amber-400 font-bold px-1">Tehlike:</span>
            <select
              value={aktifTehlike}
              onChange={(e) => setAktifTehlike(e.target.value as any)}
              className="bg-[#120d09] border border-[#3b2a1a] rounded px-2 py-1 text-[11px] text-[#f1e5d4]"
            >
              <option value="none">Sıradan Alan</option>
              <option value="kukurt">🔥 Kükürt Çukuru (Yangın)</option>
              <option value="mahzen">💥 Çöken Mahzen (Moloz)</option>
              <option value="mihrap">✨ Era Kutsal Mihrabı (Arınma)</option>
              <option value="bataklik">🧪 Karasu Sisi (Zehir)</option>
              <option value="leke_gecidi">🔮 Boşluk Yarığı (Dehşet)</option>
            </select>

            {aktifTehlike !== 'none' && (
              <button
                onClick={handleTehlikeTetikle}
                className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-heading font-black text-[10px] shadow"
                title="Çevresel Alan Tehlikesini Tetikle"
              >
                Tetikle ⚡
              </button>
            )}
          </div>

          <button
            onClick={handleLomeraBarisi}
            className={`px-3 py-1.5 rounded text-xs font-heading font-bold border flex items-center gap-1.5 shadow transition-all ${
              delloModu
                ? 'bg-purple-900 border-purple-400 text-purple-200 ring-2 ring-purple-300 animate-pulse'
                : 'bg-[#281d14] hover:bg-[#382a1d] text-purple-300 border-purple-900/60'
            }`}
            title="Lomera Barışı ile Denge Çemberi çizip 1v1 Dello Düellosuna geç"
          >
            <span>🕊️ Lomera Barışı {delloModu ? '(1v1 Aktif)' : ''}</span>
          </button>

          {onKapat && (
            <button
              onClick={onKapat}
              className="p-1.5 rounded bg-[#201812] hover:bg-[#30241b] text-stone-400 hover:text-white border border-[#443322]"
              title="Arenayı Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* KRİTİK / STRES VURUŞ BANNERI */}
      {vurusBannere && (
        <div className="flex justify-center -mb-2 z-50 relative animate-in zoom-in-95 duration-150">
          <div
            className={`px-5 py-2 rounded-xl border-2 shadow-2xl font-heading font-black text-sm tracking-widest uppercase flex items-center gap-2 ${
              vurusBannere.tur === 'kritik'
                ? 'bg-red-950/95 border-red-500 text-amber-200 ring-2 ring-red-400'
                : vurusBannere.tur === 'stres'
                ? 'bg-purple-950/95 border-purple-500 text-purple-200 ring-2 ring-purple-400'
                : vurusBannere.tur === 'gedik'
                ? 'bg-amber-950/95 border-amber-400 text-amber-200 ring-2 ring-amber-300'
                : 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{vurusBannere.metin}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      )}

      {/* 2D DARKEST DUNGEON ARENA SAHNESİ */}
      {bloodVignetteActive && <div className="blood-vignette" />}
      <div
        className={`relative rounded-2xl border-2 border-[#54412e] overflow-hidden bg-gradient-to-b from-[#090705] via-[#120e0b] to-[#18120d] shadow-2xl min-h-[460px] flex flex-col justify-between p-3 sm:p-5 transition-transform ${
          shakeActive ? 'screen-shake' : ''
        }`}
      >
        {/* Gotik Arka Plan Ögeleri (Kafatasları, Sivri Kazıklar ve Büyük Hanedan Sancağı) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#4d3624_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ortadaki Hanedan Sancağı */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-36 border-b-2 border-amber-700/60 bg-gradient-to-b from-stone-900/90 to-transparent flex flex-col items-center justify-start pt-2 pointer-events-none z-0">
          <Crown className="w-8 h-8 text-amber-600/70 mb-1" />
          <span className="font-heading font-black text-[10px] tracking-widest text-amber-500/60 uppercase">
            STALLHART MEYDANI
          </span>
          <span className="text-[8px] text-[#715c46] italic font-serif">
            &quot;Aron hanar, Edron rion&quot;
          </span>
        </div>

        {/* Ortadaki Dello Spot Işığı / Kum Çemberi */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-28 rounded-full bg-gradient-to-t from-amber-600/25 via-amber-700/10 to-transparent blur-xl pointer-events-none" />
        {delloModu && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-16 rounded-full border-2 border-dashed border-white/60 pointer-events-none animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-widest">
              DENGE ÇEMBERİ (1v1)
            </span>
          </div>
        )}

        {/* DÖVÜŞÇÜLER HATTINI BULUŞTURAN ALAN:
            SOL: 4 KAHRAMAN (Saf 4, 3, 2, 1) | ORTA: AÇIK DÜELLO BOŞLUĞU & MEŞALE | SAĞ: 4 DÜŞMAN (Saf 1, 2, 3, 4) */}
        <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-4 items-end my-auto pt-4">
          {/* SOL KANAT (5 cols): 4 Kahraman */}
          <div className="col-span-12 lg:col-span-5 p-2 rounded-xl bg-gradient-to-r from-blue-950/20 via-amber-950/15 to-transparent border border-blue-900/40">
            <div className="text-[10px] font-heading font-black text-cyan-300 uppercase tracking-widest mb-2 flex items-center justify-between border-b border-cyan-900/60 pb-1">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>SOL KANAT · KAHRAMANLAR</span>
              </span>
              <span className="text-[9px] text-cyan-400/80 font-mono font-bold">
                Saf 4 ➔ Saf 1 (Ön)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 sm:gap-2 items-end">
              {solTakim.map((c) => {
                const isSelected = c.id === seciliSolId;
                const isHiddenInDello = delloModu && c.rank !== 1;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSeciliSolId(c.id)}
                    className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 group ${
                      isHiddenInDello ? 'opacity-25 grayscale scale-90' : isSelected ? 'scale-105' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {/* Karakter Silüeti / Portresi (Darkest Dungeon Stili) */}
                    <div
                      className={`w-14 sm:w-20 md:w-24 h-36 sm:h-48 md:h-56 rounded-xl overflow-hidden border-2 relative shadow-2xl transition-all ${
                        isSelected
                          ? 'border-amber-400 ring-4 ring-amber-400/50 shadow-amber-900/50'
                          : 'border-[#443322] group-hover:border-amber-600/80 bg-[#16110d]'
                      }`}
                    >
                      <img
                        src={c.fotoUrl}
                        alt={c.ad}
                        className="w-full h-full object-cover object-top filter brightness-90 contrast-125"
                      />

                      {/* Alt Gölgelendirme */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                      {/* Saf Rozeti */}
                      <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-cyan-900/90 text-cyan-200 border border-cyan-500 font-mono font-black text-[10px] flex items-center justify-center shadow">
                        S{c.rank}
                      </span>

                      {/* Karakter Adı */}
                      <div className="absolute bottom-1 inset-x-1 text-center">
                        <span className="font-heading font-black text-[9px] sm:text-[11px] text-[#f4eadc] block truncate drop-shadow">
                          {c.ad}
                        </span>
                        <span className="text-[7px] sm:text-[8px] text-[#a99c89] block truncate">
                          {c.unvan}
                        </span>
                      </div>
                    </div>

                    {/* Darkest Dungeon Pozisyon Noktaları (● ○ ○ ○) */}
                    <div className="flex items-center gap-1 my-1">
                      {[4, 3, 2, 1].map((r) => (
                        <span
                          key={r}
                          className={`w-2 h-2 rounded-full border ${
                            c.rank === r
                              ? 'bg-amber-400 border-amber-300 ring-1 ring-amber-300'
                              : 'bg-stone-900 border-stone-700'
                          }`}
                          title={`Saf ${r}`}
                        />
                      ))}
                    </div>

                    {/* Saf Değiştirme Butonları (◀ / ▶) */}
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSafDegistir('sol', c.id, 'geri');
                        }}
                        className="w-4 h-4 rounded bg-[#201812] hover:bg-[#382a1e] text-[8px] text-stone-300 flex items-center justify-center border border-[#443322]"
                        title="Geri Safa Geç"
                      >
                        ◀
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSafDegistir('sol', c.id, 'ileri');
                        }}
                        className="w-4 h-4 rounded bg-[#201812] hover:bg-[#382a1e] text-[8px] text-stone-300 flex items-center justify-center border border-[#443322]"
                        title="İleri Safa Geç"
                      >
                        ▶
                      </button>
                    </div>

                    {/* 3 Yara Hattı Göstergesi */}
                    <div className="w-full max-w-[80px] space-y-0.5 mt-1 text-[8px]">
                      <div className="flex items-center justify-center gap-0.5" title="Fiziksel Yara Tamponları">
                        {c.fizikselKutular.map((isHit, i) => (
                          <span
                            key={i}
                            className={`w-3 h-2 rounded-xs border ${
                              isHit ? 'bg-red-800 border-red-500' : 'bg-red-950/40 border-red-900/60'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-0.5" title="Zihinsel Stres Tamponları">
                        {c.zihinselKutular.map((isHit, i) => (
                          <span
                            key={i}
                            className={`w-3 h-2 rounded-xs border ${
                              isHit ? 'bg-purple-800 border-purple-500' : 'bg-purple-950/40 border-purple-900/60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORTADAKİ BELİRGİN BOŞLUK & DÜELLO ÇATIŞMA ALANI (2 cols) */}
          <div className="col-span-12 lg:col-span-2 flex flex-col items-center justify-center my-auto py-3 text-center z-20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-500 via-red-800 to-stone-950 border-2 border-amber-400/90 flex items-center justify-center shadow-2xl ring-4 ring-amber-500/20 mb-1.5 animate-pulse">
              <Swords className="w-5 h-5 text-amber-200" />
            </div>

            <span className="font-heading font-black text-xs text-amber-300 tracking-widest uppercase block drop-shadow">
              VS
            </span>

            <div className="my-1 px-2.5 py-0.5 rounded-full bg-black/60 border border-[#523e2c] text-[9px] font-mono text-[#beae9b]">
              {delloModu ? '🕊️ Denge Çemberi' : '⚡ Çarpışma Hattı'}
            </div>

            <span className="text-[8px] text-[#7d6e5d] italic font-serif hidden sm:block">
              &quot;İki Ordu Karşı Karşıya&quot;
            </span>
          </div>

          {/* SAĞ KANAT (5 cols): 4 Düşman */}
          <div className="col-span-12 lg:col-span-5 p-2 rounded-xl bg-gradient-to-l from-red-950/30 via-stone-950/20 to-transparent border border-red-900/50">
            <div className="text-[10px] font-heading font-black text-red-400 uppercase tracking-widest mb-2 flex items-center justify-between border-b border-red-900/60 pb-1">
              <span className="text-[9px] text-red-400/80 font-mono font-bold">
                Saf 1 (Ön) ➔ Saf 4
              </span>
              <span className="flex items-center gap-1.5">
                <span>RAKİP KUVVETLER · DÜŞMANLAR</span>
                <Skull className="w-3.5 h-3.5 text-red-500" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 sm:gap-2 items-end">
              {sagTakim.map((e) => {
                const isSelected = e.id === seciliSagId;
                const isHiddenInDello = delloModu && e.rank !== 1;

                return (
                  <div
                    key={e.id}
                    onClick={() => setSeciliSagId(e.id)}
                    className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 group ${
                      isHiddenInDello ? 'opacity-25 grayscale scale-90' : isSelected ? 'scale-105' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {/* Karakter Silüeti / Portresi (Darkest Dungeon Stili) */}
                    <div
                      className={`w-14 sm:w-20 md:w-24 h-36 sm:h-48 md:h-56 rounded-xl overflow-hidden border-2 relative shadow-2xl transition-all ${
                        isSelected
                          ? 'border-red-500 ring-4 ring-red-500/50 shadow-red-900/50'
                          : 'border-[#443322] group-hover:border-red-600/80 bg-[#16110d]'
                      }`}
                    >
                      <img
                        src={e.fotoUrl}
                        alt={e.ad}
                        className="w-full h-full object-cover object-top filter brightness-85 contrast-125"
                      />

                      {/* Alt Gölgelendirme */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                      {/* Saf Rozeti */}
                      <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-900/90 text-red-200 border border-red-500 font-mono font-black text-[10px] flex items-center justify-center shadow">
                        S{e.rank}
                      </span>

                      {/* Karakter Adı */}
                      <div className="absolute bottom-1 inset-x-1 text-center">
                        <span className="font-heading font-black text-[9px] sm:text-[11px] text-[#f7e0e0] block truncate drop-shadow">
                          {e.ad}
                        </span>
                        <span className="text-[7px] sm:text-[8px] text-[#b89595] block truncate">
                          {e.unvan}
                        </span>
                      </div>
                    </div>

                    {/* Darkest Dungeon Pozisyon Noktaları (● ○ ○ ○) */}
                    <div className="flex items-center gap-1 my-1">
                      {[1, 2, 3, 4].map((r) => (
                        <span
                          key={r}
                          className={`w-2 h-2 rounded-full border ${
                            e.rank === r
                              ? 'bg-red-500 border-red-400 ring-1 ring-red-300'
                              : 'bg-stone-900 border-stone-700'
                          }`}
                          title={`Saf ${r}`}
                        />
                      ))}
                    </div>

                    {/* Saf Değiştirme Butonları (◀ / ▶) */}
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(eProp) => {
                          eProp.stopPropagation();
                          handleSafDegistir('sag', e.id, 'ileri');
                        }}
                        className="w-4 h-4 rounded bg-[#201812] hover:bg-[#382a1e] text-[8px] text-stone-300 flex items-center justify-center border border-[#443322]"
                        title="İleri Safa Geç"
                      >
                        ◀
                      </button>
                      <button
                        onClick={(eProp) => {
                          eProp.stopPropagation();
                          handleSafDegistir('sag', e.id, 'geri');
                        }}
                        className="w-4 h-4 rounded bg-[#201812] hover:bg-[#382a1e] text-[8px] text-stone-300 flex items-center justify-center border border-[#443322]"
                        title="Geri Safa Geç"
                      >
                        ▶
                      </button>
                    </div>

                    {/* 3 Yara Hattı Göstergesi */}
                    <div className="w-full max-w-[80px] space-y-0.5 mt-1 text-[8px]">
                      <div className="flex items-center justify-center gap-0.5" title="Fiziksel Yara Tamponları">
                        {e.fizikselKutular.map((isHit, i) => (
                          <span
                            key={i}
                            className={`w-3 h-2 rounded-xs border ${
                              isHit ? 'bg-red-800 border-red-500' : 'bg-red-950/40 border-red-900/60'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-0.5" title="Zihinsel Stres Tamponları">
                        {e.zihinselKutular.map((isHit, i) => (
                          <span
                            key={i}
                            className={`w-3 h-2 rounded-xs border ${
                              isHit ? 'bg-purple-800 border-purple-500' : 'bg-purple-950/40 border-purple-900/60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ALT KUMANDA: POZİSYONA BAĞLI EYLEMLER & SABİT EŞİK ASİSTANI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SOL: EYLEM SEÇİCİ & POZİSYON KURALLARI (8 cols) */}
        <div className="lg:col-span-8 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#493726] pb-2">
            <div>
              <span className="font-heading font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-amber-400" />
                <span>
                  {aktifSol.ad} (Saf {aktifSol.rank}) ➔ {aktifSag.ad} (Saf {aktifSag.rank})
                </span>
              </span>
              <span className="text-[10px] text-[#93826e] font-mono">
                Darkest Dungeon Pozisyon Şartları Geçerlidir
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                Hedef Zırhı: {aktifSag.zirh} · Ölçek: {aktifSag.olcek}
              </span>
            </div>
          </div>

          {/* SABİT EŞİK ASİSTANI */}
          {sabitEsikEngelliyor && (
            <div className="p-3 rounded-xl bg-red-950/80 border-2 border-red-600 text-red-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-heading font-black">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>SABİT EŞİK: STATÜ UÇURUMU! (Ölçek Farkı: {olcekFarki})</span>
              </div>
              <p className="text-[11px] font-serif leading-relaxed text-[#ded1be]">
                {aktifSag.ad} bir asilzade/lider ({aktifSag.olcek}. Basamak) olduğu için doğrudan kaba saldırı yapılamaz. Önce Ver-ed veya Lodvez ile sahneye bir Gedik açmalısın!
              </p>
              <button
                onClick={handleGedikAc}
                className="w-full py-2 px-3 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-heading font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>⚡ Gedik Aç (Ver-ed / Lodvez ile Avantaj Yarat)</span>
              </button>
            </div>
          )}

          {/* DARKEST DUNGEON EYLEM BUTONLARI (POZİSYONA GÖRE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* 1. Ghardello: Biçici Darbe (Saf 1-2 gerektirir) */}
            <button
              onClick={() => handleEylem('Ghardello')}
              disabled={aktifSol.rank > 2 || sabitEsikEngelliyor}
              className="p-2.5 rounded-lg bg-[#19120e] hover:bg-[#2a1d15] disabled:opacity-40 border border-red-900/80 text-left transition-all flex items-start gap-2 shadow"
            >
              <span className="text-lg">🗡️</span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-red-300">Ghardello (Yakın Darbe)</span>
                  <span className="text-[9px] font-mono text-red-400 font-bold">[Saf 1, 2]</span>
                </div>
                <span className="text-[10px] text-[#9a8976] block">
                  Kılıç, balta veya kargı ile temas saldırısı (4dF + Ghardello).
                </span>
              </div>
            </button>

            {/* 2. Rax-ed: Keskin Nişancı Oku (Saf 3-4 gerektirir) */}
            <button
              onClick={() => handleEylem('Rax-ed')}
              disabled={aktifSol.rank < 3 || sabitEsikEngelliyor}
              className="p-2.5 rounded-lg bg-[#19120e] hover:bg-[#2a1d15] disabled:opacity-40 border border-amber-900/80 text-left transition-all flex items-start gap-2 shadow"
            >
              <span className="text-lg">🏹</span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-amber-300">Rax-ed (Menzilli Ok)</span>
                  <span className="text-[9px] font-mono text-amber-400 font-bold">[Saf 3, 4]</span>
                </div>
                <span className="text-[10px] text-[#9a8976] block">
                  Ön safları aşarak düşmanın arka saflarını vurur (4dF + Rax-ed).
                </span>
              </div>
            </button>

            {/* 3. Xes-hart: Korku & Zihinsel Stres (Her saftan atılabilir) */}
            <button
              onClick={() => handleEylem('Xes-hart')}
              className="p-2.5 rounded-lg bg-[#19120e] hover:bg-[#2a1d15] border border-purple-900/80 text-left transition-all flex items-start gap-2 shadow"
            >
              <span className="text-lg">🧠</span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-purple-300">Xes-hart (Zihinsel Baskı / Stres)</span>
                  <span className="text-[9px] font-mono text-purple-400 font-bold">[Her Saf]</span>
                </div>
                <span className="text-[10px] text-[#9a8976] block">
                  Zırhı deler! Doğrudan hedefin Zihinsel Yara Hattı&apos;na stres vurur.
                </span>
              </div>
            </button>

            {/* 4. Zel-vash: Çevik Adım & Geri Çekilme */}
            <button
              onClick={() => handleEylem('Zel-vash')}
              className="p-2.5 rounded-lg bg-[#19120e] hover:bg-[#2a1d15] border border-cyan-900/80 text-left transition-all flex items-start gap-2 shadow"
            >
              <span className="text-lg">💨</span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-cyan-300">Zel-vash (Geri Çekil &amp; Siper)</span>
                  <span className="text-[9px] font-mono text-cyan-400 font-bold">[Saf Değiştirir]</span>
                </div>
                <span className="text-[10px] text-[#9a8976] block">
                  Karakteri bir saf arkaya çeker ve tur boyunca +2 Savunma kazandırır.
                </span>
              </div>
            </button>

            {/* 5. TAKTİKSEL ZİNCİRLEME KOMBO HAMLELERİ (SYNERGY CHAINS) */}
            <div className="col-span-full pt-2 border-t border-[#3a2a1c] space-y-1.5">
              <span className="text-[10px] font-heading font-black text-amber-400 uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Taktiksel Kombo &amp; Zincirleme Hamleler:</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {/* 1. Yarayı Deş */}
                <button
                  onClick={() => handleKomboHamle('yarayiDes')}
                  disabled={!aktifSag.durumlar.some((d) => d.toLowerCase().includes('kanam'))}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-left disabled:opacity-30 transition-all flex flex-col"
                  title="Hedef Kanamalı ise yarayı deşer ve +3 Şift hasar vurur"
                >
                  <span className="font-heading font-bold text-[10px]">🩸 Yarayı Deş</span>
                  <span className="text-[8px] text-rose-400">Kanamalı Hedefe +3 Hasar</span>
                </button>

                {/* 2. Zırh Yıkımı */}
                <button
                  onClick={() => handleKomboHamle('zirhYikimi')}
                  disabled={!aktifSag.durumlar.some((d) => d.toLowerCase().includes('sersem'))}
                  className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-700/80 text-amber-200 text-left disabled:opacity-30 transition-all flex flex-col"
                  title="Hedef Sersemlemiş ise zırhını 0'a indirir ve Gedik açar"
                >
                  <span className="font-heading font-bold text-[10px]">💥 Zırh Yıkımı</span>
                  <span className="text-[8px] text-amber-400">Sersem Hedefin Zırhını Kır</span>
                </button>

                {/* 3. Boğazlama */}
                <button
                  onClick={() => handleKomboHamle('bogazlama')}
                  disabled={!aktifSag.durumlar.some((d) => d.toLowerCase().includes('kör'))}
                  className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-left disabled:opacity-30 transition-all flex flex-col"
                  title="Hedef Körleşmiş ise arkadan süzülerek Görkemli İnfaz darbesi vurur"
                >
                  <span className="font-heading font-bold text-[10px]">🗡️ Gölge İnfazı</span>
                  <span className="text-[8px] text-emerald-400">Kör Hedefe Ölümcül Vuruş</span>
                </button>

                {/* 4. İlahi Gazap */}
                <button
                  onClick={() => handleKomboHamle('ilahiGazap')}
                  disabled={!aktifSol.durumlar.some((d) => d.toLowerCase().includes('kutsan'))}
                  className="p-1.5 rounded-lg bg-yellow-950/60 hover:bg-yellow-900 border border-yellow-600/80 text-yellow-200 text-left disabled:opacity-30 transition-all flex flex-col"
                  title="Karakter Kutsanmış ise Era'nın gazap alevlerini düşmana boşaltır"
                >
                  <span className="font-heading font-bold text-[10px]">✨ İlahi Gazap</span>
                  <span className="text-[8px] text-yellow-400">Kutsanmış Işığı Yak</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: MUHAREBE GÜNLÜĞÜ (4 cols) */}
        <div className="lg:col-span-4 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-2">
          <h3 className="font-heading font-black text-xs text-amber-300 uppercase tracking-wide border-b border-[#493726] pb-1.5 flex items-center justify-between">
            <span>Muharebe Kayıtları</span>
            <span className="text-[9px] font-mono text-[#8e7e6d]">Canlı 4dF Motoru</span>
          </h3>

          <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1 font-serif">
            {muharebeGunlugu.map((log, i) => (
              <p key={i} className="p-1 rounded bg-[#16110d] border border-[#312317] text-[#ded1be] text-[11px] leading-snug">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
