import React, { useState } from 'react';
import { Karakter, NPC, HANELER, zarAt4dF } from '../rules';
import { sound } from '../utils/audio';
import {
  MessageSquare,
  Sparkles,
  Swords,
  Shield,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronRight,
  Eye,
  Lock,
  Unlock,
  Coins,
  Heart,
  Skull,
  Send,
  Feather
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DialogueOption {
  id: string;
  metin: string;
  beceri?: keyof Karakter['beceriler'] | keyof Karakter['nitelikler'];
  zorluk?: number; // Fate Ladder: 1: Vasat, 2: Adil, 3: İyi, 4: Harika
  zorlukIsmi?: string;
  muhurMaliyeti?: number;
  sonrakiDugumId?: string;
  basariDugumId?: string;
  basarisizlikDugumId?: string;
  tutumEtkisi?: number; // NPC tutumuna +1 veya -1
  supheEtkisi?: number; // Şüpheye +10 veya -10
  paraEtkisi?: number; // Aron + veya -
  savasBaslat?: boolean;
  sirAcilsinMi?: boolean;
}

interface DialogueNode {
  id: string;
  npcReplik: string;
  anlatimTasviri?: string;
  npcDuygu?: 'Sakin' | 'Kuşkulu' | 'Öfkeli' | 'Korkmuş' | 'Sırdaş' | 'Alaycı';
  secenekler: DialogueOption[];
}

interface EncounterScenario {
  id: string;
  baslik: string;
  mekan: string;
  npcId: string;
  npcAd: string;
  npcHane: string;
  npcRol: string;
  npcFotoUrl: string;
  girisMetni: string;
  baslangicDugumId: string;
  dugumler: Record<string, DialogueNode>;
}

interface DialogueScreenProps {
  aktifKarakter: Karakter;
  onKarakterGuncelle: (yeniKarakter: Karakter) => void;
  npcler: NPC[];
  onNpcGuncelle: (yeniListe: NPC[]) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
  onSavasaGec: (npc: NPC) => void;
}

// 4 Zengin Hazır Stallhart Rol Yapma ve Macera Senaryosu
const HAZIR_SENARYOLAR: EncounterScenario[] = [
  {
    id: 'enc_cassian_borc',
    baslik: 'Galetsha Kasa Mahzeni: Borç Defteri & Kanlı Mühür',
    mekan: 'Galetsha Maden Kenti - Yüksek Sayman Cassian’ın Çalışma Odası',
    npcId: 'npc_1',
    npcAd: 'Büyük Sayman Cassian Galetsha',
    npcHane: 'Galetsha',
    npcRol: 'Vezir & Tefeci',
    npcFotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    girisMetni:
      'Gümüş varaklı ağır meşe kapı ardınızdan kapandı. Cassian, altın kutusundaki mühür yüzüğünü çevirirken borç senedinizin yazılı olduğu parşömeni parmaklarının arasında eziyor.',
    baslangicDugumId: 'start',
    dugumler: {
      start: {
        id: 'start',
        anlatimTasviri:
          'Cassian gözlerini önündeki kalın defterden kaldırmadan alaycı bir tebessümle altın kupasından bir yudum aldı.',
        npcReplik:
          'Kırk Aron... Tam kırk Aron kan borcu. Kurultay ordusu senin arkandaki sınırları korurken, maden loncasının sabrı tükeniyor yüzbaşı. Ya altınları dökersin, ya da kellenin bedelini afişe bastırırım.',
        npcDuygu: 'Alaycı',
        secenekler: [
          {
            id: 'opt_fight_threat',
            metin: '[Fight / Tehdit] Masaya doğru bir adım atıp kılıcının kabzasını kavra: "Kellemin bedeli senin maden muhafızlarının canından daha pahalıya patlar."',
            beceri: 'Fight',
            zorluk: 2,
            zorlukIsmi: 'Adil (+2)',
            basariDugumId: 'threat_success',
            basarisizlikDugumId: 'threat_fail',
            tutumEtkisi: -1,
            supheEtkisi: 15,
          },
          {
            id: 'opt_lore_contract',
            metin: '[Lore / Kadim Hukuk] Sahte faiz maddesini yüzüne vur: "Bu sözleşmedeki üçüncü mühür Kurultay kanununa aykırı. Hile yaptığını biliyorum."',
            beceri: 'Lore',
            zorluk: 3,
            zorlukIsmi: 'İyi (+3)',
            basariDugumId: 'contract_success',
            basarisizlikDugumId: 'contract_fail',
            sirAcilsinMi: true,
          },
          {
            id: 'opt_provoke_bargain',
            metin: '[Provoke / Pazarlık] Ona daha karlı bir takas öner: "Borcu unutursan sana Karanlık Nehir kaçakçılarının gizli askeri haritasını getiririm."',
            beceri: 'ProvokeManipulate',
            zorluk: 2,
            zorlukIsmi: 'Adil (+2)',
            basariDugumId: 'bargain_success',
            basarisizlikDugumId: 'bargain_fail',
          },
          {
            id: 'opt_pay_half',
            metin: '[Ödeme] "Şimdilik 15 Aron avans veriyorum, kalanını haftaya Kurultay divanında teslim edeceğim."',
            sonrakiDugumId: 'pay_dialogue',
            paraEtkisi: -15,
          },
        ],
      },
      threat_success: {
        id: 'threat_success',
        anlatimTasviri: 'Cassian’ın göz bebekleri büyüdü. Masadaki altın kutuyu hızla geriye doğru çekti.',
        npcReplik:
          'Sakin ol asker... Masamda kan dökmek ikimizin de işine yaramaz. Pekala, borcun vadesini bir hafta erteliyorum; fakat karşılığında Kurultay kütüphanesinden benim için bir evrak çalacaksın.',
        npcDuygu: 'Korkmuş',
        secenekler: [
          {
            id: 'opt_accept_favor',
            metin: '"Evrakın detaylarını ver. Ama bir daha kapıma adam yollarsan kılıcım kınında kalmaz."',
            sonrakiDugumId: 'quest_given',
            tutumEtkisi: 1,
          },
          {
            id: 'opt_push_harder',
            metin: '[STR / Gözdağı] Masaya bir yumruk indir: "Ertelenme değil, borç senedi tamamen yırtılacak!"',
            beceri: 'STR',
            zorluk: 3,
            zorlukIsmi: 'İyi (+3)',
            basariDugumId: 'debt_torn',
            basarisizlikDugumId: 'call_guards',
          },
        ],
      },
      threat_fail: {
        id: 'threat_fail',
        anlatimTasviri: 'Cassian zil çaldı. Kapının arkasındaki zırhlı iki muhafız hançerlerini çekerek içeri daldı!',
        npcReplik:
          'Büyük Sayman’ı kendi odasında tehdit etmek mi? Cesur ama ahmakça. Muhafızlar, bu sokak köpeğinin kollarını kırıp zindana atın!',
        npcDuygu: 'Öfkeli',
        secenekler: [
          {
            id: 'opt_to_battle',
            metin: '⚔️ Kılıcını çek ve savaşa hazırlan! (Savaş Meydanına Geç)',
            savasBaslat: true,
          },
        ],
      },
      contract_success: {
        id: 'contract_success',
        anlatimTasviri: 'Cassian’ın yüzündeki kan çekildi. Parşömeni aceleyle katlayıp çekmeceye soktu.',
        npcReplik:
          'Şşşt! Sesini alçalt... O mührü nereden öğrendin? Lanet olsun, o parşömen divanın eline geçerse boynuma yağlı urgan geçer. Dinle beni; borcun silindi sayılır, yeter ki o bahsi bir daha açma.',
        npcDuygu: 'Sırdaş',
        secenekler: [
          {
            id: 'opt_blackmail_reward',
            metin: '"Sadece borç yetmez Cassian. Sessizliğim için bana 25 Aron ve bir geçiş izni vereceksin."',
            sonrakiDugumId: 'blackmail_payout',
            paraEtkisi: 25,
            tutumEtkisi: 1,
          },
        ],
      },
      contract_fail: {
        id: 'contract_fail',
        anlatimTasviri: 'Cassian küçümseyici bir kahkaha patlattı.',
        npcReplik:
          'Hukuk mu? Stallhart mahkemelerinde hakimler benim altınlarımla şarap içer vezir bozuntusu. Bu palavralarla beni korkutamazsın.',
        npcDuygu: 'Alaycı',
        secenekler: [
          {
            id: 'opt_back_to_threat',
            metin: '"Öyleyse kaba kuvvetle çözeriz!"',
            savasBaslat: true,
          },
        ],
      },
      bargain_success: {
        id: 'bargain_success',
        anlatimTasviri: 'Cassian arkasına yaslandı, gözleri açgözlü bir parıltıyla parıldadı.',
        npcReplik:
          'Karanlık Nehir haritası ha? Maden kaçakçılarının kullandığı tüneller o haritada işaretliyse... anlaşabiliriz. Haritayı getir, borcun yarısını defterden sileyim.',
        npcDuygu: 'Sakin',
        secenekler: [
          {
            id: 'opt_accept_quest',
            metin: '"Anlaştık. İki gün sonra haritayla buradayım."',
            sonrakiDugumId: 'quest_given',
          },
        ],
      },
      bargain_fail: {
        id: 'bargain_fail',
        anlatimTasviri: 'Cassian başını iki yana salladı.',
        npcReplik: 'Boş vaatlerle karın doymuyor. Masaya somut bir şey koyana kadar borç işlemeye devam ediyor.',
        npcDuygu: 'Kuşkulu',
        secenekler: [
          {
            id: 'opt_leave_room',
            metin: '"Bu mesele burada bitmedi Cassian." (Odadan Ayrıl)',
            sonrakiDugumId: 'end_neutral',
          },
        ],
      },
      debt_torn: {
        id: 'debt_torn',
        anlatimTasviri: 'Titreyen elleriyle senedi ortadan ikiye yırttı ve masadaki muma tutarak kül etti.',
        npcReplik: 'Al... Bitti! Şimdi defol buradan! Yüzünü bir daha görmek istemiyorum.',
        npcDuygu: 'Korkmuş',
        secenekler: [
          {
            id: 'opt_victory_leave',
            metin: 'Küllerin üzerinden basarak gururla ayrıl. (Zafer)',
            sonrakiDugumId: 'end_victory',
          },
        ],
      },
      call_guards: {
        id: 'call_guards',
        anlatimTasviri: 'Cassian kapıya doğru atıldı: "Nöbetçiler! Suikastçı var, vurun şunu!"',
        npcReplik: 'Buradan sağ çıkamayacaksın!',
        npcDuygu: 'Öfkeli',
        secenekler: [
          {
            id: 'opt_fight_now',
            metin: '⚔️ Kılıcını çek ve hücum et! (Savaş Ekranı)',
            savasBaslat: true,
          },
        ],
      },
      pay_dialogue: {
        id: 'pay_dialogue',
        anlatimTasviri: 'Altın sikkeleri tek tek tartıp kadife keseye doldurdu.',
        npcReplik:
          'Güzel... Şimdilik kellen sende kalıyor. Kalan 25 Aron için bir haftan var. Gecikirsen bu kadar merhametli olmam.',
        npcDuygu: 'Sakin',
        secenekler: [
          {
            id: 'opt_leave_room_paid',
            metin: '"Haftaya görüşürüz Cassian." (Ayrıl)',
            sonrakiDugumId: 'end_neutral',
          },
        ],
      },
      blackmail_payout: {
        id: 'blackmail_payout',
        anlatimTasviri: 'Ağır bir altın kesesini masanın üzerinden sana doğru itti.',
        npcReplik:
          'İşte 25 Aron ve seyahat belgesi. Şimdi o lanet sırrı unut ve şehri terk etmeden önce göze batma.',
        npcDuygu: 'Kuşkulu',
        secenekler: [
          {
            id: 'opt_finish_blackmail',
            metin: 'Keseyi kuşağına sok ve tebessüm ederek çık. (Başarı)',
            sonrakiDugumId: 'end_victory',
          },
        ],
      },
      quest_given: {
        id: 'quest_given',
        anlatimTasviri: 'Mühürlü bir pusulayı parmaklarının ucuna tutuşturdu.',
        npcReplik: 'İş bittiğinde beni yine burada bul. Yanlış bir adım atarsan iki taraf da kaybeder.',
        npcDuygu: 'Sakin',
        secenekler: [
          {
            id: 'opt_leave_quest',
            metin: 'Pusulayı sefer heybene yerleştirip odadan çık.',
            sonrakiDugumId: 'end_neutral',
          },
        ],
      },
      end_neutral: {
        id: 'end_neutral',
        anlatimTasviri: 'Mahzenden çıktın, sokaktaki karanlık sis seni karşıladı.',
        npcReplik: '...',
        npcDuygu: 'Sakin',
        secenekler: [],
      },
      end_victory: {
        id: 'end_victory',
        anlatimTasviri: 'Cassian’ın kibirli gururunu kırdın. Galetsha loncası artık senden çekiniyor.',
        npcReplik: '...',
        npcDuygu: 'Korkmuş',
        secenekler: [],
      },
    },
  },
  {
    id: 'enc_malakor_inquisition',
    baslik: 'Mabed Engizisyonu: Denge Barikatında Leke Teftişi',
    mekan: 'Kutsal Şehir Kapıları - Engizisyon Çan Kulesi Altı',
    npcId: 'npc_3',
    npcAd: 'Engizitör Malakor',
    npcHane: 'Mabed',
    npcRol: 'Mabed Yargıcı',
    npcFotoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    girisMetni:
      'Garn kapısında kurşun zincirler yolu kesmiş. Engizitör Malakor, elindeki dumanı tüten kutsal buhurdanlıkla gözlerini doğrudan ruhunuza dikiyor.',
    baslangicDugumId: 'start',
    dugumler: {
      start: {
        id: 'start',
        anlatimTasviri:
          'Buhurdanlıktan çıkan kükürt ve adaçayı dumanı ciğerlerinizi yakıyor. Malakor boynundaki yedi kurşun mührü şakırdatarak yaklaştı.',
        npcReplik:
          'Dur yolcu! Havada is ve yasak dokumanın çürük kokusu var. Gözlerini göster bana. Denge kanunundan kaçan lekeliler bu kapıdan yalnızca zincirle geçer.',
        npcDuygu: 'Kuşkulu',
        secenekler: [
          {
            id: 'opt_stealth_conceal',
            metin: '[Stealth / Leke Gizleme] Kollarındaki moraran damarları cübbenin altına saklayarak gözlerini sabit tut.',
            beceri: 'Stealth',
            zorluk: 3,
            zorlukIsmi: 'İyi (+3)',
            basariDugumId: 'conceal_success',
            basarisizlikDugumId: 'conceal_fail',
            supheEtkisi: -15,
          },
          {
            id: 'opt_provoke_faith',
            metin: '[Provoke / Kutsal Beyan] Mabed andını haykır: "Ben Stallhart ordusunun şerefli neferiyim, asıl sen kutsal sancağa hakaret ediyorsun!"',
            beceri: 'ProvokeManipulate',
            zorluk: 2,
            zorlukIsmi: 'Adil (+2)',
            basariDugumId: 'faith_success',
            basarisizlikDugumId: 'faith_fail',
          },
          {
            id: 'opt_lore_inquisitor',
            metin: '[Lore / Teftiş Kuralları] "Engizisyon fermanının 12. maddesine göre Kurultay muhafızları barikat aramalarından muaftır."',
            beceri: 'Lore',
            zorluk: 2,
            zorlukIsmi: 'Adil (+2)',
            basariDugumId: 'law_success',
            basarisizlikDugumId: 'law_fail',
          },
          {
            id: 'opt_bribe_temple',
            metin: '[Rüşvet] Çan kulesi kefareti adı altında gizlice 20 Aron sun.',
            sonrakiDugumId: 'bribe_attempt',
            paraEtkisi: -20,
          },
        ],
      },
      conceal_success: {
        id: 'conceal_success',
        anlatimTasviri: 'Buhurdanlığı yüzüne doğru salladı, ancak duman maviye dönmedi.',
        npcReplik:
          'Kanın temiz görünüyor... Şimdilik. Geç bakalım yolcu. Fakat unutma; Denge Mahkemesi uyumaz.',
        npcDuygu: 'Sakin',
        secenekler: [
          {
            id: 'opt_pass_gate',
            metin: 'Başını hafifçe eğip kapıdan geç. (Tehlike Atlatıldı)',
            sonrakiDugumId: 'end_pass',
          },
        ],
      },
      conceal_fail: {
        id: 'conceal_fail',
        anlatimTasviri: 'Buhurdanlıktan yükselen duman aniden kapkara oldu ve tısladı!',
        npcReplik:
          'LEKELİ! Rünlerin kokusu derinden tütüyor! Cellatlar, bu yaratığı zincire vurun!',
        npcDuygu: 'Öfkeli',
        secenekler: [
          {
            id: 'opt_fight_inquisitor',
            metin: '⚔️ Kılıcını çek ve barikata hücum et! (Savaş Ekranı)',
            savasBaslat: true,
          },
        ],
      },
      faith_success: {
        id: 'faith_success',
        anlatimTasviri: 'Malakor geri adım attı, kılıcındaki Stallhart armasını inceledi.',
        npcReplik:
          'Sesin gür çıkıyor asker. Birliğine olan sadakatine hürmeten geçişine izin veriyorum. Şehirde taşkınlık çıkarma.',
        npcDuygu: 'Sakin',
        secenekler: [
          {
            id: 'opt_pass_faith',
            metin: 'Kılıcını selamlayarak şehre gir.',
            sonrakiDugumId: 'end_pass',
          },
        ],
      },
      faith_fail: {
        id: 'faith_fail',
        anlatimTasviri: 'Malakor soğuk bir kahkaha attı.',
        npcReplik: 'Küstahlık! Mabedin önünde hiçbir dünyevi unvan seni arınma ateşinden kurtaramaz!',
        npcDuygu: 'Öfkeli',
        secenekler: [
          {
            id: 'opt_fight_inquisitor_2',
            metin: '⚔️ Savaşı Başlat!',
            savasBaslat: true,
          },
        ],
      },
      law_success: {
        id: 'law_success',
        anlatimTasviri: 'Malakor parmaklarını kemerine vurdu. Kanunun açık hükmü karşısında duraksadı.',
        npcReplik:
          'Kanunları iyi biliyorsun yüzbaşı. Yolun açık olsun; ama gözüm üzerinde olacak.',
        npcDuygu: 'Kuşkulu',
        secenekler: [
          {
            id: 'opt_pass_law',
            metin: 'Hızlı adımlarla barikatı geç.',
            sonrakiDugumId: 'end_pass',
          },
        ],
      },
      law_fail: {
        id: 'law_fail',
        anlatimTasviri: 'Malakor fermanı küçümsedi: "Burada kanun benim sözümdür!"',
        npcReplik: 'Silahlarını teslim et yoksa kelleni alırım!',
        npcDuygu: 'Öfkeli',
        secenekler: [
          {
            id: 'opt_fight_inquisitor_3',
            metin: '⚔️ Savunmaya Geç ve Çarpış!',
            savasBaslat: true,
          },
        ],
      },
      bribe_attempt: {
        id: 'bribe_attempt',
        anlatimTasviri: 'Keseyi pelerinine sokarken buhurdanlığı indirdi.',
        npcReplik:
          'Mabed vakfına yapılan bu cömert bağış günahlarını hafifletti. Geç ve arkana bakma.',
        npcDuygu: 'Sırdaş',
        secenekler: [
          {
            id: 'opt_bribe_leave',
            metin: 'Hızlıca içeri sız.',
            sonrakiDugumId: 'end_pass',
          },
        ],
      },
      end_pass: {
        id: 'end_pass',
        anlatimTasviri: 'Barikatı geride bıraktın. Kutsal şehrin taş sokakları önünde uzanıyor.',
        npcReplik: '...',
        npcDuygu: 'Sakin',
        secenekler: [],
      },
    },
  },
  {
    id: 'enc_tosh_spy',
    baslik: 'Karanlık Kemer: Kör Karga Tosh ile Sır ve Şarap Pazarlığı',
    mekan: 'Stallhart Kalp Eyaleti - Kanalizasyon Çıkışı Tekinsiz Meyhane',
    npcId: 'npc_4',
    npcAd: 'Kör Karga Tosh',
    npcHane: 'Memanth',
    npcRol: 'Casus & Muhbir',
    npcFotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    girisMetni:
      'Tosh, loş köşedeki tahta masada şarap kadehinin kenarını kokluyor. Kör gözü boşluğa bakarken kulakları odadaki her fısıltıyı süzüyor.',
    baslangicDugumId: 'start',
    dugumler: {
      start: {
        id: 'start',
        anlatimTasviri: 'Ayak seslerinizi duyar duymaz başını hafifçe yana yatırdı.',
        npcReplik:
          'Kılıcının kınındaki çentik... Ve botlarındaki ıslak kireç kokusu. Goran’ın adamısın değil mi? Masama oturmak 5 Aron ya da güzel bir şarap gerektirir yabancı.',
        npcDuygu: 'Alaycı',
        secenekler: [
          {
            id: 'opt_give_wine',
            metin: '[5 Aron / İkram] Masaya 5 Aron koy: "Saray muhafızlarının nöbet değişim saatlerini öğrenmeye geldim."',
            sonrakiDugumId: 'guard_intel',
            paraEtkisi: -5,
          },
          {
            id: 'opt_investigate_tosh',
            metin: '[Investigate / Gözlem] Masasındaki parşömen kırıntılarını ve cebindeki mührü gizlice süz.',
            beceri: 'Investigate',
            zorluk: 2,
            zorlukIsmi: 'Adil (+2)',
            basariDugumId: 'tosh_inspect_success',
            basarisizlikDugumId: 'tosh_inspect_fail',
            sirAcilsinMi: true,
          },
          {
            id: 'opt_threat_tosh',
            metin: '[Provoke / Tehdit] "Sana para yerine nefes alma şansı veriyorum Tosh. Bildiklerini dök."',
            beceri: 'ProvokeManipulate',
            zorluk: 2,
            zorlukIsmi: 'Adil (+2)',
            basariDugumId: 'tosh_threat_success',
            basarisizlikDugumId: 'tosh_threat_fail',
          },
        ],
      },
      guard_intel: {
        id: 'guard_intel',
        anlatimTasviri: 'Parayı dişleriyle kontrol edip fısıldadı.',
        npcReplik:
          'Akşam çanından yarım saat sonra batı kulesindeki nöbetçiler şarap mahzenine iner. Tam on iki dakikanız var. Giriş kuzey drenaj borusundan.',
        npcDuygu: 'Sırdaş',
        secenekler: [
          {
            id: 'opt_intel_thanks',
            metin: '"Bu bilgi işime yarar Tosh. Sağ olasın."',
            sonrakiDugumId: 'end_tosh',
          },
        ],
      },
      tosh_inspect_success: {
        id: 'tosh_inspect_success',
        anlatimTasviri: 'Cebindeki kurşun kutunun üzerinde Galetsha saymanının gizli mührünü yakaladın!',
        npcReplik:
          'Hey... Nereye bakıyorsun öyle? Pekala, keskin gözlerin var. O kutudaki bilgiler Kurultay Divanını havaya uçurur. Sana ortaklık teklif ediyorum.',
        npcDuygu: 'Kuşkulu',
        secenekler: [
          {
            id: 'opt_alliance_tosh',
            metin: '"Ortaklık dinlemeye değer. Payımı peşin isterim."',
            sonrakiDugumId: 'end_tosh',
            paraEtkisi: 10,
          },
        ],
      },
      tosh_inspect_fail: {
        id: 'tosh_inspect_fail',
        anlatimTasviri: 'Tosh aniden kadehini masaya vurarak ceplerini kapattı.',
        npcReplik: 'Gözlerin fazla dolanıyor evlat. Körüm ama aptal değilim. Konuşma bitti.',
        npcDuygu: 'Kuşkulu',
        secenekler: [
          {
            id: 'opt_leave_tosh',
            metin: 'Masadan kalkıp uzaklaş.',
            sonrakiDugumId: 'end_tosh',
          },
        ],
      },
      tosh_threat_success: {
        id: 'tosh_threat_success',
        anlatimTasviri: 'Boğazına dayanan parmağın sıcaklığını hissedince titredi.',
        npcReplik: 'Tamam tamam! Dur! Sayman Cassian bu gece bataklık kaçakçılarıyla buluşacak. Hepsi bu, yemin ederim!',
        npcDuygu: 'Korkmuş',
        secenekler: [
          {
            id: 'opt_threat_done',
            metin: 'Onu serbest bırak ve bilgiyi not al.',
            sonrakiDugumId: 'end_tosh',
          },
        ],
      },
      tosh_threat_fail: {
        id: 'tosh_threat_fail',
        anlatimTasviri: 'Tosh masanın altındaki zili tekmeledi. Meyhanedeki 3 izbandut ayağa kalktı!',
        npcReplik: 'Yanlış adama çattın yüzbaşı. Çocuklar, bu arkadaşı kapının önüne atın!',
        npcDuygu: 'Öfkeli',
        secenekler: [
          {
            id: 'opt_fight_tosh_thugs',
            metin: '⚔️ Kavgayı Başlat! (Savaş Ekranı)',
            savasBaslat: true,
          },
        ],
      },
      end_tosh: {
        id: 'end_tosh',
        anlatimTasviri: 'Tekinsiz meyhaneden ayrıldın. Gece havası soğuk ve gizemli.',
        npcReplik: '...',
        npcDuygu: 'Sakin',
        secenekler: [],
      },
    },
  },
];

export const DialogueScreen: React.FC<DialogueScreenProps> = ({
  aktifKarakter,
  onKarakterGuncelle,
  npcler,
  onNpcGuncelle,
  rol,
  onSavasaGec,
}) => {
  // Seçili Senaryo
  const [seciliSenaryoId, setSeciliSenaryoId] = useState<string>(HAZIR_SENARYOLAR[0].id);
  const senaryo = HAZIR_SENARYOLAR.find((s) => s.id === seciliSenaryoId) || HAZIR_SENARYOLAR[0];

  // Senaryo Düğümü
  const [mevcutDugumId, setMevcutDugumId] = useState<string>(senaryo.baslangicDugumId);
  const dugum = senaryo.dugumler[mevcutDugumId] || senaryo.dugumler[senaryo.baslangicDugumId];

  // Diyalog Geçmişi
  const [diyalogGecmisi, setDiyalogGecmisi] = useState<
    { gonderen: string; metin: string; tasvir?: string; tur: 'npc' | 'oyuncu' | 'zar' | 'anlatici' }[]
  >([
    {
      gonderen: 'Anlatıcı',
      metin: senaryo.girisMetni,
      tur: 'anlatici',
    },
    {
      gonderen: senaryo.npcAd,
      metin: dugum.npcReplik,
      tasvir: dugum.anlatimTasviri,
      tur: 'npc',
    },
  ]);

  // NPC Anlık Durum
  const bagliNpc = npcler.find((n) => n.id === senaryo.npcId) || npcler[0];
  const [npcTutum, setNpcTutum] = useState<number>(bagliNpc?.tutum || 0); // -3 .. +3
  const [npcSuphe, setNpcSuphe] = useState<number>(30); // 0 .. 100
  const [acilanSir, setAcilanSir] = useState<boolean>(false);

  // Zar ve Mühür State
  const [sonZarSonucu, setSonZarSonucu] = useState<{
    beceriAdi: string;
    zarToplami: number;
    bonus: number;
    toplamSkor: number;
    zorluk: number;
    fark: number;
    basarili: boolean;
    bekleyenSecenek?: DialogueOption;
  } | null>(null);

  const [zarAtiliyor, setZarAtiliyor] = useState<boolean>(false);

  // Divan Mahkemesi & İtibar/Şantaj Düellosu Modu
  const [divanModu, setDivanModu] = useState<boolean>(false);
  const [npcItibar, setNpcItibar] = useState<number>(5);
  const [oyuncuItibar, setOyuncuItibar] = useState<number>(5);

  const handleDivanHamlesi = (
    hamleTuru: 'itham' | 'santaj' | 'tuzuk' | 'rusvet' | 'yemin'
  ) => {
    sound.playBladeClash();
    const zarlar = zarAt4dF();
    const zarTop = zarlar.reduce((a, b) => a + b, 0);

    if (hamleTuru === 'itham') {
      const aldris = aktifKarakter.yaklasimlar?.Aldris ?? 2;
      const toplam = zarTop + aldris;
      const basarili = toplam >= 2;
      if (basarili) {
        sound.playSealStamp();
        confetti({ particleCount: 35, spread: 60 });
        const yeniItibar = Math.max(0, npcItibar - 2);
        setNpcItibar(yeniItibar);
        setDiyalogGecmisi((prev) => [
          ...prev,
          {
            gonderen: aktifKarakter.ad,
            metin: `⚖️ [DİVAN İTHAMI] "Hane divanı önünde suçlarınızı kanıtlayan mühürlü kayıtları sunuyorum!" (${toplam} Skor vs +2 Eşik)`,
            tur: 'oyuncu',
          },
          {
            gonderen: senaryo.npcAd,
            metin: `(İtibar Kaybı: -2) "Bu belgeler sahte! Divan bunu kabul edemez!"`,
            tur: 'npc',
          },
        ]);
      } else {
        setOyuncuItibar((prev) => Math.max(0, prev - 1));
        setDiyalogGecmisi((prev) => [
          ...prev,
          {
            gonderen: aktifKarakter.ad,
            metin: `[BAŞARISIZ İTHAM] Kanıtlarınız divan heyeti tarafından yetersiz bulundu! (-1 Kendi İtibarınız)`,
            tur: 'oyuncu',
          },
        ]);
      }
    } else if (hamleTuru === 'santaj') {
      const lodvez = aktifKarakter.yaklasimlar?.Lodvez ?? 2;
      const toplam = zarTop + lodvez;
      if (toplam >= 2) {
        sound.playSealStamp();
        setNpcItibar((prev) => Math.max(0, prev - 3));
        setNpcSuphe(100);
        setDiyalogGecmisi((prev) => [
          ...prev,
          {
            gonderen: aktifKarakter.ad,
            metin: `🗡️ [ŞANTAJ & SIR] "Karasu kaçakçılarıyla yaptığınız gizli anlaşmanın mektubu bende..." (-3 Rakip İtibar!)`,
            tur: 'oyuncu',
          },
          {
            gonderen: senaryo.npcAd,
            metin: `(Dehşet İçinde) "Sessiz ol... Kimseye söyleme! Ne istiyorsun?!"`,
            tur: 'npc',
          },
        ]);
      } else {
        setOyuncuItibar((prev) => Math.max(0, prev - 2));
        setDiyalogGecmisi((prev) => [
          ...prev,
          {
            gonderen: senaryo.npcAd,
            metin: `"Bana iftira atmanın bedelini divan muhafızları ödetecek!" (-2 Kendi İtibarınız)`,
            tur: 'npc',
          },
        ]);
      }
    } else if (hamleTuru === 'tuzuk') {
      setOyuncuItibar((prev) => Math.min(5, prev + 2));
      sound.playSealStamp();
      setDiyalogGecmisi((prev) => [
        ...prev,
        {
          gonderen: aktifKarakter.ad,
          metin: `🛡️ [HANE TÜZÜĞÜNE SIĞINMA] "Stallhart Hane Tüzüğü Madde 14 uyarınca dokunulmazlığımı talep ediyorum!" (+2 İtibar Tahkimatı)`,
          tur: 'oyuncu',
        },
      ]);
    } else if (hamleTuru === 'rusvet') {
      if ((aktifKarakter.ekonomi?.aron || 0) < 10) {
        alert('Yeterli Aron yok! (10 Aron gerekli)');
        return;
      }
      onKarakterGuncelle({
        ...aktifKarakter,
        ekonomi: { ...aktifKarakter.ekonomi, aron: (aktifKarakter.ekonomi.aron || 0) - 10 },
      });
      sound.playSealStamp();
      setNpcItibar((prev) => Math.max(0, prev - 2));
      setDiyalogGecmisi((prev) => [
        ...prev,
        {
          gonderen: aktifKarakter.ad,
          metin: `💰 [RÜŞVET / ALTIN KESESİ] Masaya 10 Aron bırakıldı; tanıklar susturuldu!`,
          tur: 'oyuncu',
        },
      ]);
    } else if (hamleTuru === 'yemin') {
      sound.playSealStamp();
      setNpcItibar((prev) => Math.max(0, prev - 2));
      setDiyalogGecmisi((prev) => [
        ...prev,
        {
          gonderen: aktifKarakter.ad,
          metin: `⚖️ [MABED YEMİNİ] Erau mihrabında hakikat andı içildi! Yalanlar mühürlendi.`,
          tur: 'oyuncu',
        },
      ]);
    }
  };

  // GM Özel Mesaj Girişi
  const [gmGirdi, setGmGirdi] = useState<string>('');

  // Senaryo Değiştiğinde Sıfırla
  const handleSenaryoSec = (yeniId: string) => {
    sound.playSealStamp();
    const yeniSen = HAZIR_SENARYOLAR.find((s) => s.id === yeniId) || HAZIR_SENARYOLAR[0];
    setSeciliSenaryoId(yeniId);
    setMevcutDugumId(yeniSen.baslangicDugumId);
    setSonZarSonucu(null);
    setNpcTutum(0);
    setNpcSuphe(30);
    setAcilanSir(false);

    const baslangicDugumu = yeniSen.dugumler[yeniSen.baslangicDugumId];
    setDiyalogGecmisi([
      { gonderen: 'Anlatıcı', metin: yeniSen.girisMetni, tur: 'anlatici' },
      { gonderen: yeniSen.npcAd, metin: baslangicDugumu.npcReplik, tasvir: baslangicDugumu.anlatimTasviri, tur: 'npc' },
    ]);
  };

  // Oyuncu Seçenek Tıkladığında
  const handleSecenekSec = (secenek: DialogueOption) => {
    // Para Etkisi Varsa Uygula
    if (secenek.paraEtkisi && secenek.paraEtkisi !== 0) {
      const yeniAron = Math.max(0, aktifKarakter.ekonomi.aron + secenek.paraEtkisi);
      onKarakterGuncelle({
        ...aktifKarakter,
        ekonomi: { ...aktifKarakter.ekonomi, aron: yeniAron },
      });
    }

    // Tutum ve Şüphe Etkisi
    if (secenek.tutumEtkisi) {
      setNpcTutum((prev) => Math.max(-3, Math.min(3, prev + (secenek.tutumEtkisi || 0))));
    }
    if (secenek.supheEtkisi) {
      setNpcSuphe((prev) => Math.max(0, Math.min(100, prev + (secenek.supheEtkisi || 0))));
    }
    if (secenek.sirAcilsinMi) {
      setAcilanSir(true);
    }

    // Seçeneği Diyalog Akışına Ekle
    setDiyalogGecmisi((prev) => [
      ...prev,
      { gonderen: aktifKarakter.ad, metin: secenek.metin, tur: 'oyuncu' },
    ]);

    // 1. ZAR KONTROLLÜ SEÇENEK (Fate 4dF Skill Check)
    if (secenek.beceri && secenek.zorluk !== undefined) {
      sound.playDiceRoll();
      setZarAtiliyor(true);

      setTimeout(() => {
        const zarlar = zarAt4dF();
        const zarToplami = zarlar.reduce((a, b) => a + b, 0);

        // Beceri ya da Nitelik Değeri
        let bonus = 1;
        if (secenek.beceri && secenek.beceri in aktifKarakter.beceriler) {
          bonus = aktifKarakter.beceriler[secenek.beceri as keyof Karakter['beceriler']];
        } else if (secenek.beceri && secenek.beceri in aktifKarakter.nitelikler) {
          bonus = aktifKarakter.nitelikler[secenek.beceri as keyof Karakter['nitelikler']];
        }

        const toplamSkor = zarToplami + bonus;
        const fark = toplamSkor - secenek.zorluk!;
        const basarili = fark >= 0;

        setSonZarSonucu({
          beceriAdi: secenek.beceri as string,
          zarToplami,
          bonus,
          toplamSkor,
          zorluk: secenek.zorluk!,
          fark,
          basarili,
          bekleyenSecenek: secenek,
        });

        const zarMesaji = `🎲 [Fate Zarı: ${secenek.beceri}] 4dF(${zarToplami >= 0 ? `+${zarToplami}` : zarToplami}) + ${bonus} = ${toplamSkor} vs Zorluk ${secenek.zorluk} ➔ ${
          basarili ? (fark >= 2 ? '🌟 ÜSTÜN BAŞARI' : '✅ BAŞARILI') : '❌ BAŞARISIZ'
        }`;

        setDiyalogGecmisi((prev) => [
          ...prev,
          { gonderen: 'Kader Zarı', metin: zarMesaji, tur: 'zar' },
        ]);

        setZarAtiliyor(false);

        if (basarili) {
          sound.playSealStamp();
          if (fark >= 2) confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
          const hedefDugumId = secenek.basariDugumId || secenek.sonrakiDugumId;
          if (hedefDugumId && senaryo.dugumler[hedefDugumId]) {
            geciseIlerle(hedefDugumId);
          }
        } else {
          sound.playBladeClash();
          const hedefDugumId = secenek.basarisizlikDugumId || secenek.sonrakiDugumId;
          if (hedefDugumId && senaryo.dugumler[hedefDugumId]) {
            geciseIlerle(hedefDugumId);
          }
        }
      }, 500);
      return;
    }

    // 2. SAVAŞA BAŞLA
    if (secenek.savasBaslat) {
      sound.playBladeClash();
      onSavasaGec(bagliNpc);
      return;
    }

    // 3. NORMAL GEÇİŞ
    sound.playSealStamp();
    if (secenek.sonrakiDugumId && senaryo.dugumler[secenek.sonrakiDugumId]) {
      geciseIlerle(secenek.sonrakiDugumId);
    }
  };

  const geciseIlerle = (yeniDugumId: string) => {
    setMevcutDugumId(yeniDugumId);
    const yeniDugum = senaryo.dugumler[yeniDugumId];
    if (yeniDugum && yeniDugum.npcReplik) {
      setTimeout(() => {
        setDiyalogGecmisi((prev) => [
          ...prev,
          {
            gonderen: senaryo.npcAd,
            metin: yeniDugum.npcReplik,
            tasvir: yeniDugum.anlatimTasviri,
            tur: 'npc',
          },
        ]);
      }, 300);
    }
  };

  // Mühür Harca (Invoke Aspect: +2 Ekle veya Yeniden At)
  const handleMuhurHarca = () => {
    if (aktifKarakter.sayaclar.muhur <= 0 || !sonZarSonucu) return;

    sound.playSealStamp();
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 } });

    // 1 Mühür Düş
    onKarakterGuncelle({
      ...aktifKarakter,
      sayaclar: { ...aktifKarakter.sayaclar, muhur: aktifKarakter.sayaclar.muhur - 1 },
    });

    // Skora +2 Ekle ve Sonucu Başarılıya Çevir
    const yeniToplam = sonZarSonucu.toplamSkor + 2;
    const yeniFark = yeniToplam - sonZarSonucu.zorluk;
    const yeniBasarili = yeniFark >= 0;

    setSonZarSonucu({
      ...sonZarSonucu,
      toplamSkor: yeniToplam,
      fark: yeniFark,
      basarili: yeniBasarili,
    });

    setDiyalogGecmisi((prev) => [
      ...prev,
      {
        gonderen: 'Fate Mührü',
        metin: `✨ [Görünüş Çağrıldı: "${aktifKarakter.gorunumler.anaKavram}"] 1 Mühür harcandı! Skora +2 eklendi (${yeniToplam}) ➔ Kader lehine döndü!`,
        tur: 'zar',
      },
    ]);

    if (yeniBasarili && sonZarSonucu.bekleyenSecenek?.basariDugumId) {
      geciseIlerle(sonZarSonucu.bekleyenSecenek.basariDugumId);
    }
  };

  // GM Özel Replik Gönder
  const handleGmReplikGonder = () => {
    if (!gmGirdi.trim()) return;
    sound.playSealStamp();
    setDiyalogGecmisi((prev) => [
      ...prev,
      { gonderen: 'Anlatıcı (Aldris)', metin: gmGirdi.trim(), tur: 'anlatici' },
    ]);
    setGmGirdi('');
  };

  // Diyaloğu Baştan Başlat
  const handleDiyalogSifirla = () => {
    handleSenaryoSec(seciliSenaryoId);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-5 space-y-4">
      {/* Üst Karşılaşma Seçici Başlığı */}
      <div className="parchment-sheet p-3 sm:p-4 rounded-xl border-2 border-[#54412e] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center text-amber-200 shadow-md">
            <MessageSquare className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-heading font-black text-lg sm:text-xl text-[#f3ece0]">
              DALLANAN DİYALOG &amp; ROL YAPMA MASASI
            </h1>
            <p className="text-xs text-[#a49684]">
              {senaryo.mekan} • Fate zarları, ikna, gözdağı ve sırların açığa çıkışı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sound.playSealStamp();
              setDivanModu(!divanModu);
            }}
            className={`px-3 py-1.5 rounded text-xs font-heading font-black border flex items-center gap-1.5 shadow transition-all ${
              divanModu
                ? 'bg-amber-600 text-stone-950 border-amber-300 ring-2 ring-amber-400'
                : 'bg-[#2a1d14] hover:bg-[#3d2c1f] text-amber-300 border-[#5e432c]'
            }`}
          >
            <span>🏛️ Divan Mahkemesi &amp; İtibar Düellosu {divanModu ? '(Aktif)' : ''}</span>
          </button>

          <button
            onClick={handleDiyalogSifirla}
            className="px-3 py-1.5 rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-stone-300 text-xs font-heading font-bold border border-[#523d2b] flex items-center gap-1.5 shadow"
            title="Diyaloğu en başa döndür"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>

          <button
            onClick={() => onSavasaGec(bagliNpc)}
            className="px-3 py-1.5 rounded bg-[#4a1818] hover:bg-[#632020] text-red-200 text-xs font-heading font-black border border-red-700 shadow flex items-center gap-1.5"
          >
            <Swords className="w-3.5 h-3.5 text-amber-300" />
            <span>Kılıç Çek (Savaş)</span>
          </button>
        </div>
      </div>

      {/* Hazır Senaryo Sekmeleri */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {HAZIR_SENARYOLAR.map((s) => {
          const isSelected = s.id === seciliSenaryoId;
          return (
            <button
              key={s.id}
              onClick={() => handleSenaryoSec(s.id)}
              className={`px-3 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap border transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#291d13] border-amber-400 text-amber-200 ring-1 ring-amber-400 shadow-md'
                  : 'bg-[#16120e] border-[#3e2e20] text-[#93826e] hover:text-[#dcd1be]'
              }`}
            >
              <span>💬 {s.npcAd}</span>
            </button>
          );
        })}
      </div>

      {/* DİVAN MAHKEMESİ & İTİBAR DÜELLOSU SAVAŞ ALANI */}
      {divanModu && (
        <div className="parchment-sheet p-4 rounded-2xl border-2 border-amber-600/90 shadow-2xl space-y-3 bg-gradient-to-r from-[#1c1209] via-[#291b0f] to-[#1c1209] animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-amber-700/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <h2 className="font-heading font-black text-sm text-amber-200 uppercase tracking-widest">
                DİVAN MAHKEMESİ · İTİBAR &amp; ŞANTAJ DÜELLOSU
              </h2>
            </div>
            <span className="text-[10px] text-amber-400/90 font-mono">
              Aldris (Hukuk), Lodvez (Şantaj) ve Aronlid (Rüşvet) Hamleleri
            </span>
          </div>

          {/* İtibar Barları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Oyuncu İtibarı */}
            <div className="p-3 rounded-xl bg-[#140e0a] border border-[#3f2e1f] space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-200">{aktifKarakter.ad} İtibarı:</span>
                <span className="font-mono text-amber-400">{oyuncuItibar} / 5 İtibar</span>
              </div>
              <div className="w-full h-3 bg-[#24170d] rounded-full overflow-hidden border border-[#443020]">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
                  style={{ width: `${(oyuncuItibar / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* NPC İtibarı */}
            <div className="p-3 rounded-xl bg-[#140e0a] border border-[#3f2e1f] space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-red-200">{senaryo.npcAd} İtibarı:</span>
                <span className="font-mono text-red-400">{npcItibar} / 5 İtibar</span>
              </div>
              <div className="w-full h-3 bg-[#24170d] rounded-full overflow-hidden border border-[#443020]">
                <div
                  className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-300"
                  style={{ width: `${(npcItibar / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Divan Taktik Hamleleri Butonları */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
            <button
              onClick={() => handleDivanHamlesi('itham')}
              className="p-2 rounded-xl bg-[#22160d] hover:bg-[#342214] border border-amber-700/80 text-amber-200 font-bold flex flex-col text-left shadow"
            >
              <span>📜 İtham Et</span>
              <span className="text-[9px] text-[#baa694] font-normal">Aldris ile Belge Sun (-2 İtibar)</span>
            </button>

            <button
              onClick={() => handleDivanHamlesi('santaj')}
              className="p-2 rounded-xl bg-[#22160d] hover:bg-[#342214] border border-rose-800 text-rose-200 font-bold flex flex-col text-left shadow"
            >
              <span>🗡️ Şantaj &amp; Sır</span>
              <span className="text-[9px] text-[#baa694] font-normal">Lodvez ile Sır İfşa Et (-3 İtibar)</span>
            </button>

            <button
              onClick={() => handleDivanHamlesi('tuzuk')}
              className="p-2 rounded-xl bg-[#22160d] hover:bg-[#342214] border border-blue-800 text-blue-200 font-bold flex flex-col text-left shadow"
            >
              <span>🛡️ Hane Tüzüğü</span>
              <span className="text-[9px] text-[#baa694] font-normal">Dokunulmazlık (+2 İtibar Kazan)</span>
            </button>

            <button
              onClick={() => handleDivanHamlesi('rusvet')}
              className="p-2 rounded-xl bg-[#22160d] hover:bg-[#342214] border border-yellow-700 text-yellow-200 font-bold flex flex-col text-left shadow"
            >
              <span>💰 Rüşvet Ver</span>
              <span className="text-[9px] text-[#baa694] font-normal">10 Aron ile Tanığı Bağla</span>
            </button>

            <button
              onClick={() => handleDivanHamlesi('yemin')}
              className="p-2 rounded-xl bg-[#22160d] hover:bg-[#342214] border border-purple-700 text-purple-200 font-bold flex flex-col text-left shadow"
            >
              <span>⚖️ Mabed Yemini</span>
              <span className="text-[9px] text-[#baa694] font-normal">Erau ile Hakikat Andı İç</span>
            </button>
          </div>
        </div>
      )}

      {/* SİNEMATİK DİYALOG ARENASI:
          SOL (Karakterimiz) | ORTA (Diyalog & Seçenekler) | SAĞ (Muhatap NPC) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* SOL PANEL: OYUNCU KARAKTERİ & FATE GÖRÜNÜŞLERİ (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="parchment-sheet p-3.5 rounded-xl border border-[#4d3a28] shadow space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-amber-500/80 bg-black shadow-md flex-shrink-0">
                <img
                  src={aktifKarakter.fotoUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'}
                  alt={aktifKarakter.ad}
                  className="w-full h-full object-cover sepia-[0.2]"
                />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  {aktifKarakter.hane} Hanesi
                </span>
                <h3 className="font-heading font-black text-sm text-[#f6efe6] truncate">
                  {aktifKarakter.ad}
                </h3>
                <span className="text-[11px] text-[#a49684] block truncate">
                  {aktifKarakter.meslek} • {aktifKarakter.rutbe}
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span>{aktifKarakter.ekonomi.aron} Aron</span>
                </span>
              </div>
            </div>

            {/* Fate Mühür Sayacı & Çağırma Butonu */}
            <div className="p-2.5 rounded-lg bg-[#18130e] border border-amber-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8e7e6d] font-heading font-bold uppercase block">
                  Kader Mührü (Fate Point)
                </span>
                <span className="font-mono font-black text-sm text-amber-400">
                  {aktifKarakter.sayaclar.muhur} Mühür
                </span>
              </div>

              {sonZarSonucu && !sonZarSonucu.basarili && aktifKarakter.sayaclar.muhur > 0 && (
                <button
                  onClick={handleMuhurHarca}
                  className="px-2.5 py-1 rounded wax-seal text-white font-heading font-bold text-[10px] animate-pulse shadow flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Mühürle (+2)</span>
                </button>
              )}
            </div>

            {/* İlgili Sosyal & Soruşturma Becerileri */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-heading font-bold uppercase text-[#8e7e6d] block border-b border-[#3b2b1d] pb-0.5">
                Diyalog &amp; İkna Yetenekleri
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                <div className="p-1 rounded bg-[#16120e] border border-[#3b2b1d] flex justify-between">
                  <span className="text-[#a49684]">Fight:</span>
                  <span className="text-amber-300 font-bold">+{aktifKarakter.beceriler.Fight}</span>
                </div>
                <div className="p-1 rounded bg-[#16120e] border border-[#3b2b1d] flex justify-between">
                  <span className="text-[#a49684]">Provoke:</span>
                  <span className="text-amber-300 font-bold">+{aktifKarakter.beceriler.ProvokeManipulate}</span>
                </div>
                <div className="p-1 rounded bg-[#16120e] border border-[#3b2b1d] flex justify-between">
                  <span className="text-[#a49684]">Lore:</span>
                  <span className="text-amber-300 font-bold">+{aktifKarakter.beceriler.Lore}</span>
                </div>
                <div className="p-1 rounded bg-[#16120e] border border-[#3b2b1d] flex justify-between">
                  <span className="text-[#a49684]">Investigate:</span>
                  <span className="text-amber-300 font-bold">+{aktifKarakter.beceriler.Investigate}</span>
                </div>
              </div>
            </div>

            {/* Karakter Görünüşleri (Fate Aspects) */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-heading font-bold uppercase text-[#8e7e6d] block border-b border-[#3b2b1d] pb-0.5">
                Görünüşlerin (Aspects)
              </span>
              <div className="p-1.5 rounded bg-[#18130f] border border-[#3d2d1f] text-[10px] text-[#cfc2b0] italic leading-tight">
                &quot;{aktifKarakter.gorunumler.anaKavram}&quot;
              </div>
              <div className="p-1.5 rounded bg-[#1e1313] border border-red-950 text-[10px] text-[#dfc5c5] italic leading-tight">
                ⚠️ Dert: &quot;{aktifKarakter.gorunumler.dert}&quot;
              </div>
            </div>
          </div>
        </div>

        {/* ORTA PANEL: CRPG DİYALOG AKIŞI & DALLANAN SEÇENEKLER (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412f] shadow-2xl space-y-3">
            {/* Diyalog Metin Akışı Kutusu */}
            <div className="bg-[#120e0b] p-3.5 rounded-xl border border-[#3d2c1d] max-h-80 overflow-y-auto space-y-3 font-serif">
              {diyalogGecmisi.map((d, idx) => {
                const isNpc = d.tur === 'npc';
                const isZar = d.tur === 'zar';
                const isAnlatici = d.tur === 'anlatici';

                if (isZar) {
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#1a1c12] border border-amber-900/80 font-mono text-[11px] text-amber-300 shadow-sm"
                    >
                      {d.metin}
                    </div>
                  );
                }

                if (isAnlatici) {
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#1b1510] border-l-4 border-amber-600/70 text-xs text-[#a99c8b] italic leading-relaxed"
                    >
                      {d.metin}
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                      isNpc
                        ? 'bg-[#1b1310] border-amber-900/60 text-[#faecd5]'
                        : 'bg-[#151c16] border-emerald-900/60 text-[#e4f3e8] ml-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-heading font-black text-[11px] ${
                          isNpc ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {d.gonderen}:
                      </span>
                    </div>

                    {d.tasvir && (
                      <p className="text-[11px] text-[#9c8e7b] italic mb-1 border-b border-[#352618] pb-1">
                        {d.tasvir}
                      </p>
                    )}

                    <p className="text-xs font-serif leading-relaxed">&quot;{d.metin}&quot;</p>
                  </div>
                );
              })}
            </div>

            {/* SEÇENEKLER LİSTESİ (Player Choices) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                <span>Bir Söz Söyle veya Eylem Seç:</span>
              </span>

              {dugum.secenekler.length === 0 ? (
                <div className="p-3 rounded-lg bg-[#18130e] border border-[#3b2b1d] text-center text-xs text-[#9d8d7b]">
                  <span>Bu karşılaşma noktalandı. Yeni bir karşılaşma seçebilir veya sıfırlayabilirsiniz.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {dugum.secenekler.map((secenek) => {
                    const isCheck = !!secenek.beceri;
                    return (
                      <button
                        key={secenek.id}
                        disabled={zarAtiliyor}
                        onClick={() => handleSecenekSec(secenek)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all relative flex items-start gap-2 group ${
                          secenek.savasBaslat
                            ? 'bg-red-950/80 hover:bg-red-900 border-red-700 text-red-100 ring-1 ring-red-500'
                            : isCheck
                            ? 'bg-[#221811] hover:bg-[#342417] border-amber-600/70 text-[#f5ebd7] hover:border-amber-400'
                            : 'bg-[#18130e] hover:bg-[#251d16] border-[#443323] text-[#d6c7b2] hover:border-[#674e35]'
                        }`}
                      >
                        <span className="text-amber-400 font-bold flex-shrink-0 mt-0.5">➔</span>
                        <div className="flex-1">
                          <span className="font-serif leading-snug block">{secenek.metin}</span>
                          {secenek.zorlukIsmi && (
                            <span className="text-[9px] font-mono text-amber-400 font-bold block mt-0.5">
                              Hedef Eşik: {secenek.zorlukIsmi}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ANLATICI (GM) MODU MÜDAHALE SATIRI */}
            {rol === 'Anlatıcı' && (
              <div className="pt-2 border-t border-[#3b2b1d] flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Anlatıcı olarak diyaloga replik veya sahne tasviri ekle..."
                  value={gmGirdi}
                  onChange={(e) => setGmGirdi(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGmReplikGonder()}
                  className="flex-1 bg-[#140f0c] border border-[#443322] rounded px-2.5 py-1.5 text-xs text-[#f5ecd8] focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleGmReplikGonder}
                  className="p-1.5 rounded wax-seal text-white text-xs font-bold"
                  title="Sahneye Ekle"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SAĞ PANEL: MUHATAP NPC & CANLI TUTUM / ŞÜPHE HUD (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="parchment-sheet p-3.5 rounded-xl border border-[#4d3a28] shadow space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-red-700/80 bg-black shadow-md flex-shrink-0">
                <img
                  src={senaryo.npcFotoUrl}
                  alt={senaryo.npcAd}
                  className="w-full h-full object-cover sepia-[0.2]"
                />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                  {senaryo.npcHane} Hanesi
                </span>
                <h3 className="font-heading font-black text-sm text-[#f6efe6] truncate">
                  {senaryo.npcAd}
                </h3>
                <span className="text-[11px] text-[#a49684] block truncate">
                  {senaryo.npcRol}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-bold border border-red-800 inline-block mt-0.5">
                  Ruh Hali: {dugum.npcDuygu || 'Sakin'}
                </span>
              </div>
            </div>

            {/* NPC Tutumu (-3 .. +3) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#a49684] font-semibold">Tutum Derecesi:</span>
                <span
                  className={`font-mono font-bold ${
                    npcTutum < 0 ? 'text-red-400' : npcTutum > 0 ? 'text-emerald-400' : 'text-stone-300'
                  }`}
                >
                  {npcTutum === -3
                    ? 'Düşmanca (-3)'
                    : npcTutum === -2
                    ? 'Husumet (-2)'
                    : npcTutum === -1
                    ? 'Soğuk (-1)'
                    : npcTutum === 0
                    ? 'Nötr (0)'
                    : npcTutum === 1
                    ? 'Ilımlı (+1)'
                    : npcTutum === 2
                    ? 'Sırdaş (+2)'
                    : 'Dostane (+3)'}
                </span>
              </div>
              <div className="w-full bg-[#120e0b] h-2 rounded-full overflow-hidden border border-[#3b2b1d]">
                <div
                  className={`h-full transition-all duration-300 ${
                    npcTutum < 0 ? 'bg-red-600' : npcTutum > 0 ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${((npcTutum + 3) / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* NPC Şüphe Seviyesi (0 .. 100%) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#a49684] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Şüphe Eşiği:</span>
                </span>
                <span
                  className={`font-mono font-bold ${
                    npcSuphe >= 70 ? 'text-red-400' : npcSuphe >= 40 ? 'text-amber-400' : 'text-stone-400'
                  }`}
                >
                  %{npcSuphe}
                </span>
              </div>
              <div className="w-full bg-[#120e0b] h-2 rounded-full overflow-hidden border border-[#3b2b1d]">
                <div
                  className={`h-full transition-all duration-300 ${
                    npcSuphe >= 70 ? 'bg-red-600' : npcSuphe >= 40 ? 'bg-amber-500' : 'bg-stone-600'
                  }`}
                  style={{ width: `${npcSuphe}%` }}
                />
              </div>
            </div>

            {/* Açığa Çıkan Sırlar & İpuçları */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-[#3b2b1d]">
              <span className="text-[10px] font-heading font-bold uppercase text-[#8e7e6d] block flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Gizli Bilgiler &amp; Sırlar</span>
              </span>

              {acilanSir ? (
                <div className="p-2 rounded bg-[#1e1511] border border-amber-600/60 text-[10px] text-amber-200 animate-in fade-in duration-200 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <Unlock className="w-3 h-3" /> Sır Keşfedildi!
                  </span>
                  <p className="italic font-serif leading-relaxed">
                    &quot;{bagliNpc.sir}&quot;
                  </p>
                </div>
              ) : (
                <div className="p-2 rounded bg-[#130f0c] border border-[#38281a] text-[10px] text-[#71614f] italic">
                  Henüz bir sır açığa çıkmadı. Başarılı bir Kadim Bilgi (Lore) veya Soruşturma (Investigate) hamlesi gerektirir.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
