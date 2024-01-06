import Background from './background/background.js';
import Block from './block.js';
import Tile from './tile.js';

export default class GameMap {
  constructor(levelData, drawData) {
    this.levelData = levelData;
    this.drawData = drawData;
    this.levelLength = 0;
    this.tilesNumber = 0;
    this.tiles = [];
    this.visibleTiles = [];
    this.currentTileIndex = 0;
    this.currentTile = null;
    this.cellSize = 64;
    this.tileWidth = 0;
    this.tileHeight = 0;
    const layers = [];
    for (const layerIndex of levelData.bgLayers) {
      const layerData = {
        ...drawData.bgLayers[layerIndex], ...drawData.bgLayer
      };
      layers.push(layerData);
    }
    this.background = new Background(layers);
    this.mapContent = {
      blocks: drawData.blocks,
      enemies: drawData.enemies,
      enemyVisibleObjs: [],
      enemyInvisibleObjs: drawData.interactObjs
    };
  }

  decodeLevelArray() {
    const encodedLevel = this.levelData.encodedLevel;
    const decoding = {
      emptyCell: 0,
      blocks: { min: 1000, max: 2000 },
      enemies: { min: 10, max: 310 },
      enemyVisibleObjs: { min: 400, max: 500 },
      enemyInvisibleObjs: { min: 600, max: 700 }
    };
    const mapObjs = [
      'blocks',
      'enemies',
      'enemyVisibleObjs',
      'enemyInvisibleObjs'
    ];

    const tileRows = encodedLevel[0].length;
    const tileCols = encodedLevel[0][0].length;
    this.tileWidth = tileCols * this.cellSize;
    this.tileHeight = tileRows * this.cellSize;

    const getObjFromEncoding = (objCode, tilePosX, row, col) => {
      for (const obj of mapObjs) {
        const codeRange = decoding[obj];
        if (objCode >= codeRange.min && objCode <= codeRange.max) {
          let newObj, objIndex;
          if (obj === 'blocks') {
            objIndex = Math.floor((objCode - decoding.blocks.min) / 10);
            const objState = objCode % 10;
            const blockData = {
              ...this.mapContent[obj][objIndex],
              ...this.drawData.block
            };
            newObj = new Block(blockData);
            newObj.state = objState;
          } else {
            objIndex = objCode - decoding[obj].min;
            const objData = this.mapContent[obj][objIndex];
            const Ref = objData.ref;
            newObj = new Ref(objData);
          }
          newObj.box.pos.x = tilePosX + col * this.cellSize;
          newObj.box.pos.y = row * this.cellSize;
          this.tiles[this.tilesNumber][obj].push(newObj);
        }
      }
    };

    const handleTileCells = (tile, tilePosX) => {
      for (let i = 0; i < tileRows; i++) {
        for (let j = 0; j < tileCols; j++) {
          getObjFromEncoding(tile[i][j], tilePosX, i, j);
        }
      }
    };

    const handleTiles = () => {
      for (const tile of encodedLevel) {
        const tilePosX = this.tileWidth * this.tilesNumber;
        this.tiles.push(new Tile(this.tileWidth, this.tileHeight));
        this.tiles[this.tilesNumber].box.pos.x = tilePosX;
        handleTileCells(tile, tilePosX);
        const currentTile = this.tiles[this.tilesNumber];
        currentTile.interactObjs = currentTile.enemyVisibleObjs.concat(
          currentTile.enemyInvisibleObjs
        );
        currentTile.enemyObjs = currentTile.blocks.concat(
          currentTile.enemyVisibleObjs
        );
        this.tilesNumber++;
      }
    };
    handleTiles();

    this.currentTile = this.tiles[this.currentTileIndex];
    this.visibleTiles.push(this.currentTile);
    this.visibleTiles.push(this.tiles[this.currentTileIndex + 1]);
    this.levelLength = this.tilesNumber * this.tileWidth;
  }

  update(player, delay) {
    this.background.update(player.box.pos.x);

    const { x } = player.box.pos;
    const { tiles, visibleTiles, currentTile } = this;

    if (x > (this.currentTileIndex + 1) * currentTile.box.width) {
      if (this.currentTileIndex > 0) {
        visibleTiles.shift();
      }
      this.currentTile = tiles[++this.currentTileIndex];
      if (this.currentTileIndex < tiles.length - 1) {
        visibleTiles.push(tiles[this.currentTileIndex + 1]);
      }
    } else if (x < this.currentTileIndex * currentTile.box.width) {
      this.currentTile = tiles[--this.currentTileIndex];
      if (this.currentTileIndex > 0) {
        visibleTiles.unshift(tiles[this.currentTileIndex - 1]);
      }
      if (this.currentTileIndex < tiles.length - 2) {
        visibleTiles.pop();
      }
    }

    for (const tile of visibleTiles) tile.update(delay);
  }

  draw() {
    this.background.draw(this.tilesNumber);
    for (const tile of this.visibleTiles) {
      tile.draw();
    }
  }
}
