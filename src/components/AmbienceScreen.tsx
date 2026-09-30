import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Karakter } from '../rules';
import {
  Volume2,
  VolumeX,
  Bell,
  CloudRain,
  Flame,
  Wind,
  Moon,
  Sun,
  Eye,
  Send,
  Sparkles,
  Layers,
  MessageSquare,
  Scroll
} from 'lucide-react';

interface AmbienceScreenProps {
  karakterler: Karakter[];
  rol: 'Anlatıcı' | 'Oyuncu';
  onAnlatiYayinla: (metin: string) => void;
  onFisiltiGonder: (hedefAd: string, metin: string) => void;
}

export interface SahneAyari {
  id: string;
  ad: string;
  tonRenk: string;
  aciklama: string;
  varsayilanOrtam: { ates: boolean; ruzgar: boolean; yagmur: boolean; uultu: boolean };
}

const SAHNELER: SahneAyari[] = [
  { id: 'han', ad: 'Kanlı Kadeh Hanı', tonRenk: '#3a2110', aciklama: 'Ateşin çıtırdadığı, şarabın döküldüğü ve fısıltıların uçuştuğu han.', varsayilanOrtam: { ates: true, ruzgar: false, yagmur: false, uultu: false } },
  { id: 'kisla', ad: 'Stallhart Kışlası', tonRenk: '#201b17', aciklama: 'Kalkanların çarpıştığı, çeliğin bilendiği disiplinli askeri kamp.', varsayilanOrtam: { ates: true, ruzgar: true, yagmur: false, uultu: false } },
  { id: 'kurultay', ad: 'Yüksek Kurultay Salonu', tonRenk: '#1d1720', aciklama: 'Mermer sütunlar ve ağır kadife perdeler altında fısıldayan vezirler.', varsayilanOrtam: { ates: false, ruzgar: false, yagmur: false, uultu: true } },
  { id: 'mabed', ad: 'Yedi Çan Mabedi', tonRenk: '#182414', aciklama: 'Tütsü kokusu, bronz çanlar ve Denge Mahkemesinin ilahileri.', varsayilanOrtam: { ates: false, ruzgar: false, yagmur: false, uultu: true } },
  { id: 'orman', ad: 'Puslu Lanetli Orman', tonRenk: '#101a14', aciklama: 'Dalların arasından süzülen solgun ay ışığı ve yırtıcı hırıltıları.', varsayilanOrtam: { ates: false, ruzgar: true, yagmur: true, uultu: false } },
  { id: 'zindan', ad: 'Engizisyon Mahzeni', tonRenk: '#0d0d0e', aciklama: 'Damlalayan sular, küf kokusu ve demir prangaların gıcırtısı.', varsayilanOrtam: { ates: false, ruzgar: false, yagmur: false, uultu: true } },
  { id: 'pusu', ad: 'Geceyarısı Pususu', tonRenk: '#291212', aciklama: 'Gergin bir sessizlik, nefesler tutulmuş, oklar kirişte bekliyor.', varsayilanOrtam: { ates: false, ruzgar: true, yagmur: false, uultu: false } }
];

