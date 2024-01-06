import GameEventManager from '../../game-event-manager.js';

export default class FinalGates {
  constructor(data) {
    this.em = GameEventManager.getInstance();
    this.name = data.name;
    this.gates = {
      name: data.gates.name,
      box: {
        width: data.gates.box.width,
        height: data.gates.box.height,
        pos: { x: 0, y: 0 }
      }
    };
    this.stage = {
      name: data.stage.name,
      box: {
        width: data.stage.box.width,
        height: data.stage.box.height,
        pos: { x: 0, y: 0 }
      }
    };
    this.stageDrawOffsetX = 16;
    this.borderOfMoves = 15;
    this.speed = 2;
  }

  get box() {
    return this.stage.box;
  }

  interact(side, playerProps) {
    if (side !== 'none') {
      playerProps.lives = Infinity;
    }
  }

  update() {
    const { gates, stage } = this;
    if (gates.box.pos.x === 0 || gates.box.pos.y === 0) {
      gates.box.pos.x = stage.box.pos.x;
      gates.box.pos.y = stage.box.pos.y;
      stage.box.pos.x += this.stageDrawOffsetX;
      stage.box.pos.y += this.borderOfMoves;
    }
    const stageTop = stage.box.pos.y;
    const stageBottom = stageTop + stage.box.height;
    const gatesTop = gates.box.pos.y;
    const gatesBottom = gatesTop + gates.box.height;

    const isStageInMinPos = stageBottom > gatesBottom - this.borderOfMoves;
    const isStageInMaxPos = stageTop < gatesTop + this.borderOfMoves;
    if (isStageInMinPos || isStageInMaxPos) this.speed *= -1;
    stage.box.pos.y += this.speed;
  }

  draw() {
    const gatesBox = this.gates.box;
    const gatesSBox = {
      x: 0,
      y: 0,
      width: gatesBox.width,
      height: gatesBox.height
    };
    const gatesDBox = {
      x: gatesBox.pos.x,
      y: gatesBox.pos.y,
      width: gatesBox.width,
      height: gatesBox.height
    };
    this.em.emitEvent('drawObject', this.gates.name, gatesSBox, gatesDBox);

    const stageBox = this.stage.box;
    const stageSBox = {
      x: 0,
      y: 0,
      width: stageBox.width,
      height: stageBox.height
    };
    const stageDBox = {
      x: stageBox.pos.x,
      y: stageBox.pos.y,
      width: stageBox.width,
      height: stageBox.height
    };
    this.em.emitEvent('drawObject', this.stage.name, stageSBox, stageDBox);
  }
}
