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
} from '../rules';
import { sound } from '../utils/audio';
import { ThreeDiceCanvas } from './ThreeDiceCanvas';
import { Sparkles, RefreshCw, X, Award, Shield, Calculator, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  karakter: Karakter;
  initialNitelik?: keyof Nitelikler | 'Yok';
  initialBeceri?: keyof Beceriler | 'Yok';
  onZarKaydet: (sonuc: ZarSonucu) => void;
  onMuhurHarca?: (miktar: number) => void;
}

export const DiceModal: React.FC<DiceModalProps> = ({
  isOpen,
  onClose,
  karakter,
  initialNitelik = 'Yok',
  initialBeceri = 'Fight',
  onZarKaydet,
  onMuhurHarca,
}) => {
  const [seciliNitelik, setSeciliNitelik] = useState<keyof Nitelikler | 'Yok'>('Yok');
  const [seciliBeceri, setSeciliBeceri] = useState<keyof Beceriler | 'Yok'>('Fight');
  const [ekstraBonus, setEkstraBonus] = useState<number>(0);
  const [sonZar, setSonZar] = useState<ZarSonucu | null>(null);
  const [zarlar3D, setZarlar3D] = useState<number[]>([1, 0, -1, 1]);
  const [yuvarlaniyor, setYuvarlaniyor] = useState<boolean>(false);
  const [sonucGosterilsin, setSonucGosterilsin] = useState<boolean>(false);
  const [cepheSonucu, setCepheSonucu] = useState<any | null>(null);

  // Sync initial selections whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      if (initialBeceri !== undefined) {
        setSeciliBeceri(initialBeceri);
      }
      if (initialNitelik !== undefined) {
        setSeciliNitelik(initialNitelik);
      }
    }
  }, [isOpen, initialBeceri, initialNitelik]);

  if (!isOpen) return null;

  const haneInfo = HANELER[karakter.hane] || HANELER.Stallhart;
  const nitelikDegeri =
    seciliNitelik !== 'Yok' ? karakter.nitelikler[seciliNitelik] || 0 : 0;
  const beceriDegeri =
    seciliBeceri !== 'Yok' ? karakter.beceriler[seciliBeceri] || 0 : 0;

  const handle4dFAt = () => {
    const zarlar = zarAt4dF();
    setZarlar3D(zarlar);
    setYuvarlaniyor(true);
    setSonucGosterilsin(false);
    sound.playDiceRoll();

    const zarToplami = zarlar.reduce((a, b) => a + b, 0);
    // Beceriden gelen sayı ile zar sonucu toplanarak nihai sonuç
    const toplam = zarToplami + beceriDegeri + nitelikDegeri + ekstraBonus;
    const merdiven = merdivenDerecesiBul(toplam);

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
      aciklama: `Zar Sonucu (${zarToplami >= 0 ? `+${zarToplami}` : zarToplami}) + Beceri (+${beceriDegeri} ${seciliBeceri}) = Nihai Sonuç: ${toplam >= 0 ? `+${toplam}` : toplam}`,
    };

    setSonZar(yeniSonuc);

    // 3D zar animasyonunun ardından sonucu altta belirgin şekilde göster
    setTimeout(() => {
      setYuvarlaniyor(false);
      setSonucGosterilsin(true);
      onZarKaydet(yeniSonuc);

      if (toplam >= 5) {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      }
    }, 1250);
  };

  const handleCepheZariAt = () => {
    sound.playBladeClash();
    const sonuc = cepheZariAt();
    setCepheSonucu(sonuc);
  };

  // Mühür Harca: +2 Ekle
  const handleMuhurArti2 = () => {
    if (karakter.sayaclar.muhur <= 0) return;
    if (onMuhurHarca) onMuhurHarca(1);
    sound.playSealStamp();

    if (sonZar) {
      const yeniToplam = sonZar.toplam + 2;
      const yeniSonuc: ZarSonucu = {
        ...sonZar,
        muhurBonusu: sonZar.muhurBonusu + 2,
        toplam: yeniToplam,
        merdivenDerecesi: merdivenDerecesiBul(yeniToplam),
        muhurKullanildi: true,
        aciklama: `${sonZar.aciklama} [+2 Mühür Bonusu!]`,
      };
      setSonZar(yeniSonuc);
      onZarKaydet(yeniSonuc);
    }
  };

  // Mühür Harca: Zarları Yeniden At
  const handleMuhurYenidenAt = () => {
    if (karakter.sayaclar.muhur <= 0) return;
    if (onMuhurHarca) onMuhurHarca(1);
    sound.playSealStamp();
    handle4dFAt();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl parchment-sheet rounded-xl p-5 sm:p-7 border-2 border-[#68523b] shadow-2xl text-[#f3ede3]">
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
            <h2 className="font-heading font-bold text-xl text-[#f6efe6]">
              4dF Kader Zarı &amp; Beceri Toplamı
            </h2>
            <p className="text-xs text-[#b8ab9a] italic">
              {karakter.ad} ({karakter.hane}) • Beceriden gelen sayı ile zar toplanarak nihai sonuç hesaplanır
            </p>
          </div>
        </div>

        {/* Beceri ve Nitelik Seçicileri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Beceri (Vurgulu) */}
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
              <option value="Yok">Beceri Seçme (+0)</option>
              <option value="Fight">Fight (Dövüş) (+{karakter.beceriler.Fight})</option>
              <option value="Shoot">Shoot (Atış) (+{karakter.beceriler.Shoot})</option>
              <option value="Stealth">Stealth (Gizlilik) (+{karakter.beceriler.Stealth})</option>
              <option value="Investigate">Investigate (Araştırma) (+{karakter.beceriler.Investigate})</option>
              <option value="Lore">Lore (Kadim Bilgi) (+{karakter.beceriler.Lore})</option>
              <option value="ProvokeManipulate">Provoke/Manipulate (Kışkırtma) (+{karakter.beceriler.ProvokeManipulate})</option>
            </select>
          </div>

          {/* Nitelik (İsteğe Bağlı Ek Puan) */}
          <div className="bg-[#171310] p-2.5 rounded-lg border border-[#443322]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase font-heading text-[#c5b49f]">
                2. Nitelik Ekle (Opsiyonel)
              </label>
              <span className="text-[10px] text-cyan-300 font-mono">
                +{nitelikDegeri} Puan
              </span>
            </div>
            <select
              value={seciliNitelik}
              onChange={(e) => setSeciliNitelik(e.target.value as any)}
              className="w-full bg-[#241d17] border border-[#53402e] rounded px-2.5 py-1.5 text-xs text-[#f5ebd8] font-mono focus:outline-none"
            >
              <option value="Yok">Nitelik Seçme (+0)</option>
              <option value="STR">STR (Güç) (+{karakter.nitelikler.STR})</option>
              <option value="DEX">DEX (Çeviklik) (+{karakter.nitelikler.DEX})</option>
              <option value="CON">CON (Bünye) (+{karakter.nitelikler.CON})</option>
              <option value="INT">INT (Zeka) (+{karakter.nitelikler.INT})</option>
              <option value="WIS">WIS (Sezgi/Bilgelik) (+{karakter.nitelikler.WIS})</option>
              <option value="CHA">CHA (Karizma) (+{karakter.nitelikler.CHA})</option>
            </select>
          </div>
        </div>

        {/* 3D React Three Fiber Zar Çanağı */}
        <div className="mb-4">
          <ThreeDiceCanvas
            zarlar={zarlar3D}
            isRolling={yuvarlaniyor}
            haneRenk={haneInfo.renk}
          />
        </div>

        {/* Beceriden Gelen Sayı İle Zar Sonucu Toplanarak Altta Nihai Sonuç */}
        <div className="bg-[#110e0c] p-4 rounded-xl border-2 border-[#54412f] mb-4 text-center shadow-inner">
          {yuvarlaniyor ? (
            <div className="flex items-center justify-center gap-2 text-xs font-heading font-bold text-amber-300 animate-pulse py-4">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
              <span>4dF Zarları Çanakta Yuvarlanıyor &amp; Beceri Hesaplanıyor...</span>
            </div>
          ) : sonucGosterilsin && sonZar ? (
            <div className="animate-in fade-in zoom-in-95 duration-200 space-y-3">
              {/* Formül & Toplama Adımları */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono">
                {/* 1. Zar Sonucu */}
                <div className="flex items-center gap-1.5 bg-[#1f1711] px-3 py-1.5 rounded-lg border border-[#4d3a28]">
                  <span className="text-[#a49685] text-xs">Zar Sonucu (4dF):</span>
                  <span
                    className={`font-black text-sm ${
                      sonZar.zarToplami > 0
                        ? 'text-amber-300'
                        : sonZar.zarToplami < 0
                        ? 'text-red-400'
                        : 'text-stone-300'
                    }`}
                  >
                    {sonZar.zarToplami >= 0 ? `+${sonZar.zarToplami}` : sonZar.zarToplami}
                  </span>
                </div>

                <span className="text-amber-400 font-bold text-base">+</span>

                {/* 2. Beceriden Gelen Sayı */}
                <div className="flex items-center gap-1.5 bg-[#152217] px-3 py-1.5 rounded-lg border border-emerald-700/80">
                  <span className="text-emerald-300 text-xs">
                    Beceriden Gelen ({sonZar.beceriAdi || 'Beceri'}):
                  </span>
                  <span className="font-black text-sm text-emerald-400">
                    +{sonZar.beceriDegeri}
                  </span>
                </div>

                {/* Varsa Nitelik */}
                {sonZar.nitelikDegeri > 0 && (
                  <>
                    <span className="text-amber-400 font-bold text-base">+</span>
                    <div className="flex items-center gap-1.5 bg-[#131b26] px-3 py-1.5 rounded-lg border border-cyan-800/80">
                      <span className="text-cyan-300 text-xs">Nitelik ({sonZar.nitelikAdi}):</span>
                      <span className="font-black text-sm text-cyan-400">
                        +{sonZar.nitelikDegeri}
                      </span>
                    </div>
                  </>
                )}

                {/* Varsa Mühür */}
                {sonZar.muhurBonusu > 0 && (
                  <>
                    <span className="text-amber-400 font-bold text-base">+</span>
                    <div className="flex items-center gap-1.5 bg-[#261c10] px-3 py-1.5 rounded-lg border border-amber-600/80">
                      <span className="text-amber-300 text-xs">Mühür:</span>
                      <span className="font-black text-sm text-amber-400">
                        +{sonZar.muhurBonusu}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* ALTTAYAZILAN BÜYÜK NİHAİ SONUÇ KUTUSU */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#24170d] via-[#382414] to-[#24170d] border-2 border-amber-500/80 shadow-2xl">
                <div className="text-[11px] font-heading font-black text-amber-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>NİHAİ SONUÇ</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>

                <div className="flex items-center justify-center gap-4 py-1">
                  <div className="text-4xl sm:text-5xl font-mono font-black text-amber-200 tracking-tight drop-shadow-lg">
                    {sonZar.toplam >= 0 ? `+${sonZar.toplam}` : sonZar.toplam}
                  </div>

                  <div className="text-left border-l-2 border-[#664b30] pl-4">
                    <span className="text-sm font-heading font-bold text-[#fff2dd] block">
                      {sonZar.merdivenDerecesi}
                    </span>
                    <span className="text-xs text-[#baa896] block font-serif italic mt-0.5">
                      Zar Sonucu ({sonZar.zarToplami >= 0 ? `+${sonZar.zarToplami}` : sonZar.zarToplami}) + Beceri (+{sonZar.beceriDegeri}) {sonZar.nitelikDegeri > 0 ? `+ Nitelik (+${sonZar.nitelikDegeri})` : ''} = <strong>Nihai: {sonZar.toplam >= 0 ? `+${sonZar.toplam}` : sonZar.toplam}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#8e7e6d] text-xs italic py-2">
              Seçili beceri (+{beceriDegeri} {seciliBeceri !== 'Yok' ? seciliBeceri : ''}) ile zar sonucunu toplamak için aşağıdaki düğmeye basın.
            </div>
          )}
        </div>

        {/* Eylem Düğmeleri: Zar At & Mühür Harca */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            onClick={handle4dFAt}
            disabled={yuvarlaniyor}
            className="flex-1 py-3 px-4 font-heading font-bold rounded wax-seal text-white hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{yuvarlaniyor ? 'Zarlar Sallanıyor...' : `Zar At & ${seciliBeceri !== 'Yok' ? seciliBeceri : 'Beceri'} ile Topla`}</span>
          </button>

          {sonZar && sonucGosterilsin && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleMuhurArti2}
                disabled={karakter.sayaclar.muhur <= 0}
                className="px-3 py-2 text-xs font-semibold rounded bg-[#352517] hover:bg-[#4d3621] text-amber-200 border border-[#785938] disabled:opacity-40 flex items-center gap-1 shadow"
                title="1 Mühür harcayarak sonuca +2 ekle"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>+2 Mühür Ekle ({karakter.sayaclar.muhur})</span>
              </button>

              <button
                onClick={handleMuhurYenidenAt}
                disabled={karakter.sayaclar.muhur <= 0}
                className="px-3 py-2 text-xs font-semibold rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-[#f0e4d3] border border-[#5f462e] disabled:opacity-40 flex items-center gap-1 shadow"
                title="1 Mühür harcayarak zarları baştan at"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tekrar At</span>
              </button>
            </div>
          )}
        </div>

        {/* Cephe Zarı (Birlik Savaşları) */}
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
    </div>
  );
};