export const AmbienceScreen: React.FC<AmbienceScreenProps> = ({
  karakterler,
  rol,
  onAnlatiYayinla,
  onFisiltiGonder,
}) => {
  const [aktifSahne, setAktifSahne] = useState<SahneAyari>(SAHNELER[0]);
  const [hava, setHava] = useState<'Acik' | 'Yagmur' | 'Kar' | 'Sis'>('Acik');
  const [vakit, setVakit] = useState<'Gunduz' | 'Alacakaranlik' | 'Gece'>('Gece');

  // Katmanlı Ses Sentezi
  const [ates, setAtes] = useState(true);
  const [ruzgar, setRuzgar] = useState(false);
  const [sesCaliniyor, setSesCaliniyor] = useState(false);
  const [masterSes, setMasterSes] = useState(0.3);

  // Anlatı Örtüsü Metni
  const [anlatiMetni, setAnlatiMetni] = useState('');

  // Fısıltı State
  const [fisiltiHedef, setFisiltiHedef] = useState(karakterler[0]?.ad || '');
  const [fisiltiMetni, setFisiltiMetni] = useState('');

  const handleSesToggle = () => {
    if (sesCaliniyor) {
      sound.stopAmbience();
      setSesCaliniyor(false);
    } else {
      sound.startAmbience({ ates, ruzgar, yagmur: hava === 'Yagmur', uultu: false }, masterSes);
      setSesCaliniyor(true);
    }
  };

  const handleSahneSec = (sahne: SahneAyari) => {
    sound.playSealStamp();
    setAktifSahne(sahne);
    setAtes(sahne.varsayilanOrtam.ates);
    setRuzgar(sahne.varsayilanOrtam.ruzgar);
    if (sesCaliniyor) {
      sound.startAmbience(
        {
          ates: sahne.varsayilanOrtam.ates,
          ruzgar: sahne.varsayilanOrtam.ruzgar,
          yagmur: hava === 'Yagmur',
          uultu: sahne.varsayilanOrtam.uultu,
        },
        masterSes
      );
    }
  };

  const handleCanCal = (tur: 'uyanis' | 'minnet' | 'koruma' | 'aksam') => {
    sound.playTempleBell(tur);
  };

  const handleAnlatiGonder = () => {
    if (!anlatiMetni.trim()) return;
    onAnlatiYayinla(anlatiMetni.trim());
    setAnlatiMetni('');
  };

  const handleFisiltiGonderAction = () => {
    if (!fisiltiMetni.trim()) return;
    onFisiltiGonder(fisiltiHedef, fisiltiMetni.trim());
    setFisiltiMetni('');
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Üst Bar: Aktif Sahne Başlığı ve Canlı Efekt Durumu */}
      <div className="parchment-sheet p-5 rounded-xl border border-[#503d2b] shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-heading font-bold text-amber-400 block mb-0.5">
            Masa Ambiyansı &amp; Ses Sentezleyicisi
          </span>
          <h1 className="font-heading font-black text-2xl text-[#f3ece0]">
            {aktifSahne.ad}
          </h1>
          <p className="text-xs text-[#a99b8a] italic max-w-xl">
            &quot;{aktifSahne.aciklama}&quot;
          </p>
        </div>

        {/* Master Ses Kontrolü */}
        <div className="flex items-center gap-3 bg-[#16120e] p-2.5 rounded-lg border border-[#443322]">
          <button
            onClick={handleSesToggle}
            className={`p-2 rounded-full border transition-all ${
              sesCaliniyor
                ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400'
                : 'bg-[#251d16] text-[#867563] border-[#443322]'
            }`}
            title={sesCaliniyor ? 'Ambiyans Sesini Sustur' : 'Ortam Seslerini Başlat'}
          >
            {sesCaliniyor ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <div>
            <span className="text-[10px] text-[#9a8976] block font-heading">
              {sesCaliniyor ? 'Sesler Aktif' : 'Sessiz'}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterSes}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMasterSes(val);
                if (sesCaliniyor) {
                  sound.startAmbience({ ates, ruzgar, yagmur: hava === 'Yagmur', uultu: false }, val);
                }
              }}
              className="w-20 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Sahne Ön Ayarları Izgarası */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SAHNELER.map((s) => {
          const isSelected = s.id === aktifSahne.id;
          return (
            <button
              key={s.id}
              onClick={() => handleSahneSec(s)}
              className={`p-2.5 rounded-lg border text-left transition-all relative ${
                isSelected
                  ? 'bg-[#291e15] border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-[#18130e] border-[#3e2e20] hover:border-[#674e35]'
              }`}
            >
              <span className="font-heading font-bold text-xs text-[#f1e6d4] block truncate">
                {s.ad}
              </span>
              <span className="text-[10px] text-[#8d7c6b] line-clamp-1 mt-0.5">
                {s.aciklama}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2 Sütunlu Kontrol Masası: Sol (Mabed Çanları & Ses Katmanları) | Sağ (Anlatı Örtüsü & Fısıltı) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Mabed Çanları & Hava/Işık (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Mabed Çanları (Sanctuary Bells) */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-1.5 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Mabed Çanları &amp; Denge Ayini</span>
            </h2>
            <p className="text-xs text-[#a99c8b] mb-4">
              Gerçek bronz tınılı sentezlenmiş Mabed çanları. Zaman akışını ve kutsal duaları ilan etmek için çalınır.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleCanCal('uyanis')}
                className="p-2.5 rounded bg-[#1e1913] hover:bg-[#34271c] border border-[#4d3a27] text-amber-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold block">1. Sabah Çanı: Uyanış</span>
                  <span className="text-[10px] text-[#8e7e6d]">Güneş doğuşu, diriliş</span>
                </div>
                <Bell className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleCanCal('minnet')}
                className="p-2.5 rounded bg-[#1e1913] hover:bg-[#34271c] border border-[#4d3a27] text-amber-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold block">2. Sabah Çanı: Minnet</span>
                  <span className="text-[10px] text-[#8e7e6d]">Toprak ve rızık şükrü</span>
                </div>
                <Bell className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleCanCal('koruma')}
                className="p-2.5 rounded bg-[#1e1913] hover:bg-[#34271c] border border-[#4d3a27] text-amber-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold block">3. Sabah Çanı: Koruma</span>
                  <span className="text-[10px] text-[#8e7e6d]">Lekeli büyüye karşı kalkan</span>
                </div>
                <Bell className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleCanCal('aksam')}
                className="p-2.5 rounded bg-[#201515] hover:bg-[#351e1e] border border-red-900/60 text-red-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold block">Akşam Duası Çanı</span>
                  <span className="text-[10px] text-red-300/70">Karanlığın inişi, huzur</span>
                </div>
                <Bell className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>

          {/* Hava Durumu ve Vakit Ayarları */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#3e2e20] pb-1.5 mb-3">
              Hava Koşulları ve Gün Işığı
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-heading text-[#a39482] block mb-1">
                  Hava Durumu
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {(['Acik', 'Yagmur', 'Kar', 'Sis'] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHava(h)}
                      className={`p-1.5 rounded text-xs font-semibold ${
                        hava === h
                          ? 'bg-amber-800 text-white'
                          : 'bg-[#1a140f] text-[#8e7d6b] hover:bg-[#251d16]'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-heading text-[#a39482] block mb-1">
                  Günün Vakti
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {(['Gunduz', 'Alacakaranlik', 'Gece'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVakit(v)}
                      className={`p-1 rounded text-xs font-semibold ${
                        vakit === v
                          ? 'bg-amber-800 text-white'
                          : 'bg-[#1a140f] text-[#8e7d6b] hover:bg-[#251d16]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: Anlatı Örtüsü & Fısıltı Mesajları (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Anlatı Örtüsü (Narrative Overlay for Cinematic Storytelling) */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-1.5 mb-2 flex items-center gap-1.5">
              <Scroll className="w-4 h-4 text-amber-400" />
              <span>Anlatı Örtüsü (Sinematik Metin Yayını)</span>
            </h2>
            <p className="text-xs text-[#a99c8b] mb-3">
              Anlatıcı olarak yazacağınız bu metin tüm oyuncuların ekranında kadim bir parşömen afişi olarak belirecektir.
            </p>

            <textarea
              rows={3}
              placeholder="Örn: Hanın ahşap kapısı şiddetli bir rüzgarla açılır. İçeriye boynunda Mabed zincirleri asılı, nefesi buz kesmiş bir yabancı adım atar..."
              value={anlatiMetni}
              onChange={(e) => setAnlatiMetni(e.target.value)}
              className="w-full bg-[#18130f] border border-[#503d2b] rounded p-2.5 text-xs text-[#f1e6d4] focus:outline-none font-serif leading-relaxed mb-3"
            />

            <button
              onClick={handleAnlatiGonder}
              className="w-full py-2 px-4 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 text-xs font-heading font-bold border border-[#785734] shadow flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Oyuncuların Ekranına Yayınla</span>
            </button>
          </div>

          {/* Fısıltı Mesajı (Whisper System) */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-[#bcaaa0] border-b border-[#3e2e20] pb-1.5 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-300" />
              <span>Gizli Fısıltı (Tek Bir Oyuncuya)</span>
            </h2>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#8e7e6d]">Alıcı:</span>
              <select
                value={fisiltiHedef}
                onChange={(e) => setFisiltiHedef(e.target.value)}
                className="bg-[#18130f] border border-[#503d2b] rounded px-2 py-1 text-xs text-[#eedec8]"
              >
                {karakterler.map((c) => (
                  <option key={c.id} value={c.ad}>
                    {c.ad} ({c.hane})
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Sadece bu oyuncunun duyacağı fısıltı..."
              value={fisiltiMetni}
              onChange={(e) => setFisiltiMetni(e.target.value)}
              className="w-full bg-[#18130f] border border-[#503d2b] rounded px-3 py-1.5 text-xs text-[#eedec8] focus:outline-none mb-2"
            />

            <button
              onClick={handleFisiltiGonderAction}
              className="px-4 py-1.5 rounded bg-[#251d16] hover:bg-[#382b20] text-indigo-200 text-xs font-bold border border-[#523d2b] flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Fısılda</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
