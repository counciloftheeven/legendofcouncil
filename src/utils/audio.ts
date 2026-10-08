/**
 * Web Audio API ile Stallhart ortam sesleri ve efekt sentezleyicisi.
 * Harici dosya bağımlılığı olmadan temiz ve atmosferik sesler üretir.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private activeGenerators: { stop: () => void }[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Zar yuvarlanma tıkırtısı ve düşüş
  playDiceRoll() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // 4 tıkırtı
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = i * 0.07 + Math.random() * 0.04;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120 + Math.random() * 160, now + delay);
        osc.frequency.exponentialRampToValueAtTime(40, now + delay + 0.06);

        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.07);
      }
    } catch {
      // AudioContext policy
    }
  }

  // Balmumu Mühür Basma Sesi
  playSealStamp() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Mabed Çanı (Bronz çan tınısı)
  playTempleBell(tur: 'uyanis' | 'minnet' | 'koruma' | 'aksam') {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const freqs = {
        uyanis: [330, 660, 990],
        minnet: [261.6, 523.2, 784],
        koruma: [220, 440, 880],
        aksam: [196, 392, 587]
      }[tur];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const decay = 2.5 + idx * 0.8;
        gain.gain.setValueAtTime(0.18 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {}
  }

  // Kılıç Çarpışması / Darbe
  playBladeClash() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Metal tınlama
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Hafif Adım / Taş Sesi
  playFootstep() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Ortam sesleri yöneticisi (Ateş çıtırtısı, Rüzgar, Yağmur)
  startAmbience(layers: { ates: boolean; ruzgar: boolean; yagmur: boolean; uultu: boolean }, masterVol = 0.3) {
    this.stopAmbience();
    try {
      const ctx = this.getContext();
      const master = ctx.createGain();
      master.gain.setValueAtTime(masterVol, ctx.currentTime);
      master.connect(ctx.destination);
      this.ambientGain = master;

      // Ateş çıtırtısı sentezi
      if (layers.ates) {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.985 ? 0.8 : 0.05);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;

        const gain = ctx.createGain();
        gain.gain.value = 0.25;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        noise.start();

        this.activeGenerators.push({
          stop: () => {
            try { noise.stop(); } catch {}
          }
        });
      }

      // Rüzgar uğultusu
      if (layers.ruzgar) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 85;

        // Hafif frekans salınımı
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 25;
        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.value = 0.2;
        osc.connect(gain);
        gain.connect(master);
        osc.start();

        this.activeGenerators.push({
          stop: () => {
            try {
              osc.stop();
              lfo.stop();
            } catch {}
          }
        });
      }
    } catch {}
  }

  stopAmbience() {
    this.activeGenerators.forEach(g => g.stop());
    this.activeGenerators = [];
  }

  // Dinamik Ses Manzaraları (Bölgeye & Duruma Göre Ses Geçişleri)

  // 1. Khasinya: Uluyan Kar Fırtınası & Keskin Buz Çatırtısı
  playBlizzardAndIceCrack() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Uluyan dondurucu rüzgar (Bandpass filtered white noise)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(260, now + 2.5);
      filter.Q.value = 5.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 2.7);

      // 3 adet kristal buz çatlaması (Sharp high-pitched clicks)
      [0.4, 0.85, 1.4].forEach((t, idx) => {
        const iceOsc = ctx.createOscillator();
        const iceGain = ctx.createGain();
        iceOsc.type = 'sine';
        iceOsc.frequency.setValueAtTime(2800 + idx * 800, now + t);
        iceOsc.frequency.exponentialRampToValueAtTime(900, now + t + 0.08);

        iceGain.gain.setValueAtTime(0.2, now + t);
        iceGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);

        iceOsc.connect(iceGain);
        iceGain.connect(ctx.destination);
        iceOsc.start(now + t);
        iceOsc.stop(now + t + 0.09);
      });
    } catch {}
  }

  // 2. Arava Sarayı: Kristal Kadeh Sesleri, Fısıltılar ve Saray Çanı
  playPalaceGobletsAndChimes() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // İki kadehin birbirine hafifçe tokuşması (High resonance glass chime)
      [0.1, 0.65].forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(i === 0 ? 1760 : 1975, now + t); // A6, B6 crystal glass
        osc.frequency.exponentialRampToValueAtTime(1750, now + t + 0.6);

        gain.gain.setValueAtTime(0.22, now + t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.75);
      });

      // Saray divan arp / çan akoru
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(freq, now + 0.3 + idx * 0.12);

        chordGain.gain.setValueAtTime(0.08, now + 0.3 + idx * 0.12);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        chordOsc.connect(chordGain);
        chordGain.connect(ctx.destination);
        chordOsc.start(now + 0.3 + idx * 0.12);
        chordOsc.stop(now + 1.9);
      });
    } catch {}
  }

  // 3. Savaş Başlangıcı: Gerilimli Savaş Tamtamları (Tense War Drums)
  playWarDrums() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // 4 darbeli kalbi andıran tamtam ritmi (Bum-bum... bum-bum!)
      const drumBeats = [0.0, 0.28, 0.75, 1.05];
      drumBeats.forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Kalın membran vurusu (65 Hz -> 35 Hz)
        osc.frequency.setValueAtTime(i % 2 === 0 ? 80 : 70, now + t);
        osc.frequency.exponentialRampToValueAtTime(32, now + t + 0.22);

        gain.gain.setValueAtTime(0.4, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.26);

        // Hafif distorsiyon/tokluk için ikinci harmonik
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(120, now + t);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + t + 0.15);
        subGain.gain.setValueAtTime(0.2, now + t);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + 0.28);
        subOsc.start(now + t);
        subOsc.stop(now + t + 0.18);
      });
    } catch {}
  }

  // Bölgeye Göre Ses Geçişi Tetikleyici
  playRegionSoundscape(regionId: string) {
    if (regionId.toLowerCase().includes('khasin') || regionId.toLowerCase().includes('buz')) {
      this.playBlizzardAndIceCrack();
    } else if (regionId.toLowerCase().includes('arava') || regionId.toLowerCase().includes('saray') || regionId.toLowerCase().includes('divan')) {
      this.playPalaceGobletsAndChimes();
    } else if (regionId.toLowerCase().includes('savas') || regionId.toLowerCase().includes('fight')) {
      this.playWarDrums();
    } else {
      this.playTempleBell('koruma');
    }
  }
}

export const sound = new SoundSynthesizer();
