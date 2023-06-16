import { detectCollisionSide } from "../utils.js";

export default class Sprite {
  constructor(tilesNumber, src, soundPlayer) {
    this.tile = null;
    this.tilesNumber = tilesNumber;
    this.image = src.image;
    this.box = {
      width: src.box.width,
      height: src.box.height,
      pos: { x: 0, y: 0 },
    };
    this.frame = {
      width: src.frame.width,
      height: src.frame.height,
      drawOffset: {
        x: src.frame.drawOffset.x,
        y: src.frame.drawOffset.y,
      },
      interval: src.frame.interval,
    };
    this.states = src.states;
    this.currentFrame = {
      index: 0,
      state: 0,
      timer: 0,
      max: 0,
    };
    this.soundPlayer = soundPlayer;
    this.velocity = { x: 0, y: 0 };
    this.maxVelocity = { x: 0, y: 0 };
    this.gravity = 1;
    this.lives = 0;
    this.damage = 0;
  }

  isNearMapStart() {
    return this.box.pos.x + this.velocity.x <= 0;
  }

  isOnMapTop() {
    return this.box.pos.y + this.box.width > 0;
  }

  isNearMapEnd() {
    const currentPosX = this.box.pos.x + this.box.width + this.velocity.x;
    const maxPosX = this.tile.box.width * this.tilesNumber;
    return currentPosX >= maxPosX;
  }

  isUnderMapBottom() {
    return this.box.pos.y > this.tile.box.height;
  }

  detectCollisions(tileObjects) {
    const collisions =  {
      sides: [],
      objects: [],
    };
    if (tileObjects.length !== 0) {
      const collisionHandling = {
        left:   { axis: 'x', newPos: tileObjects[0].box.width + 1,  },
        right:  { axis: 'x', newPos: -this.box.width - 1,           },
        top:    { axis: 'y', newPos: tileObjects[0].box.height + 1, },
        bottom: { axis: 'y', newPos: -this.box.height,              },
      };
      for (const obj of tileObjects) {
        const side = detectCollisionSide(this.box, obj.box);
        if (side !== 'none') {
          collisions.sides.push(side);
          collisions.objects.push(obj);

          this.box.pos[collisionHandling[side].axis] =
            obj.box.pos[collisionHandling[side].axis] +
            collisionHandling[side].newPos;
          this.velocity[collisionHandling[side].axis] = 0;
        }
      }
    }
    if (collisions.sides.length === 0)
      collisions.sides.push('none');
    return collisions;
  }

  updateFrame(delay) {
    if (this.currentFrame.timer > this.frame.interval) {
      this.currentFrame.timer = 0;
      if (this.currentFrame.index < this.currentFrame.max) {
        this.currentFrame.index++;
      } else {
        this.currentFrame.index = 0;
      }
    } else {
      this.currentFrame.timer += delay;
    }
  }

  update() {}

  draw(ctx) {
    const { width, height, drawOffset } = this.frame;
    ctx.drawImage(this.image,
      (this.currentFrame.index * width),
      (this.currentFrame.state * height),
      width, height,
      (this.box.pos.x + drawOffset.x),
      (this.box.pos.y + drawOffset.y),
      width, height);
  }
}
