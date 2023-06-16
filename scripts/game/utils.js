export const detectCollisionSide = (obj1, obj2) => {
  let collisionSide = 'none';

  const obj1Left = obj1.pos.x;
  const obj1Right = obj1Left + obj1.width;
  const obj1Top = obj1.pos.y;
  const obj1Bottom = obj1Top + obj1.height;

  const obj2Left = obj2.pos.x;
  const obj2Right = obj2Left + obj2.width;
  const obj2Top = obj2.pos.y;
  const obj2Bottom = obj2Top + obj2.height;

  const isCollisionX = (obj1Left <= obj2Right) && (obj1Right >= obj2Left);
  const isCollisionY = (obj1Top <= obj2Bottom) && (obj1Bottom >= obj2Top);
  if (isCollisionX  && isCollisionY) {
    let sideX, sideY, collisionSizeX, collisionSizeY;
    if (obj1Left === Math.min(obj1Left, obj2Left)) {
      sideX = 'right';
      collisionSizeX = obj1Right - obj2Left;
    } else {
      sideX = 'left';
      collisionSizeX = obj2Right - obj1Left;
    }
    if (obj1Top === Math.min(obj1Top, obj2Top)) {
      sideY = 'bottom';
      collisionSizeY = obj1Bottom - obj2Top;
    } else {
      sideY = 'top';
      collisionSizeY = obj2Bottom - obj1Top;
    }
    collisionSide = (collisionSizeX >= collisionSizeY ? sideY : sideX);
  }
  return collisionSide;
};

export const isInRange = (range, value) => (
  value >= range.min && value <= range.max
);
