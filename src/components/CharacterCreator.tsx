import React, { useState } from 'react';
import {
  Karakter,
  Hane,
  HANELER,
  MESLEKLER,
  HAZIR_ESYALAR,
  Esya,
  Nitelikler,
  Beceriler,
  hesaplaMaksYaraKutusu,
  hesaplaMaksYuk,
  hesaplaBaslangicMuhur,
  hesaplaToplamAgirlik,
} from '../rules';
import { sound } from '../utils/audio';
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
  Upload,
  RefreshCw
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
  const [adim, setAdim] = useState<number>(1);
  const [hataMesaji, setHataMesaji] = useState<string | null>(null);

  // Form State
  const [ad, setAd] = useState('');
  const [hane, setHane] = useState<Hane>('Stallhart');
  const [koken, setKoken] = useState<'Halk' | 'Soylu' | 'Kutsal Kan İddiası'>('Halk');
  const [meslek, setMeslek] = useState<string>('Paralı Asker');
  const [rutbe, setRutbe] = useState('Acemi');

  // Üç Evre
  const [ucEvre, setUcEvre] = useState({
    koken: '',
    yukselenCatisma: '',
    konukYildiz: '',
  });

  // Görünüşler (5 Aspects)
  const [gorunumler, setGorunumler] = useState({
    anaKavram: '',
    dert: '',
    gecmis: '',
    catisma: '',
    bag: '',
  });

  // Puan Dağıtımı (20 Puan: 9 Nitelik + 8 Beceri + 3 Luck)
  const [nitelikler, setNitelikler] = useState<Nitelikler>({
    STR: 1,
    DEX: 1,
    CON: 1,
    INT: 1,
    WIS: 1,
    CHA: 1,
  });

  const [beceriler, setBeceriler] = useState<Beceriler>({
    Fight: 1,
    Shoot: 1,
    Stealth: 1,
    Investigate: 1,
    Lore: 1,
    ProvokeManipulate: 1,
  });

  const [luck, setLuck] = useState<number>(3);

  // Ekipman & Aron
  const [aron, setAron] = useState<number>(20);
  const [seciliEsyalar, setSeciliEsyalar] = useState<Esya[]>([
    HAZIR_ESYALAR[0], // Başlangıç kılıcı
    HAZIR_ESYALAR[7], // Sefer heybesi
  ]);

  // Fotoğraf ve filtre
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [sepyaFiltresi, setSepyaFiltresi] = useState<boolean>(true);
  const [analizYukleniyor, setAnalizYukleniyor] = useState<boolean>(false);
  const [geminiPortreAnalizi, setGeminiPortreAnalizi] = useState<string | null>(null);

  const haneInfo = HANELER[hane];

  // Puan Hesaplamaları
  const harcananNitelik = Object.values(nitelikler).reduce((a, b) => a + b, 0);
  const harcananBeceri = Object.values(beceriler).reduce((a, b) => a + b, 0);
  const kalanNitelik = 9 - harcananNitelik;
  const kalanBeceri = 8 - harcananBeceri;
  const kalanLuck = 3 - luck;
  const kalanToplamPuan = kalanNitelik + kalanBeceri + kalanLuck;

  const maksYuk = hesaplaMaksYuk(nitelikler.STR);
  const toplamYuk = hesaplaToplamAgirlik(seciliEsyalar);

  // Adım Doğrulama Kontrolleri
  const sonrakiAdimaGec = () => {
    setHataMesaji(null);

    if (adim === 1) {
      if (!ad.trim()) {
        setHataMesaji('Mühür henüz basılamaz: Karakterinizin şanlı veya gizemli bir ada ihtiyacı var.');
        return;
      }
    }

    if (adim === 4) {
      // Üç evre kontrolü
      if (!ucEvre.koken.trim() || !ucEvre.yukselenCatisma.trim()) {
        setHataMesaji('Arşiv eksik: En azından Köken ve Yükselen Çatışma hikayeleri yazılmalıdır.');
        return;
      }
    }

    if (adim === 5) {
      // Puan dağıtımı
      if (kalanNitelik < 0 || kalanBeceri < 0 || luck < 0 || luck > 3) {
        setHataMesaji('Puan haddi aşıldı! Nitelikler tavanı 9, Beceriler tavanı 8 puandır.');
        return;
      }
    }

    if (adim === 6) {
      // Görünüşler: Ana Kavram ve Dert zorunlu
      if (!gorunumler.anaKavram.trim() || !gorunumler.dert.trim()) {
        setHataMesaji('Fate kuralı: Ana Kavram ve Dert (Trouble) alanları kader için mecburidir.');
        return;
      }
    }

    if (adim === 7) {
      // Ekipman & Yük
      if (toplamYuk > maksYuk) {
        setHataMesaji(`Taşıma haddi aşıldı! Gücünüz en fazla ${maksYuk} Yük taşımanıza izin verir.`);
        return;
      }
      if (aron < 0) {
        setHataMesaji('Aron tükendi! Borç almadan daha fazla eşya alamazsınız.');
        return;
      }
    }

    sound.playSealStamp();
    setAdim((prev) => Math.min(9, prev + 1));
  };

  const oncekiAdimaGit = () => {
    setHataMesaji(null);
    sound.playSealStamp();
    setAdim((prev) => Math.max(1, prev - 1));
  };

  // Eşya Satın Al / Bırak
  const handleEsyaSecToggle = (esya: Esya) => {
    const varMi = seciliEsyalar.some((e) => e.id === esya.id);
    if (varMi) {
      setSeciliEsyalar(seciliEsyalar.filter((e) => e.id !== esya.id));
      setAron((prev) => prev + esya.fiyat);
    } else {
      if (aron < esya.fiyat) {
        setHataMesaji('Yeterli Aron yok!');
        return;
      }
      setSeciliEsyalar([...seciliEsyalar, esya]);
      setAron((prev) => prev - esya.fiyat);
    }
  };

  // Gemini Portre Analizi
  const handlePortreAnalizi = async (base64Img: string) => {
    try {
      setAnalizYukleniyor(true);
      const res = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          prompt: `Bu portreyi Stallhart masaüstü RPG evreninde analiz et. Karakterin hangi Haneye (${hane}), hangi mesleğe (${meslek}) benzediğini, yüzündeki olası yara izlerini ve taşıdığı karanlık sırrı 3 kısa cümleyle anlat.`,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setGeminiPortreAnalizi(data.analysis);
      }
    } catch {
      // Fallback
    } finally {
      setAnalizYukleniyor(false);
    }
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFotoUrl(result);
        handlePortreAnalizi(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Karakteri Tamamla
  const handleMuhuBasVeTamamla = () => {
    sound.playSealStamp();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });

    const yeniKarakter: Karakter = {
      id: `char_${Date.now()}`,
      ad: ad.trim(),
      hane,
      koken,
      meslek,
      rutbe,
      cerceve: `${hane.toLowerCase()}-frame`,
      fotoUrl,
      nitelikler,
      beceriler,
      luck,
      gorunumler,
      ucEvre,
      sayaclar: {
        yaraKutulari: hesaplaMaksYaraKutusu(nitelikler.CON),
        alınanYaraKutulari: 0,
        yorgunluk: 0,
        muhur: hesaplaBaslangicMuhur(luck),
        leke: 0,
        supheli: 0,
      },
      ekonomi: {
        aron,
        borc: 0,
        sicil: koken === 'Soylu' ? 0 : 1,
        un: koken === 'Kutsal Kan İddiası' ? 3 : 1,
      },
      envanter: seciliEsyalar,
      yaraIzleri: [],
      yaralar: {},
      durumlar: ['Sağlam'],
      kilometreTaslari: {
        kucuk: 0,
        orta: 0,
        buyuk: 0,
      },
      notlar: `Köken: ${koken}, Sancak: ${haneInfo.ad}`,
    };

    onKarakterOlustur(yeniKarakter);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Wizard Progress Bar with Wax Seals */}
      <div className="parchment-sheet rounded-xl border border-[#523d2b] p-4 mb-6 shadow-xl">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-2">
          {[
            { num: 1, label: 'Hane' },
            { num: 2, label: 'Köken' },
            { num: 3, label: 'Meslek' },
            { num: 4, label: 'Üç Evre' },
            { num: 5, label: 'Puanlar' },
            { num: 6, label: 'Görünüş' },
            { num: 7, label: 'Ekipman' },
            { num: 8, label: 'Portre' },
            { num: 9, label: 'Mühür' },
          ].map((step) => {
            const isDone = adim > step.num;
            const isCurrent = adim === step.num;
            return (
              <div
                key={step.num}
                onClick={() => isDone && setAdim(step.num)}
                className={`flex flex-col items-center flex-1 min-w-[50px] cursor-pointer transition-all ${
                  isDone ? 'opacity-90' : isCurrent ? 'scale-105' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-xs shadow-md border ${
                    isCurrent
                      ? 'wax-seal-gold text-amber-950 border-amber-300'
                      : isDone
                      ? 'wax-seal text-white border-red-400'
                      : 'bg-[#221a14] text-[#867664] border-[#423223]'
                  }`}
                >
                  {isDone ? '✓' : step.num}
                </div>
                <span className="text-[10px] font-heading font-semibold mt-1 text-[#d8cebe] whitespace-nowrap">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error / Validation Warning */}
      {hataMesaji && (
        <div className="mb-4 bg-red-950/90 border border-red-700 p-3 rounded text-red-200 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{hataMesaji}</span>
        </div>
      )}

      {/* Step Content Card */}
      <div className="parchment-sheet rounded-xl border-2 border-[#5a4430] p-5 sm:p-8 shadow-2xl relative min-h-[460px] flex flex-col justify-between">
        {/* STEP 1: Hane ve İsim */}
        {adim === 1 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                1. Adım: Hane Seçimi ve Karakter Adı
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Hangi kanın ve sancağın gölgesinde yemin ettin? Haneniz sayfanın ve zırhınızın renklerini tayin eder.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-1">
                Karakter Adı &amp; Lakabı *
              </label>
              <input
                type="text"
                placeholder="Örn: Goran Demirkanat, Lyra Vespera..."
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-2 text-base text-[#f5ecd8] focus:outline-none focus:border-amber-500 font-serif"
              />
            </div>

            <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-2">
              Büyük Haneler (12 Hane)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {(Object.keys(HANELER) as Hane[]).map((hKey) => {
                const info = HANELER[hKey];
                const isSelected = hane === hKey;
                return (
                  <button
                    key={hKey}
                    type="button"
                    onClick={() => {
                      setHane(hKey);
                      sound.playSealStamp();
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#271d15] border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-[#18130e] border-[#3e2e20] hover:border-[#674e35]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full border shadow-sm"
                        style={{ backgroundColor: info.renk, borderColor: info.ikincilRenk }}
                      />
                      <span className="font-heading font-bold text-xs text-[#f1e6d4]">
                        {info.ad.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#9a8976] line-clamp-2">
                      {info.amblem}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected House Preview Card */}
            <div
              className="mt-4 p-3 rounded border text-xs flex items-center justify-between"
              style={{
                backgroundColor: `${haneInfo.renk}18`,
                borderColor: haneInfo.renk,
              }}
            >
              <div>
                <span className="font-bold font-heading text-sm text-[#f5ebd7]">
                  {haneInfo.ad}
                </span>
                <span className="text-[#a49583] block text-[11px]">
                  Eyalet: {haneInfo.eyalet} • &quot;{haneInfo.motto}&quot;
                </span>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                style={{ backgroundColor: haneInfo.renk, color: haneInfo.ikincilRenk }}
              >
                {haneInfo.motifi}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Köken */}
        {adim === 2 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                2. Adım: Sosyal Köken
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Hangi beşikten geldin? Çamurdan mı, mermer saraylardan mı yoksa tanrıların unutulmuş kanından mı?
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'Halk',
                  baslik: 'Halk (Köylü, Esnaf, Çırak, Asker)',
                  aciklama: 'Toprağı elleriyle işlemiş, zorluklarla yoğrulmuş dayanıklı beden. Şehir sokaklarını ve halkın dilini iyi bilir.',
                  avantaj: 'Direnç: Yorgunluk eşiği ve fiziksel dayanıklılık kontrollerinde avantaj.',
                },
                {
                  id: 'Soylu',
                  baslik: 'Soylu (Aristokrat, Hanedan Kanı)',
                  aciklama: 'Özel eğitmenler, saray protokolü ve kanunlarla yetiştirilmiş asilzade. Diplomasi ve emir verme yeteneği yüksektir.',
                  avantaj: 'İmtiyaz: +1 Ün ile başlar, kurultayda söz hakkı ve mahkemelerde ayrıcalık.',
                },
                {
                  id: 'Kutsal Kan İddiası',
                  baslik: 'Kutsal Kan İddiası (Kayıp Veliaht, Rün Seçilmişi)',
                  aciklama: 'Damarlarında kadim çağlardan kalma bir miras taşıdığını iddia eden veya bunu gizlemeye çalışan tekinsiz fert.',
                  avantaj: 'Kader Çekimi: +1 Mühür kapasitesi, fakat Şüphe sayacı 1 puanla başlar.',
                },
              ].map((k) => (
                <div
                  key={k.id}
                  onClick={() => setKoken(k.id as any)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    koken === k.id
                      ? 'bg-[#271d15] border-amber-400 ring-1 ring-amber-400'
                      : 'bg-[#18130e] border-[#3e2e20] hover:border-[#674e35]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-sm text-[#f1e6d4]">
                      {k.baslik}
                    </span>
                    {koken === k.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-[#a49583] mb-2">{k.aciklama}</p>
                  <div className="text-[11px] font-semibold text-amber-300/90 bg-[#120e0b] px-2 py-1 rounded inline-block">
                    {k.avantaj}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-1">
                Mevcut Rütbe veya San
              </label>
              <input
                type="text"
                placeholder="Örn: Yüzbaşı, Acemi Kolcu, Kaçak Vezin, Çırak..."
                value={rutbe}
                onChange={(e) => setRutbe(e.target.value)}
                className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-1.5 text-xs text-[#f5ecd8] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Meslek */}
        {adim === 3 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                3. Adım: Meslek ve Hünerler
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Stallhart evreninde 8 temel meslek vardır. Her meslek 3 özel Hüner ve 1 karakteristik Zaaf taşır.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {Object.keys(MESLEKLER).map((mKey) => {
                const m = MESLEKLER[mKey];
                const isSelected = meslek === mKey;
                return (
                  <div
                    key={mKey}
                    onClick={() => {
                      setMeslek(mKey);
                      sound.playSealStamp();
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#271d15] border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-[#18130e] border-[#3e2e20] hover:border-[#674e35]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-sm text-[#f1e6d4]">
                        {m.ad}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-[#9d8c79] line-clamp-2 mb-2">
                      {m.aciklama}
                    </p>

                    {/* Hünerler */}
                    <div className="space-y-1 mb-2">
                      {m.hunerler.map((h, i) => (
                        <div key={i} className="text-[10px] text-[#c9bbaa]">
                          <span className="text-amber-400 font-semibold">• {h.ad}:</span>{' '}
                          {h.aciklama}
                        </div>
                      ))}
                    </div>

                    {/* Zaaf */}
                    <div className="text-[10px] text-red-300 font-semibold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/40">
                      Zaaf: {m.zaaf.ad} ({m.zaaf.aciklama})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Üç Evre (Three Phases) */}
        {adim === 4 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                4. Adım: Üç Evre (Background / Hikaye)
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Karakterinizin geçmişini tek cümlelik kırılma anlarıyla özetleyin. Bu evreler daha sonra Görünüşlerinize can verecek.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-heading text-amber-300 mb-1">
                  1. Evre: Köken (İlk Yıllar ve Ayrılış)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Selya sınırında bir çiftlikte büyüdüm ama harami baskınında evim yandı."
                  value={ucEvre.koken}
                  onChange={(e) => setUcEvre({ ...ucEvre, koken: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-2 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading text-amber-300 mb-1">
                  2. Evre: Yükselen Çatışma (Büyük Sınav veya Felaket)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Kurultay muhafızları komutanımı idama götürürken arşivi ateşe verip kaçtım."
                  value={ucEvre.yukselenCatisma}
                  onChange={(e) => setUcEvre({ ...ucEvre, yukselenCatisma: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-2 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading text-amber-300 mb-1">
                  3. Evre: Konuk Yıldız (Başka Bir Oyuncu veya NPC ile Kesişme)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Z'ela bataklıklarında Lyra ile sırt sırta verip engizisyon cellatlarını atlattık."
                  value={ucEvre.konukYildiz}
                  onChange={(e) => setUcEvre({ ...ucEvre, konukYildiz: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-2 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Puan Dağıtımı (20 Puan Sayaç) */}
        {adim === 5 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl text-amber-200">
                  5. Adım: Yetenek Dağıtımı (20 Puan Havuzu)
                </h2>
                <p className="text-xs text-[#a99c8b]">
                  Nitelikler (9), Beceriler (8) ve Luck (3). Her bir değer en fazla 3 olabilir.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#a1907e] font-heading block">
                  Kalan Puanlar
                </span>
                <span className="font-mono font-black text-xl text-amber-300">
                  {kalanToplamPuan} / 20
                </span>
              </div>
            </div>

            {/* Nitelikler Grubu (Maks 9) */}
            <div className="bg-[#17120e] p-3 rounded border border-[#3e2e20] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-bold text-[#d4af37]">
                  Nitelikler (0 - 3) [Kalan: {kalanNitelik}]
                </span>
                <span className="text-[10px] text-[#867563]">
                  Toplam 9 Puan Harcanabilir
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as (keyof Nitelikler)[]).map((stat) => (
                  <div
                    key={stat}
                    className="flex items-center justify-between bg-[#221a13] p-1.5 rounded border border-[#4a3726]"
                  >
                    <span className="font-heading font-bold text-xs text-[#d8cbba]">
                      {stat}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setNitelikler({
                            ...nitelikler,
                            [stat]: Math.max(0, nitelikler[stat] - 1),
                          })
                        }
                        className="w-5 h-5 bg-[#33251a] rounded text-xs text-amber-200 font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-mono font-bold text-sm text-amber-300">
                        {nitelikler[stat]}
                      </span>
                      <button
                        type="button"
                        disabled={nitelikler[stat] >= 3 || kalanNitelik <= 0}
                        onClick={() =>
                          setNitelikler({
                            ...nitelikler,
                            [stat]: nitelikler[stat] + 1,
                          })
                        }
                        className="w-5 h-5 bg-[#33251a] disabled:opacity-30 rounded text-xs text-amber-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beceriler Grubu (Maks 8) */}
            <div className="bg-[#17120e] p-3 rounded border border-[#3e2e20] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-bold text-[#d4af37]">
                  Beceriler (0 - 3) [Kalan: {kalanBeceri}]
                </span>
                <span className="text-[10px] text-[#867563]">
                  Toplam 8 Puan Harcanabilir
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    'Fight',
                    'Shoot',
                    'Stealth',
                    'Investigate',
                    'Lore',
                    'ProvokeManipulate',
                  ] as (keyof Beceriler)[]
                ).map((bec) => (
                  <div
                    key={bec}
                    className="flex items-center justify-between bg-[#221a13] p-1.5 rounded border border-[#4a3726]"
                  >
                    <span className="font-heading font-semibold text-[11px] text-[#d8cbba] truncate max-w-[70px]">
                      {bec}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setBeceriler({
                            ...beceriler,
                            [bec]: Math.max(0, beceriler[bec] - 1),
                          })
                        }
                        className="w-5 h-5 bg-[#33251a] rounded text-xs text-amber-200 font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-mono font-bold text-sm text-cyan-300">
                        {beceriler[bec]}
                      </span>
                      <button
                        type="button"
                        disabled={beceriler[bec] >= 3 || kalanBeceri <= 0}
                        onClick={() =>
                          setBeceriler({
                            ...beceriler,
                            [bec]: beceriler[bec] + 1,
                          })
                        }
                        className="w-5 h-5 bg-[#33251a] disabled:opacity-30 rounded text-xs text-amber-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Luck (3 Puan) */}
            <div className="flex items-center justify-between bg-[#1f1711] p-2.5 rounded border border-[#4e3927]">
              <div>
                <span className="font-heading font-bold text-xs text-amber-300 block">
                  Luck (Şans / Kader) (0 - 3)
                </span>
                <span className="text-[10px] text-[#93826e]">
                  Başlangıç Mühür Puanı = 2 + Luck
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLuck(Math.max(0, luck - 1))}
                  className="w-6 h-6 bg-[#33251a] rounded text-xs text-amber-200 font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-base text-amber-300">
                  {luck}
                </span>
                <button
                  type="button"
                  disabled={luck >= 3}
                  onClick={() => setLuck(luck + 1)}
                  className="w-6 h-6 bg-[#33251a] disabled:opacity-30 rounded text-xs text-amber-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Görünüşler (5 Aspects) */}
        {adim === 6 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                6. Adım: Görünüşler (Fate Aspects)
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Görünüşler, zar atışlarında Mühür harcayarak lehinize çevirdiğiniz veya Anlatıcının aleyhinize tetikleyerek size Mühür kazandırdığı kader cümleleridir.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase font-heading text-amber-400 mb-1">
                  1. Ana Kavram (High Concept) * [Zorunlu]
                </label>
                <input
                  type="text"
                  placeholder="Örn: Stallhart Sınırlarının Kıdemli Kılıcı..."
                  value={gorunumler.anaKavram}
                  onChange={(e) => setGorunumler({ ...gorunumler, anaKavram: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-1.5 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading text-red-400 mb-1">
                  2. Dert (Trouble) * [Zorunlu]
                </label>
                <input
                  type="text"
                  placeholder="Örn: Ödenmemiş Kan Borcu ve Şarap Zaafı..."
                  value={gorunumler.dert}
                  onChange={(e) => setGorunumler({ ...gorunumler, dert: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-1.5 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-1">
                  3. Geçmişten Gelen (Past)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Dama Sancağı Altında On Beş Kuşatma..."
                  value={gorunumler.gecmis}
                  onChange={(e) => setGorunumler({ ...gorunumler, gecmis: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-1.5 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-1">
                  4. Çatışmadan Gelen (Conflict)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Galetsha Tefecileri Peşimde..."
                  value={gorunumler.catisma}
                  onChange={(e) => setGorunumler({ ...gorunumler, catisma: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-1.5 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-1">
                  5. Bağ (Bond)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Küçük Kardeşimin Mabed'deki Kefareti..."
                  value={gorunumler.bag}
                  onChange={(e) => setGorunumler({ ...gorunumler, bag: e.target.value })}
                  className="w-full bg-[#17130f] border border-[#55402c] rounded px-3 py-1.5 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Ekipman ve 20 Aronluk Dükkan */}
        {adim === 7 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl text-amber-200">
                  7. Adım: Ekipman ve Heybe
                </h2>
                <p className="text-xs text-[#a99c8b]">
                  Başlangıç sermayeniz 20 Aron. Seçtiğiniz eşyalar Yük limitinizi (5 + STR: {maksYuk}) aşmamalıdır.
                </p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] text-[#a1907e] font-heading block">Kalan Aron</span>
                  <span className="font-mono font-bold text-lg text-amber-300">
                    {aron} Aron
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a1907e] font-heading block">Yük</span>
                  <span
                    className={`font-mono font-bold text-lg ${
                      toplamYuk > maksYuk ? 'text-red-400' : 'text-stone-300'
                    }`}
                  >
                    {toplamYuk} / {maksYuk}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {HAZIR_ESYALAR.map((esya) => {
                const isSelected = seciliEsyalar.some((e) => e.id === esya.id);
                return (
                  <div
                    key={esya.id}
                    onClick={() => handleEsyaSecToggle(esya)}
                    className={`p-2.5 rounded border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#2a1e15] border-amber-400 ring-1 ring-amber-400'
                        : 'bg-[#18130e] border-[#3e2e20] hover:border-[#674e35]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#f1e6d4] flex items-center gap-1.5">
                        <span>{esya.ad}</span>
                        {esya.zirhPuani && (
                          <span className="text-[10px] text-amber-300 font-mono">
                            (+{esya.zirhPuani} Zırh)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#8e7e6d]">
                        {esya.tur} • {esya.yuk} Yük • {esya.fiyat} Aron
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#2b2118] text-[#a99a89]'
                      }`}
                    >
                      {isSelected ? 'Kuşanıldı' : 'Satın Al'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: Fotoğraf Ekleme & Gemini Analizi */}
        {adim === 8 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                8. Adım: Karakter Portresi &amp; Görsel Arşiv
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Karakterinize bir yüz verin. Görselinizi yükleyebilir ve Gemini ile Stallhart evreni bağlamında tahlil ettirebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Preview Box */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-36 h-44 rounded-lg overflow-hidden border-4 shadow-2xl bg-black flex items-center justify-center relative transition-all ${
                    sepyaFiltresi ? 'sepia-[0.35] contrast-105' : ''
                  }`}
                  style={{ borderColor: haneInfo.renk }}
                >
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt="Portre"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Camera className="w-10 h-10 mx-auto text-[#624e3a] mb-2" />
                      <span className="text-xs text-[#8c7760]">Portre Bekleniyor</span>
                    </div>
                  )}
                  {/* House Heraldry Seal */}
                  <div
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow"
                    style={{ backgroundColor: haneInfo.renk, color: haneInfo.ikincilRenk }}
                  >
                    {hane[0]}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <label className="text-xs text-[#a39482] cursor-pointer flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={sepyaFiltresi}
                      onChange={(e) => setSepyaFiltresi(e.target.checked)}
                      className="rounded bg-[#1a140f] border-[#4f3c2b]"
                    />
                    <span>Eskitilmiş Parşömen / Sepya Filtresi</span>
                  </label>
                </div>
              </div>

              {/* Upload & Gemini AI Analysis */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-heading text-[#c5b49f] mb-1">
                    Cihazdan Fotoğraf Yükle
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 bg-[#18130e] hover:bg-[#251d16] border border-dashed border-[#55402c] rounded-lg cursor-pointer text-xs text-amber-200 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Portre Dosyası Seç (PNG, JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gemini AI Understanding Response */}
                {analizYukleniyor ? (
                  <div className="p-3 bg-[#17120e] rounded border border-[#443322] text-xs text-amber-300 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Gemini Arşivcisi portrenizi tahlil ediyor...</span>
                  </div>
                ) : geminiPortreAnalizi ? (
                  <div className="p-3 bg-[#1c1611] rounded border border-[#5a4430] text-xs text-[#d8cebe] space-y-1">
                    <div className="font-heading font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Arşivcinin Portre Yorumu (Gemini AI)</span>
                    </div>
                    <p className="italic text-[11px] leading-relaxed">
                      &quot;{geminiPortreAnalizi}&quot;
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Özet ve Balmumu Mühür ile Onay */}
        {adim === 9 && (
          <div>
            <div className="border-b border-[#443324] pb-3 mb-5">
              <h2 className="font-heading font-bold text-xl text-amber-200">
                9. Adım: Karakter Kâğıdı Özeti &amp; Mühürleme
              </h2>
              <p className="text-xs text-[#a99c8b]">
                Tüm kayıtlar tamamlandı. Aşağıdaki özeti kontrol edip kırmızı balmumu mührü basarak karakterinizi arşive kaydedin.
              </p>
            </div>

            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] space-y-3 text-xs mb-4">
              <div className="flex items-center justify-between border-b border-[#312519] pb-2">
                <div>
                  <span className="font-heading font-black text-lg text-amber-200">
                    {ad}
                  </span>
                  <span className="text-[#a49583] block">
                    {haneInfo.ad} • {meslek} ({koken})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-mono font-bold text-base">
                    {aron} Aron
                  </span>
                  <span className="text-[10px] text-[#867563] block">
                    Yara Kutuları: {hesaplaMaksYaraKutusu(nitelikler.CON)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-amber-400 block mb-1">
                    Nitelikler
                  </span>
                  <div className="text-[11px] text-[#cfc1b0]">
                    STR: +{nitelikler.STR} | DEX: +{nitelikler.DEX} | CON: +{nitelikler.CON} | INT: +{nitelikler.INT} | WIS: +{nitelikler.WIS} | CHA: +{nitelikler.CHA}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-cyan-300 block mb-1">
                    Beceriler
                  </span>
                  <div className="text-[11px] text-[#cfc1b0]">
                    Fight: +{beceriler.Fight} | Shoot: +{beceriler.Shoot} | Stealth: +{beceriler.Stealth} | Investigate: +{beceriler.Investigate} | Lore: +{beceriler.Lore} | Provoke: +{beceriler.ProvokeManipulate}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#312519] pt-2">
                <span className="font-bold text-amber-300 block">
                  Ana Kavram: {gorunumler.anaKavram}
                </span>
                <span className="font-bold text-red-400 block">
                  Dert: {gorunumler.dert}
                </span>
              </div>
            </div>

            <div className="text-center py-2">
              <button
                type="button"
                onClick={handleMuhuBasVeTamamla}
                className="py-3.5 px-8 font-heading font-black text-base rounded wax-seal text-white hover:brightness-110 active:scale-95 transition-all shadow-xl inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>MÜHRÜ BAS VE OYUNA BAŞLA</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Buttons */}
        <div className="border-t border-[#3c2e20] pt-4 mt-6 flex items-center justify-between">
          {adim > 1 ? (
            <button
              type="button"
              onClick={oncekiAdimaGit}
              className="px-4 py-2 text-xs font-heading font-semibold rounded bg-[#251d16] hover:bg-[#382b20] text-[#cfc2b1] border border-[#523d2b] flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onIptal}
              className="px-4 py-2 text-xs font-heading font-semibold rounded bg-[#251d16] hover:bg-[#382b20] text-[#a99a89] border border-[#443323]"
            >
              İptal
            </button>
          )}

          {adim < 9 && (
            <button
              type="button"
              onClick={sonrakiAdimaGec}
              className="px-5 py-2 text-xs font-heading font-bold rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 border border-[#785734] shadow flex items-center gap-1.5"
            >
              <span>İlerle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
