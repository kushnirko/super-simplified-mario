import AppPage from '../app-page.js';
import LevelSelectorPageMedia from './level-selector-page-media.js';
import SoundManager from '../sound-manager.js';

export default class LevelSelectorPage extends AppPage {
  constructor() {
    super();
    this.media = new LevelSelectorPageMedia();
    this.sm = new SoundManager(this.media.src.audio, this.ee);
    this.sm.onCreate();
    this.onOpen();
  }

  setButtonListeners() {
    const { ee } = this;
    const homeBtn = document.getElementById('homeButton');
    homeBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', homeBtn);
      ee.emitEvent('newPage', homeBtn.getAttribute('data-href'));
      ee.emitEvent('pageClose');
    });
    const level1Btn = document.getElementById('level1Button');
    level1Btn.addEventListener('click', () => {
      ee.emitEvent('btnClick', level1Btn);
      ee.emitEvent('newPage', level1Btn.getAttribute('data-href'));
      ee.emitEvent('pageClose');
    });
  }
}
