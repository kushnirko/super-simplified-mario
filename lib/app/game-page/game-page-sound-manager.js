import SoundManager from '../sound-manager.js';
import GameEventManager from '../../game/game-event-manager.js';

export default class GamePageSoundManager extends SoundManager {
  constructor(audioSrc, ee) {
    super(audioSrc, ee);
    this.gameEM = GameEventManager.getInstance();
    this.onCreate();
  }

  setEventListeners() {
    super.setEventListeners();
    const { gameEM } = this;
    gameEM.onEvent('gameStart', () => {
      this.playTrack('gameInProgress');
    });
    gameEM.onEvent('gameWin', () => {
      this.pause('gameInProgress');
      this.playSound('gameWin');
    });
    gameEM.onEvent('gameOver', () => {
      this.pause('gameInProgress');
      this.playSound('gameOver');
    });
    gameEM.onEvent('playSound', soundName => {
      this.playSound(soundName);
    });
  }
}
