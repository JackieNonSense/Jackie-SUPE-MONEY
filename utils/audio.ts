

export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  
  // Custom Audio Elements
  private customSpinAudio: HTMLAudioElement | null = null;
  private customFeatureAudio: HTMLAudioElement | null = null;
  private customMainBgmAudio: HTMLAudioElement | null = null;
  private customFeatureTriggerAudio: HTMLAudioElement | null = null;

  // Background Music State
  private isFeatureBgPlaying: boolean = false;
  private isMainBgmPlaying: boolean = false;

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public init() {
    this.getContext();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Custom Asset Setters ---
  public setCustomSpinSound(url: string) {
      this.customSpinAudio = new Audio(url);
      this.customSpinAudio.loop = true; 
  }

  public setCustomFeatureBgm(url: string) {
      this.customFeatureAudio = new Audio(url);
      this.customFeatureAudio.loop = true;
  }

  public setCustomMainBgm(url: string) {
      this.customMainBgmAudio = new Audio(url);
      this.customMainBgmAudio.loop = true;
      this.customMainBgmAudio.volume = 0.6; 
      
      if (this.isMainBgmPlaying && !this.isMuted && !this.isFeatureBgPlaying) {
          this.customMainBgmAudio.play().catch(e => console.error(e));
      }
  }

  public setCustomFeatureTrigger(url: string) {
      this.customFeatureTriggerAudio = new Audio(url);
  }
  // ----------------------------

  public toggleMute(): boolean {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
          if (this.customSpinAudio) this.customSpinAudio.pause();
          if (this.customFeatureAudio) this.customFeatureAudio.pause();
          if (this.customMainBgmAudio) this.customMainBgmAudio.pause();
          if (this.customFeatureTriggerAudio) this.customFeatureTriggerAudio.pause();
      } else {
          if (this.isFeatureBgPlaying && this.customFeatureAudio) {
              this.customFeatureAudio.play().catch(()=>{});
          } else if (this.isMainBgmPlaying && this.customMainBgmAudio) {
              this.customMainBgmAudio.play().catch(()=>{});
          }
      }
      return this.isMuted;
  }

  public getMuteStatus() { return this.isMuted; }

  // --- Main Background Music Control ---
  public playMainBgm() {
      this.isMainBgmPlaying = true;
      if (this.isMuted) return;

      if (this.isFeatureBgPlaying) return;

      if (this.customMainBgmAudio) {
          this.customMainBgmAudio.play().catch(e => console.error("Main BGM play failed", e));
      }
  }

  public stopMainBgm() {
      this.isMainBgmPlaying = false;
      if (this.customMainBgmAudio) {
          this.customMainBgmAudio.pause();
          this.customMainBgmAudio.currentTime = 0;
      }
  }
  // -------------------------------------

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public playSpinSound() {
    if (this.isMuted) return;
    if (this.customSpinAudio) {
        this.customSpinAudio.currentTime = 0;
        this.customSpinAudio.play().catch(e => console.error("Audio play failed", e));
        return;
    }
    // Default Silent
  }

  public stopSpinSound() {
    if (this.customSpinAudio) {
        this.customSpinAudio.pause();
        this.customSpinAudio.currentTime = 0;
    }
  }

  public playReelStop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    // Click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(1200, t);
    clickOsc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    clickGain.gain.setValueAtTime(0.2, t);
    clickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    clickOsc.start(t);
    clickOsc.stop(t + 0.05);

    // Thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.type = 'square';
    thudOsc.frequency.setValueAtTime(80, t);
    thudOsc.frequency.exponentialRampToValueAtTime(30, t + 0.12);
    thudGain.gain.setValueAtTime(0.15, t);
    thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    thudOsc.start(t);
    thudOsc.stop(t + 0.12);
  }

  public playWinSound(amount: number) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    playNote(523.25, now, 0.3);
    playNote(659.25, now + 0.15, 0.3);
    playNote(783.99, now + 0.30, 0.3);
    playNote(1046.50, now + 0.45, 0.6);

    if (amount > 1000) {
        setTimeout(() => {
            playNote(523.25, ctx.currentTime, 0.2);
            playNote(659.25, ctx.currentTime, 0.2);
            playNote(783.99, ctx.currentTime, 0.2);
            playNote(1046.50, ctx.currentTime, 0.4);
            playNote(1318.51, ctx.currentTime + 0.1, 0.4);
        }, 600);
    }
  }

  public playFeatureTrigger() {
      if (this.isMuted) return;
      
      if (this.customFeatureTriggerAudio) {
          this.customFeatureTriggerAudio.currentTime = 0;
          this.customFeatureTriggerAudio.volume = 1.0;
          this.customFeatureTriggerAudio.play().catch(e => console.error(e));
          return;
      }

      // Default Fanfare
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const play = (freq: number, t: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + dur);
          osc.start(t);
          osc.stop(t + dur);
      };

      // Dramatic Chord
      play(523.25, now, 1.0); // C
      play(659.25, now, 1.0); // E
      play(783.99, now, 1.0); // G
      play(1046.50, now, 1.5); // High C

      // Rhythmic pulses
      setTimeout(() => play(1046.50, ctx.currentTime, 0.5), 200);
      setTimeout(() => play(1046.50, ctx.currentTime, 0.5), 400);
      setTimeout(() => play(1318.51, ctx.currentTime, 2.0), 600); // High E
  }

  public playFeatureBg() {
    this.isFeatureBgPlaying = true;
    if (this.customMainBgmAudio) {
        this.customMainBgmAudio.pause();
    }
    if (this.isMuted) return;
    if (this.customFeatureAudio) {
        this.customFeatureAudio.currentTime = 0;
        this.customFeatureAudio.volume = 1.0;
        this.customFeatureAudio.play().catch(e => console.error(e));
        return;
    }
  }

  public stopFeatureBg() {
      if (!this.isFeatureBgPlaying) return;
      this.isFeatureBgPlaying = false;
      
      if (this.customFeatureAudio) {
          const fadeAudio = this.customFeatureAudio;
          const fadeInterval = setInterval(() => {
              if (fadeAudio.volume > 0.05) {
                  fadeAudio.volume -= 0.05;
              } else {
                  fadeAudio.pause();
                  fadeAudio.currentTime = 0;
                  fadeAudio.volume = 1.0;
                  clearInterval(fadeInterval);
                  this.resumeMainBgm();
              }
          }, 50);
          return;
      }
      this.resumeMainBgm();
  }

  private resumeMainBgm() {
      if (this.isMainBgmPlaying && !this.isMuted && this.customMainBgmAudio) {
          this.customMainBgmAudio.play().catch(e => console.error(e));
      }
  }
}

export const audio = new SoundManager();
