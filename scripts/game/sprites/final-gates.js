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
    const { gatesBox, stageBox } = this;
    if (gatesBox.pos.x === 0 || gatesBox.pos.y === 0) {
      gatesBox.pos.x = stageBox.pos.x;
      gatesBox.pos.y = stageBox.pos.y;
      stageBox.pos.x += this.stageDrawOffsetX;
      stageBox.pos.y += this.borderOfMoves;
    }
    const stageTop = stageBox.pos.y;
    const stageBottom = stageTop + stageBox.height;
    const gatesTop = gatesBox.pos.y;
    const gatesBottom = gatesTop + gatesBox.height;

    const isStageInMinPos = stageBottom > gatesBottom - this.borderOfMoves;
    const isStageInMaxPos = stageTop < gatesTop + this.borderOfMoves;
    if (isStageInMinPos || isStageInMaxPos) this.speed *= -1;
    stageBox.pos.y += this.speed;
  }

  draw(ctx) {
    const { stageBox, gatesBox } = this;
    ctx.drawImage(this.gatesImage,
      0, 0, gatesBox.width, gatesBox.height,
      gatesBox.pos.x, gatesBox.pos.y, gatesBox.width, gatesBox.height
    );
    ctx.drawImage(this.stageImage,
      0, 0, stageBox.width, stageBox.height,
      stageBox.pos.x, stageBox.pos.y, stageBox.width, stageBox.height
    );
  }
}
