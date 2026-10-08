import React, { useState } from 'react';
import { Karakter } from '../rules';
import { sound } from '../utils/audio';
import {
  ScrollText,
  Skull,
  Award,
  Plus,
  Coins,
  ShieldAlert,
  Flame,
  FileText,
  Calendar
} from 'lucide-react';

interface SessionEntry {
  id: string;
  oturumNo: number;
  tarih: string;
  baslik: string;
  ozet: string;
  kazanilanUn: number;
  odenenBorc: number;
}

interface CampaignJournalProps {
  karakter: Karakter;
  onKarakterGuncelle: (k: Karakter) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
}

export const CampaignJournal: React.FC<CampaignJournalProps> = ({
  karakter,
  onKarakterGuncelle,
  rol,
}) => {
  const [oturumlar, setOturumlar] = useState<SessionEntry[]>([
    {
      id: 'sess_1',
      oturumNo: 1,
      tarih: '24 Ayaz Ayı',
      baslik: 'Karanlık Nehir Baskını ve İlk Kan',
      ozet: 'Stallhart sınır kalesinden ayrılan grup, köprü başında Galetsha borç tahsildarları ile çatıştı. Bir muhafız esir alındı ve harita ele geçirildi.',
      kazanilanUn: 1,
      odenenBorc: 0,
    },
    {
      id: 'sess_2',
      oturumNo: 2,
      tarih: '28 Ayaz Ayı',
      baslik: 'Yedi Çan Mabedi ve Gece Fısıltısı',
      ozet: 'Engizitör Malakor’un mahzeninde saklanan yasak parşömen kopyalandı. Lyra rün ateşine dokunarak ilk Lekesini aldı.',
      kazanilanUn: 2,
      odenenBorc: 10,
    },
  ]);

  const [yeniBaslik, setYeniBaslik] = useState('');
  const [yeniOzet, setYeniOzet] = useState('');
  const [cenazeModali, setCenazeModali] = useState(false);
  const [mirasciAd, setMirasciAd] = useState('');
  const [mirasNotu, setMirasNotu] = useState('');

  // Kilometre Taşları (Küçük, Orta, Büyük)
  const handleMilestone = (tur: 'kucuk' | 'orta' | 'buyuk') => {
    sound.playSealStamp();
    const current = karakter.kilometreTaslari || { kucuk: 0, orta: 0, buyuk: 0 };
    onKarakterGuncelle({
      ...karakter,
      kilometreTaslari: {
        ...current,
        [tur]: (current[tur] || 0) + 1,
      },
    });
  };

  const handleYeniOturumEkle = () => {
    if (!yeniBaslik.trim()) return;
    const yeni: SessionEntry = {
      id: `sess_${Date.now()}`,
      oturumNo: oturumlar.length + 1,
      tarih: `${new Date().getDate()} Ayaz Ayı`,
      baslik: yeniBaslik.trim(),
      ozet: yeniOzet.trim() || 'Oturum notları kaydedildi.',
      kazanilanUn: 1,
      odenenBorc: 0,
    };
    setOturumlar([yeni, ...oturumlar]);
    setYeniBaslik('');
    setYeniOzet('');
  };

  // Miras Devri & Cenaze Merasimi
  const handleMirasDevret = () => {
    sound.playTempleBell('aksam');
    alert(
      `"Gema hanar, Era zeana!"\n${karakter.ad} şanla toprağa verildi.\nMiras ve eşyalar yeni varis ${mirasciAd} adına devredildi.`
    );
    setCenazeModali(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="parchment-sheet p-5 rounded-xl border border-[#503d2b] shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-amber-400" />
            <h1 className="font-heading font-black text-2xl text-[#f3ece0]">
              Kampanya Defteri &amp; Miras Sicili
            </h1>
          </div>
          <p className="text-xs text-[#a99c8b]">
            Oturum günlükleri, kazanılan kilometre taşları ve ölüm anında miras devri.
          </p>
        </div>

        <button
          onClick={() => setCenazeModali(true)}
          className="px-3.5 py-2 rounded bg-[#381414] hover:bg-[#521c1c] text-red-200 text-xs font-heading font-bold border border-red-800 flex items-center gap-2 shadow"
        >
          <Skull className="w-4 h-4 text-red-400" />
          <span>Karakter Ölümü &amp; Miras Merasimi</span>
        </button>
      </div>

      {/* 2 Sütunlu Izgara: Sol (Kilometre Taşları & Miras) | Sağ (Oturum Günlükleri) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Kilometre Taşları & İlerleme (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Kilometre Taşları */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-1.5 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Kilometre Taşları (İlerleme)</span>
            </h2>

            <div className="space-y-3 text-xs">
              {/* Küçük Kilometre Taşı */}
              <div className="p-2.5 rounded bg-[#18130e] border border-[#3e2e20] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#f1e6d4] block">
                    Küçük Kilometre Taşı (Oturum Sonu)
                  </span>
                  <span className="text-[10px] text-[#93826e]">
                    Bir beceriyi yer değiştir veya bir Görünüşü yeniden yaz.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300 text-base">
                    {karakter.kilometreTaslari?.kucuk ?? 0}
                  </span>
                  <button
                    onClick={() => handleMilestone('kucuk')}
                    className="w-6 h-6 rounded bg-[#2c1f15] hover:bg-[#3f2d1e] text-amber-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Orta Kilometre Taşı */}
              <div className="p-2.5 rounded bg-[#18130e] border border-[#3e2e20] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#f1e6d4] block">
                    Orta Kilometre Taşı (Bölüm / Senaryo Sonu)
                  </span>
                  <span className="text-[10px] text-[#93826e]">
                    +1 Beceri puanı ekle (tavanı aşamaz) veya yeni Hüner edin.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300 text-base">
                    {karakter.kilometreTaslari?.orta ?? 0}
                  </span>
                  <button
                    onClick={() => handleMilestone('orta')}
                    className="w-6 h-6 rounded bg-[#2c1f15] hover:bg-[#3f2d1e] text-amber-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Büyük Kilometre Taşı */}
              <div className="p-2.5 rounded bg-[#18130e] border border-[#3e2e20] flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-400 block">
                    Büyük Kilometre Taşı (Kampanya Sonu)
                  </span>
                  <span className="text-[10px] text-[#93826e]">
                    +1 Nitelik puanı ekle veya kalıcı kan bağı Görünüşü aç.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300 text-base">
                    {karakter.kilometreTaslari?.buyuk ?? 0}
                  </span>
                  <button
                    onClick={() => handleMilestone('buyuk')}
                    className="w-6 h-6 rounded bg-[#2c1f15] hover:bg-[#3f2d1e] text-amber-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* İtibar & Borç Özeti */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow text-xs space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#d4af37] border-b border-[#3e2e20] pb-1 mb-2">
              Kayıtlı İtibar &amp; Yükümlülükler
            </h3>
            <div className="flex justify-between p-2 rounded bg-[#16120e]">
              <span className="text-[#a49684]">İmparatorluk Şöhreti (Ün):</span>
              <span className="font-bold text-amber-300">{karakter.ekonomi?.un ?? 0} Puan</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#16120e]">
              <span className="text-[#a49684]">Galetsha Banka Borcu:</span>
              <span className="font-bold text-red-400">{karakter.ekonomi?.borc ?? 0} Aron</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#16120e]">
              <span className="text-[#a49684]">Adli Sicil Puanı:</span>
              <span className="font-bold text-stone-300">{karakter.ekonomi?.sicil ?? 0}</span>
            </div>
          </div>
        </div>

        {/* SAĞ: Oturum Günlükleri (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Yeni Oturum Ekleme Formu */}
          {rol === 'Anlatıcı' && (
            <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow text-xs space-y-2">
              <span className="font-heading font-bold text-amber-300 block mb-1">
                + Yeni Oturum Kaydı Yaz (Aldris)
              </span>
              <input
                type="text"
                placeholder="Oturum başlığı..."
                value={yeniBaslik}
                onChange={(e) => setYeniBaslik(e.target.value)}
                className="w-full bg-[#18130f] border border-[#503d2b] rounded px-3 py-1.5 text-xs text-[#eedec8]"
              />
              <textarea
                rows={2}
                placeholder="Bu oturumda neler yaşandı, kim yaralandı, hangi sırlar açığa çıktı..."
                value={yeniOzet}
                onChange={(e) => setYeniOzet(e.target.value)}
                className="w-full bg-[#18130f] border border-[#503d2b] rounded p-2 text-xs text-[#eedec8]"
              />
              <button
                onClick={handleYeniOturumEkle}
                className="px-4 py-1.5 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 font-bold border border-[#785734]"
              >
                Oturumu Kaydet
              </button>
            </div>
          )}

          {/* Geçmiş Oturumlar Listesi */}
          <div className="space-y-3">
            {oturumlar.map((sess) => (
              <div
                key={sess.id}
                className="parchment-sheet p-4 rounded-xl border border-[#483726] shadow text-xs space-y-2"
              >
                <div className="flex items-center justify-between border-b border-[#36281b] pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 font-mono font-bold text-[10px] border border-amber-800">
                      Oturum #{sess.oturumNo}
                    </span>
                    <span className="font-heading font-bold text-sm text-[#f1e6d4]">
                      {sess.baslik}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8e7e6d] font-mono">
                    {sess.tarih}
                  </span>
                </div>
                <p className="text-[#c7baa8] text-[11px] leading-relaxed">
                  {sess.ozet}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-[#93826e] pt-1 border-t border-[#291f15]">
                  <span>+ {sess.kazanilanUn} Ün</span>
                  {sess.odenenBorc > 0 && <span>• {sess.odenenBorc} Aron Borç Ödendi</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cenaze ve Miras Merasimi Modalı ("Gema hanar, Era zeana") */}
      {cenazeModali && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md">
          <div className="parchment-sheet p-6 rounded-2xl border-2 border-red-900/80 max-w-lg w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-950 border border-red-700 mx-auto flex items-center justify-center text-red-400">
              <Skull className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-heading font-black text-2xl text-red-200 tracking-wider">
                GEMA HANAR, ERA ZEANA!
              </h3>
              <p className="text-xs text-[#a49684] italic mt-1">
                &quot;Ateş söndü, kül uykuya daldı. {karakter.ad} Stallhart toprağına karıştı.&quot;
              </p>
            </div>

            <div className="text-left bg-[#18130e] p-4 rounded-lg border border-[#443322] text-xs space-y-2 text-[#d8cebe]">
              <span className="font-bold text-amber-300 block">
                Miras Devri &amp; Varis Tayini
              </span>
              <div>
                <label className="block text-[10px] uppercase text-[#9a8976] mb-1">
                  Yeni Varisin Adı (Yeni Karakter)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Evlat, yeminli silah arkadaşı veya çırak..."
                  value={mirasciAd}
                  onChange={(e) => setMirasciAd(e.target.value)}
                  className="w-full bg-[#120e0b] border border-[#523d2b] rounded px-3 py-1.5 text-xs text-[#eedec8]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#9a8976] mb-1">
                  Miras Bırakılan Eşya veya Ahit
                </label>
                <input
                  type="text"
                  placeholder="Örn: Kanlı süvari kılıcı ve Galetsha borç senedi..."
                  value={mirasNotu}
                  onChange={(e) => setMirasNotu(e.target.value)}
                  className="w-full bg-[#120e0b] border border-[#523d2b] rounded px-3 py-1.5 text-xs text-[#eedec8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCenazeModali(false)}
                className="px-4 py-2 rounded bg-[#251d16] text-[#baa998] text-xs"
              >
                Vazgeç
              </button>
              <button
                onClick={handleMirasDevret}
                className="px-6 py-2 rounded bg-[#521b1b] hover:bg-[#6e2323] text-red-100 font-heading font-bold text-xs border border-red-700 shadow"
              >
                Miras Mührünü Bas ve Vefat Ettir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
