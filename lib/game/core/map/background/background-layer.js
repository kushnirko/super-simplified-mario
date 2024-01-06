import GameEventManager from '../../../game-event-manager.js';

export default class BackgroundLayer {
  constructor(data) {
    this.em = GameEventManager.getInstance();
    this.name = data.name;
    this.box = {
      pos: { x: 0, y: 0 },
      width: data.width,
      height: data.height
    };
  }

  draw(tilesNumber) {
    const { pos: { x, y }, width, height } = this.box;
    const sBox = {
      x: 0,
      y: 0,
      width,
      height
    };
    for (let i = 0; i <= tilesNumber; i++) {
      const dx = Math.round(x) + i * width;
      const dBox = {
        x: dx,
        y,
        width,
        height
      };
      this.em.emitEvent('drawObject', this.name, sBox, dBox);
    }
  }
}
