export default class SoundPlayer {
  constructor(src) {
    this.sounds = src;
  }

  play(event) {
    this.sounds[event].play();
  }

  pause(event) {
    this.sounds[event].pause();
  }
}
