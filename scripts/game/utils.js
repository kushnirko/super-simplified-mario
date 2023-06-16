export const detectCollisionSide = (obj1, obj2) => {
  let collisionSide = 'none';
  if (obj1.pos.x <= obj2.pos.x + obj2.width  &&
      obj1.pos.x + obj1.width >= obj2.pos.x  &&
      obj1.pos.y <= obj2.pos.y + obj2.height &&
      obj1.pos.y + obj1.height >= obj2.pos.y) {
    let sideX, sideY, collisionSizeX, collisionSizeY;
    if (obj1.pos.x === Math.min(obj1.pos.x, obj2.pos.x)) {
      sideX = 'right';
      collisionSizeX = (obj1.pos.x + obj1.width) - obj2.pos.x;
    } else {
      sideX = 'left';
      collisionSizeX = (obj2.pos.x + obj2.width) - obj1.pos.x;
    }
    if (obj1.pos.y === Math.min(obj1.pos.y, obj2.pos.y)) {
      sideY = 'bottom';
      collisionSizeY = (obj1.pos.y + obj1.height) - obj2.pos.y;
    } else {
      sideY = 'top';
      collisionSizeY = (obj2.pos.y + obj2.height) - obj1.pos.y;
    }
    if (collisionSizeX >= collisionSizeY)
      collisionSide = sideY;
    else collisionSide = sideX;
  }
  return collisionSide;
};

export const isInRange = (range, value) => (
  value >= range.min && value <= range.max
);
