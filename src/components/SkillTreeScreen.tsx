import React, { useState } from 'react';
import { Karakter, HANELER } from '../rules';
import {
  YetenekDugumu,
  BeceriDaliId,
  MUHURLER,
  YETENEK_AGACI_DUGUMLERI,
  getCharacterSeals,
  isNodeUnlocked,
  canUnlockNode,
} from '../data/skillTreeData';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Shield,
  Swords,
  Lock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Zap,
  Award,
  ChevronRight,
  Flame,
  Skull,
  Eye,
  Crown,
  BookOpen,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillTreeScreenProps {
  karakter: Karakter;
  karakterler: Karakter[];
  onKarakterGuncelle: (guncel: Karakter) => void;
  onKarakterSec: (id: string) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
}

export const SkillTreeScreen: React.FC<SkillTreeScreenProps> = ({
  karakter,
  karakterler,
  onKarakterGuncelle,
  onKarakterSec,
  rol,
}) => {
  const [seciliDal, setSeciliDal] = useState<'tumu' | BeceriDaliId>('tumu');
  const [detayNode, setDetayNode] = useState<YetenekDugumu | null>(null);
  const [muhurDuzenleModal, setMuhurDuzenleModal] = useState<boolean>(false);

  const haneInfo = HANELER[karakter.hane] || HANELER.Stallhart;
  const seals = getCharacterSeals(karakter);
  const unlockedNodes = karakter.yetenekler || [];

  // Yetenek Kilidini Aç
  const handleYetenekAc = (node: YetenekDugumu) => {
    const { possible, reason } = canUnlockNode(karakter, node);
    if (!possible) {
      sound.playBladeClash();
      return;
    }

    sound.playSealStamp();
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.5 },
      colors: [MUHURLER[node.dalId].renk, '#f59e0b', '#ffffff'],
    });

    // Mühürleri ve Fate Puanını düş
    const guncelMuhurler = {
      ...seals,
      [node.dalId]: Math.max(0, seals[node.dalId] - node.muhurMaliyeti),
    };

    let guncelKP = karakter.kaderPuani ?? 3;
    if (node.kaderPuaniMaliyeti) {
      guncelKP = Math.max(0, guncelKP - node.kaderPuaniMaliyeti);
    }

    const yeniYetenekler = [...unlockedNodes, node.id];

    // Eğer yetenek bir durum efekti sinerjisi kazandırıyorsa (örn: Era'nın Kutsal Nuru -> Kutsanmış)
    let guncelDurumlar = [...(karakter.durumlar || [])];
    if (node.durumSinerjisi && !guncelDurumlar.includes(node.durumSinerjisi)) {
      if (node.id === 'gunes_1_mabed_nuru' || node.id === 'kan_2_kirilmaz_siper') {
        guncelDurumlar.push(node.durumSinerjisi);
      }
    }

    onKarakterGuncelle({
      ...karakter,
      yetenekler: yeniYetenekler,
      muhurler: guncelMuhurler,
      kaderPuani: guncelKP,
      durumlar: guncelDurumlar,
    });

    if (detayNode?.id === node.id) {
      setDetayNode(null);
    }
  };

  // Mühür Sayısını Güncelle (+ / -)
  const handleMuhurDegistir = (dalId: BeceriDaliId, delta: number) => {
    sound.playSealStamp();
    const guncel = {
      ...seals,
      [dalId]: Math.max(0, (seals[dalId] || 0) + delta),
    };
    onKarakterGuncelle({
      ...karakter,
      muhurler: guncel,
    });
  };

  // Ruh Kefareti (Tüm Yetenekleri Sıfırla ve Mühürleri İade Et)
  const handleSifirla = () => {
    if (unlockedNodes.length === 0) return;
    if (!window.confirm('Tüm öğrenilmiş yetenekleri sıfırlayıp harcanan mühürleri iade etmek istediğinize emin misiniz?')) {
      return;
    }

    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 60 });

    // İade edilecek mühürleri hesapla
    const iade = { ...seals };
    unlockedNodes.forEach((nodeId) => {
      const node = YETENEK_AGACI_DUGUMLERI.find((n) => n.id === nodeId);
      if (node) {
        iade[node.dalId] = (iade[node.dalId] || 0) + node.muhurMaliyeti;
      }
    });

    onKarakterGuncelle({
      ...karakter,
      yetenekler: [],
      muhurler: iade,
    });
  };

  // Filtrelenmiş Düğümler
  const gorunenDugumler =
    seciliDal === 'tumu'
      ? YETENEK_AGACI_DUGUMLERI
      : YETENEK_AGACI_DUGUMLERI.filter((d) => d.dalId === seciliDal);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* ÜST PANEL: KARAKTER BİLGİSİ VE MÜHÜR SUNAĞI (SEALS ALTAR) */}
      <div className="parchment-sheet p-4 rounded-2xl border-2 border-[#54412e] shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Karakter Bilgisi */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500 bg-black flex-shrink-0 shadow-lg relative group">
            <img
              src={karakter.fotoUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
              alt={karakter.ad}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-xl text-amber-200">{karakter.ad}</h1>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-bold border"
                style={{ borderColor: haneInfo.renk, color: haneInfo.renk }}
              >
                {karakter.hane}
              </span>
            </div>
            <p className="text-xs text-[#a99c8b]">
              {karakter.meslek} • {unlockedNodes.length} / {YETENEK_AGACI_DUGUMLERI.length} Yetenek Ustalaşıldı
            </p>
          </div>
        </div>

        {/* 4 EŞSİZ MÜHÜR KASASI (SEALS VAULT) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {(Object.keys(MUHURLER) as BeceriDaliId[]).map((dalKey) => {
            const m = MUHURLER[dalKey];
            const count = seals[dalKey] || 0;

            return (
              <div
                key={dalKey}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-inner transition-transform hover:scale-105 ${m.badgeSinifi}`}
                title={`${m.ad}: ${m.aciklama}\n\nKazanım: ${m.kazanimYolu}`}
              >
                <span className="text-lg">{m.ikon}</span>
                <div>
                  <span className="text-[9px] uppercase font-heading font-bold block opacity-80 leading-none">
                    {m.ad.replace(' Mührü', '')}
                  </span>
                  <span className="font-mono font-black text-sm block leading-tight">
                    {count} Mühür
                  </span>
                </div>
              </div>
            );
          })}

          {/* Mühür Yönet & Sıfırla Düğmeleri */}
          <div className="flex items-center gap-1.5 ml-1">
            {rol === 'Anlatıcı' && (
              <button
                onClick={() => setMuhurDuzenleModal(true)}
                className="px-2.5 py-1.5 rounded bg-[#2a1d13] hover:bg-[#3d2a1a] text-amber-300 text-xs font-bold border border-[#5a3f28] flex items-center gap-1 shadow"
                title="GM: Karaktere Mühür Bahşet / Seviye Atlat"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>👑 Mühür Bahşet</span>
              </button>
            )}

            <button
              onClick={handleSifirla}
              disabled={unlockedNodes.length === 0}
              className="px-2.5 py-1.5 rounded bg-[#2a1414] hover:bg-[#401a1a] text-rose-300 text-xs font-bold border border-rose-900 disabled:opacity-40 flex items-center gap-1 shadow"
              title="Ruh Kefareti: Yetenekleri sıfırlar ve mühürleri iade eder"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Kefaret</span>
            </button>
          </div>
        </div>
      </div>

      {/* BECERİ DALLARI SEÇİCİ (BRANCH SELECTOR TABS) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#3b2a1a]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playSealStamp();
              setSeciliDal('tumu');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-black border transition-all flex items-center gap-1.5 ${
              seciliDal === 'tumu'
                ? 'bg-amber-600 border-amber-400 text-stone-950 shadow-md scale-105'
                : 'bg-[#18110b] border-[#443020] text-[#c9b9a6] hover:bg-[#281b11]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tüm Dallar (Büyük Ağaç)</span>
          </button>

          {(Object.keys(MUHURLER) as BeceriDaliId[]).map((dalKey) => {
            const m = MUHURLER[dalKey];
            const isSelected = seciliDal === dalKey;

            return (
              <button
                key={dalKey}
                onClick={() => {
                  sound.playSealStamp();
                  setSeciliDal(dalKey);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-black border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? `${m.badgeSinifi} shadow-md scale-105 ring-1 ring-amber-400`
                    : 'bg-[#18110b] border-[#443020] text-[#c9b9a6] hover:bg-[#281b11]'
                }`}
              >
                <span>{m.ikon}</span>
                <span>{dalKey === 'kan' ? 'Demir & Kan' : dalKey === 'golge' ? 'Gölge & Fısıltı' : dalKey === 'leke' ? 'Yasak Rünler' : 'Mabed & Denge'}</span>
              </button>
            );
          })}
        </div>

        {/* Karakter Değiştirme */}
        <div className="flex items-center gap-2">
          <select
            value={karakter.id}
            onChange={(e) => onKarakterSec(e.target.value)}
            className="bg-[#17120e] border border-[#443322] rounded px-2.5 py-1 text-xs text-[#f1e6d4]"
          >
            {karakterler.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ad} ({c.hane})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* YETENEK AĞACI TUVALİ (SKILL TREE GRID / CANVAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['kan', 'golge', 'leke', 'gunes'] as BeceriDaliId[])
          .filter((d) => seciliDal === 'tumu' || seciliDal === d)
          .map((dalId) => {
            const m = MUHURLER[dalId];
            const dalDugumleri = YETENEK_AGACI_DUGUMLERI.filter((n) => n.dalId === dalId);
            const dalUnlockedCount = dalDugumleri.filter((n) => unlockedNodes.includes(n.id)).length;

            return (
              <div
                key={dalId}
                className="parchment-sheet p-4 rounded-2xl border-2 border-[#54412e] shadow-xl flex flex-col justify-between space-y-4 relative"
              >
                {/* Dal Başlığı */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${m.badgeSinifi}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.ikon}</span>
                    <div>
                      <h3 className="font-heading font-black text-sm text-[#fcf3e6]">
                        {dalId === 'kan'
                          ? 'Demir ve Kan Yolu'
                          : dalId === 'golge'
                          ? 'Gölge ve Fısıltı Yolu'
                          : dalId === 'leke'
                          ? 'Yasak Rünler ve Leke'
                          : 'Mabed ve İlahi Denge'}
                      </h3>
                      <span className="text-[10px] opacity-80 font-mono">
                        {m.ad} ({seals[dalId] || 0} Mevcut)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-bold">
                    {dalUnlockedCount} / {dalDugumleri.length}
                  </span>
                </div>

                {/* Düğümler Listesi (Tier 1 -> Tier 4 Apex) */}
                <div className="space-y-3 relative">
                  {dalDugumleri.map((node, index) => {
                    const isUnlocked = isNodeUnlocked(karakter, node.id);
                    const { possible, reason } = canUnlockNode(karakter, node);

                    return (
                      <div key={node.id} className="relative">
                        {/* Bağlantı Çizgisi */}
                        {index > 0 && (
                          <div className="w-0.5 h-3 bg-[#443020] mx-auto -mt-3 mb-1" />
                        )}

                        <div
                          onClick={() => setDetayNode(node)}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                            isUnlocked
                              ? 'bg-[#24170d] border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                              : possible
                              ? 'bg-[#1b140e] border-amber-700/80 hover:border-amber-400 hover:scale-[1.02] shadow'
                              : 'bg-[#120d09] border-[#312316] opacity-65 hover:opacity-90'
                          }`}
                        >
                          {/* Seviye ve Durum Rozeti */}
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xl">{node.ikon}</span>
                              <div>
                                <span className="font-heading font-black text-xs text-[#f5ebd8] block leading-tight">
                                  {node.ad}
                                </span>
                                <span className="text-[9px] text-[#baa896] block">
                                  {node.unvan}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              {isUnlocked ? (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 text-[9px] font-black uppercase flex items-center gap-0.5 shadow">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>USTALAŞILDI</span>
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-amber-300 font-bold bg-[#140e0a] px-1.5 py-0.5 rounded border border-[#3b2a1a]">
                                  {node.muhurMaliyeti} {m.ad.replace(' Mührü', '')}
                                </span>
                              )}
                              <span className="text-[8px] font-mono uppercase text-[#887867] mt-0.5">
                                Tier {node.seviye} {node.seviye === 4 ? '· APEX' : ''}
                              </span>
                            </div>
                          </div>

                          {/* Açıklama */}
                          <p className="text-[11px] text-[#ded1be] font-serif leading-tight">
                            {node.oyunMekanigi}
                          </p>

                          {/* Durum Sinerjisi Rozeti */}
                          {node.durumSinerjisi && (
                            <div className="flex items-center gap-1 text-[9px] font-mono text-amber-400">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Sinerji: {node.durumSinerjisi}</span>
                            </div>
                          )}

                          {/* Aksiyon / Aç Düğmesi */}
                          {!isUnlocked && (
                            <div className="pt-1 border-t border-[#312316] flex items-center justify-between">
                              <span className="text-[9px] text-[#8e7e6e] italic">
                                {possible ? 'Açılabilir!' : reason}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleYetenekAc(node);
                                }}
                                disabled={!possible}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                  possible
                                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-300 shadow active:scale-95'
                                    : 'bg-[#18110b] text-stone-500 border-stone-800 cursor-not-allowed'
                                }`}
                              >
                                Kilidi Aç
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* YETENEK DETAY MODALI / INSPECTOR */}
      {detayNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-amber-600/80 max-w-lg w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-start justify-between border-b border-[#443322] pb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-[#140e0a] border border-[#3b2a1a]">
                  {detayNode.ikon}
                </span>
                <div>
                  <h3 className="font-heading font-black text-base text-amber-200">
                    {detayNode.ad}
                  </h3>
                  <p className="text-[10px] text-[#a99c8b]">
                    {detayNode.dalAdi} • {detayNode.unvan} (Tier {detayNode.seviye})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetayNode(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            {/* Lore ve Mekanik */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#16100c] border border-[#3f2e1e] space-y-1">
                <span className="text-[10px] uppercase font-heading font-bold text-amber-400 block">
                  Evrensel İrfan (Lore):
                </span>
                <p className="text-xs text-[#ded1be] font-serif leading-relaxed italic">
                  &quot;{detayNode.aciklama}&quot;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#140e0a] border border-amber-900/60 space-y-1">
                <span className="text-[10px] uppercase font-heading font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kural &amp; Çatışma Mekaniği:</span>
                </span>
                <p className="text-xs text-[#f1e6d4] font-sans font-semibold leading-relaxed">
                  {detayNode.oyunMekanigi}
                </p>
              </div>

              {/* Gereksinimler & Mühürler */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#140e0a] border border-[#3b2a1a]">
                  <span className="text-[10px] text-[#8e7e6e] block">Gereken Mühür:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {detayNode.muhurMaliyeti} {MUHURLER[detayNode.dalId].ad}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#140e0a] border border-[#3b2a1a]">
                  <span className="text-[10px] text-[#8e7e6e] block">Mevcut Durum:</span>
                  <span className="font-mono font-bold">
                    {isNodeUnlocked(karakter, detayNode.id) ? (
                      <span className="text-emerald-400">Öğrenildi ✓</span>
                    ) : (
                      <span className="text-amber-400">Henüz Açılmadı</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Alt Butonlar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#443322]">
              <button
                onClick={() => setDetayNode(null)}
                className="px-3 py-1.5 rounded text-stone-400 hover:text-white"
              >
                Kapat
              </button>

              {!isNodeUnlocked(karakter, detayNode.id) && (
                <button
                  onClick={() => handleYetenekAc(detayNode)}
                  disabled={!canUnlockNode(karakter, detayNode).possible}
                  className="px-4 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs disabled:opacity-50"
                >
                  Bu Yeteneği Öğren ({detayNode.muhurMaliyeti} Mühür)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MÜHÜR DÜZENLEME & SEVİYE ATLAMA MODALI */}
      {muhurDuzenleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-[#68523b] max-w-md w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#443322] pb-2">
              <div>
                <h3 className="font-heading font-black text-sm text-amber-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Karaktere Mühür Bahşet</span>
                </h3>
                <p className="text-[10px] text-[#a99c8b]">
                  Kilometre taşları, muharebe zaferleri ve hikâye dönümlerinde kazanılan mühürleri ekleyin.
                </p>
              </div>
              <button
                onClick={() => setMuhurDuzenleModal(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {(Object.keys(MUHURLER) as BeceriDaliId[]).map((dalId) => {
                const m = MUHURLER[dalId];
                const count = seals[dalId] || 0;

                return (
                  <div
                    key={dalId}
                    className="p-2.5 rounded-xl bg-[#140e0a] border border-[#3b2a1a] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.ikon}</span>
                      <div>
                        <span className="font-bold text-[#f5ecd8] block">{m.ad}</span>
                        <span className="text-[9px] text-[#8e7e6e] block">{m.aciklama}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMuhurDegistir(dalId, -1)}
                        className="w-6 h-6 rounded bg-[#251b14] hover:bg-[#3b2a1f] text-stone-300 font-bold border border-[#443322] flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-sm text-amber-300 w-6 text-center">
                        {count}
                      </span>
                      <button
                        onClick={() => handleMuhurDegistir(dalId, 1)}
                        className="w-6 h-6 rounded bg-[#251b14] hover:bg-[#3b2a1f] text-amber-400 font-bold border border-[#443322] flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#443322]">
              <button
                onClick={() => setMuhurDuzenleModal(false)}
                className="px-4 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs"
              >
                Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
