import React, { useState, useEffect } from 'react';
import {
  Karakter,
  Nitelikler,
  Beceriler,
  ZarSonucu,
  zarAt4dF,
  cepheZariAt,
  merdivenDerecesiBul,
  HANELER,
  YAKLASIMLAR,
  YaklasimAdi
} from '../rules';
import {
  parseStatusEffects,
  calculateStatusDiceModifier,
  CANON_STATUS_EFFECTS,
} from '../rules/statusEffects';
import { sound } from '../utils/audio';
import { multiplayer } from '../utils/multiplayerManager';
import { ThreeDiceCanvas } from './ThreeDiceCanvas';
import { CriticalResultOverlay } from './CriticalResultOverlay';
import { Sparkles, RefreshCw, X, Award, Shield, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  karakter: Karakter;
  initialNitelik?: keyof Nitelikler | 'Yok';
  initialBeceri?: keyof Beceriler | 'Yok';
  autoRoll?: boolean;
  onZarKaydet: (sonuc: ZarSonucu) => void;
  onMuhurHarca?: (miktar: number) => void;
  onMuhurKazan?: (miktar: number) => void;
}

export const DiceModal: React.FC<DiceModalProps> = ({
  isOpen,
  onClose,
  karakter,
  initialNitelik = 'Yok',
  initialBeceri = 'Fight',
  autoRoll = false,
  onZarKaydet,
  onMuhurHarca,
  onMuhurKazan,
}) => {
  const [seciliNitelik, setSeciliNitelik] = useState<keyof Nitelikler | 'Yok'>('Yok');
  const [seciliBeceri, setSeciliBeceri] = useState<keyof Beceriler | 'Yok'>('Fight');
  const [ekstraBonus, setEkstraBonus] = useState<number>(0);
  const [sonZar, setSonZar] = useState<ZarSonucu | null>(null);
  const [zarlar3D, setZarlar3D] = useState<number[]>([1, 0, -1, 1]);
  const [yuvarlaniyor, setYuvarlaniyor] = useState<boolean>(false);
  const [sonucGosterilsin, setSonucGosterilsin] = useState<boolean>(false);
  const [cepheSonucu, setCepheSonucu] = useState<any | null>(null);
  const [criticalType, setCriticalType] = useState<'critical_success' | 'catastrophe' | null>(null);
  const [criticalScore, setCriticalScore] = useState<number>(0);

  // Invoke & Compel State
  const [seciliGorunusTuru, setSeciliGorunusTuru] = useState<string>('anaKavram');
  const [compelModalAcik, setCompelModalAcik] = useState<boolean>(false);

  // Sync initial selections whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      if (initialBeceri !== undefined) {
        setSeciliBeceri(initialBeceri);
      }
      if (initialNitelik !== undefined) {
        setSeciliNitelik(initialNitelik);
      }
      if (autoRoll) {
        const timer = setTimeout(() => {
          handle4dFAt();
        }, 180);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialBeceri, initialNitelik, autoRoll]);

  if (!isOpen) return null;

  const haneInfo = HANELER[karakter.hane] || HANELER.Stallhart;
  const nitelikDegeri =
    seciliNitelik !== 'Yok' ? karakter.nitelikler?.[seciliNitelik] || 0 : 0;
  const beceriDegeri =
    (seciliBeceri in YAKLASIMLAR)
      ? (karakter.yaklasimlar?.[seciliBeceri as YaklasimAdi] ?? 0)
      : seciliBeceri !== 'Yok'
      ? (karakter.beceriler?.[seciliBeceri as keyof Beceriler] ?? 0)
      : 0;

  // Görünüşler Listesi (Fate Aspects)
  const gorunusSecenekleri = [
    { anahtar: 'anaKavram', baslik: 'Ana Kavram', metin: karakter.gorunumler.anaKavram },
    { anahtar: 'dert', baslik: 'Dert (Trouble)', metin: karakter.gorunumler.dert },
    { anahtar: 'gecmis', baslik: 'Geçmiş', metin: karakter.gorunumler.gecmis },
    { anahtar: 'catisma', baslik: 'Çatışma', metin: karakter.gorunumler.catisma },
    { anahtar: 'bag', baslik: 'Bağ', metin: karakter.gorunumler.bag },
  ];

  const secilenGorunusMetni =
    gorunusSecenekleri.find((g) => g.anahtar === seciliGorunusTuru)?.metin ||
    karakter.gorunumler.anaKavram;

  // Aktif Durum Efektleri ve Zar Modifikatörü
  const aktifDurumEfektleri = parseStatusEffects(karakter.durumlar || []);
  const durumZarBonusu = calculateStatusDiceModifier(karakter.durumlar || []);

  const handle4dFAt = () => {
    const zarlar = zarAt4dF();
    setZarlar3D(zarlar);
    setYuvarlaniyor(true);
    setSonucGosterilsin(false);
    sound.playDiceRoll();

    const zarToplami = zarlar.reduce((a, b) => a + b, 0);
    const toplam = zarToplami + beceriDegeri + nitelikDegeri + ekstraBonus + durumZarBonusu;
    const merdiven = merdivenDerecesiBul(toplam);

    const durumAciklama = durumZarBonusu !== 0
      ? ` ${durumZarBonusu > 0 ? `+ Durum (+${durumZarBonusu})` : `- Durum (${durumZarBonusu})`}`
      : '';

    const yeniSonuc: ZarSonucu = {
      id: `zar_${Date.now()}`,
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      atan: karakter.ad,
      tur: '4dF',
      zarlar,
      zarToplami,
      nitelikAdi: seciliNitelik !== 'Yok' ? seciliNitelik : undefined,
      nitelikDegeri,
      beceriAdi: seciliBeceri !== 'Yok' ? seciliBeceri : undefined,
      beceriDegeri,
      muhurBonusu: ekstraBonus,
      toplam,
      merdivenDerecesi: merdiven,
      aciklama: `Zar Sonucu (${zarToplami >= 0 ? `+${zarToplami}` : zarToplami}) + Beceri (+${beceriDegeri} ${seciliBeceri})${nitelikDegeri > 0 ? ` + Nitelik (+${nitelikDegeri})` : ''}${durumAciklama} = Nihai Sonuç: ${toplam >= 0 ? `+${toplam}` : toplam}`,
    };

    setSonZar(yeniSonuc);

    setTimeout(() => {
      setYuvarlaniyor(false);
      setSonucGosterilsin(true);
      onZarKaydet(yeniSonuc);

      // Çevrimiçi masadaki arkadaşlara zarı yayınla
      multiplayer.broadcast('zar', {
        atan: karakter.ad,
        beceri: seciliBeceri !== 'Yok' ? seciliBeceri : seciliNitelik !== 'Yok' ? seciliNitelik : '4dF Zar Kontrolü',
        zarlar,
        toplam,
        basariSeviyesi: merdiven,
        aciklama: yeniSonuc.aciklama,
      });

      // Kritik Başarı (+4) veya Felaket (-3 veya -4) Sinematikleri
      if (toplam >= 4 || zarToplami === 4) {
        setCriticalType('critical_success');
        setCriticalScore(toplam);
      } else if (toplam <= -3 || zarToplami === -4) {
        setCriticalType('catastrophe');
        setCriticalScore(toplam);
      }
    }, 1250);
  };

  const handleCepheZariAt = () => {
    sound.playBladeClash();
    const sonuc = cepheZariAt();
    setCepheSonucu(sonuc);
  };

  // Mühür Harca: Görünüş Çağırarak (Invoke Aspect) +2 Ekle
  const handleMuhurArti2 = () => {
    if (karakter.sayaclar.muhur <= 0) return;
    if (onMuhurHarca) onMuhurHarca(1);
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });

    if (sonZar) {
      const yeniToplam = sonZar.toplam + 2;
      const yeniSonuc: ZarSonucu = {
        ...sonZar,
        muhurBonusu: sonZar.muhurBonusu + 2,
        toplam: yeniToplam,
        merdivenDerecesi: merdivenDerecesiBul(yeniToplam),
        muhurKullanildi: true,
        aciklama: `${sonZar.aciklama} [Görünüş Çağrıldı: "${secilenGorunusMetni}" (+2 Mühür Bonusu)]`,
      };
      setSonZar(yeniSonuc);
      onZarKaydet(yeniSonuc);
    }
  };

  // Mühür Harca: Görünüş Çağırarak Zarları Yeniden At (Reroll)
  const handleMuhurYenidenAt = () => {
    if (karakter.sayaclar.muhur <= 0) return;
    if (onMuhurHarca) onMuhurHarca(1);
    sound.playSealStamp();
    handle4dFAt();
  };

  // Dert Zorlaması (Compel): +1 Mühür Kazan
  const handleDertKabulEt = () => {
    sound.playSealStamp();
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 } });
    if (onMuhurKazan) onMuhurKazan(1);

    const compelKaydi: ZarSonucu = {
      id: `compel_${Date.now()}`,
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      atan: karakter.ad,
      tur: '4dF',
      zarlar: [0, 0, 0, 0],
      zarToplami: 0,
      beceriDegeri: 0,
      nitelikDegeri: 0,
      muhurBonusu: 1,
      toplam: 0,
      merdivenDerecesi: 'Dert Zorlaması (Compel)',
      muhurKullanildi: false,
      aciklama: `⚠️ [Dert Zorlaması Kabul Edildi] "${karakter.gorunumler.dert}" aleyhe çalıştı ➔ +1 Mühür Puanı Kazanıldı!`,
    };
    onZarKaydet(compelKaydi);
    setCompelModalAcik(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl parchment-sheet rounded-xl p-5 sm:p-7 border-2 border-[#68523b] shadow-2xl text-[#f3ede3] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a39483] hover:text-white p-1 rounded hover:bg-[#34281e]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#4e3d2c] pb-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border shadow"
            style={{
              backgroundColor: haneInfo.ikincilRenk,
              borderColor: haneInfo.renk,
              color: haneInfo.renk,
            }}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-[#f6efe6]">
                4dF Kader Zarı &amp; Fate Mührü
              </h2>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-800">
                {karakter.sayaclar.muhur} Mühür
              </span>
            </div>
            <p className="text-xs text-[#b8ab9a] italic">
              {karakter.ad} ({karakter.hane}) • Beceri toplamı ve Görünüş Çağırma (Invoke)
            </p>
          </div>
        </div>

        {/* Beceri ve Nitelik Seçicileri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Beceri */}
          <div className="bg-[#171c16] p-2.5 rounded-lg border-2 border-emerald-800/80 shadow">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase font-heading font-bold text-emerald-400">
                1. Beceri Seçimi *
              </label>
              <span className="text-[10px] text-emerald-300 font-mono font-bold">
                +{beceriDegeri} Puan
              </span>
            </div>
            <select
              value={seciliBeceri}
              onChange={(e) => setSeciliBeceri(e.target.value as any)}
              className="w-full bg-[#1e271e] border border-emerald-700/80 rounded px-2.5 py-1.5 text-xs text-[#dcfce7] font-semibold focus:outline-none"
            >
              <optgroup label="Ortak Lisan · 14 Yaklaşım (SRD)">
                {(Object.keys(YAKLASIMLAR) as YaklasimAdi[]).map((yAd) => {
                  const val = karakter.yaklasimlar?.[yAd] ?? 0;
                  return (
                    <option key={yAd} value={yAd}>
                      {yAd} ({val >= 0 ? `+${val}` : val}) • {YAKLASIMLAR[yAd].fateKarsiligi}
                    </option>
                  );
                })}
              </optgroup>
              <optgroup label="Klasik Beceriler">
                <option value="Yok">Beceri Seçme (+0)</option>
                <option value="Fight">Fight (Dövüş) (+{karakter.beceriler?.Fight ?? 0})</option>
                <option value="Shoot">Shoot (Atış) (+{karakter.beceriler?.Shoot ?? 0})</option>
                <option value="Stealth">Stealth (Gizlilik) (+{karakter.beceriler?.Stealth ?? 0})</option>
                <option value="Investigate">Investigate (Araştırma) (+{karakter.beceriler?.Investigate ?? 0})</option>
                <option value="Lore">Lore (Kadim Bilgi) (+{karakter.beceriler?.Lore ?? 0})</option>
                <option value="ProvokeManipulate">Provoke (Kışkırtma) (+{karakter.beceriler?.ProvokeManipulate ?? 0})</option>
              </optgroup>
            </select>
          </div>

          {/* Nitelik */}
          <div className="bg-[#1e1711] p-2.5 rounded-lg border-2 border-amber-900/60 shadow">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase font-heading font-bold text-amber-400">
                2. Nitelik Ekle (Opsiyonel)
              </label>
              <span className="text-[10px] text-amber-300 font-mono font-bold">
                +{nitelikDegeri} Puan
              </span>
            </div>
            <select
              value={seciliNitelik}
              onChange={(e) => setSeciliNitelik(e.target.value as any)}
              className="w-full bg-[#271d15] border border-amber-800/60 rounded px-2.5 py-1.5 text-xs text-[#fef3c7] font-semibold focus:outline-none"
            >
              <option value="Yok">Nitelik Katma (+0)</option>
              <option value="STR">STR (Güç) (+{karakter.nitelikler.STR})</option>
              <option value="DEX">DEX (Çeviklik) (+{karakter.nitelikler.DEX})</option>
              <option value="CON">CON (Dayanıklılık) (+{karakter.nitelikler.CON})</option>
              <option value="INT">INT (Zeka) (+{karakter.nitelikler.INT})</option>
              <option value="WIS">WIS (Bilgelik) (+{karakter.nitelikler.WIS})</option>
              <option value="CHA">CHA (Karizma) (+{karakter.nitelikler.CHA})</option>
            </select>
          </div>
        </div>

        {/* Aktif Durum Efektleri Çubuğu */}
        {aktifDurumEfektleri.length > 0 && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#17110c] border border-amber-900/60 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-heading font-black text-amber-300 flex items-center gap-1">
                <span>⚡ Aktif Durumlar:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {aktifDurumEfektleri.map((efekt) => (
                  <span
                    key={efekt.id}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${efekt.sinif}`}
                    title={efekt.aciklama}
                  >
                    <span>{efekt.ikon}</span>
                    <span>{efekt.ad}</span>
                    {efekt.zarBonusu !== 0 && (
                      <span className="font-mono text-[9px]">
                        ({efekt.zarBonusu > 0 ? `+${efekt.zarBonusu}` : efekt.zarBonusu} Zar)
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded font-mono font-black text-xs self-start sm:self-auto border ${
              durumZarBonusu > 0
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                : durumZarBonusu < 0
                ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                : 'bg-stone-900 border-stone-700 text-stone-300'
            }`}>
              Zar Modu: {durumZarBonusu >= 0 ? `+${durumZarBonusu}` : durumZarBonusu}
            </div>
          </div>
        )}

        {/* 3D Fate Zar Sahnesi */}
        <div className="bg-[#100d0a] rounded-xl border border-[#443322] p-2 mb-4 shadow-inner relative flex flex-col items-center">
          <div className="w-full h-40">
            <ThreeDiceCanvas zarlar={zarlar3D} isRolling={yuvarlaniyor} />
          </div>

          {/* Zar Atıldıktan Sonra Çözümleme */}
          {sonZar && sonucGosterilsin ? (
            <div className="w-full space-y-2 mt-2 px-2 pb-1 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 font-mono text-sm text-[#e8ded0]">
                <span>4dF Zarları:</span>
                <span className="font-bold text-amber-300">
                  [{sonZar.zarlar.map((z: number) => (z > 0 ? `+` : z < 0 ? `-` : `0`)).join(' ')}]
                </span>
                <span className="text-[#a49582] text-xs">
                  (Toplam: {sonZar.zarToplami >= 0 ? `+${sonZar.zarToplami}` : sonZar.zarToplami})
                </span>
              </div>

              {/* Nihai Sonuç Kutusu */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#24170d] via-[#382414] to-[#24170d] border-2 border-amber-500/80 shadow-2xl">
                <div className="text-[10px] font-heading font-black text-amber-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>NİHAİ SONUÇ</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>

                <div className="flex items-center justify-center gap-4 py-1">
                  <div className="text-4xl font-mono font-black text-amber-200 drop-shadow-lg">
                    {sonZar.toplam >= 0 ? `+${sonZar.toplam}` : sonZar.toplam}
                  </div>

                  <div className="text-left border-l-2 border-[#664b30] pl-4">
                    <span className="text-sm font-heading font-bold text-[#fff2dd] block">
                      {sonZar.merdivenDerecesi}
                    </span>
                    <span className="text-[11px] text-[#baa896] block font-serif italic mt-0.5">
                      Zar ({sonZar.zarToplami >= 0 ? `+${sonZar.zarToplami}` : sonZar.zarToplami}) + Beceri (+{sonZar.beceriDegeri}) {durumZarBonusu !== 0 ? `+ Durum (${durumZarBonusu > 0 ? `+${durumZarBonusu}` : durumZarBonusu})` : ''} {sonZar.muhurBonusu > 0 ? `+ Mühür (+${sonZar.muhurBonusu})` : ''} = <strong>Nihai: {sonZar.toplam >= 0 ? `+${sonZar.toplam}` : sonZar.toplam}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#8e7e6d] text-xs italic py-2">
              Zarları atmak ve becerinizle toplamak için aşağıdaki mühürlü düğmeye basın.
            </div>
          )}
        </div>

        {/* FATE GÖRÜNÜŞ ÇAĞIRMA (INVOKE) & MÜHÜR PANELİ */}
        {sonZar && sonucGosterilsin && (
          <div className="mb-4 p-3 rounded-xl bg-[#19130e] border border-amber-900/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-heading font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Görünüş Çağır (Invoke Aspect)</span>
              </span>
              <span className="text-[10px] text-[#a49684] font-mono">
                1 Mühür Maliyeti
              </span>
            </div>

            {/* Hangi Görünüşü Çağıracaksın? */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-heading text-[#8f7e6e] block">
                Zarda Kullanılacak Görünüşün:
              </label>
              <select
                value={seciliGorunusTuru}
                onChange={(e) => setSeciliGorunusTuru(e.target.value)}
                className="w-full bg-[#201812] border border-[#523d2b] rounded px-2.5 py-1.5 text-xs text-[#f5ecd8] font-serif focus:outline-none"
              >
                {gorunusSecenekleri.map((g) => (
                  <option key={g.anahtar} value={g.anahtar}>
                    {g.baslik}: &quot;{g.metin}&quot;
                  </option>
                ))}
              </select>
            </div>

            {/* Mühür Aksiyon Butonları */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleMuhurArti2}
                disabled={karakter.sayaclar.muhur <= 0}
                className="py-2 px-3 text-xs font-heading font-bold rounded wax-seal text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 shadow flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>+2 Ekle (1 Mühür)</span>
              </button>

              <button
                onClick={handleMuhurYenidenAt}
                disabled={karakter.sayaclar.muhur <= 0}
                className="py-2 px-3 text-xs font-heading font-bold rounded bg-[#2c1e15] hover:bg-[#3f2a1c] text-[#f2e6d6] border border-[#644930] hover:border-amber-400 disabled:opacity-40 shadow flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tekrar At (1 Mühür)</span>
              </button>
            </div>
          </div>
        )}

        {/* Eylem Düğmeleri: Zar At & Dert Zorlaması */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            onClick={handle4dFAt}
            disabled={yuvarlaniyor}
            className="flex-1 py-3 px-4 font-heading font-bold rounded wax-seal text-white hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{yuvarlaniyor ? 'Zarlar Sallanıyor...' : `Zar At & ${seciliBeceri !== 'Yok' ? seciliBeceri : 'Beceri'} ile Topla`}</span>
          </button>

          <button
            onClick={() => setCompelModalAcik(true)}
            className="px-3 py-3 text-xs font-heading font-bold rounded bg-[#3b1919] hover:bg-[#522020] text-red-200 border border-red-700 shadow flex items-center gap-1.5"
            title="Dert'i aleyhine kullanarak +1 Mühür kazan"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Dert Zorla (+1 Mühür)</span>
          </button>
        </div>

        {/* Cephe Zarı */}
        <div className="border-t border-[#3e3022] pt-3 flex items-center justify-between">
          <div className="text-xs text-[#a99c8b]">
            <span className="font-semibold text-red-300">Birlik Savaşı (Rion / Garion):</span>
            {cepheSonucu ? (
              <span className="ml-2 text-amber-300 font-mono font-bold">
                {cepheSonucu.sonuc} &rarr; {cepheSonucu.aciklama}
              </span>
            ) : (
              <span className="ml-2 italic">Orduların kitlesel çatışması için zar</span>
            )}
          </div>
          <button
            onClick={handleCepheZariAt}
            className="px-2.5 py-1 text-xs rounded bg-[#4a1c1c] text-[#ffd6d6] hover:bg-[#682424] font-semibold border border-red-800"
          >
            Cephe Zarı At
          </button>
        </div>
      </div>

      {/* DERT ZORLAMASI (COMPEL) MODALI */}
      {compelModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-red-800 max-w-md w-full shadow-2xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-red-950 pb-2">
              <div className="flex items-center gap-2 text-red-400 font-heading font-black text-sm uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Kaderin Cilvesi: Dert Zorlaması (Compel)</span>
              </div>
              <button
                onClick={() => setCompelModalAcik(false)}
                className="text-stone-400 hover:text-white"
              >
                Kapat
              </button>
            </div>

            <p className="text-[#e2d5c3] font-serif leading-relaxed">
              Fate kurallarına göre kader, karakterinin en zayıf noktasını sınamak üzere sahneye beklenmedik bir engel çıkarıyor.
            </p>

            <div className="p-3 rounded-lg bg-[#241313] border border-red-800/80 space-y-1">
              <span className="text-[10px] font-bold text-red-400 uppercase block">
                Tetiklenen Dert (Trouble Aspect):
              </span>
              <span className="font-serif italic text-xs text-[#fae1e1] block">
                &quot;{karakter.gorunumler.dert}&quot;
              </span>
              <p className="text-[10px] text-[#b89b9b] mt-1">
                Örn: Alacaklılar kapıya dayandı, zaafın yüzünden dikkatin dağıldı veya eski bir düşman pusuda bekliyor!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#3e2e20]">
              <button
                onClick={handleDertKabulEt}
                className="p-2.5 rounded wax-seal text-white font-heading font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Kabul Et (+1 Mühür)</span>
              </button>

              <button
                onClick={() => setCompelModalAcik(false)}
                className="p-2.5 rounded bg-[#201812] hover:bg-[#33251c] text-stone-300 border border-[#443322] font-heading font-semibold text-xs"
              >
                Reddet / Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kritik Başarı & Felaket Tam Ekran Sinematiği */}
      <CriticalResultOverlay
        type={criticalType}
        score={criticalScore}
        onDismiss={() => setCriticalType(null)}
      />
    </div>
  );
};
