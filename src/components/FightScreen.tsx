import React, { useState } from 'react';
import {
  Karakter,
  saldiriHesapla,
  zarAt4dF,
  cepheZariAt,
  merdivenDerecesiBul,
  NPC,
} from '../rules';
import { sound } from '../utils/audio';
import {
  Skull,
  Shield,
  Swords,
  ChevronRight,
  Flame,
  Plus,
  Minus,
  AlertTriangle,
  Award,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Combatant {
  id: string;
  ad: string;
  tur: 'Oyuncu' | 'Düşman' | 'Müttefik';
  fotoUrl?: string;
  fightBonus: number;
  savunmaBonus: number;
  zirh: number;
  yaraKutulari: number;
  alinanYara: number;
  yorgunluk: number;
  durumlar: string[];
  tehdit?: string;
  ozelDavranis?: string;
}

interface FightScreenProps {
  karakterler: Karakter[];
  aktifKarakter: Karakter;
  npcler: NPC[];
  rol: 'Anlatıcı' | 'Oyuncu';
}

export const FightScreen: React.FC<FightScreenProps> = ({
  karakterler,
  aktifKarakter,
  npcler,
  rol,
}) => {
  // Savaşçılar listesi
  const [katilimcilar, setKatilimcilar] = useState<Combatant[]>([
    {
      id: aktifKarakter.id,
      ad: aktifKarakter.ad,
      tur: 'Oyuncu',
      fotoUrl: aktifKarakter.fotoUrl,
      fightBonus: aktifKarakter.beceriler.Fight,
      savunmaBonus: aktifKarakter.nitelikler.DEX,
      zirh: 1,
      yaraKutulari: aktifKarakter.sayaclar.yaraKutulari,
      alinanYara: aktifKarakter.sayaclar.alınanYaraKutulari,
      yorgunluk: aktifKarakter.sayaclar.yorgunluk,
      durumlar: ['Teyakkuzda'],
    },
    {
      id: 'mob_wolf',
      ad: 'Lekeli Yaban Kurdu',
      tur: 'Düşman',
      fightBonus: 2,
      savunmaBonus: 2,
      zirh: 0,
      yaraKutulari: 3,
      alinanYara: 0,
      yorgunluk: 0,
      durumlar: ['Kuduz', 'Aç'],
      tehdit: 'Orta',
      ozelDavranis: 'Yaralı düşmanlara saldırırken +2 Vuruş kazanır.',
    },
    {
      id: 'mob_guard',
      ad: 'Galetsha Borç Muhafızı',
      tur: 'Düşman',
      fightBonus: 3,
      savunmaBonus: 1,
      zirh: 2,
      yaraKutulari: 4,
      alinanYara: 1,
      yorgunluk: 1,
      durumlar: ['Zırhlı'],
      tehdit: 'Yüksek',
      ozelDavranis: 'Kalkan darbesi ile sersemletme girişiminde bulunur.',
    },
  ]);

  const [aktifSiraIndex, setAktifSiraIndex] = useState<number>(0);
  const [saldiranId, setSaldiranId] = useState<string>(katilimcilar[0]?.id || '');
  const [hedefId, setHedefId] = useState<string>(katilimcilar[1]?.id || '');
  const [savasGunlugu, setSavasGunlugu] = useState<string[]>([
    'Savaş başladı! Çelik kınından sıyrıldı.',
  ]);

  const [sonSaldiriDetay, setSonSaldiriDetay] = useState<any | null>(null);
  const [cepheSonuc, setCepheSonuc] = useState<any | null>(null);

  // Turu İlerlet
  const handleSonrakiTur = () => {
    sound.playSealStamp();
    setAktifSiraIndex((prev) => (prev + 1) % katilimcilar.length);
  };

  // Saldırı Akışı: Saldırı Zarı (4dF + Fight) vs Savunma Zarı (4dF + Savunma)
  const handleSaldiriGerceklestir = () => {
    const saldiran = katilimcilar.find((k) => k.id === saldiranId);
    const hedef = katilimcilar.find((k) => k.id === hedefId);
    if (!saldiran || !hedef) return;

    sound.playBladeClash();

    // 4dF zarları
    const saldiriZarlari = zarAt4dF();
    const saldiriZarToplam = saldiriZarlari.reduce((a, b) => a + b, 0);
    const saldiriToplam = saldiriZarToplam + saldiran.fightBonus;

    const savunmaZarlari = zarAt4dF();
    const savunmaZarToplam = savunmaZarlari.reduce((a, b) => a + b, 0);
    const savunmaToplam = savunmaZarToplam + hedef.savunmaBonus;

    // Kural motoru hesaplaması
    const hesap = saldiriHesapla(saldiriToplam, savunmaToplam, hedef.zirh);

    setSonSaldiriDetay({
      saldiran: saldiran.ad,
      hedef: hedef.ad,
      saldiriToplam,
      savunmaToplam,
      vurusFarki: hesap.vurusFarki,
      netHasar: hesap.netHasar,
      kademe: hesap.onerilenYaraKademesi,
      aciklama: hesap.aciklama,
    });

    const yeniLog = `[${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}] ${saldiran.ad} -> ${hedef.ad}: Saldırı (${saldiriToplam}) vs Savunma (${savunmaToplam}) | Fark: ${hesap.vurusFarki} | Hasar: ${hesap.netHasar} (${hesap.onerilenYaraKademesi})`;
    setSavasGunlugu((prev) => [yeniLog, ...prev.slice(0, 30)]);

    // Eğer hasar varsa hedefte yara kutusunu otomatik artırma öner
    if (hesap.netHasar > 0) {
      setKatilimcilar((prev) =>
        prev.map((k) =>
          k.id === hedef.id
            ? { ...k, alinanYara: Math.min(k.yaraKutulari, k.alinanYara + 1) }
            : k
        )
      );
    }
  };

  // Cephe Zarı (Birlik Savaşı: Rion vs Garion)
  const handleCepheZari = () => {
    sound.playBladeClash();
    const sonuc = cepheZariAt();
    setCepheSonuc(sonuc);
    setSavasGunlugu((prev) => [
      `[CEPHE SAVAŞI] ${sonuc.sonuc} -> ${sonuc.aciklama}`,
      ...prev,
    ]);
  };

  // Anlatıcı Hızlı Eylemleri
  const handleYaraDegistir = (id: string, artis: number) => {
    setKatilimcilar((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              alinanYara: Math.max(0, Math.min(k.yaraKutulari, k.alinanYara + artis)),
            }
          : k
      )
    );
  };

  const handleDurumEkle = (id: string) => {
    const durum = prompt('Eklenecek durum (Örn: Kanama, Sersemleme, Korku, Kör):');
    if (!durum) return;
    setKatilimcilar((prev) =>
      prev.map((k) => (k.id === id ? { ...k, durumlar: [...k.durumlar, durum] } : k))
    );
  };

  // NPC'yi Sahneye Ekleme
  const handleNpcSahneyeCagir = (npc: NPC) => {
    const yeni: Combatant = {
      id: `c_${npc.id}_${Date.now()}`,
      ad: npc.ad,
      tur: 'Düşman',
      fightBonus: npc.stats.fight,
      savunmaBonus: npc.stats.savunma,
      zirh: 1,
      yaraKutulari: npc.stats.yaraKutulari,
      alinanYara: 0,
      yorgunluk: 0,
      durumlar: ['Teyakkuzda'],
      tehdit: npc.tehdit,
      ozelDavranis: npc.anaKavram,
    };
    setKatilimcilar((prev) => [...prev, yeni]);
    setSavasGunlugu((prev) => [`${npc.ad} sahneye girdi!`, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Savaş Üst Başlığı & Cephe Zarı */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#4e3d2b] pb-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-red-200 flex items-center gap-2">
            <Swords className="w-6 h-6 text-red-500" />
            <span>Savaş &amp; Düello Meydanı</span>
          </h1>
          <p className="text-xs text-[#a49684]">
            Fate darbe mekaniği: Saldırı (4dF+Fight) &minus; Savunma (4dF+DEX) = Vuruş &minus; Zırh = Yara Kademesi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCepheZari}
            className="px-3 py-1.5 rounded bg-[#4e1d1d] hover:bg-[#682323] text-red-100 text-xs font-heading font-bold border border-red-700 flex items-center gap-1.5 shadow"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Cephe Zarı (Ordu)</span>
          </button>

          <button
            onClick={handleSonrakiTur}
            className="px-4 py-1.5 rounded wax-seal text-white text-xs font-heading font-bold hover:brightness-110 flex items-center gap-1.5 shadow"
          >
            <span>Sıradaki Tur</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cephe Zarı Sonuç Bildirimi */}
      {cepheSonuc && (
        <div className="bg-[#241313] border border-red-800/80 p-3 rounded-lg flex items-center justify-between text-xs text-red-200 shadow">
          <div>
            <span className="font-bold text-amber-300">
              Cephe Muharebesi Sonucu: {cepheSonuc.sonuc}
            </span>
            <span className="block text-[#d0beaf] mt-0.5">{cepheSonuc.aciklama}</span>
          </div>
          <button
            onClick={() => setCepheSonuc(null)}
            className="text-[#927f6e] hover:text-white text-xs"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Tur Sırası Şeridi (Initiative Order Strip) */}
      <div className="parchment-sheet p-3 rounded-lg border border-[#503d2b] shadow">
        <span className="text-[10px] font-heading font-bold text-[#b4a491] uppercase block mb-2">
          İnisiyatif &amp; Tur Sırası
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {katilimcilar.map((k, idx) => {
            const isTurn = idx === aktifSiraIndex;
            return (
              <div
                key={k.id}
                onClick={() => setAktifSiraIndex(idx)}
                className={`p-2 rounded-lg border flex items-center gap-2 min-w-[150px] cursor-pointer transition-all ${
                  isTurn
                    ? 'bg-red-950/70 border-red-500 shadow-md ring-1 ring-red-400 scale-105'
                    : 'bg-[#18130e] border-[#3e2e20] hover:border-[#634b35]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    k.tur === 'Oyuncu'
                      ? 'bg-blue-900 text-blue-200'
                      : 'bg-red-900 text-red-200'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#f1e6d4] truncate">
                    {k.ad}
                  </div>
                  <div className="text-[10px] text-[#938371]">
                    Yara: {k.alinanYara}/{k.yaraKutulari}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Sütunlu Muharebe Alanı: Sol (Saldırı & Vuruş Masası) | Sağ (Savaşçılar Kartları) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Saldırı Mekaniği ve Savaş Günlüğü (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Saldırı Yürütücü Kart */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#55402c] shadow-lg">
            <h2 className="font-heading font-bold text-sm uppercase text-amber-200 border-b border-[#3e2e20] pb-1.5 mb-3 flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-400" />
              <span>Saldırı &amp; Savunma Akışı</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                  Saldıran
                </label>
                <select
                  value={saldiranId}
                  onChange={(e) => setSaldiranId(e.target.value)}
                  className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2 py-1.5 text-xs text-[#f1e6d4] focus:outline-none"
                >
                  {katilimcilar.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.ad} (+{k.fightBonus} Fight)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                  Hedef (Savunan)
                </label>
                <select
                  value={hedefId}
                  onChange={(e) => setHedefId(e.target.value)}
                  className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2 py-1.5 text-xs text-[#f1e6d4] focus:outline-none"
                >
                  {katilimcilar.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.ad} (+{k.savunmaBonus} Sav / {k.zirh} Zırh)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaldiriGerceklestir}
              className="w-full py-2.5 px-4 font-heading font-bold rounded wax-seal text-white hover:brightness-110 active:scale-95 transition-all shadow flex items-center justify-center gap-2 text-xs"
            >
              <Swords className="w-4 h-4 text-amber-300" />
              <span>Darbe İndir (4dF Karşılaştırması)</span>
            </button>

            {/* Son Saldırı Çözümlemesi */}
            {sonSaldiriDetay && (
              <div className="mt-4 p-3 rounded bg-[#18120d] border border-[#543e2b] text-xs space-y-1">
                <div className="font-heading font-bold text-amber-300 flex items-center justify-between">
                  <span>
                    {sonSaldiriDetay.saldiran} &rarr; {sonSaldiriDetay.hedef}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sonSaldiriDetay.netHasar > 0
                        ? 'bg-red-900 text-red-100'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {sonSaldiriDetay.kademe}
                  </span>
                </div>
                <div className="text-[#a49684] text-[11px]">
                  Vuruş Farkı: {sonSaldiriDetay.vurusFarki} | Net Hasar:{' '}
                  {sonSaldiriDetay.netHasar}
                </div>
                <p className="italic text-[#d8cebe] text-[11px]">
                  &quot;{sonSaldiriDetay.aciklama}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Savaş Günlüğü (Combat Log) */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#55402c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-[#bcaaa0] border-b border-[#3e2e20] pb-1.5 mb-2">
              Savaş Günlüğü
            </h2>
            <div className="space-y-1 text-[11px] font-mono max-h-48 overflow-y-auto pr-1">
              {savasGunlugu.map((log, idx) => (
                <div key={idx} className="p-1 rounded bg-[#18130e] text-[#d4c8b8]">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ: Katılımcı ve Düşman Kartları (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-heading font-bold text-[#b4a491] uppercase">
              Muharip Birlikler ve Düşmanlar
            </span>
            <span className="text-[10px] text-[#867563]">
              Toplam: {katilimcilar.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {katilimcilar.map((k) => {
              const isDead = k.alinanYara >= k.yaraKutulari;
              return (
                <div
                  key={k.id}
                  className={`p-3 rounded-lg border transition-all relative ${
                    isDead
                      ? 'bg-black/60 border-red-950 opacity-60'
                      : k.tur === 'Oyuncu'
                      ? 'bg-[#181410] border-[#4d3a28]'
                      : 'bg-[#221313] border-red-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#f1e6d4]">
                        {k.ad}
                      </span>
                      {k.tehdit && (
                        <span className="text-[9px] px-1 py-0.2 bg-red-950 text-red-300 rounded border border-red-800">
                          {k.tehdit}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      +{k.fightBonus} Fight / {k.zirh} Zırh
                    </span>
                  </div>

                  {/* Yara Kutuları */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-[#8e7e6d]">Yara:</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: k.yaraKutulari }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center border ${
                            i < k.alinanYara
                              ? 'bg-red-800 border-red-600 text-white'
                              : 'bg-[#14100c] border-[#3e2e20] text-[#6b5847]'
                          }`}
                        >
                          {i < k.alinanYara ? 'X' : i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Durumlar */}
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    {k.durumlar.map((d, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-[#33251a] text-amber-200 border border-[#523d2b]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* GM Hızlı Butonları */}
                  <div className="border-t border-[#3b2b1d] pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleYaraDegistir(k.id, 1)}
                        className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-200 text-[10px] font-bold border border-red-800"
                        title="1 Yara Ver"
                      >
                        + Yara
                      </button>
                      <button
                        onClick={() => handleYaraDegistir(k.id, -1)}
                        className="px-2 py-0.5 rounded bg-[#2b2016] hover:bg-[#3d2d1f] text-[#cfc2b1] text-[10px] border border-[#503d2b]"
                        title="1 Yara Sil"
                      >
                        - Yara
                      </button>
                    </div>

                    <button
                      onClick={() => handleDurumEkle(k.id)}
                      className="text-[10px] text-amber-300 hover:underline"
                    >
                      + Durum
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sahneye NPC Ekleme Açılır Kartı */}
          <div className="bg-[#18130e] p-3 rounded-lg border border-[#403021] text-xs">
            <span className="font-heading font-bold text-amber-300 block mb-1">
              Arşivden Savaşçı / NPC Çağır
            </span>
            <div className="flex flex-wrap gap-2">
              {npcler.map((npc) => (
                <button
                  key={npc.id}
                  onClick={() => handleNpcSahneyeCagir(npc)}
                  className="px-2.5 py-1 rounded bg-[#241a13] hover:bg-[#38281d] text-[#e8ded0] border border-[#4c3926] text-[11px]"
                >
                  + {npc.ad} ({npc.rol})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
