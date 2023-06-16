export default class FinalGates {
  constructor(tilesNumber, src) {
    this.gatesImage = src.gatesImage;
    this.stageImage = src.stageImage;
    this.gatesBox = {
      width: src.gatesBox.width,
      height: src.gatesBox.height,
      pos: { x: 0, y: 0 }
    };
    this.stageBox = {
      width: src.stageBox.width,
      height: src.stageBox.height,
      pos: {
        x: 0,
        y: 0,
      }
    };
    this.stageDrawOffsetX = 16;
    this.borderOfMoves = 15;
    this.speed = 2;
  }

  get box() {
    return this.stageBox;
  }

  interact(side, playerProps) {
    if (side !== 'none') {
      playerProps.lives = Infinity;
    }
  }

  update() {
    if (this.gatesBox.pos.x === 0 ||
        this.gatesBox.pos.y === 0) {
      this.gatesBox.pos.x = this.stageBox.pos.x;
      this.gatesBox.pos.y = this.stageBox.pos.y;
      this.stageBox.pos.x += this.stageDrawOffsetX;
      this.stageBox.pos.y += this.borderOfMoves;
    }
    const stageTop = this.stageBox.pos.y;
    const stageBottom = stageTop + this.stageBox.height;
    const gatesTop = this.gatesBox.pos.y;
    const gatesBottom = gatesTop + this.gatesBox.height;
    if (stageTop < gatesTop + this.borderOfMoves ||
        stageBottom > gatesBottom - this.borderOfMoves)
      this.speed *= -1;
    this.stageBox.pos.y += this.speed;
  }

  draw(ctx) {
    const { stageBox, gatesBox } = this;
    ctx.drawImage(
      this.gatesImage,
      0, 0, gatesBox.width, gatesBox.height,
      gatesBox.pos.x, gatesBox.pos.y, gatesBox.width, gatesBox.height
    );
    ctx.drawImage(
      this.stageImage,
      0, 0, stageBox.width, stageBox.height,
      stageBox.pos.x, stageBox.pos.y, stageBox.width, stageBox.height
    );
  }
}
