// Centralized Retro Web Audio Synthesizer
// Provides pleasant 8-bit / retro sound effects without external audio file dependencies.

class RetroAudioManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.volume = 0.5;
    this.musicPlaying = false;
    this.bgmOsc1 = null;
    this.bgmOsc2 = null;
    this.bgmGain = null;
    this.bgmTimer = null;
    
    // Load persisted settings
    try {
      const savedMute = localStorage.getItem('dj_sound_enabled');
      if (savedMute !== null) this.soundEnabled = JSON.parse(savedMute);
      const savedVol = localStorage.getItem('dj_volume');
      if (savedVol !== null) this.volume = parseFloat(savedVol);
    } catch {
      // Ignore localStorage errors
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('dj_sound_enabled', JSON.stringify(enabled));
    } catch {}
    if (!enabled && this.musicPlaying) {
      this.stopBgm();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('dj_volume', JSON.stringify(this.volume));
    } catch {}
  }

  // Play short synthesized sounds
  play(type = 'click') {
    if (!this.soundEnabled || this.volume === 0) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, t);
    masterGain.connect(this.ctx.destination);

    try {
      switch (type) {
        case 'click': {
          // Sharp little arcade button press
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(150, t + 0.05);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }

        case 'blip': {
          // Soft digital navigation blip
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.setValueAtTime(1200, t + 0.03);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }

        case 'complete': {
          // Cheerful checkbox pop / mini chime
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, t); // C5
          osc.frequency.setValueAtTime(659.25, t + 0.06); // E5
          osc.frequency.setValueAtTime(783.99, t + 0.12); // G5
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.25);
          break;
        }

        case 'page': {
          // Notebook page flip / rustle simulation
          const bufferSize = this.ctx.sampleRate * 0.1;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1400, t);
          filter.Q.setValueAtTime(2, t);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          noise.start(t);
          break;
        }

        case 'save': {
          // Warm save confirmation chime
          const notes = [440, 554.37, 659.25]; // A major arpeggio
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.05);
            gain.gain.setValueAtTime(0.15, t + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.2);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(t + idx * 0.05);
            osc.stop(t + idx * 0.05 + 0.2);
          });
          break;
        }

        case 'achievement': {
          // Fanfare 8-bit retro fanfare
          const notes = [392, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            const startTime = t + idx * 0.08;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(startTime);
            osc.stop(startTime + 0.3);
          });
          break;
        }

        case 'unlock': {
          // Mystical letter/capsule unlock
          const notes = [659.25, 783.99, 987.77, 1318.51];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const startTime = t + idx * 0.07;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(startTime);
            osc.stop(startTime + 0.4);
          });
          break;
        }

        case 'delete': {
          // Quick retro crunch/descend
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.15);
          break;
        }

        default:
          break;
      }
    } catch {
      // Audio fallback safe
    }
  }

  // Toggle optional retro chiptune ambient loop
  toggleBgm() {
    if (this.musicPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    if (this.musicPlaying || !this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    this.musicPlaying = true;
    const chords = [
      [261.63, 329.63], // C, E
      [220.00, 261.63], // A, C
      [174.61, 220.00], // F, A
      [196.00, 246.94], // G, B
    ];
    let step = 0;

    const playChiptuneStep = () => {
      if (!this.musicPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;

      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(this.volume * 0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.95);
      });
    };

    playChiptuneStep();
    this.bgmTimer = setInterval(playChiptuneStep, 1000);
  }

  stopBgm() {
    this.musicPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundFx = new RetroAudioManager();
