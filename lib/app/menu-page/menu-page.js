import AppPage from '../app-page.js';
import MenuPageMedia from './menu-page-media.js';
import SoundManager from '../sound-manager.js';
import DrawManager from '../draw-manager.js';

export default class MenuPage extends AppPage {
  constructor() {
    super();
    this.media = new MenuPageMedia();
    this.sm = new SoundManager(this.media.src.audio, this.ee);
    this.sm.onCreate();
    this.dm = new DrawManager(null, this.media.src.drawable, this.ee);
    this.dm.onCreate();
    this.onOpen();
  }

  setStartSoundsState() {
    super.setStartSoundsState();
    const soundsSwitch = document.getElementById('toggleSounds');
    soundsSwitch.checked = this.sm.isSoundsOn;
  }

  setStartMusicState() {
    super.setStartMusicState();
    const musicSwitch = document.getElementById('toggleMusic');
    musicSwitch.checked = this.sm.isMusicOn;
  }

  setEventListeners() {
    super.setEventListeners();
    this.ee.onEvent('pageOpen', () => {
      const text = 'TODAY\'S MAX SCORE : ';
      const maxScoreStr = sessionStorage.getItem('maxScore');
      const str = text.concat(maxScoreStr || '0');
      this.ee.emitEvent('changeText', 'todayMaxScore', str);
    });
  }

  setButtonListeners() {
    const { ee } = this;
    const playBtn = document.getElementById('playButton');
    playBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', playBtn);
      ee.emitEvent('pageClose');
      ee.emitEvent('newPage', playBtn.getAttribute('data-href'));
    });
    const soundsSwitch = document.getElementById('toggleSounds');
    soundsSwitch.addEventListener('click', () => {
      ee.emitEvent('btnClick', soundsSwitch);
      ee.emitEvent('toggleSounds');
    });
    const musicSwitch = document.getElementById('toggleMusic');
    musicSwitch.addEventListener('click', () => {
      ee.emitEvent('btnClick', musicSwitch);
      ee.emitEvent('toggleMusic');
    });
  }
}
