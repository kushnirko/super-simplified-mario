import BackgroundLayer from './background-layer.js';

export default class DynamicLayer extends BackgroundLayer {
  constructor(data) {
    super(data);
    this.speed = data.speed;
  }

  update() {
    const x = this.box.pos.x;
    if (x < -this.box.width) this.box.pos.x = 0;
    else this.box.pos.x -= this.speed;
  }
}
