import BackgroundLayer from './background-layer.js';

export default class ParallaxLayer extends BackgroundLayer {
  constructor(data) {
    super(data);
    this.speedModifier = data.speedModifier;
    this.previousPlayerPosX = 0;
  }

  update(playerPosX) {
    const { box } = this;
    const x = box.pos.x;
    if (x < -box.width) {
      box.pos.x = 0;
    } else {
      box.pos.x -= this.speedModifier * (playerPosX - this.previousPlayerPosX);
    }
    this.previousPlayerPosX = playerPosX;
  }
}
