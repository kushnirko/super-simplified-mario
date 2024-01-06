import Sprite from './sprite.js';
import PlayerStateMachine from './player-states/player-state-machine.js';

export default class Player extends Sprite {
  constructor(data) {
    super(data);
    this.box.pos.x = 0;
    this.box.pos.y = 200;
    this.maxVelocity.x = 6;
    this.maxVelocity.y = 24;
    this.stateMachine = new PlayerStateMachine(this);
    this.lives = 5;
    this.damage = 1;
    this.score = 0;
  }

  setProps() {
    const self = this;

    return {
      set boxPosX(x) {
        self.box.pos.x = x;
      },
      set boxPosY(y) {
        self.box.pos.y = y;
      },
      set lives(value) {
        self.lives = value;
      },
      set damage(value) {
        self.damage = value;
      },
      set maxVelocity(value) {
        self.maxVelocity = value;
      }
    };
  }

  update(delay, tile, levelLength, inputs) {
    this.tile = tile;
    this.velocity.y += this.gravity;

    const limitValue = (value, maxValue) =>
      Math.sign(value) * Math.min(Math.abs(value), maxValue);
    this.velocity.x = limitValue(this.velocity.x, this.maxVelocity.x);
    this.velocity.y = limitValue(this.velocity.y, this.maxVelocity.y);

    this.stateMachine.update(tile, inputs);

    if (!this.isNearMapStart() && !this.isNearMapEnd(levelLength)) {
      this.box.pos.x += this.velocity.x;
    }
    this.box.pos.y += this.velocity.y;

    if (this.isUnderMapBottom(tile.box.height)) this.lives = 0;
    this.updateFrame(delay);
  }
}
