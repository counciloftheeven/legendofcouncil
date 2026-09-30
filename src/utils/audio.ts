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
}

export const sound = new SoundSynthesizer();
