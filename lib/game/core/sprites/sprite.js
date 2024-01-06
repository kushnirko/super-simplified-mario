import GameEventManager from '../../game-event-manager.js';

export default class Sprite {
  constructor(data) {
    this.em = GameEventManager.getInstance();
    this.name = data.name;
    this.box = {
      width: data.box.width,
      height: data.box.height,
      pos: { x: 0, y: 0 }
    };
    this.frame = {
      width: data.frame.width,
      height: data.frame.height,
      drawOffset: {
        x: data.frame.drawOffset.x,
        y: data.frame.drawOffset.y
      },
      interval: data.frame.interval
    };
    this.states = data.states;
    this.currentFrame = {
      index: 0,
      state: 0,
      timer: 0,
      max: 0
    };
    this.velocity = { x: 0, y: 0 };
    this.maxVelocity = { x: 0, y: 0 };
    this.gravity = 1.5;
    this.lives = 0;
    this.damage = 0;
  }

  isNearMapStart() {
    const currentPosX = this.box.pos.x + this.velocity.x;
    return currentPosX <= 0;
  }

  isNearMapEnd(levelLength) {
    const currentPosX = this.box.pos.x + this.box.width + this.velocity.x;
    return currentPosX >= levelLength;
  }

  isOnMapTop() {
    return this.box.pos.y + this.box.width > 0;
  }

  isUnderMapBottom(tileHeight) {
    return this.box.pos.y > tileHeight;
  }

  detectCollisionSide(obj) {
    let collisionSide = 'none';

    const left = this.box.pos.x;
    const right = left + this.box.width;
    const top = this.box.pos.y;
    const bottom = top + this.box.height;

    const objLeft = obj.pos.x;
    const objRight = objLeft + obj.width;
    const objTop = obj.pos.y;
    const objBottom = objTop + obj.height;

    const isCollisionX = left <= objRight && right >= objLeft;
    const isCollisionY = top <= objBottom && bottom >= objTop;
    if (isCollisionX && isCollisionY) {
      let sideX, sideY, collisionSizeX, collisionSizeY;
      if (left === Math.min(left, objLeft)) {
        sideX = 'right';
        collisionSizeX = right - objLeft;
      } else {
        sideX = 'left';
        collisionSizeX = objRight - left;
      }
      if (top === Math.min(top, objTop)) {
        sideY = 'bottom';
        collisionSizeY = bottom - objTop;
      } else {
        sideY = 'top';
        collisionSizeY = objBottom - top;
      }
      collisionSide = collisionSizeX >= collisionSizeY ? sideY : sideX;
    }
    return collisionSide;
  }

  detectCollisions(objs) {
    const collisions = {
      sides: [],
      objects: []
    };
    if (objs.length !== 0) {
      const collisionHandling = {
        left: { axis: 'x', newPos: objs[0].box.width + 1 },
        right: { axis: 'x', newPos: -this.box.width - 1 },
        top: { axis: 'y', newPos: objs[0].box.height + 1 },
        bottom: { axis: 'y', newPos: -this.box.height }
      };
      for (const obj of objs) {
        const side = this.detectCollisionSide(obj.box);
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
    if (collisions.sides.length === 0) collisions.sides.push('none');
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

  draw() {
    const { pos: { x, y } } = this.box;
    const { width, height, drawOffset } = this.frame;
    const { index, state } = this.currentFrame;
    const sBox = {
      x: index * width,
      y: state * height,
      width,
      height
    };
    const dBox = {
      x: x + drawOffset.x,
      y: y + drawOffset.y,
      width,
      height
    };
    this.em.emitEvent('drawObject', this.name, sBox, dBox);
  }
}
