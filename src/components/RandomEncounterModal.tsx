import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { multiplayer } from '../utils/multiplayerManager';
import {
  Sparkles,
  Flame,
  ShieldAlert,
  Skull,
  Crown,
  Scroll,
  X,
  RefreshCw,
  Send,
  Zap,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RandomEncounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEncounter: (encounter: EncounterScene) => void;
}

export interface EncounterScene {
  id: string;
  kategori: 'Saray Entrikası' | 'Yol & Pusu' | 'Engizisyon Baskını' | 'Doğaüstü Kriz' | 'Vahşi Doğa & Hayvan' | 'Kadim Canavar İni' | 'Yeraltı Canavarı' | 'Ruhani Dehşet' | string;
  baslik: string;
  mekan: string;
  anlati: string;
  tehlike: string;
  zorlukSeviyesi: string;
  zorlukSayi: number;
  onerilenBeceriler: string[];
  sahneAspectleri: string[];
  dusmanlar: string[];
}

const ENCOUNTER_POOL: EncounterScene[] = [
  {
    id: 'enc_zehirli_kadeh',
    kategori: 'Saray Entrikası',
    baslik: 'Zehirli Kadeh & Muhafız Fısıltısı',
    mekan: 'Arava Sarayı: Şölen Salonu',
    anlati: 'Gümüş kadehler tokuşturulurken Lord Selya aniden boğazını tutarak yere yığılır. Kapılar sürgülenir; bir muhafız hançerini çekip partiyi işaret eder!',
    tehlike: 'Salondaki panik ve üzerinize atılan cinayet iftirası.',
    zorlukSeviyesi: '+3 (İyi)',
    zorlukSayi: 3,
    onerilenBeceriler: ['Investigate (Arama)', 'Provoke (Kışkırtma)', 'Deceive (Aldatma)'],
    sahneAspectleri: ['Kilitli Saray Kapıları', 'Yere Dökülen Zehirli Şarap', 'Panik Halindeki Soylular'],
    dusmanlar: ['2x Arhan Gölgeli Muhafızı', '1x Kâtip Casusu'],
  },
  {
    id: 'enc_gece_pusu',
    kategori: 'Yol & Pusu',
    baslik: 'Karanlık Geçit Haydutları & Sis',
    mekan: 'Galetsha Çam Ormanları: Yıkık Taş Köprü',
    anlati: 'Gece sisi çökerken köprünün iki yakasından katranlı alev okları fırlar. Ağaçların arasından zırhlı haydutlar yolu kesmiştir!',
    tehlike: 'Uçurum kenarında çapraz ateş ve yıkılmak üzere olan ahşap taban.',
    zorlukSeviyesi: '+2 (Orta)',
    zorlukSayi: 2,
    onerilenBeceriler: ['Fight (Yakın Dövüş)', 'Shoot (Menzilli)', 'Athletics (Çeviklik)'],
    sahneAspectleri: ['Çökmekte Olan Köprü Tabanı', 'Görüşü Kesen Zifiri Sis', 'Alev Alan Kuru Çalılar'],
    dusmanlar: ['3x Dağ Haydutu', '1x Arbaletli Nişancı'],
  },
  {
    id: 'enc_engizisyon',
    kategori: 'Engizisyon Baskını',
    baslik: 'Kızıl Cübbeli Müfettişler & Leke Arayıcı Tazılar',
    mekan: 'Onneva Sınırı: Terk Edilmiş Yol Mabedi',
    anlati: 'Mabedin kapıları gülle gibi bir tekmeyle açılır. Kırmızı cübbeli Engizitör ve yanındaki demir tasmalı büyü avcısı tazılar içeri dalar: "Burada büyü lekesi kokuyor!"',
    tehlike: 'Leke sayacını ifşa eden kutsal terazi kontrolü ve tutuklama tehdidi.',
    zorlukSeviyesi: '+4 (Harika)',
    zorlukSayi: 4,
    onerilenBeceriler: ['Lore (Kadim Bilgi)', 'Stealth (Gizlilik)', 'Rapport (İlişki Kurma)'],
    sahneAspectleri: ['Kutsal Terazi Mührü', 'Koku Alan Büyü Tazıları', 'Yol Vermez Engizisyon Fermanı'],
    dusmanlar: ['1x Baş Engizitör Malakor', '2x Zırhlı Tapınak Şövalyesi', '2x Mabed Tazısı'],
  },
  {
    id: 'enc_mor_kul',
    kategori: 'Doğaüstü Kriz',
    baslik: 'Mor Kül Hortlakları & Çatlayan Boyut',
    mekan: 'Khasin Boğazı: Buzla Mühürlü Zindan',
    anlati: 'Masanın ortasındaki kadim rün çatırdayarak mavi alevle yarılır. Odanın sıcaklığı donma noktasına inerken duvardaki gölgeler mor dumanlar eşliğinde ete kemiğe bürünür!',
    tehlike: 'Zihinsel dayanıklılığı çökerten KS-0 soğuk deliliği.',
    zorlukSeviyesi: '+4 (Harika)',
    zorlukSayi: 4,
    onerilenBeceriler: ['Will (İrade)', 'Fight (Kılıç)', 'Lore (Rün Kırma)'],
    sahneAspectleri: ['Donmuş Zemin (Kaygan)', 'Mor Kül Zehirlenmesi', 'Çatlayan Rün Mührü'],
    dusmanlar: ['3x Mor Kül Hortlağı', '1x Çözülmüş Buz Varlığı'],
  },
  {
    id: 'enc_liman_isyan',
    kategori: 'Saray Entrikası',
    baslik: 'Selya Rıhtımında Kundaklama & İsyan',
    mekan: 'Selyanya Vadisi: Büyük Baharat İskelesi',
    anlati: 'Tersaneden yükselen dev bir patlama rıhtımı sallar. İsyan çıkaran gemiciler tüccar kalyonlarını ateşe vermiştir; vali yardımcısı can havliyle kaçmaktadır!',
    tehlike: 'Alev fırtınası ve kontrolden çıkmış kalabalık güruhu.',
    zorlukSeviyesi: '+3 (İyi)',
    zorlukSayi: 3,
    onerilenBeceriler: ['Provoke (Baskı)', 'Physique (Güç)', 'Contacts (Bağlantılar)'],
    sahneAspectleri: ['Alev Alan Barut Fıçıları', 'Kudurmuş İsyancı Kalabalık', 'Çöken İskele Halatları'],
    dusmanlar: ['4x Tersane İsyancısı', '1x İsyan Elebaşısı'],
  },
  {
    id: 'enc_kurt_surusu',
    kategori: 'Vahşi Doğa & Hayvan',
    baslik: 'Khasinya Ayaz Kurtları & Tipi Sürüsü',
    mekan: 'Khasinya Boğazı: Donmuş Dağ Geçidi',
    anlati: 'Göz gözü görmez bir tipi fırtınasında kayalıkların tepesinden ulumalar yükselir. Buz mavisi gözleriyle Ak Yele ve aç kurt sürüsü partinin çevresini sarmıştır!',
    tehlike: 'Donma tehlikesi, çevik kurtların bacaklara yapışıp yere çekmesi.',
    zorlukSeviyesi: '+3 (İyi)',
    zorlukSayi: 3,
    onerilenBeceriler: ['Survival (Hayatta Kalma)', 'Fight (Kılıç)', 'Athletics (Denge)'],
    sahneAspectleri: ['Göz Gözü Görmez Tipi', 'Kaygan Buz Patikası', 'Aç Alfa Kurt Koruması'],
    dusmanlar: ['1x Khasinya Ayaz Kurdu ("Ak Yele")', '3x Bozkır Kurdu', '1x İğneada Gölge Parsı'],
  },
  {
    id: 'enc_bataklik_cirkinligi',
    kategori: 'Kadim Canavar İni',
    baslik: 'Selya Balçık Çirkinliği & Zehir Hidrası',
    mekan: 'Selyanya Bataklığı: Çürük Sazlıklar',
    anlati: 'Bataklığın ortasından kokuşmuş bir balçık kabarcığı patlar. Çürümüş cesetlerden bir araya gelmiş devasa bir heyula ve tıslayan su hidraları suların altından fırlar!',
    tehlike: 'Boğulma tehlikesi, çürütücü dokunuş ve asit tükürüğü.',
    zorlukSeviyesi: '+5 (Mükemmel)',
    zorlukSayi: 5,
    onerilenBeceriler: ['Physique (Beden Gücü)', 'Lore (Zayıflık Tespiti)', 'Shoot (Menzilli Ateş)'],
    sahneAspectleri: ['Dibe Çeken Balçık', 'Asit Dumanı', 'Zehirli Su Sazlıkları'],
    dusmanlar: ['1x Selya Bataklık Çirkinliği', '1x Üç Başlı Zehir Hidrası', '2x Çamur Tazısı'],
  },
  {
    id: 'enc_magara_wyrm',
    kategori: 'Yeraltı Canavarı',
    baslik: 'Çukurtepe Derinlik Wyrm\'ı & Mağara Ayısı',
    mekan: 'Çukurtepe Terk Edilmiş Maden Galerisi',
    anlati: 'Madenin derinliklerinden gelen kükürt dumanı ve yer sarsıntısıyla duvarlar çatlar. Zırh eriten asit salyalarıyla dev kör solucan ve yaralı dev mağara ayısı üzerinize hücum eder!',
    tehlike: 'Zırhların kalıcı olarak asitle delinmesi ve göçük altında kalma.',
    zorlukSeviyesi: '+4 (Harika)',
    zorlukSayi: 4,
    onerilenBeceriler: ['Athletics (Kaçınma)', 'Fight (Zayıf Noktaya Vuruş)', 'Notice (Titreşim Algılama)'],
    sahneAspectleri: ['Çökmekte Olan Maden Tavanı', 'Asit Göletleri', 'Ezici Sarsıntı'],
    dusmanlar: ['1x Çukurtepe Derinlik Wyrm\'ı', '1x Kızıl Pençeli Mağara Ayısı'],
  },
  {
    id: 'enc_leke_ifriti',
    kategori: 'Ruhani Dehşet',
    baslik: 'Gölge Leke İfriti & Aklın Çürümesi',
    mekan: 'Yasak Kütüphane: Mühürlü Mahzen',
    anlati: 'Aynaların yüzeyi çatlar ve siyah alevler odayı sarar. Gölgelerin içinden çıkan leke ifritleri oyuncuların kulaklarına delirtici fısıltılar fısıldamaya başlar!',
    tehlike: 'Zihinsel direncin çökmesi ve leke sayacının kritik seviyeye fırlaması.',
    zorlukSeviyesi: '+5 (Mükemmel)',
    zorlukSayi: 5,
    onerilenBeceriler: ['Will (İrade)', 'Lore (Kutsal Dua)', 'Provoke (Korkuyu Yenme)'],
    sahneAspectleri: ['Zihni Felç Eden Fısıltılar', 'Siyah Alev Mumları', 'Çatlayan Akıl Aynası'],
    dusmanlar: ['2x Gölge Leke İfriti', '2x Mor Kül Hortlağı', '1x Adamen Kan Vampiri'],
  },
];

