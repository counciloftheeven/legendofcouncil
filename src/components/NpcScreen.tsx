import React, { useState } from 'react';
import { NPC, Hane, HANELER } from '../rules';
import { INITIAL_NPCS } from '../data/initialData';
import { sound } from '../utils/audio';
import {
  Users,
  Search,
  Filter,
  Eye,
  EyeOff,
  Skull,
  Swords,
  Plus,
  Lock,
  Sparkles
} from 'lucide-react';

interface NpcScreenProps {
  npcler: NPC[];
  onNpcGuncelle: (yeniListe: NPC[]) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
  onSahneyeCagir: (npc: NPC) => void;
}

export const NpcScreen: React.FC<NpcScreenProps> = ({
  npcler,
  onNpcGuncelle,
  rol,
  onSahneyeCagir,
}) => {
  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliRol, setSeciliRol] = useState<string>('Hepsi');
  const [seciliHane, setSeciliHane] = useState<string>('Hepsi');
  const [seciliNpcId, setSeciliNpcId] = useState<string>(npcler[0]?.id || '');

  // Yeni NPC Ekleme Modalı
  const [yeniNpcModal, setYeniNpcModal] = useState(false);
  const [yeniAd, setYeniAd] = useState('');
  const [yeniRol, setYeniRol] = useState<any>('Vezir');
  const [yeniHane, setYeniHane] = useState<Hane>('Stallhart');
  const [yeniTehdit, setYeniTehdit] = useState<any>('Orta');
  const [yeniKonsept, setYeniKonsept] = useState('');
  const [yeniSir, setYeniSir] = useState('');

  // Filtreleme
  const filtrelenmis = npcler.filter((npc) => {
    const adUyumu = npc.ad.toLowerCase().includes(aramaMetni.toLowerCase());
    const rolUyumu = seciliRol === 'Hepsi' || npc.rol === seciliRol;
    const haneUyumu = seciliHane === 'Hepsi' || npc.hane === seciliHane;
    return adUyumu && rolUyumu && haneUyumu;
  });

  const aktifNpc = npcler.find((n) => n.id === seciliNpcId) || npcler[0];

  // Tutum Sayacı (-3 .. +3)
  const handleTutumDegistir = (npcId: string, delta: number) => {
    sound.playSealStamp();
    const guncel = npcler.map((n) =>
      n.id === npcId
        ? { ...n, tutum: Math.max(-3, Math.min(3, n.tutum + delta)) }
        : n
    );
    onNpcGuncelle(guncel);
  };

  const handleYeniNpcEkle = () => {
    if (!yeniAd.trim()) return;
    const olusturulan: NPC = {
      id: `npc_${Date.now()}`,
      ad: yeniAd.trim(),
      hane: yeniHane,
      eyalet: HANELER[yeniHane]?.eyalet || 'Stallhart Kalp Eyaleti',
      rol: yeniRol,
      tehdit: yeniTehdit,
      tutum: 0,
      anaKavram: yeniKonsept.trim() || 'Gizemli Yabancı',
      dert: 'Bilinmeyen Gizli Amaç',
      sir: yeniSir.trim() || 'Henüz açığa çıkmamış bir sır taşıyor.',
      ipuclari: ['Karanlıkta fısıldar.'],
      anlaticiNotlari: 'Özel Anlatıcı notu girilmedi.',
      stats: { fight: 2, savunma: 2, yaraKutulari: 3, mevcutYara: 0 },
    };
    onNpcGuncelle([...npcler, olusturulan]);
    setYeniNpcModal(false);
    setYeniAd('');
    setSeciliNpcId(olusturulan.id);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Üst Bar & Arama */}
      <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-xl text-amber-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Stallhart Şahsiyetleri &amp; NPC Arşivi</span>
          </h1>
          <p className="text-xs text-[#a99c8b]">
            Kurultay vezirleri, eyalet valileri, lonca reisleri ve yeraltı casusları.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Arama Girişi */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7f6f5e]" />
            <input
              type="text"
              placeholder="İsim ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="bg-[#17120e] border border-[#443322] rounded pl-8 pr-3 py-1.5 text-xs text-[#f1e6d4] focus:outline-none"
            />
          </div>

          {/* Rol Filtresi */}
          <select
            value={seciliRol}
            onChange={(e) => setSeciliRol(e.target.value)}
            className="bg-[#17120e] border border-[#443322] rounded px-2.5 py-1.5 text-xs text-[#eedec8]"
          >
            <option value="Hepsi">Tüm Roller</option>
            <option value="Vezir">Vezir</option>
            <option value="Vali">Vali</option>
            <option value="Paralı Asker">Paralı Asker</option>
            <option value="Casus">Casus</option>
            <option value="Mabed Yargıcı">Mabed Yargıcı</option>
            <option value="Büyücü">Büyücü</option>
            <option value="Tüccar">Tüccar</option>
          </select>

          {rol === 'Anlatıcı' && (
            <button
              onClick={() => setYeniNpcModal(true)}
              className="px-3 py-1.5 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 text-xs font-bold border border-[#785734] flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni NPC</span>
            </button>
          )}
        </div>
      </div>

      {/* 2 Sütun: Sol Kart Listesi (5 cols) | Sağ Detay Kartı (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Kart Listesi (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filtrelenmis.map((npc) => {
            const isSelected = npc.id === seciliNpcId;
            const haneInfo = HANELER[npc.hane];
            return (
              <div
                key={npc.id}
                onClick={() => {
                  sound.playSealStamp();
                  setSeciliNpcId(npc.id);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#271e16] border-amber-400 shadow-md ring-1 ring-amber-400'
                    : 'bg-[#18130e] border-[#3e2e20] hover:border-[#674e35]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shadow"
                    style={{
                      backgroundColor: haneInfo?.renk || '#443322',
                      color: haneInfo?.ikincilRenk || '#ffffff',
                    }}
                  >
                    {npc.hane[0]}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs text-[#f1e6d4]">
                      {npc.ad}
                    </div>
                    <div className="text-[10px] text-[#93826e]">
                      {npc.rol} • {npc.hane}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      npc.tehdit === 'Ölümcül'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : npc.tehdit === 'Yüksek'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-[#231a13] text-[#a99c8b]'
                    }`}
                  >
                    {npc.tehdit} Tehdit
                  </span>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                    Tutum: {npc.tutum >= 0 ? `+${npc.tutum}` : npc.tutum}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SAĞ: Seçili NPC Detayı (7 cols) */}
        {aktifNpc && (
          <div className="lg:col-span-7">
            <div className="parchment-sheet p-5 rounded-xl border-2 border-[#5a4430] shadow-2xl space-y-4">
              {/* Header */}
              <div className="border-b border-[#433222] pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-black text-xl text-[#f3ece0]">
                      {aktifNpc.ad}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#2e2217] text-amber-300 border border-[#523d2b] font-bold">
                      {aktifNpc.rol}
                    </span>
                  </div>
                  <span className="text-xs text-[#9d8d7b] block mt-0.5">
                    {aktifNpc.hane} Hanedanı • Eyalet: {aktifNpc.eyalet}
                  </span>
                </div>

                <button
                  onClick={() => onSahneyeCagir(aktifNpc)}
                  className="px-3 py-1.5 rounded wax-seal text-white text-xs font-heading font-bold shadow flex items-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Sahneye Çağır</span>
                </button>
              </div>

              {/* Tutum Sayacı (-3 .. +3) */}
              <div className="bg-[#18130e] p-3 rounded border border-[#443322] flex items-center justify-between">
                <div>
                  <span className="text-xs font-heading font-bold text-amber-300 block">
                    Karakterlere Karşı Tutum (-3 .. +3)
                  </span>
                  <span className="text-[10px] text-[#9a8976]">
                    {aktifNpc.tutum <= -2
                      ? 'Düşmanca / Nefret'
                      : aktifNpc.tutum === -1
                      ? 'Soğuk / Tereddütlü'
                      : aktifNpc.tutum === 0
                      ? 'Nötr / Çıkarcı'
                      : aktifNpc.tutum === 1
                      ? 'Ilımlı / İşbirlikçi'
                      : 'Sadık Müttefik'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTutumDegistir(aktifNpc.id, -1)}
                    className="w-6 h-6 rounded bg-[#2d1e13] hover:bg-[#402a1a] text-amber-200 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base text-amber-300 w-8 text-center">
                    {aktifNpc.tutum >= 0 ? `+${aktifNpc.tutum}` : aktifNpc.tutum}
                  </span>
                  <button
                    onClick={() => handleTutumDegistir(aktifNpc.id, 1)}
                    className="w-6 h-6 rounded bg-[#2d1e13] hover:bg-[#402a1a] text-amber-200 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Görünüşler & Sır */}
              <div className="space-y-2 text-xs">
                <div className="bg-[#1a140f] p-2.5 rounded border border-[#403021]">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block">
                    Ana Kavram (High Concept)
                  </span>
                  <span className="text-[#f1e6d4] font-serif font-semibold">
                    {aktifNpc.anaKavram}
                  </span>
                </div>

                <div className="bg-[#1a140f] p-2.5 rounded border border-[#403021]">
                  <span className="text-[10px] font-bold text-red-400 uppercase block">
                    Dert (Trouble)
                  </span>
                  <span className="text-[#eed9cb] font-serif">
                    {aktifNpc.dert}
                  </span>
                </div>

                {/* Sırlar ve İpuçları */}
                <div className="bg-[#17120e] p-2.5 rounded border border-[#483726]">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase block mb-1">
                    Bilinen İpuçları
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[#d4c8b8] text-[11px]">
                    {aktifNpc.ipuclari.map((ip, i) => (
                      <li key={i}>{ip}</li>
                    ))}
                  </ul>
                </div>

                {/* Gizli Anlatıcı Notları (Yalnızca GM Görür) */}
                {rol === 'Anlatıcı' ? (
                  <div className="bg-[#241313] p-3 rounded border border-red-900/70 text-xs text-red-200 space-y-1 shadow-inner">
                    <div className="flex items-center gap-1.5 font-bold text-red-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Gizli Anlatıcı Arşivi &amp; Sırrı (Oyunculara Kapalı)</span>
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <strong>Gizli Sırrı:</strong> {aktifNpc.sir}
                    </div>
                    <div className="text-[11px] text-red-300/80 italic">
                      <strong>Kullanım Notu:</strong> {aktifNpc.anlaticiNotlari}
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-[#130f0c] border border-[#33251a] text-center text-xs text-stone-500 italic">
                    Gizli Anlatıcı notları yalnızca Aldris (GM) modunda görünür.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Yeni NPC Oluşturma Modalı */}
      {yeniNpcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
          <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] max-w-md w-full shadow-2xl text-xs space-y-3">
            <h3 className="font-heading font-bold text-base text-amber-200 border-b border-[#443322] pb-2">
              Yeni Stallhart Şahsiyeti Ekle
            </h3>
            <div>
              <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                Ad ve Lakap
              </label>
              <input
                type="text"
                placeholder="Örn: Yüzbaşı Goran, Zehirci Lyra..."
                value={yeniAd}
                onChange={(e) => setYeniAd(e.target.value)}
                className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2.5 py-1.5 text-xs text-[#f1e6d4]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                  Hane
                </label>
                <select
                  value={yeniHane}
                  onChange={(e) => setYeniHane(e.target.value as any)}
                  className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2 py-1 text-xs text-[#f1e6d4]"
                >
                  {(Object.keys(HANELER) as Hane[]).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                  Rol
                </label>
                <select
                  value={yeniRol}
                  onChange={(e) => setYeniRol(e.target.value as any)}
                  className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2 py-1 text-xs text-[#f1e6d4]"
                >
                  <option value="Vezir">Vezir</option>
                  <option value="Vali">Vali</option>
                  <option value="Paralı Asker">Paralı Asker</option>
                  <option value="Casus">Casus</option>
                  <option value="Mabed Yargıcı">Mabed Yargıcı</option>
                  <option value="Büyücü">Büyücü</option>
                  <option value="Tüccar">Tüccar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                Ana Kavram (Görünüş)
              </label>
              <input
                type="text"
                placeholder="Örn: Madenlerin Gizli Tefecisi..."
                value={yeniKonsept}
                onChange={(e) => setYeniKonsept(e.target.value)}
                className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2.5 py-1.5 text-xs text-[#f1e6d4]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-heading text-red-400 mb-1">
                Gizli Sırrı (Yalnızca GM)
              </label>
              <input
                type="text"
                placeholder="Örn: Aslında rakip haneye çalışıyor..."
                value={yeniSir}
                onChange={(e) => setYeniSir(e.target.value)}
                className="w-full bg-[#18130f] border border-[#503d2b] rounded px-2.5 py-1.5 text-xs text-[#f1e6d4]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#443322]">
              <button
                onClick={() => setYeniNpcModal(false)}
                className="px-3 py-1 rounded bg-[#251d16] text-[#a99a89]"
              >
                İptal
              </button>
              <button
                onClick={handleYeniNpcEkle}
                className="px-4 py-1 rounded bg-[#3b2a1a] text-amber-200 font-bold border border-[#785734]"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
