import React, { useState } from 'react';
import { NPC, Karakter, Hane, HANELER, YaklasimAdi } from '../rules';
import { EyaletInfo, EYALETLER, INITIAL_NPCS, INITIAL_CHARACTERS } from '../data/initialData';
import { sound } from '../utils/audio';
import {
  Shield,
  Users,
  MapPin,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  Download,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Eye,
  Crown,
  Heart,
  Skull,
  Swords,
  Layers,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPanelScreenProps {
  npcler: NPC[];
  onNpcGuncelle: (yeniListe: NPC[]) => void;
  eyaletler: EyaletInfo[];
  onEyaletGuncelle: (yeniListe: EyaletInfo[]) => void;
  karakterler: Karakter[];
  onKarakterlerGuncelle: (yeniListe: Karakter[]) => void;
  onAnlatıYayinla: (metin: string) => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  npcler,
  onNpcGuncelle,
  eyaletler,
  onEyaletGuncelle,
  karakterler,
  onKarakterlerGuncelle,
  onAnlatıYayinla,
}) => {
  // Aktif Admin Sekmesi: 'mekanlar' | 'npcler' | 'karakterler' | 'sistem'
  const [aktifAdminTab, setAktifAdminTab] = useState<'mekanlar' | 'npcler' | 'karakterler' | 'sistem'>('mekanlar');

  // Bildirim Mesajı
  const [bildirim, setBildirim] = useState<string | null>(null);
  const notify = (msg: string) => {
    setBildirim(msg);
    setTimeout(() => setBildirim(null), 3500);
  };

  // =========================================================
  // 1. MEKANLAR & BÖLGELER (LOCATIONS) STATE & HANDLERS
  // =========================================================
  const [seciliEyaletId, setSeciliEyaletId] = useState<string>(eyaletler[0]?.id || '');
  const [duzenlenenEyalet, setDuzenlenenEyalet] = useState<EyaletInfo | null>(null);
  const [yeniMekanModal, setYeniMekanModal] = useState<boolean>(false);

  // Mekan Düzenleme Başlat
  const handleMekanDuzenleBasla = (e: EyaletInfo) => {
    sound.playSealStamp();
    setDuzenlenenEyalet({ ...e });
  };

  // Mekan Kaydet
  const handleMekanKaydet = () => {
    if (!duzenlenenEyalet) return;
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 50 });

    const guncel = eyaletler.map((item) =>
      item.id === duzenlenenEyalet.id ? duzenlenenEyalet : item
    );
    onEyaletGuncelle(guncel);
    setDuzenlenenEyalet(null);
    notify(`✅ "${duzenlenenEyalet.ad}" mekanı başarıyla güncellendi!`);
  };

  // Mekan 16:9 Fotoğraf Dosyası Yükleme
  const handleMekanDosyaYukle = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (duzenlenenEyalet) {
        setDuzenlenenEyalet({
          ...duzenlenenEyalet,
          tarihce: duzenlenenEyalet.tarihce, // ensure text remains
          // Custom wallpaper URL stored on eyalet object
          ...( { wallpaperUrl: base64 } as any ),
        });
        sound.playSealStamp();
        notify('🖼️ 16:9 Mekan duvar kağıdı yüklendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Yeni Mekan Oluştur
  const handleYeniMekanOlustur = (yeni: Partial<EyaletInfo> & { wallpaperUrl?: string }) => {
    sound.playSealStamp();
    confetti({ particleCount: 40, spread: 60 });
    const yeniId = `mekan_${Date.now()}`;
    const tamMekan: EyaletInfo = {
      id: yeniId,
      ad: yeni.ad || 'Yeni Keşfedilen Diyar',
      hane: yeni.hane || 'Stallhart',
      vali: yeni.vali || 'Bölge Kâhyası',
      nufus: yeni.nufus || '50.000',
      gecim: yeni.gecim || 'Madencilik, Tarım',
      tarihce: yeni.tarihce || 'Sarp kayalıkların ardında unutulmuş kadim bir yerleşke.',
      tehlikeSeviyesi: (yeni.tehlikeSeviyesi as any) || 'Orta',
      kesfedildi: true,
      x: 50,
      y: 50,
      pinler: [],
      isPanosu: {
        guvenli: { baslik: 'Bölge Devriyesi', odul: '15 Aron', detay: 'Halkı koruyun.' },
        riskli: { baslik: 'Harabeleri Araştır', odul: '35 Aron', detay: 'Kayıp eseri bulun.' },
        tuzak: { baslik: 'Terk Edilmiş Mahzen', odul: '60 Aron', detay: 'Pusuya dikkat edin!' },
      },
      ...((yeni as any).wallpaperUrl ? { wallpaperUrl: (yeni as any).wallpaperUrl } : {}),
    } as any;

    const guncel = [...eyaletler, tamMekan];
    onEyaletGuncelle(guncel);
    setYeniMekanModal(false);
    notify(`🎉 Yeni mekan "${tamMekan.ad}" haritaya ve sisteme eklendi!`);
  };

  // Mekan Sil
  const handleMekanSil = (id: string) => {
    if (confirm('Bu mekanı silmek istediğinize emin misiniz?')) {
      sound.playBladeClash();
      const guncel = eyaletler.filter((e) => e.id !== id);
      onEyaletGuncelle(guncel);
      notify('🗑️ Mekan sistemden silindi.');
    }
  };

  // =========================================================
  // 2. NPCLER & DÜŞMANLAR (NPCS & ENEMIES) STATE & HANDLERS
  // =========================================================
  const [aramaNpc, setAramaNpc] = useState('');
  const [filtreHane, setFiltreHane] = useState<string>('Hepsi');
  const [seciliNpcId, setSeciliNpcId] = useState<string>(npcler[0]?.id || '');
  const [duzenlenenNpc, setDuzenlenenNpc] = useState<NPC | null>(null);
  const [yeniNpcModal, setYeniNpcModal] = useState<boolean>(false);

  const filtrelenmisNpcListesi = npcler.filter((n) => {
    const adMatches = n.ad.toLowerCase().includes(aramaNpc.toLowerCase());
    const haneMatches = filtreHane === 'Hepsi' || n.hane === filtreHane;
    return adMatches && haneMatches;
  });

  // NPC Düzenleme Başlat
  const handleNpcDuzenleBasla = (n: NPC) => {
    sound.playSealStamp();
    setDuzenlenenNpc({ ...n });
  };

  // NPC Kaydet
  const handleNpcKaydet = () => {
    if (!duzenlenenNpc) return;
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 50 });

    const guncel = npcler.map((n) => (n.id === duzenlenenNpc.id ? duzenlenenNpc : n));
    onNpcGuncelle(guncel);
    setDuzenlenenNpc(null);
    notify(`✅ "${duzenlenenNpc.ad}" NPC verileri güncellendi!`);
  };

  // NPC Fotoğraf Dosyası Yükleme
  const handleNpcDosyaYukle = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (duzenlenenNpc) {
        setDuzenlenenNpc({ ...duzenlenenNpc, fotoUrl: base64 });
        sound.playSealStamp();
        notify('👤 NPC portre fotoğrafı güncellendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Yeni NPC Oluştur
  const handleYeniNpcOlustur = (yeni: Partial<NPC>) => {
    sound.playSealStamp();
    confetti({ particleCount: 40, spread: 60 });
    const yeniId = `npc_${Date.now()}`;
    const tamNpc: NPC = {
      id: yeniId,
      ad: yeni.ad || 'Yeni Karakter',
      tur: yeni.tur || 'Önemli Rakip',
      hane: yeni.hane || 'Stallhart',
      eyalet: yeni.eyalet || 'Başsancak Arava',
      rol: yeni.rol || 'Muhafız Komutanı',
      tehdit: yeni.tehdit || 'Orta',
      tutum: yeni.tutum ?? 0,
      olcek: yeni.olcek ?? 3,
      anaKavram: yeni.anaKavram || 'Karanlık Sokakların Gözcüsü',
      dert: yeni.dert || 'Saray Borcu Peşini Bırakmıyor',
      sir: yeni.sir || 'Geceleri gizli fermanlar taşır.',
      ipuclari: yeni.ipuclari || ['Belinde eski bir kılıç taşır.'],
      anlaticiNotlari: yeni.anlaticiNotlari || 'Yakın dövüşte etkilidir.',
      fotoUrl:
        yeni.fotoUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      yaklasimlar: yeni.yaklasimlar || { Ghardello: 3, Lithron: 2, 'Edor / Edros': 2 },
      stats: yeni.stats || { fight: 3, savunma: 2, yaraKutulari: 3, mevcutYara: 0 },
    };

    const guncel = [...npcler, tamNpc];
    onNpcGuncelle(guncel);
    setYeniNpcModal(false);
    notify(`🎉 Yeni NPC "${tamNpc.ad}" sisteme eklendi!`);
  };

  // NPC Sil
  const handleNpcSil = (id: string) => {
    if (confirm('Bu NPC\'yi silmek istediğinize emin misiniz?')) {
      sound.playBladeClash();
      const guncel = npcler.filter((n) => n.id !== id);
      onNpcGuncelle(guncel);
      notify('🗑️ NPC sistemden silindi.');
    }
  };

  // =========================================================
  // 3. SİSTEM & YEDEKLEME (SYSTEM & BACKUP) HANDLERS
  // =========================================================
  const [fermanMetni, setFermanMetni] = useState('');

  // Tüm Verileri JSON Olarak İndir
  const handleTumVerileriIndir = () => {
    sound.playSealStamp();
    const yedek = {
      tarih: new Date().toISOString(),
      versiyon: '1.0.0',
      npcler,
      eyaletler,
      karakterler,
    };
    const blob = new Blob([JSON.stringify(yedek, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stallhart_tam_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('💾 Tüm sistem verileri JSON olarak bilgisayarınıza indirildi!');
  };

  // JSON Yedek Yükle
  const handleYedekDosyaYukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed.npcler && Array.isArray(parsed.npcler)) onNpcGuncelle(parsed.npcler);
          if (parsed.eyaletler && Array.isArray(parsed.eyaletler)) onEyaletGuncelle(parsed.eyaletler);
          if (parsed.karakterler && Array.isArray(parsed.karakterler)) onKarakterlerGuncelle(parsed.karakterler);
          sound.playSealStamp();
          confetti({ particleCount: 50, spread: 70 });
          notify('🎉 Yedek dosyası başarıyla yüklendi ve tüm veriler güncellendi!');
        } catch {
          alert('Geçersiz JSON yedek dosyası!');
        }
      };
      reader.readAsText(file);
    }
  };

  // Fabrika Ayarlarına Sıfırla
  const handleFabrikaAyarlarinaSifirla = () => {
    if (confirm('TÜM NPC ve Mekan verileri orijinal canon haline dönecek. Onaylıyor musunuz?')) {
      sound.playBladeClash();
      onNpcGuncelle(INITIAL_NPCS);
      onEyaletGuncelle(EYALETLER);
      onKarakterlerGuncelle(INITIAL_CHARACTERS);
      localStorage.removeItem('stallhart_npcler');
      localStorage.removeItem('stallhart_custom_wallpapers');
      localStorage.removeItem('stallhart_karakterler');
      notify('🔄 Sistem orijinal Stallhart fabrika ayarlarına sıfırlandı.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 font-sans text-[#f4ebdc]">
      {/* ÜST BAŞLIK & BİLDİRİM BARI */}
      <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 border border-amber-400 flex items-center justify-center text-amber-200 shadow-lg">
            <Crown className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-lg sm:text-xl text-[#f5ebd7] tracking-wider">
                ADMİN &amp; GM YÖNETİM MERKEZİ
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono font-bold border border-amber-800">
                Canlı Veri &amp; Görsel Yönetimi
              </span>
            </div>
            <p className="text-xs text-[#a49684] italic font-serif">
              Tüm sayfaların NPC&apos;lerini, mekanlarını, 16:9 duvar kağıtlarını ve fotoğraflarını anında düzenleyin.
            </p>
          </div>
        </div>

        {/* Sekme Butonları */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              sound.playSealStamp();
              setAktifAdminTab('mekanlar');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all flex items-center gap-1.5 shadow ${
              aktifAdminTab === 'mekanlar'
                ? 'bg-amber-950 border-amber-500 text-amber-200 ring-1 ring-amber-400'
                : 'bg-[#1b1510] border-[#3e2e20] text-[#93826e] hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Mekanlar &amp; 16:9 Görseller</span>
          </button>

          <button
            onClick={() => {
              sound.playSealStamp();
              setAktifAdminTab('npcler');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all flex items-center gap-1.5 shadow ${
              aktifAdminTab === 'npcler'
                ? 'bg-amber-950 border-amber-500 text-amber-200 ring-1 ring-amber-400'
                : 'bg-[#1b1510] border-[#3e2e20] text-[#93826e] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>NPC&apos;ler &amp; Portreler</span>
          </button>

          <button
            onClick={() => {
              sound.playSealStamp();
              setAktifAdminTab('sistem');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all flex items-center gap-1.5 shadow ${
              aktifAdminTab === 'sistem'
                ? 'bg-amber-950 border-amber-500 text-amber-200 ring-1 ring-amber-400'
                : 'bg-[#1b1510] border-[#3e2e20] text-[#93826e] hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Sistem &amp; Yedekleme</span>
          </button>
        </div>
      </div>

      {/* CANLI BİLDİRİM TOAST */}
      {bildirim && (
        <div className="p-2.5 rounded-xl bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 text-xs font-heading font-bold flex items-center justify-between shadow-2xl animate-in fade-in">
          <span>{bildirim}</span>
          <button onClick={() => setBildirim(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          1. TAB: MEKANLAR & 16:9 DUVAR KAĞITLARI YÖNETİMİ
          ======================================================== */}
      {aktifAdminTab === 'mekanlar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* SOL: MEKAN LİSTESİ (5 cols) */}
          <div className="lg:col-span-5 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#493726] pb-2">
              <span className="font-heading font-black text-xs text-amber-300 uppercase flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Kayıtlı Mekanlar &amp; Bölgeler ({eyaletler.length})</span>
              </span>

              <button
                onClick={() => setYeniMekanModal(true)}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-heading font-black text-[10px] flex items-center gap-1 shadow"
              >
                <Plus className="w-3 h-3" />
                <span>Yeni Mekan</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {eyaletler.map((e) => {
                const isSelected = seciliEyaletId === e.id;
                const wallpaper = (e as any).wallpaperUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      sound.playSealStamp();
                      setSeciliEyaletId(e.id);
                    }}
                    className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#291e13] border-amber-400 shadow-xl ring-1 ring-amber-400'
                        : 'bg-[#15110d] border-[#3e2e20] hover:border-[#674e35]'
                    }`}
                  >
                    {/* 16:9 Küçük Önizleme */}
                    <div className="w-20 aspect-video rounded-lg overflow-hidden border border-[#523e2c] bg-black flex-shrink-0 relative">
                      <img src={wallpaper} alt={e.ad} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-[#f5ebd7] truncate block">
                          {e.ad}
                        </span>
                        <span className="text-[9px] font-mono text-amber-400 uppercase">
                          {e.hane}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#93826e] block truncate font-serif italic">
                        Vali: {e.vali} • {e.tehlikeSeviyesi} Tehlike
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleMekanDuzenleBasla(e);
                        }}
                        className="p-1.5 rounded bg-[#221811] hover:bg-[#342419] text-amber-300 border border-[#443322]"
                        title="Düzenle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleMekanSil(e.id);
                        }}
                        className="p-1.5 rounded bg-[#2a1313] hover:bg-[#421b1b] text-red-300 border border-red-900/60"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAĞ: MEKAN DETAYI & 16:9 GÖRSEL DÜZENLEYİCİ (7 cols) */}
          <div className="lg:col-span-7 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
            {duzenlenenEyalet ? (
              /* DÜZENLEME FORMU */
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#493726] pb-2">
                  <span className="font-heading font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                    <Edit className="w-4 h-4 text-amber-400" />
                    <span>Mekan Düzenle: {duzenlenenEyalet.ad}</span>
                  </span>
                  <button
                    onClick={() => setDuzenlenenEyalet(null)}
                    className="p-1 rounded bg-[#201812] text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 16:9 Fotoğraf Canlı Önizleme & Yükleme */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-amber-300 block">
                    16:9 Duvar Kâğıdı Fotoğrafı:
                  </label>
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative border-2 border-amber-600 bg-black group">
                    <img
                      src={(duzenlenenEyalet as any).wallpaperUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80'}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg wax-seal text-white font-heading font-bold text-xs shadow flex items-center gap-1.5">
                        <Camera className="w-4 h-4" />
                        <span>Dosyadan 16:9 Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleMekanDosyaYukle(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={(duzenlenenEyalet as any).wallpaperUrl || ''}
                      onChange={(e) =>
                        setDuzenlenenEyalet({
                          ...duzenlenenEyalet,
                          ...({ wallpaperUrl: e.target.value } as any),
                        })
                      }
                      placeholder="Görsel URL'si yapıştırın (16:9)..."
                      className="flex-1 bg-[#140f0c] border border-[#443322] rounded px-3 py-1.5 text-xs text-[#f5ebd7] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Mekan / Bölge Adı:</label>
                    <input
                      type="text"
                      value={duzenlenenEyalet.ad}
                      onChange={(e) => setDuzenlenenEyalet({ ...duzenlenenEyalet, ad: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Hane / Yetki:</label>
                    <input
                      type="text"
                      value={duzenlenenEyalet.hane}
                      onChange={(e) => setDuzenlenenEyalet({ ...duzenlenenEyalet, hane: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Vali / Lider:</label>
                    <input
                      type="text"
                      value={duzenlenenEyalet.vali}
                      onChange={(e) => setDuzenlenenEyalet({ ...duzenlenenEyalet, vali: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Tehlike Seviyesi:</label>
                    <select
                      value={duzenlenenEyalet.tehlikeSeviyesi}
                      onChange={(e) =>
                        setDuzenlenenEyalet({
                          ...duzenlenenEyalet,
                          tehlikeSeviyesi: e.target.value as any,
                        })
                      }
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-white"
                    >
                      <option value="Düşük">Düşük</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksek">Yüksek</option>
                      <option value="Ölümcül">Ölümcül</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Tarihçe &amp; Bölge Açıklaması:</label>
                  <textarea
                    rows={2}
                    value={duzenlenenEyalet.tarihce}
                    onChange={(e) => setDuzenlenenEyalet({ ...duzenlenenEyalet, tarihce: e.target.value })}
                    className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-white text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#443322]">
                  <button
                    onClick={() => setDuzenlenenEyalet(null)}
                    className="px-3 py-1.5 rounded bg-[#201812] text-stone-300 text-xs font-heading font-bold"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleMekanKaydet}
                    className="px-4 py-1.5 rounded wax-seal text-white text-xs font-heading font-black shadow flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Kaydet &amp; Uygula</span>
                  </button>
                </div>
              </div>
            ) : (
              /* SEÇİLİ MEKAN ÖNİZLEMESİ */
              (() => {
                const secili = eyaletler.find((e) => e.id === seciliEyaletId) || eyaletler[0];
                if (!secili) return null;
                const wallpaper =
                  (secili as any).wallpaperUrl ||
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80';

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#493726] pb-2">
                      <div>
                        <h2 className="font-heading font-black text-sm text-amber-200">
                          {secili.ad}
                        </h2>
                        <span className="text-[10px] text-[#93826e]">
                          {secili.hane} Hanesi • Vali: {secili.vali}
                        </span>
                      </div>
                      <button
                        onClick={() => handleMekanDuzenleBasla(secili)}
                        className="px-3 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs shadow flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Mekanı &amp; Fotoğrafı Düzenle</span>
                      </button>
                    </div>

                    {/* 16:9 Sahne Görünümü */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative border-2 border-[#54412e] shadow-2xl bg-black">
                      <img src={wallpaper} alt={secili.ad} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 inset-x-3 text-xs text-[#ebdcc8] font-serif italic">
                        &quot;{secili.tarihce}&quot;
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#140f0c] border border-[#3e2e20] text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Nüfus:</span>
                        <span className="font-mono text-amber-300">{secili.nufus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Geçim Kaynağı:</span>
                        <span className="text-[#e2d5c3]">{secili.gecim}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Tehlike Seviyesi:</span>
                        <span className="text-red-400 font-bold">{secili.tehlikeSeviyesi}</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          2. TAB: NPCLER & PORTRELER YÖNETİMİ
          ======================================================== */}
      {aktifAdminTab === 'npcler' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* SOL: NPC LİSTESİ (5 cols) */}
          <div className="lg:col-span-5 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#493726] pb-2">
              <span className="font-heading font-black text-xs text-amber-300 uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>NPC &amp; Düşmanlar ({npcler.length})</span>
              </span>

              <button
                onClick={() => setYeniNpcModal(true)}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-heading font-black text-[10px] flex items-center gap-1 shadow"
              >
                <Plus className="w-3 h-3" />
                <span>Yeni NPC</span>
              </button>
            </div>

            {/* Arama & Filtre */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="NPC ara..."
                value={aramaNpc}
                onChange={(e) => setAramaNpc(e.target.value)}
                className="flex-1 bg-[#140f0c] border border-[#3e2e20] rounded p-1.5 text-xs text-white"
              />
              <select
                value={filtreHane}
                onChange={(e) => setFiltreHane(e.target.value)}
                className="bg-[#140f0c] border border-[#3e2e20] rounded p-1.5 text-xs text-stone-300"
              >
                <option value="Hepsi">Tüm Haneler</option>
                {Object.keys(HANELER).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* NPC Listesi */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filtrelenmisNpcListesi.map((n) => {
                const isSelected = seciliNpcId === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      sound.playSealStamp();
                      setSeciliNpcId(n.id);
                    }}
                    className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#291e13] border-amber-400 shadow-xl ring-1 ring-amber-400'
                        : 'bg-[#15110d] border-[#3e2e20] hover:border-[#674e35]'
                    }`}
                  >
                    {/* Yuvarlak Portre */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-600 bg-black flex-shrink-0">
                      <img src={n.fotoUrl} alt={n.ad} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-[#f5ebd7] truncate block">
                          {n.ad}
                        </span>
                        <span className="text-[9px] font-mono text-red-400 font-bold uppercase">
                          {n.tehdit}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#93826e] block truncate font-serif italic">
                        {n.rol} ({n.hane})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleNpcDuzenleBasla(n);
                        }}
                        className="p-1.5 rounded bg-[#221811] hover:bg-[#342419] text-amber-300 border border-[#443322]"
                        title="Düzenle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleNpcSil(n.id);
                        }}
                        className="p-1.5 rounded bg-[#2a1313] hover:bg-[#421b1b] text-red-300 border border-red-900/60"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAĞ: NPC DÜZENLEME & PORTRE ALANI (7 cols) */}
          <div className="lg:col-span-7 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
            {duzenlenenNpc ? (
              /* DÜZENLEME FORMU */
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#493726] pb-2">
                  <span className="font-heading font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                    <Edit className="w-4 h-4 text-amber-400" />
                    <span>NPC Düzenle: {duzenlenenNpc.ad}</span>
                  </span>
                  <button
                    onClick={() => setDuzenlenenNpc(null)}
                    className="p-1 rounded bg-[#201812] text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Portre Fotoğrafı & Yükleme */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#140f0c] border border-[#3e2e20]">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-600 bg-black flex-shrink-0 relative group">
                    <img src={duzenlenenNpc.fotoUrl} alt={duzenlenenNpc.ad} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs">
                    <label className="text-[10px] uppercase font-bold text-amber-300 block">
                      NPC Portre Fotoğrafı:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={duzenlenenNpc.fotoUrl || ''}
                        onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, fotoUrl: e.target.value })}
                        placeholder="Portre URL yapıştır..."
                        className="flex-1 bg-[#1a140f] border border-[#443322] rounded px-2.5 py-1 text-xs text-white"
                      />
                      <label className="cursor-pointer px-3 py-1 rounded wax-seal text-white font-heading font-bold text-[10px] shadow flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Dosya Seç</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleNpcDosyaYukle(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Adı:</label>
                    <input
                      type="text"
                      value={duzenlenenNpc.ad}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, ad: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Hanesi:</label>
                    <input
                      type="text"
                      value={duzenlenenNpc.hane}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, hane: e.target.value as any })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Rolü / Unvanı:</label>
                    <input
                      type="text"
                      value={duzenlenenNpc.rol}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, rol: e.target.value as any })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Tehdit Seviyesi:</label>
                    <select
                      value={duzenlenenNpc.tehdit}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, tehdit: e.target.value as any })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    >
                      <option value="Düşük">Düşük</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksek">Yüksek</option>
                      <option value="Ölümcül">Ölümcül</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Ana Kavram (High Concept):</label>
                    <input
                      type="text"
                      value={duzenlenenNpc.anaKavram}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, anaKavram: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Dert (Trouble):</label>
                    <input
                      type="text"
                      value={duzenlenenNpc.dert}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, dert: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Gizli Sırrı (GM Only):</label>
                    <textarea
                      rows={2}
                      value={duzenlenenNpc.sir}
                      onChange={(e) => setDuzenlenenNpc({ ...duzenlenenNpc, sir: e.target.value })}
                      className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#443322]">
                  <button
                    onClick={() => setDuzenlenenNpc(null)}
                    className="px-3 py-1.5 rounded bg-[#201812] text-stone-300 text-xs font-heading font-bold"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleNpcKaydet}
                    className="px-4 py-1.5 rounded wax-seal text-white text-xs font-heading font-black shadow flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Kaydet &amp; Uygula</span>
                  </button>
                </div>
              </div>
            ) : (
              /* SEÇİLİ NPC ÖNİZLEMESİ */
              (() => {
                const secili = npcler.find((n) => n.id === seciliNpcId) || npcler[0];
                if (!secili) return null;

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#493726] pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-16 rounded-xl overflow-hidden border-2 border-amber-600 bg-black flex-shrink-0 shadow">
                          <img src={secili.fotoUrl} alt={secili.ad} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h2 className="font-heading font-black text-sm text-amber-200">
                            {secili.ad}
                          </h2>
                          <span className="text-[10px] text-[#93826e]">
                            {secili.rol} • {secili.hane} Hanesi ({secili.tehdit} Tehdit)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleNpcDuzenleBasla(secili)}
                        className="px-3 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs shadow flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-lg bg-[#140f0c] border border-[#3e2e20] text-xs space-y-1.5">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold block">Ana Kavram:</span>
                        <p className="text-[#ded1be] font-serif italic">&quot;{secili.anaKavram}&quot;</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-red-400 font-bold block">Dert:</span>
                        <p className="text-[#ded1be] font-serif italic">&quot;{secili.dert}&quot;</p>
                      </div>

                      <div className="pt-1 border-t border-[#3e2e20]">
                        <span className="text-[10px] text-purple-400 font-bold block">Gizli Sır:</span>
                        <p className="text-[#beaf9e] text-[11px] font-mono">{secili.sir}</p>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          3. TAB: SİSTEM, FERMAN & YEDEKLEME YÖNETİMİ
          ======================================================== */}
      {aktifAdminTab === 'sistem' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ANLATICI FERMANI GÖNDER */}
          <div className="lg:col-span-6 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <span className="font-heading font-black text-xs text-amber-300 uppercase flex items-center gap-1.5 border-b border-[#493726] pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Canlı Anlatıcı Fermanı (Tüm Oyunculara Yayınla)</span>
            </span>

            <p className="text-xs text-[#ded1be] font-serif">
              Buradan göndereceğiniz ferman, tüm ekranlarda altın mühürlü bir anlatı bandı olarak canlı yayınlanır.
            </p>

            <textarea
              rows={3}
              value={fermanMetni}
              onChange={(e) => setFermanMetni(e.target.value)}
              placeholder="Örn: 'Gökyüzü kana boyandı, Arava surlarında çanlar çalıyor! Tüm muhafızlar kılıç çeksin!'"
              className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#f5ebd7]"
            />

            <button
              onClick={() => {
                if (fermanMetni.trim()) {
                  sound.playTempleBell('uyanis');
                  confetti({ particleCount: 35, spread: 60 });
                  onAnlatıYayinla(fermanMetni.trim());
                  notify('📜 Ferman tüm sayfalara canlı olarak yayınlandı!');
                  setFermanMetni('');
                }
              }}
              className="w-full py-2 rounded wax-seal text-white font-heading font-bold text-xs shadow flex items-center justify-center gap-2"
            >
              <span>Fermanı Yayınla</span>
            </button>
          </div>

          {/* VERİ YEDEKLEME & SIFIRLAMA */}
          <div className="lg:col-span-6 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <span className="font-heading font-black text-xs text-amber-300 uppercase flex items-center gap-1.5 border-b border-[#493726] pb-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Veri Yedekleme &amp; Sıfırlama</span>
            </span>

            <p className="text-xs text-[#ded1be] font-serif">
              Hazırladığınız tüm özel NPC&apos;leri, mekanları ve görselleri bilgisayarınıza yedekleyebilir veya başka bir cihaza yükleyebilirsiniz.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleTumVerileriIndir}
                className="p-3 rounded-xl bg-[#1e1610] hover:bg-[#2e2118] border border-amber-600/70 text-amber-200 text-xs font-heading font-bold flex flex-col items-center justify-center gap-1 shadow"
              >
                <Download className="w-5 h-5 text-amber-400" />
                <span>JSON Olarak Dışa Aktar</span>
              </button>

              <label className="p-3 rounded-xl bg-[#1e1610] hover:bg-[#2e2118] border border-amber-600/70 text-amber-200 text-xs font-heading font-bold flex flex-col items-center justify-center gap-1 shadow cursor-pointer">
                <Upload className="w-5 h-5 text-amber-400" />
                <span>JSON Dosyası İçe Aktar</span>
                <input type="file" accept=".json" onChange={handleYedekDosyaYukle} className="hidden" />
              </label>
            </div>

            <div className="pt-2 border-t border-[#443322]">
              <button
                onClick={handleFabrikaAyarlarinaSifirla}
                className="w-full py-2 rounded bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700 text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Orijinal Stallhart Canon Verilerine Sıfırla</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YENİ MEKAN EKLEME MODALI */}
      {yeniMekanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-amber-600 max-w-lg w-full shadow-2xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#4d3a28] pb-2">
              <span className="font-heading font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Yeni Mekan / Bölge Ekle</span>
              </span>
              <button onClick={() => setYeniMekanModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleYeniMekanOlustur({
                  ad: form.ad.value,
                  hane: form.hane.value,
                  vali: form.vali.value,
                  tarihce: form.tarihce.value,
                  wallpaperUrl: form.wallpaperUrl.value,
                  tehlikeSeviyesi: form.tehlike.value,
                });
              }}
              className="space-y-2.5"
            >
              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Mekan Adı:</label>
                <input name="ad" required placeholder="Örn: Galetsha Yeraltı Mahzenleri" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Hane:</label>
                  <input name="hane" defaultValue="Stallhart" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Vali / Lider:</label>
                  <input name="vali" defaultValue="Garnizon Kâhyası" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">16:9 Duvar Kâğıdı Fotoğraf URL:</label>
                <input name="wallpaperUrl" defaultValue="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Tehlike Seviyesi:</label>
                <select name="tehlike" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white">
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                  <option value="Ölümcül">Ölümcül</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Açıklama / Tarihçe:</label>
                <textarea name="tarihce" rows={2} defaultValue="Sırlarla dolu karanlık bir bölge." className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#443322]">
                <button type="button" onClick={() => setYeniMekanModal(false)} className="px-3 py-1.5 rounded bg-[#201812] text-stone-300">
                  İptal
                </button>
                <button type="submit" className="px-4 py-1.5 rounded wax-seal text-white font-heading font-black">
                  Mekanı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YENİ NPC EKLEME MODALI */}
      {yeniNpcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-amber-600 max-w-lg w-full shadow-2xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#4d3a28] pb-2">
              <span className="font-heading font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Yeni NPC / Düşman Ekle</span>
              </span>
              <button onClick={() => setYeniNpcModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleYeniNpcOlustur({
                  ad: form.ad.value,
                  hane: form.hane.value,
                  rol: form.rol.value,
                  tehdit: form.tehdit.value,
                  anaKavram: form.anaKavram.value,
                  dert: form.dert.value,
                  sir: form.sir.value,
                  fotoUrl: form.fotoUrl.value,
                });
              }}
              className="space-y-2.5"
            >
              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Karakter Adı:</label>
                <input name="ad" required placeholder="Örn: Yüzbaşı Alveth" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Hane:</label>
                  <input name="hane" defaultValue="Stallhart" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Rol:</label>
                  <input name="rol" defaultValue="Komutan" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Portre Fotoğraf URL:</label>
                <input name="fotoUrl" defaultValue="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Tehdit Seviyesi:</label>
                <select name="tehdit" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white">
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                  <option value="Ölümcül">Ölümcül</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Ana Kavram (High Concept):</label>
                <input name="anaKavram" defaultValue="Arava Muhafızlarının Sert Disiplinli Yüzbaşısı" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Dert:</label>
                <input name="dert" defaultValue="Komutanın Rüşvet Aldığını Biliyor" className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 block mb-0.5">Gizli Sır (GM Only):</label>
                <input name="sir" defaultValue="Gece pazarında kaçakçılarla buluşuyor." className="w-full bg-[#140f0c] border border-[#443322] rounded p-1.5 text-white" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#443322]">
                <button type="button" onClick={() => setYeniNpcModal(false)} className="px-3 py-1.5 rounded bg-[#201812] text-stone-300">
                  İptal
                </button>
                <button type="submit" className="px-4 py-1.5 rounded wax-seal text-white font-heading font-black">
                  NPC&apos;yi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
