


export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Custom Audio Elements
  private customSpinAudio: HTMLAudioElement | null = null;
  private customFeatureAudio: HTMLAudioElement | null = null;
  private customMainBgmAudio: HTMLAudioElement | null = null;
  private customFeatureTriggerAudio: HTMLAudioElement | null = null;
  private customNearJackpotAudio: HTMLAudioElement | null = null;
  private customFeatureEndAudio: HTMLAudioElement | null = null;
  private customWinningAudio: HTMLAudioElement | null = null;

  // Background Music State
  private isFeatureBgPlaying: boolean = false;
  private isMainBgmPlaying: boolean = false;
  private isNearJackpotPlaying: boolean = false;
  private isWinningSoundPlaying: boolean = false;

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
      // this.customSpinAudio.loop = true; // Spin sound usually short, loop if needed but usually one-shot or short loop
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

  public setCustomNearJackpot(url: string) {
      this.customNearJackpotAudio = new Audio(url);
      this.customNearJackpotAudio.loop = true;
  }

  public setCustomFeatureEnd(url: string) {
      this.customFeatureEndAudio = new Audio(url);
  }

  public setCustomWinningSound(url: string) {
      this.customWinningAudio = new Audio(url);
      this.customWinningAudio.loop = true;
  }
  // ----------------------------

  public toggleMute(): boolean {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
          this.stopAll();
      } else {
          if (this.isFeatureBgPlaying && this.customFeatureAudio) {
              this.customFeatureAudio.play().catch(()=>{});
          } else if (this.isNearJackpotPlaying && this.customNearJackpotAudio) {
              this.customNearJackpotAudio.play().catch(()=>{});
          } else if (this.isWinningSoundPlaying && this.customWinningAudio) {
              this.customWinningAudio.play().catch(()=>{});
          } else if (this.isMainBgmPlaying && this.customMainBgmAudio) {
              this.customMainBgmAudio.play().catch(()=>{});
          }
      }
      return this.isMuted;
  }

  private stopAll() {
      if (this.customSpinAudio) this.customSpinAudio.pause();
      if (this.customFeatureAudio) this.customFeatureAudio.pause();
      if (this.customMainBgmAudio) this.customMainBgmAudio.pause();
      if (this.customFeatureTriggerAudio) this.customFeatureTriggerAudio.pause();
      if (this.customNearJackpotAudio) this.customNearJackpotAudio.pause();
      if (this.customFeatureEndAudio) this.customFeatureEndAudio.pause();
      if (this.customWinningAudio) this.customWinningAudio.pause();
  }

  public getMuteStatus() { return this.isMuted; }

  // --- Main Background Music Control ---
  public playMainBgm() {
      this.isMainBgmPlaying = true;
      if (this.isMuted) return;

      if (this.isFeatureBgPlaying || this.isNearJackpotPlaying || this.isWinningSoundPlaying) return;

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
  }

  public stopSpinSound() {
    if (this.customSpinAudio) {
        this.customSpinAudio.pause();
        this.customSpinAudio.currentTime = 0;
    }
  }

  public playReelStop() {
    if (this.isMuted) return;
    // Simple thud
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playWinSound(amount: number) {
    // This is for small line wins, not the big summary win
    if (this.isMuted) return;
    // Simple ping
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 523.25;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Returns a promise that resolves when the trigger sound finishes
  public playFeatureTrigger(): Promise<void> {
      // Always pause Main BGM first, even if muted
      if (this.customMainBgmAudio) {
          this.customMainBgmAudio.pause();
          this.customMainBgmAudio.currentTime = 0;
      }

      return new Promise((resolve) => {
          if (this.isMuted) {
              resolve();
              return;
          }

          if (this.customFeatureTriggerAudio) {
              this.customFeatureTriggerAudio.currentTime = 0;
              this.customFeatureTriggerAudio.volume = 1.0;

              const onEnded = () => {
                  this.customFeatureTriggerAudio?.removeEventListener('ended', onEnded);
                  resolve();
              };

              this.customFeatureTriggerAudio.addEventListener('ended', onEnded);
              this.customFeatureTriggerAudio.play().catch(e => {
                  console.error(e);
                  resolve(); // Resolve anyway if error
              });
          } else {
              // Fallback if no audio
              setTimeout(resolve, 2000);
          }
      });
  }

  public playFeatureBg() {
    this.isFeatureBgPlaying = true;
    this.isNearJackpotPlaying = false; // Ensure near jackpot is off

    // Fully stop main BGM
    if (this.customMainBgmAudio) {
        this.customMainBgmAudio.pause();
        this.customMainBgmAudio.currentTime = 0;
    }

    if (this.isMuted) return;
    if (this.customFeatureAudio) {
        this.customFeatureAudio.currentTime = 0;
        this.customFeatureAudio.volume = 1.0;
        this.customFeatureAudio.play().catch(e => console.error(e));
    }
  }

  public stopFeatureBg() {
      this.isFeatureBgPlaying = false;
      if (this.customFeatureAudio) {
          this.customFeatureAudio.pause();
          this.customFeatureAudio.currentTime = 0;
      }
      // Resume Main BGM if nothing else is playing
      if (!this.isNearJackpotPlaying && !this.isWinningSoundPlaying) {
          this.resumeMainBgm();
      }
  }

  public playNearJackpot() {
      if (this.isNearJackpotPlaying) return; // Already playing
      this.isNearJackpotPlaying = true;

      // Pause Feature BG if it's playing (Near Jackpot overrides)
      if (this.customFeatureAudio) this.customFeatureAudio.pause();

      if (this.isMuted) return;
      if (this.customNearJackpotAudio) {
          this.customNearJackpotAudio.currentTime = 0;
          this.customNearJackpotAudio.play().catch(e => console.error(e));
      }
  }

  public stopNearJackpot() {
      this.isNearJackpotPlaying = false;
      if (this.customNearJackpotAudio) {
          this.customNearJackpotAudio.pause();
          this.customNearJackpotAudio.currentTime = 0;
      }
      // If we are still in feature, resume feature bg
      if (this.isFeatureBgPlaying && !this.isMuted && this.customFeatureAudio) {
          this.customFeatureAudio.play().catch(()=>{});
      }
  }

  public playFeatureEnd() {
      if (this.isMuted) return;

      // Stop others
      this.stopFeatureBg();
      this.stopNearJackpot();

      if (this.customFeatureEndAudio) {
          this.customFeatureEndAudio.currentTime = 0;
          this.customFeatureEndAudio.play().catch(e => console.error(e));
      }
  }

  public playWinningSound() {
      this.isWinningSoundPlaying = true;
      if (this.isMuted) return;

      if (this.customWinningAudio) {
          this.customWinningAudio.currentTime = 0;
          this.customWinningAudio.play().catch(e => console.error(e));
      }
  }

  public stopWinningSound() {
      this.isWinningSoundPlaying = false;
      if (this.customWinningAudio) {
          this.customWinningAudio.pause();
          this.customWinningAudio.currentTime = 0;
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
