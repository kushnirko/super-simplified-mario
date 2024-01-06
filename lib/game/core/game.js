import GameEventManager from '../game-event-manager.js';
import Player from './sprites/player.js';
import GameMap from './map/map.js';
import Level1 from '../../../levels/level-1.js';

export default class Game {
  constructor(width, height, drawData, levelIndex) {
    const levelsData = [new Level1()];
    this.levelData = levelsData[levelIndex];
    this.timer = this.levelData.time;
    this.previousUpdateTime = new Date().getTime();
    this.timeToScoreMultiplier = 0.05;
    this.state = 'gameInProgress';
    this.box = {
      pos: { x: 0, y: 0 },
      width,
      height
    };
    this.em = GameEventManager.getInstance();
    this.inputs = [];
    this.gameMap = new GameMap(
      this.levelData,
      drawData
    );
    this.gameMap.decodeLevelArray();
    this.player = new Player(drawData.player);
    this.playerHeart = drawData.playerHeart;
    this.camera = {
      posX: 0,
      width: 1000,
      move: 0
    };
    this.setInputListeners();
  }

  setInputListeners() {
    this.em.onEvent('inputAdded', inputs => {
      this.inputs = inputs;
    });
    this.em.onEvent('inputRemoved', inputs => {
      this.inputs = inputs;
    });
  }

  updateCamera() {
    const { player, gameMap } = this;
    this.camera.move = 0;
    const oldCameraPosX = this.camera.posX;
    this.camera.posX = Math.round(
      player.box.pos.x - (this.camera.width - player.box.width) * 0.5
    );

    const cameraLeftSide = this.camera.posX;
    const cameraRightSide = cameraLeftSide + this.camera.width;
    const gameBoxLeftSide = this.box.pos.x;
    const gameBoxRightSide = gameBoxLeftSide + this.box.width;

    const canPanLeft = cameraLeftSide > 0;
    const canPanRight = cameraRightSide < gameMap.levelLength;
    const needPanLeft = cameraLeftSide < gameBoxLeftSide;
    const needPanRight = cameraRightSide > gameBoxRightSide;

    if ((canPanLeft && needPanLeft) || (canPanRight && needPanRight)) {
      this.camera.move -= (this.camera.posX - oldCameraPosX);
      this.box.pos.x -= this.camera.move;
    }
  }

  update(delay) {
    const currentTime = new Date().getTime();
    const time = currentTime - this.previousUpdateTime;
    this.timer -= time;
    this.previousUpdateTime = currentTime;

    const { gameMap, player } = this;
    this.player.update(
      delay, gameMap.currentTile, gameMap.levelLength, this.inputs
    );
    this.gameMap.update(player, delay);
    this.updateCamera();

    if (player.lives === 0 || this.timer <= 0) {
      this.state = 'gameOver';
      this.em.emitEvent('gameOver');
    } else if (player.lives === Infinity) {
      this.state = 'gameWin';
      const totalScore = Math.round(
        player.score + this.timer * this.timeToScoreMultiplier);
      this.em.emitEvent('gameWin', totalScore);
    }
  }

  drawPlayerLives() {
    const distanceBetweenHearts = 10;
    const drawOffset = {
      x: 50,
      y: 30
    };
    const drawPos = {
      x: this.box.pos.x + drawOffset.x,
      y: this.box.pos.y + drawOffset.y
    };

    for (let i = 0; i < this.player.lives; i++) {
      const sBox = {
        x: 0,
        y: 0,
        width: this.playerHeart.width,
        height: this.playerHeart.height
      };
      const dBox = {
        x: drawPos.x,
        y: drawPos.y,
        width: this.playerHeart.width,
        height: this.playerHeart.height
      };
      this.em.emitEvent('drawObject', 'playerHeart', sBox, dBox);
      drawPos.x += this.playerHeart.width + distanceBetweenHearts;
    }
  }

  drawTime() {
    const timeInSeconds = Math.round(this.timer / 1000);
    this.em.emitEvent('drawTime', timeInSeconds);
  }

  drawScore() {
    this.em.emitEvent('drawScore', this.player.score);
  }

  draw() {
    this.gameMap.draw();
    this.player.draw();
    if (this.state !== 'gameWin') {
      this.drawPlayerLives();
      this.drawTime();
      this.drawScore();
    }
  }
}
