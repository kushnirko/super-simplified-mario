import Background from "./background.js";

import { levels } from "./levels.js";
import { isInRange } from "../utils.js";

import Rex from "../sprites/rex.js";
import FinalGates from "../sprites/final-gates.js";

class Block {
  constructor(src) {
    this.image = src.image;
    this.state = 0;
    this.box = {
      pos: {
        x: 0,
        y: 0,
      },
      width: src.width,
      height: src.height,
    }
  }

  draw(ctx) {
    const { image, state, box } = this;
    ctx.drawImage(image,
        state * box.width, 0, box.width, box.height,
        box.pos.x, box.pos.y, box.width, box.height
    );
  }
}

class Tile {
  constructor(width, height) {
    this.box = {
      pos: { x: 0, y: 0 },
      width: width,
      height: height,
    }
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
    for (const interactObj of this.interactObjs)
      interactObj.update();
  }

  draw(ctx) {
    for (const block of this.blocks)
      block.draw(ctx);
    for (const enemy of this.enemies)
      enemy.draw(ctx);
    for (const interactItem of this.interactObjs)
      interactItem.draw(ctx);
  }
}

export default class GameMap {
  constructor(
    levelIndex,
    layersSrc,
    blocksSrc,
    enemiesSrc,
    interactObjsSrc
  ) {
    this.levelIndex = levelIndex;
    this.levelLength = 0;
    this.tilesNumber = 0;
    this.tiles = [];
    this.visibleTiles = [];
    this.currentTileIndex = 0;
    this.currentTile = null;
    this.cellSize = 64;
    this.tileWidth = 0;
    this.tileHeight = 0;
    const layers = levels[this.levelIndex].get('bgLayers').map((name) => layersSrc[name]);
    this.background = new Background(layers);
    this.mapContent = {
      blocks: Object.keys(blocksSrc).map((key) => ({
        reference: Block,
        src: blocksSrc[key],
      })),
      enemies: [
        { reference: Rex,    src: enemiesSrc.rex, },
      ],
      enemyVisibleObjs: [],
      enemyInvisibleObjs: [
        { reference: FinalGates, src: interactObjsSrc.finalGates, },
      ],
    };
  }

  decodeLevelArray() {
    const levelArray = levels[this.levelIndex].get('array');
    const decoding = {
      emptyCell: 0,
      blocks:             { min: 1000, max: 2000, },
      enemies:            { min: 10,   max: 310,  },
      enemyVisibleObjs:   { min: 400,  max: 500,  },
      enemyInvisibleObjs: { min: 600,  max: 700,  },
    };
    const mapObjs = [
      'blocks',
      'enemies',
      'enemyVisibleObjs',
      'enemyInvisibleObjs',
    ];

    const tileRows = levelArray[0].length;
    const tileCols = levelArray[0][0].length;
    this.tileWidth = tileCols * this.cellSize;
    this.tileHeight = tileRows * this.cellSize;

    for (const tile of levelArray) {
      const tilePosX = this.tileWidth * this.tilesNumber;
      this.tiles.push(new Tile(this.tileWidth, this.tileHeight));
      this.tiles[this.tilesNumber].box.pos.x = tilePosX;
      for (let i = 0; i < tileRows; i++) {
        for (let j = 0; j < tileCols; j++) {
          for (const obj of mapObjs) {
            if (isInRange(decoding[obj], tile[i][j])) {
              let newObj, objIndex;
              if (obj === 'blocks') {
                objIndex = Math.floor((tile[i][j] - decoding.blocks.min) / 10);
                const objState = tile[i][j] % 10;
                const { reference, src } = this.mapContent[obj][objIndex];
                newObj = new reference(src);
                newObj.state = objState;
              } else {
                objIndex = tile[i][j] - decoding[obj].min;
                const { reference, src } = this.mapContent[obj][objIndex];
                newObj = new reference(this.tilesNumber, src);
              }
              newObj.box.pos.x = tilePosX + j * this.cellSize;
              newObj.box.pos.y = i * this.cellSize;
              this.tiles[this.tilesNumber][obj].push(newObj);
            }
          }
        }
      }
      const currentTile = this.tiles[this.tilesNumber];
      currentTile.interactObjs = currentTile.enemyVisibleObjs.concat(
        currentTile.enemyInvisibleObjs
      );
      currentTile.enemyObjs = currentTile.blocks.concat(
        currentTile.enemyVisibleObjs
      );
      this.tilesNumber++;
    }
    this.currentTile = this.tiles[this.currentTileIndex];
    this.visibleTiles.push(this.currentTile);
    this.visibleTiles.push(this.tiles[this.currentTileIndex + 1]);
    this.levelLength = this.tilesNumber * this.tileWidth;
  }

  update(playerPosX, playerVelocityX, delay) {
    this.background.update(playerVelocityX);

    if (playerPosX > (this.currentTileIndex + 1) * this.currentTile.box.width) {
      if (this.currentTileIndex > 0)
        this.visibleTiles.shift();
      this.currentTile = this.tiles[++this.currentTileIndex];
      if (this.currentTileIndex < this.tiles.length - 1)
        this.visibleTiles.push(this.tiles[this.currentTileIndex + 1]);
    } else if (playerPosX < this.currentTileIndex * this.currentTile.box.width) {
      this.currentTile = this.tiles[--this.currentTileIndex];
      if (this.currentTileIndex > 0)
        this.visibleTiles.unshift(this.tiles[this.currentTileIndex - 1]);
      if (this.currentTileIndex < this.tiles.length - 2)
        this.visibleTiles.pop();
    }

    for (const tile of this.visibleTiles)
      tile.update(delay);
  }

  draw(ctx) {
    this.background.draw(ctx, this.tilesNumber);

    for (const tile of this.visibleTiles)
      tile.draw(ctx);
  }
}
