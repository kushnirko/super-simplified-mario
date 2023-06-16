import Sprite from "./sprite.js";

export default class Rex extends Sprite {
  constructor(tilesNumber, src) {
    super(tilesNumber, src);
    this.maxVelocity.x = 0.7;
    this.maxVelocity.y = 0;
    this.velocity.x = -this.maxVelocity.x;
    this.lives = 2;
    this.previousLivesValue = this.lives;
    this.damage = 1;
    this.currentStateName = 'lives2Left';
    this.currentFrame.state = this.states[this.currentStateName].index;
    this.currentFrame.max = this.states[this.currentStateName].maxFrame - 1;
  }

  setFrame() {
    this.currentFrame.index = 0;
    const nextState = this.states[this.currentStateName];
    this.currentFrame.state = nextState.index;
    this.currentFrame.max = nextState.maxFrame - 1;
  }

  stateUpdate() {
    const velocityHandling = new Map([
      [ 1, 'Right' ],
      [-1, 'Left'  ],
      [ 0, this.currentStateName.replace(
        `lives${ this.previousLivesValue }`, ''
      ) ],
    ]);
    const nextStateName = `lives${ this.lives }`.concat(
      velocityHandling.get(Math.sign(this.velocity.x))
    );
    if (nextStateName !== this.currentStateName) {
      if (this.lives !== this.previousLivesValue) {
        this.velocity.x -= Math.sign(this.velocity.x) *
          this.maxVelocity.x * 0.5;
        this.box.height -= this.box.height * 0.5;
        this.frame.drawOffset.y -= this.box.height;
        this.box.pos.y += this.box.height;
        this.previousLivesValue = this.lives;
      }
      this.currentStateName = nextStateName;
      this.setFrame();
    }
  }

  velocityUpdate() {
    const { box, velocity } = this;
    velocity.y += this.gravity;
    const currentVelocityX = velocity.x;
    const collisionChecker =
      currentVelocityX + Math.sign(currentVelocityX) * box.width;
    box.pos.x += collisionChecker;
    const collisions = this.detectCollisions(this.tile.enemyObjs);
    box.pos.x -= collisionChecker;
    if (collisions.sides[0] !== 'bottom') velocity.x = -currentVelocityX;
    else velocity.x = currentVelocityX;
  }

  update(delay, tile) {
    this.tile = tile;
    this.stateUpdate();
    this.velocityUpdate();

    this.box.pos.x += this.velocity.x;
    this.box.pos.y += this.velocity.y;

    this.updateFrame(delay);
  }
}
