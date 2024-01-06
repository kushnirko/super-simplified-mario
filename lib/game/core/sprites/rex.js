import Sprite from './sprite.js';

export default class Rex extends Sprite {
  constructor(data) {
    super(data);
    this.maxVelocity.x = 2;
    this.maxVelocity.y = 0;
    this.velocity.x = -this.maxVelocity.x;
    this.lives = 2;
    this.previousLivesValue = this.lives;
    this.damage = 1;
    this.currentStateName = 'lives2Left';
    this.currentFrame.state = this.states[this.currentStateName].index;
    this.currentFrame.max = this.states[this.currentStateName].maxFrame - 1;
    this.reward = 200;
  }

  setFrame() {
    this.currentFrame.index = 0;
    const nextState = this.states[this.currentStateName];
    this.currentFrame.state = nextState.index;
    this.currentFrame.max = nextState.maxFrame - 1;
  }

  stateUpdate() {
    const velocityHandling = new Map([
      [1, 'Right'],
      [-1, 'Left'],
      [0, this.currentStateName.replace(`lives${this.previousLivesValue}`, '')]
    ]);
    const nextStateName = `lives${this.lives}`.concat(
      velocityHandling.get(Math.sign(this.velocity.x))
    );
    if (nextStateName !== this.currentStateName) {
      if (this.lives !== this.previousLivesValue) {
        this.velocity.x -=
          Math.sign(this.velocity.x) * this.maxVelocity.x * 0.5;
        this.box.height -= this.box.height * 0.5;
        this.frame.drawOffset.y -= this.box.height;
        this.box.pos.y += this.box.height;
        this.previousLivesValue = this.lives;
      }
      this.currentStateName = nextStateName;
      this.setFrame();
    }
  }

  velocityUpdate(tile) {
    const { velocity } = this;
    velocity.y += this.gravity;
    const currentVX = velocity.x;
    velocity.x = currentVX;
    const collisions = this.detectCollisions(tile.enemyObjs);
    for (const side of collisions.sides) {
      if (side !== 'bottom') {
        velocity.x = -currentVX;
        return;
      }
    }

    const box = structuredClone(this.box);
    const bottomCheckBox = structuredClone(this.box);
    bottomCheckBox.pos.x += Math.sign(currentVX) * box.width;
    this.box = bottomCheckBox;
    const bottomCheck = this.detectCollisions(tile.enemyObjs);
    this.box = box;

    velocity.x = currentVX;
    if (bottomCheck.objects.length === 0) {
      velocity.x = -currentVX;
    }
  }

  update(delay, tile) {
    this.stateUpdate();
    this.velocityUpdate(tile);
    this.box.pos.x += this.velocity.x;
    this.box.pos.y += this.velocity.y;
    this.updateFrame(delay);
  }
}
