import React, { useState } from 'react';
import {
  Karakter,
  TurAdi,
  TUR_VE_IRKLAR,
  SEKIZ_HANE,
  ON_SEKIZ_MESLEK,
  YAKLASIMLAR,
  YaklasimAdi,
  SIFATLAR_MERDIVENI,
  merdivenDerecesiBul,
  HAZIR_EKIPMANLAR
} from '../rules';
import { sound } from '../utils/audio';
import { LegendOfTheCouncilLogo } from './LegendOfTheCouncilLogo';
import {
  Shield,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Coins,
  Sparkles,
  Camera,
  AlertCircle,
  Skull,
  Feather,
  RefreshCw,
  Award,
  Crown,
  Scroll,
  Heart,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CharacterCreatorProps {
  onKarakterOlustur: (yeniKarakter: Karakter) => void;
  onIptal: () => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  onKarakterOlustur,
  onIptal,
}) => {
  const [adim, setAdim] = useState<number>(1); // 1..7

  // Adım 1: Tür (6 Seçenek)
  const [seciliTur, setSeciliTur] = useState<TurAdi>('İnsan');

  // Adım 2: Irk (12 Seçenek)
  const [seciliIrkKey, setSeciliIrkKey] = useState<string>('Eran');

  // Adım 3: Köken (Soylu / Halktan)
  const [seciliKoken, setSeciliKoken] = useState<'Soylu' | 'Halktan'>('Soylu');

  // Adım 4: Hane veya Eyalet + Meslek
  const [seciliHaneKey, setSeciliHaneKey] = useState<string>('Selya');
  const [seciliEyalet, setSeciliEyalet] = useState<string>('Selyanya Vadisi');
  const [seciliMeslekKey, setSeciliMeslekKey] = useState<string>('Asker');

  // İsim & Portre
  const [ad, setAd] = useState<string>('');
  const [fotoUrl, setFotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  );

  // Adım 5: 14 Yaklaşım Değerleri Dağılımı (+4 x1, +3 x2, +2 x3, +1 x3, 0 x2, -1 x3)
  const [yaklasimlar, setYaklasimlar] = useState<Record<YaklasimAdi, number>>({
    'Ghardello': 4,
    'Ver-ed': 3,
    'Lithron': 3,
    'Rax-ed': 2,
    'Aldris': 2,
    'Edor / Edros': 2,
    'Vizer': 1,
    'Xes-hart': 1,
    'Aronlid': 1,
    'Zel-vash': 0,
    'Vize-rion': 0,
    'Lodvez': -1,
    'Erau': -1,
    'Loth': -1,
  });

  // Adım 6: Uzmanlıklar
  const [uzmanlik1, setUzmanlik1] = useState<string>('Hane Mirası / Meslek Hüneri');
  const [uzmanlik2, setUzmanlik2] = useState<string>('Sözleşme Kılıcı: Müttefik yanımdayken Ghardello +2');
  const [uzmanlik3, setUzmanlik3] = useState<string>('Kalkan Duvarı: Siper hattında Savunma +2');
  const [yasakIlim, setYasakIlim] = useState<boolean>(false);

  // Adım 7: 5 Aspect ve 3 Geçmiş Cümlesi
  const [unvanVeKader, setUnvanVeKader] = useState<string>('');
  const [zayifKanadi, setZayifKanadi] = useState<string>('');
  const [sadakatBagi, setSadakatBagi] = useState<string>('');
  const [serbest1, setSerbest1] = useState<string>('');
  const [serbest2, setSerbest2] = useState<string>('');
  const [gecmis1, setGecmis1] = useState<string>('Sınır boylarında zorlu bir çocukluk geçirdim.');
  const [gecmis2, setGecmis2] = useState<string>('Kanlı bir kuşatmada sancağı tek başıma savundum.');
  const [gecmis3, setGecmis3] = useState<string>('Verilen gizli bir yeminle kaderim tahtın gölgesine bağlandı.');

  const guncelIrk = TUR_VE_IRKLAR[seciliIrkKey] || TUR_VE_IRKLAR.Eran;
  const guncelHane = SEKIZ_HANE[seciliHaneKey] || SEKIZ_HANE.Selya;
  const guncelMeslek = ON_SEKIZ_MESLEK[seciliMeslekKey] || ON_SEKIZ_MESLEK.Asker;

  // İleri Adım Kontrolleri
  const sonrakiAdim = () => {
    sound.playSealStamp();
    if (adim === 4) {
      // 4. adımdan 5'e geçerken ilk uzmanlığı ve zayıf kanadı otomatik hazırla
      if (seciliKoken === 'Soylu') {
        setUzmanlik1(`${guncelHane.haneMirasi}: ${guncelHane.haneMirasiDetay}`);
      } else {
        setUzmanlik1(`${guncelMeslek.meslekHüneri}: ${guncelMeslek.hunerMetni}`);
        if (!zayifKanadi) setZayifKanadi(guncelMeslek.yuk);
      }
    }
    setAdim((prev) => Math.min(7, prev + 1));
  };

  const oncekiAdim = () => {
    sound.playSealStamp();
    setAdim((prev) => Math.max(1, prev - 1));
  };

  // Yaklaşım Değeri Değiştirme
  const handleYaklasimDegis = (yAd: YaklasimAdi, val: number) => {
    setYaklasimlar((prev) => ({
      ...prev,
      [yAd]: val,
    }));
  };

  // Karakteri Kaydet
  const handleTamamla = () => {
    sound.playSealStamp();
    confetti({ particleCount: 50, spread: 70 });

    const olcek = seciliKoken === 'Soylu' ? 5 : 2;
    const yenileme = seciliKoken === 'Soylu' ? 3 : 4;

    const yeniKarakter: Karakter = {
      id: `char_${Date.now()}`,
      ad: ad.trim() || 'İsimsiz Savaşçı',
      oyuncu: 'Oyuncu',
      tur: seciliTur,
      irk: guncelIrk.ad,
      koken: seciliKoken,
      olcek,
      hane: seciliKoken === 'Soylu' ? (guncelHane.id as any) : 'Stallhart',
      eyalet: seciliKoken === 'Soylu' ? guncelHane.diyar : seciliEyalet,
      meslek: seciliKoken === 'Soylu' ? 'Soylu Asilzade' : guncelMeslek.ad,
      rutbe: seciliKoken === 'Soylu' ? 'Hane Varisi' : 'Kıdemli',
      fotoUrl,
      cerceve: seciliKoken === 'Soylu' ? 'stallhart-gold' : 'arhan-crimson',

      yenileme,
      kaderPuani: yenileme,

      yaklasimlar,

      yaraHatlari: {
        fiziksel: [false, false, false],
        zihinsel: [false, false, false],
        itibar: [false],
      },
      sonuclar: {},

      aspectler: {
        unvanVeKader: unvanVeKader.trim() || 'Stallhart’ın Kader Yolu Yolcusu',
        zayifKanadi: zayifKanadi.trim() || (seciliKoken === 'Halktan' ? guncelMeslek.yuk : 'Onur Yükü'),
        sadakatBagi: sadakatBagi.trim() || 'Birlik Kardeşime Verilmiş Söz',
        serbest1: serbest1.trim() || 'Kör Yengeç’te Gizli Bir Masa',
        serbest2: serbest2.trim() || 'Kadim Bir Çeliğin Hatırası',
      },

      uzmanliklar: [uzmanlik1, uzmanlik2, uzmanlik3].filter(Boolean),
      yasakIlim: seciliMeslekKey === 'Büyücü' || yasakIlim,

      ekipmanAspectleri: [
        'Ağır Plaka Zırh: Ghardello Savunmasında +2.',
        'Stallhart Çeliği Kılıç: Saldırıda +2.'
      ],
      envanter: [
        { id: `eq_${Date.now()}_1`, ad: 'Stallhart Çeliği Kılıç', tur: 'Silah', aspectEtkisi: 'Ghardello ile Saldırıda +2.', fiyat: 15, yuk: 2 },
        { id: `eq_${Date.now()}_2`, ad: 'Deri Zırh', tur: 'Zırh', aspectEtkisi: 'Savunmada +1.', fiyat: 10, yuk: 2 }
      ],

      gecmis3Cumle: [gecmis1, gecmis2, gecmis3],

      ekonomi: { aron: seciliKoken === 'Soylu' ? 40 : 20, borc: 0 },
      durumlar: ['Hazır'],
      notlar: '## 📜 Karakterin Yeminleri & Yolculuk Notları',

      // Legacy alanlar
      sayaclar: { yaraKutulari: 3, alınanYaraKutulari: 0, yorgunluk: 0, muhur: yenileme, leke: 0, supheli: 1 },
      gorunumler: {
        anaKavram: unvanVeKader.trim() || 'Kader Yolcusu',
        dert: zayifKanadi.trim() || 'Yük',
        gecmis: serbest1.trim() || 'Geçmiş Sırrı',
        catisma: serbest2.trim() || 'Çatışma',
        bag: sadakatBagi.trim() || 'Sadakat Bağı',
      },
      beceriler: { Fight: 3, Shoot: 2, Stealth: 1, Investigate: 2, Lore: 2, ProvokeManipulate: 2 },
      nitelikler: { STR: 2, DEX: 2, CON: 2, INT: 2, WIS: 2, CHA: 2 },
    };

    onKarakterOlustur(yeniKarakter);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6 text-[#f3ece0]">
      {/* ÜST İLERLEME ÇUBUĞU (7 ADIM) */}
      <div className="parchment-sheet p-4 sm:p-5 rounded-2xl border-2 border-[#54412e] shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#443322] pb-3">
          <LegendOfTheCouncilLogo size="sm" showSubtitle />
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded bg-[#18110b] border border-amber-900/60 shadow">
              Karakter Yaratımı · Adım {adim} / 7
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-heading font-bold">
          {['1. Tür', '2. Irk', '3. Köken', '4. Hane/Meslek', '5. Yaklaşım', '6. Uzmanlık', '7. Aspectler'].map((label, idx) => (
            <div
              key={label}
              className={`p-1.5 rounded border transition-all ${
                adim === idx + 1
                  ? 'bg-amber-900 border-amber-400 text-white font-black shadow ring-1 ring-amber-300'
                  : adim > idx + 1
                  ? 'bg-[#18120e] border-emerald-700 text-emerald-300'
                  : 'bg-[#120d09] border-[#312317] text-[#6b5b4c]'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ADIM İÇERİKLERİ */}
      <div className="parchment-sheet p-5 sm:p-6 rounded-2xl border-2 border-[#54412e] shadow-2xl min-h-[380px] flex flex-col justify-between space-y-4">
        {/* ADIM 1: TÜR SEÇİMİ */}
        {adim === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 1: Tür Seçimi (Altı Tür)
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Tür ölçek tavanını belirler. İnsan-olmayan türlerde Ölçek tavanı 8&apos;dir (Yönetici).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {(['İnsan', 'Zieli', 'Irun', 'Yaban', 'Kadim-Kan', 'Meren'] as TurAdi[]).map((tur) => (
                <div
                  key={tur}
                  onClick={() => setSeciliTur(tur)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                    seciliTur === tur
                      ? 'bg-[#2a1d13] border-amber-400 text-white shadow-lg ring-1 ring-amber-400'
                      : 'bg-[#15110d] border-[#3b2b1d] text-[#c4b5a2] hover:border-[#674e35]'
                  }`}
                >
                  <strong className="font-heading text-sm text-[#f5ebd7] block">{tur}</strong>
                  <span className="text-[10px] text-[#8e7e6d] block">
                    {tur === 'İnsan' ? 'Başsancak, ova ve hudut insanı. Ölçek tavanı: 10.' : 'Kadim varlık. Ölçek tavanı: 8 (Yönetici).'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADIM 2: IRK SEÇİMİ */}
        {adim === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 2: Irk ve Eğilim Yaklaşımı
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Her ırkın bir Eğilim Yaklaşımı vardır: 5. adımdaki dağılımda o Yaklaşım en az +2 yapılmalıdır.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {Object.keys(TUR_VE_IRKLAR)
                .filter((k) => TUR_VE_IRKLAR[k].tur === seciliTur)
                .map((key) => {
                  const irk = TUR_VE_IRKLAR[key];
                  return (
                    <div
                      key={key}
                      onClick={() => setSeciliIrkKey(key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                        seciliIrkKey === key
                          ? 'bg-[#2a1d13] border-amber-400 text-white shadow-lg ring-1 ring-amber-400'
                          : 'bg-[#15110d] border-[#3b2b1d] text-[#c4b5a2] hover:border-[#674e35]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="font-heading text-sm text-[#f5ebd7]">{irk.ad}</strong>
                        <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-800">
                          {irk.egilimYaklasimi}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#ded1be] font-serif">{irk.kimlik}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ADIM 3: KÖKEN (SOYLU / HALKTAN) */}
        {adim === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 3: Soylu mu, Halktan mı?
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Soylu olmak hem güç hem boyunduruktur. Halktan olmak ise özgürlük ve yüksek Yenileme sunar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Soylu Kartı */}
              <div
                onClick={() => setSeciliKoken('Soylu')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                  seciliKoken === 'Soylu'
                    ? 'bg-[#2a1d13] border-amber-400 shadow-xl ring-2 ring-amber-400'
                    : 'bg-[#15110d] border-[#3b2b1d] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-heading font-black text-base text-[#f5ecd8]">Soylu</h3>
                </div>
                <div className="space-y-1 text-[#ded1be]">
                  <p><strong>Başlangıç Ölçeği:</strong> 5 (Soylu Aile)</p>
                  <p><strong>Yenileme Kotası:</strong> 3 Kader Puanı</p>
                  <p><strong>Köken:</strong> 8 Büyük Hane Mirası (ilk ücretsiz Uzmanlık)</p>
                  <p><strong>Zayıf Kanadı:</strong> Hane yükümlülüğü veya onurla ilgili olmalı</p>
                </div>
              </div>

              {/* Halktan Kartı */}
              <div
                onClick={() => setSeciliKoken('Halktan')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                  seciliKoken === 'Halktan'
                    ? 'bg-[#2a1d13] border-amber-400 shadow-xl ring-2 ring-amber-400'
                    : 'bg-[#15110d] border-[#3b2b1d] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3 className="font-heading font-black text-base text-[#f5ecd8]">Halktan</h3>
                </div>
                <div className="space-y-1 text-[#ded1be]">
                  <p><strong>Başlangıç Ölçeği:</strong> 2 (Sıradan Halk)</p>
                  <p><strong>Yenileme Kotası:</strong> 4 Kader Puanı (Daha esnek!)</p>
                  <p><strong>Köken:</strong> Eyalet + 18 Meslek Hüneri (ilk ücretsiz Uzmanlık)</p>
                  <p><strong>Zayıf Kanadı:</strong> Meslek Yükü (&quot;Borçlar Beni Kovalar&quot; vb.)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADIM 4: HANE VEYA EYALET + MESLEK */}
        {adim === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 4: {seciliKoken === 'Soylu' ? 'Hane Mirası Seçimi' : 'Eyalet ve Meslek Seçimi'}
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Bu seçim sana ilk ücretsiz Uzmanlığını ve hikâye kökenini kazandırır.
              </p>
            </div>

            {/* İsim & Görsel Girişi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-[#140f0c] border border-[#3b2b1d]">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8d7c6b] block mb-1">Karakter Adı:</label>
                <input
                  type="text"
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  placeholder="Örn: Ren, Kaelen, Lyra..."
                  className="w-full bg-[#1b1510] border border-[#443322] rounded p-2 text-amber-200 font-heading font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8d7c6b] block mb-1">Portre Fotoğraf URL:</label>
                <input
                  type="text"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  className="w-full bg-[#1b1510] border border-[#443322] rounded p-2 text-stone-300 font-mono text-[11px]"
                />
              </div>
            </div>

            {seciliKoken === 'Soylu' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Object.keys(SEKIZ_HANE).map((hKey) => {
                  const h = SEKIZ_HANE[hKey];
                  return (
                    <div
                      key={hKey}
                      onClick={() => setSeciliHaneKey(hKey)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        seciliHaneKey === hKey
                          ? 'bg-[#2b1f14] border-amber-400 text-white shadow ring-1 ring-amber-400'
                          : 'bg-[#15110d] border-[#3b2b1d] text-[#c4b5a2]'
                      }`}
                    >
                      <strong className="font-heading font-bold block text-sm text-[#f5ebd7]">{h.ad}</strong>
                      <span className="text-[10px] text-amber-300 block font-bold mt-0.5">{h.haneMirasi}</span>
                      <p className="text-[10px] text-[#8e7e6d] font-serif italic mt-1">{h.motto}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {Object.keys(ON_SEKIZ_MESLEK).map((mKey) => {
                    const m = ON_SEKIZ_MESLEK[mKey];
                    return (
                      <div
                        key={mKey}
                        onClick={() => setSeciliMeslekKey(mKey)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                          seciliMeslekKey === mKey
                            ? 'bg-[#2b1f14] border-amber-400 text-white shadow ring-1 ring-amber-400'
                            : 'bg-[#15110d] border-[#3b2b1d] text-[#c4b5a2]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <strong className="font-heading font-bold text-sm text-[#f5ebd7]">{m.ad}</strong>
                          <span className="text-[9px] text-[#8e7e6d]">{m.oneriYaklasim}</span>
                        </div>
                        <span className="text-[10px] text-amber-300 font-bold block">{m.meslekHüneri}</span>
                        <span className="text-[9px] text-red-300 block">Yük: {m.yuk}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADIM 5: 14 YAKLAŞIM DAĞILIMI */}
        {adim === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 5: On Dört Yaklaşım Dağılımı
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Kural Piramidi: <strong>+4 (1 tane)</strong>, <strong>+3 (2 tane)</strong>, <strong>+2 (3 tane)</strong>, <strong>+1 (3 tane)</strong>, <strong>0 (2 tane)</strong>, <strong>−1 (3 tane)</strong>.
                Irkın Eğilim Yaklaşımı ({guncelIrk.egilimYaklasimi}) en az +2 olmalıdır.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
              {(Object.keys(YAKLASIMLAR) as YaklasimAdi[]).map((yAd) => {
                const val = yaklasimlar[yAd];
                const isEgilim = yAd === guncelIrk.egilimYaklasimi;
                return (
                  <div key={yAd} className="p-2 rounded-lg bg-[#16120e] border border-[#3b2b1d] text-center space-y-1">
                    <span className="font-heading font-bold text-[#f5ebd7] block text-xs truncate">
                      {yAd}
                    </span>
                    {isEgilim && (
                      <span className="text-[8px] bg-amber-950 text-amber-300 font-bold px-1 rounded block">
                        Eğilim
                      </span>
                    )}
                    <select
                      value={val}
                      onChange={(e) => handleYaklasimDegis(yAd, Number(e.target.value))}
                      className="w-full bg-[#1b1510] text-amber-300 font-mono font-bold border border-[#443322] rounded p-1 text-xs text-center"
                    >
                      <option value={4}>+4</option>
                      <option value={3}>+3</option>
                      <option value={2}>+2</option>
                      <option value={1}>+1</option>
                      <option value={0}>0</option>
                      <option value={-1}>−1</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADIM 6: UZMANLIKLAR */}
        {adim === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 6: Üç Uzmanlık Seçimi
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                İlk Uzmanlık 4. adımdaki Hanenden veya Mesleğinden gelir. Kalan 2 tanesini özgürce belirleyebilirsin.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] space-y-1">
                <label className="text-[10px] uppercase font-bold text-amber-400">1. Uzmanlık (Hane Mirası / Meslek Hüneri):</label>
                <input
                  type="text"
                  value={uzmanlik1}
                  onChange={(e) => setUzmanlik1(e.target.value)}
                  className="w-full bg-[#1b1510] border border-[#443322] rounded p-2 text-stone-200"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] space-y-1">
                <label className="text-[10px] uppercase font-bold text-amber-400">2. Uzmanlık (Dövüş / Becerik / Taktik):</label>
                <input
                  type="text"
                  value={uzmanlik2}
                  onChange={(e) => setUzmanlik2(e.target.value)}
                  placeholder="Örn: Çünkü müttefik yanımdayken omuz omuza Ghardello ile +2..."
                  className="w-full bg-[#1b1510] border border-[#443322] rounded p-2 text-stone-200"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] space-y-1">
                <label className="text-[10px] uppercase font-bold text-amber-400">3. Uzmanlık (Sosyal / Keşif / Savunma):</label>
                <input
                  type="text"
                  value={uzmanlik3}
                  onChange={(e) => setUzmanlik3(e.target.value)}
                  placeholder="Örn: Sahnede bir kez, bir lordun adını öne sürerek..."
                  className="w-full bg-[#1b1510] border border-[#443322] rounded p-2 text-stone-200"
                />
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#1b140f] border border-purple-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={yasakIlim}
                  onChange={(e) => setYasakIlim(e.target.checked)}
                  className="rounded border-[#443322]"
                />
                <span className="text-purple-300 font-bold">
                  Yasak İlim Uzmanlığı: Loth ile doğaüstü büyü yapma izni (Bedel risklidir!).
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ADIM 7: BEŞ ASPECT VE 3 CÜMLELİK GEÇMİŞ */}
        {adim === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
                Adım 7: Beş Aspect ve Üç Cümlelik Geçmiş
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Aspect hem silahtır hem yük. Kader Puanı harcayarak çağrılır (+2 / zar yenileme); başın belaya girdiğinde ise zorlanır (+1 Kader Puanı).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-amber-400">1. Unvan ve Kader:</label>
                <input
                  type="text"
                  value={unvanVeKader}
                  onChange={(e) => setUnvanVeKader(e.target.value)}
                  placeholder="Örn: Selya Rıhtımının Kılıcı, Altına Yemin Etmiş..."
                  className="w-full bg-[#18130e] border border-[#443322] rounded p-2 text-amber-200 font-serif italic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-red-400">2. Zayıf Kanadı / Yük (Trouble):</label>
                <input
                  type="text"
                  value={zayifKanadi}
                  onChange={(e) => setZayifKanadi(e.target.value)}
                  placeholder="Örn: Borçlar Beni Kovalar..."
                  className="w-full bg-[#18130e] border border-red-900 rounded p-2 text-red-200 font-serif italic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-blue-400">3. Sadakat Bağı:</label>
                <input
                  type="text"
                  value={sadakatBagi}
                  onChange={(e) => setSadakatBagi(e.target.value)}
                  placeholder="Örn: Eski Birlik Kardeşim Haldor’a Borçluyum..."
                  className="w-full bg-[#18130e] border border-[#443322] rounded p-2 text-blue-200 font-serif italic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">4. Serbest Aspect 1:</label>
                <input
                  type="text"
                  value={serbest1}
                  onChange={(e) => setSerbest1(e.target.value)}
                  placeholder="Örn: Kör Yengeç’te Hep Bir Masam Var..."
                  className="w-full bg-[#18130e] border border-[#443322] rounded p-2 text-stone-200 font-serif italic"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">5. Serbest Aspect 2:</label>
                <input
                  type="text"
                  value={serbest2}
                  onChange={(e) => setSerbest2(e.target.value)}
                  placeholder="Örn: Gümüş Damarlı Kılıcın Sırrı..."
                  className="w-full bg-[#18130e] border border-[#443322] rounded p-2 text-stone-200 font-serif italic"
                />
              </div>
            </div>

            {/* Geçmiş 3 Cümle */}
            <div className="p-3 rounded-xl bg-[#140f0c] border border-[#3b2b1d] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Karakteri Tanımlayan Üç Cümle (Geçmiş):</span>
              <input
                type="text"
                value={gecmis1}
                onChange={(e) => setGecmis1(e.target.value)}
                placeholder="1. Cümle: Köken ve çocukluk..."
                className="w-full bg-[#18130f] border border-[#443322] rounded p-1.5 text-stone-300 text-xs"
              />
              <input
                type="text"
                value={gecmis2}
                onChange={(e) => setGecmis2(e.target.value)}
                placeholder="2. Cümle: Yükselen çatışma ve ilk büyük yara..."
                className="w-full bg-[#18130f] border border-[#443322] rounded p-1.5 text-stone-300 text-xs"
              />
              <input
                type="text"
                value={gecmis3}
                onChange={(e) => setGecmis3(e.target.value)}
                placeholder="3. Cümle: Masadaki bir dostla kesişen yol..."
                className="w-full bg-[#18130f] border border-[#443322] rounded p-1.5 text-stone-300 text-xs"
              />
            </div>
          </div>
        )}

        {/* ALT BUTONLAR */}
        <div className="flex items-center justify-between border-t border-[#443322] pt-4">
          <button
            onClick={adim === 1 ? onIptal : oncekiAdim}
            className="px-4 py-2 rounded bg-[#201812] hover:bg-[#31251b] text-stone-300 font-heading text-xs border border-[#443322] flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{adim === 1 ? 'İptal' : 'Geri'}</span>
          </button>

          {adim < 7 ? (
            <button
              onClick={sonrakiAdim}
              className="px-5 py-2 rounded wax-seal text-white font-heading font-bold text-xs shadow flex items-center gap-1.5"
            >
              <span>Sonraki Adım</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleTamamla}
              className="px-6 py-2 rounded wax-seal text-white font-heading font-black text-xs shadow-xl ring-2 ring-amber-400 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Karakteri Doğur ve Mühürle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
