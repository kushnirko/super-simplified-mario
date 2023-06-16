import Sprite from "../sprite.js";
import PlayerStates from "./player-states.js";

export default class Player extends Sprite {
  constructor(tilesNumber, src, soundPlayer) {
    super(tilesNumber, src, soundPlayer);
    this.box.pos.x = 0;
    this.box.pos.y = 200;
    this.maxVelocity.x = 6;
    this.maxVelocity.y = 40;
    this.stateMachine = new PlayerStates(this);
    this.lives = 5;
    this.damage = 1;
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

  update(delay, input, tile) {
    this.tile = tile;
    this.velocity.y += this.gravity;
    this.stateMachine.update(input);

    if (!this.isNearMapStart() && !this.isNearMapEnd()) {
      this.box.pos.x += this.velocity.x;
    }
    this.box.pos.y += this.velocity.y;

    if (this.isUnderMapBottom()) this.lives = 0;

    this.updateFrame(delay);
  }
}
