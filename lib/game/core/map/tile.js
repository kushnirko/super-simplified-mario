export default class Tile {
  constructor(width, height) {
    this.box = {
      pos: { x: 0, y: 0 },
      width,
      height
    };
    this.blocks = [];
    this.enemies = [];
    this.enemyVisibleObjs = [];
    this.enemyInvisibleObjs = [];
    this.interactObjs = [];
    this.enemyObjs = [];
  }

  update(delay) {
    for (const enemy of this.enemies) {
      enemy.update(delay, this);
      if (enemy.lives === 0) {
        const enemyIndex = this.enemies.indexOf(enemy);
        this.enemies.splice(enemyIndex, 1);
      }
    }
    for (const interactObj of this.interactObjs) interactObj.update();
  }

  draw() {
    for (const block of this.blocks) block.draw();
    for (const enemy of this.enemies) enemy.draw();
    for (const interactItem of this.interactObjs) interactItem.draw();
  }
}
