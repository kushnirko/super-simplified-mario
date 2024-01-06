export default class SoundManager {
  constructor(audioSrc, ee) {
    this.newPageDelay = 500;
    this.sounds = audioSrc;
    this.isMusicOn = true;
    this.isSoundsOn = true;
    this.currentTrack = null;
    this.ee = ee;
  }

  onCreate() {
    this.setEventListeners();
  }

  setEventListeners() {
    const { ee } = this;
    ee.onEvent('btnClick', () => {
      this.playSound('buttonClick');
    });
    ee.onEvent('toggleSounds', () => {
      this.isSoundsOn = !this.isSoundsOn;
    });
    ee.onEvent('toggleMusic', () => {
      this.isMusicOn = !this.isMusicOn;
      if (this.currentTrack) {
        this.currentTrack.volume = (this.isMusicOn ? 1.0 : 0.0);
      }
    });
    ee.onEvent('pageOpen', () => {
      this.playTrack('pageSoundtrack');
    });
    ee.onEvent('pageClose', () => {
      this.pause(this.currentTrack);
    });
  }

  playSound(name) {
    const sound = this.sounds.get(name);
    if (sound && this.isSoundsOn) {
      sound.play();
    }
  }

  playTrack(name) {
    const soundtrack = this.sounds.get(name);
    if (soundtrack) {
      this.currentTrack = soundtrack;
      soundtrack.volume = (this.isMusicOn ? 1.0 : 0.0);
      soundtrack.play();
    }
  }

  pause(name) {
    const audio = this.sounds.get(name);
    if (audio) {
      if (!audio.paused) audio.pause();
    }
  }
}
