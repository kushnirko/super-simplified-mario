import DrawManager from '../draw-manager.js';
import GameEventManager from '../../game/game-event-manager.js';

export default class GamePageDrawManager extends DrawManager {
  constructor(ctx, drawableSrc, ee) {
    super(ctx, drawableSrc, ee);
    this.gameEM = GameEventManager.getInstance();
    this.onCreate();
  }

  setEventListeners() {
    super.setEventListeners();
    this.gameEM.onEvent('drawObject', (name, sBox, dBox) => {
      this.drawImage(name, sBox, dBox);
    });
  }
}