export const RandomEncounterModal: React.FC<RandomEncounterModalProps> = ({
  isOpen,
  onClose,
  onApplyEncounter,
}) => {
  const [selectedEncounter, setSelectedEncounter] = useState<EncounterScene>(() => ENCOUNTER_POOL[0]);

  if (!isOpen) return null;

  const handleRandomize = () => {
    sound.playBladeClash();
    const remaining = ENCOUNTER_POOL.filter((e) => e.id !== selectedEncounter.id);
    const chosen = remaining[Math.floor(Math.random() * remaining.length)];
    setSelectedEncounter(chosen);
  };

  const handleApply = () => {
    sound.playTempleBell('uyanis');
    confetti({ particleCount: 40, spread: 60 });
    onApplyEncounter(selectedEncounter);

    // Also broadcast to multiplayer room if connected
    multiplayer.broadcast('anlati', {
      text: `🚨 YENİ SAHNE KARŞILAŞMASI: ${selectedEncounter.baslik} — ${selectedEncounter.anlati}`,
    });
    multiplayer.updateAspects(selectedEncounter.sahneAspectleri);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full parchment-sheet rounded-2xl border-2 border-amber-600/90 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSealStamp();
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#443322] pb-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full wax-seal-gold flex items-center justify-center text-amber-950">
              <Zap className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-amber-300 uppercase tracking-wider">
                GM OTOMATİK KARŞILAŞMA ÜRETECİ
              </h2>
              <p className="text-xs text-[#eedec8] font-serif italic">
                Tek tıkla karanlık fantezi sahneleri, krizler ve düşman encounter&apos;ları üretin.
              </p>
            </div>
          </div>

          <button
            onClick={handleRandomize}
            className="px-3 py-1.5 rounded-xl bg-[#2b1c11] hover:bg-[#3d2717] border border-amber-500/70 text-amber-200 text-xs font-heading font-bold flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rastgele Üret</span>
          </button>
        </div>

        {/* Generated Scene Card */}
        <div className="space-y-3.5 overflow-y-auto pr-1">
          {/* Title & Badge */}
          <div className="p-4 rounded-xl bg-[#140e0a] border-2 border-amber-500/80 space-y-2 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 uppercase">
                {selectedEncounter.kategori}
              </span>
              <span className="text-xs font-heading font-bold text-amber-400">
                Hedef Zorluk: {selectedEncounter.zorlukSeviyesi}
              </span>
            </div>

            <h3 className="font-heading font-black text-lg text-amber-200">
              {selectedEncounter.baslik}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-serif">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{selectedEncounter.mekan}</span>
            </div>

            <p className="font-serif italic text-sm text-[#f5ebd7] leading-relaxed bg-[#1b120c] p-3 rounded-lg border border-[#3b291a]">
              &quot;{selectedEncounter.anlati}&quot;
            </p>

            <div className="text-xs text-red-300/90 flex items-center gap-1.5 pt-1">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span><strong>Kriz/Tehlike:</strong> {selectedEncounter.tehlike}</span>
            </div>
          </div>

          {/* Scene Aspects & Suggested Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Aspects */}
            <div className="p-3 rounded-xl bg-[#120d09] border border-[#3b2819] space-y-2">
              <span className="text-xs font-heading font-bold text-amber-400 flex items-center gap-1">
                <Scroll className="w-3.5 h-3.5" />
                <span>Sahne Aspect&apos;leri</span>
              </span>
              <div className="space-y-1">
                {selectedEncounter.sahneAspectleri.map((asp, idx) => (
                  <span
                    key={idx}
                    className="block text-xs font-serif px-2.5 py-1 rounded bg-[#21160e] text-amber-200 border border-amber-700/50"
                  >
                    📜 {asp}
                  </span>
                ))}
              </div>
            </div>

            {/* Enemies & Skills */}
            <div className="p-3 rounded-xl bg-[#120d09] border border-[#3b2819] space-y-2">
              <span className="text-xs font-heading font-bold text-amber-400 flex items-center gap-1">
                <Skull className="w-3.5 h-3.5 text-red-400" />
                <span>Sahnedeki Düşmanlar</span>
              </span>
              <div className="space-y-1">
                {selectedEncounter.dusmanlar.map((dus, idx) => (
                  <span
                    key={idx}
                    className="block text-xs font-serif px-2.5 py-1 rounded bg-red-950/50 text-red-200 border border-red-800/50"
                  >
                    ⚔️ {dus}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#3b291a] flex gap-2">
          <button
            onClick={onClose}
            className="w-1/3 py-2.5 rounded-xl bg-[#1e140d] text-stone-300 text-xs font-heading font-bold border border-[#443322]"
          >
            İptal
          </button>
          <button
            onClick={handleApply}
            className="w-2/3 py-2.5 rounded-xl wax-seal-gold text-amber-950 text-xs font-heading font-black hover:brightness-110 shadow flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4 text-amber-900" />
            <span>Sahneyi Uygula &amp; Masaya İndir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
