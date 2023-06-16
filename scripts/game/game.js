import Player from "./sprites/player/player.js";
import GameMap from "./map/map.js";

export default class Game {
  constructor(
    canvasWidth,
    canvasHeight,
    src,
    levelIndex,
    soundPlayer
  ) {
    this.state = 'gameInProgress';
    this.box = {
      pos: { x: 0, y: 0 },
      width: canvasWidth,
      height: canvasHeight,
    }
    this.soundPlayer = soundPlayer;
    this.gameMap = new GameMap(
      levelIndex,
      src.get('bgLayers'),
      src.get('blocks'),
      src.get('enemies'),
      src.get('interactObjs')
    );
    this.gameMap.decodeLevelArray();
    this.player = new Player(
      this.gameMap.tilesNumber,
      src.get('player'),
      this.soundPlayer
    );
    this.playerHeart = src.get('playerHeart');
    this.camera = {
      posX: 0,
      width: 1000,
      move: 0,
    }
  }

  updateCamera() {
    const { player, gameMap } = this;
    this.camera.move = 0;
    const half = 0.5
    this.camera.posX = player.box.pos.x -
        (this.camera.width - player.box.width) * half;

    const cameraLeftSide = this.camera.posX;
    const cameraRightSide = cameraLeftSide + this.camera.width;
    const gameBoxLeftSide = this.box.pos.x;
    const gameBoxRightSide = gameBoxLeftSide + this.box.width;

    const isImpossiblePanLeft = cameraLeftSide <= 0;
    const isImpossiblePanRight = cameraRightSide >= gameMap.levelLength;
    if (isImpossiblePanLeft || isImpossiblePanRight) return;

    const isRequiredPanLeft = cameraLeftSide <= gameBoxLeftSide;
    const isRequiredPanRight = cameraRightSide >= gameBoxRightSide;
    if (isRequiredPanLeft || isRequiredPanRight) {
      this.camera.move -= player.velocity.x;
      this.box.pos.x -= this.camera.move;
    }
  }

  update(delay, input) {
    this.player.update(delay, input, this.gameMap.currentTile);

    this.gameMap.update(
      this.player.box.pos.x,
      this.player.velocity.x,
      delay
    );

    this.updateCamera();

    if (this.player.lives === 0)
      this.state = 'gameOver';
    else if (this.player.lives === Infinity)
      this.state = 'gameWin';

  }

  drawPlayerLives(ctx) {
    const distanceBetweenImages = 10;
    const drawOffset = {
      x: 50,
      y: 30,
    };
    const drawPos = {
      x: this.box.pos.x + drawOffset.x,
      y: this.box.pos.y + drawOffset.y,
    }

    for (let i = 0; i < this.player.lives; i++) {
      ctx.drawImage(this.playerHeart.image,
        0, 0, this.playerHeart.width, this.playerHeart.height,
        drawPos.x, drawPos.y, this.playerHeart.width, this.playerHeart.height);
      drawPos.x += (this.playerHeart.width + distanceBetweenImages);
    }
  }

  draw(ctx) {
    this.gameMap.draw(ctx);
    this.player.draw(ctx);
    if (this.state !== 'gameWin')
      this.drawPlayerLives(ctx);
  }
}
