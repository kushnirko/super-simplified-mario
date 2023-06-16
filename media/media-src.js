export const mediaSrc = new Map();

mediaSrc.set('player', {
  image: document.getElementById('miniMario'),
  box: {
    width: 48,
    height: 70,
  },
  frame: {
    width: 64,
    height: 100,
    drawOffset: {
      x: -8,
      y: -30,
    },
    interval: 1000 / 16,
  },
  states: {
    standingRight:      { index: 0,  maxFrame: 1 },
    standingLeft:       { index: 1,  maxFrame: 1 },
    runningRight:       { index: 2,  maxFrame: 2 },
    runningLeft:        { index: 3,  maxFrame: 2 },
    fastRunningRight:   { index: 4,  maxFrame: 2 },
    fastRunningLeft:    { index: 5,  maxFrame: 2 },
    jumpingRight:       { index: 6,  maxFrame: 1 },
    jumpingLeft:        { index: 7,  maxFrame: 1 },
    fallingRight:       { index: 8,  maxFrame: 1 },
    fallingLeft:        { index: 9,  maxFrame: 1 },
    landingRight:       { index: 10, maxFrame: 1 },
    landingLeft:        { index: 11, maxFrame: 1 },
    spinningRight:      { index: 12, maxFrame: 4 },
    spinningLeft:       { index: 13, maxFrame: 4 },
    damageGettingRight: { index: 14, maxFrame: 1 },
    damageGettingLeft:  { index: 15, maxFrame: 1 },
  },
});

mediaSrc.set('playerHeart', {
  image: document.getElementById('playerHeart'),
  width: 40,
  height: 40,
});

mediaSrc.set('blocks', {
  soilGrass: {
    image: document.getElementById('soilGrass'),
    width: 64,
    height: 64,
  },
  stone: {
    image: document.getElementById('stone'),
    width: 64,
    height: 64,
  },
  singleStone: {
    image: document.getElementById('singleStone'),
    width: 64,
    height: 64,
  },
  singleBricks: {
    image: document.getElementById('singleBricks'),
    width: 64,
    height: 64,
  },
});

mediaSrc.set('bgLayers', {
  skyLayer: {
    image: document.getElementById('skyLayer'),
    width: 1280,
    height: 640,
    speed: 0.05,
  },
  cloudsLayer: {
    image: document.getElementById('cloudsLayer'),
    width: 1280,
    height: 640,
    speed: 0.1,
  },
  largeCloudsLayer: {
    image: document.getElementById('largeCloudsLayer'),
    width: 1280,
    height: 640,
    speedModifier: 0,
  }
});

mediaSrc.set('enemies', {
  rex: {
    image: document.getElementById('rex'),
    box: {
      width: 69,
      height: 120,
    },
    frame: {
      width: 76,
      height: 120,
      drawOffset: {
        x:-3,
        y: 0,
      },
      interval: 125,
    },
    states: {
      lives2Left:  { index: 0,  maxFrame: 2 },
      lives2Right: { index: 1,  maxFrame: 2 },
      lives1Left:  { index: 2,  maxFrame: 2 },
      lives1Right: { index: 3,  maxFrame: 2 },
      lives0Left:  { index: 4,  maxFrame: 1 },
      lives0Right: { index: 5,  maxFrame: 1 },
    },
  },
});

mediaSrc.set('interactObjs', {
  finalGates: {
    gatesImage: document.getElementById('finalGates'),
    gatesBox: {
      width: 96,
      height: 256,
    },
    stageImage: document.getElementById('finalGatesStage'),
    stageBox: {
      width: 49,
      height: 16,
    },
  },
});

mediaSrc.set('sounds', {
  kick:           document.getElementById('kick'),
  pause:          document.getElementById('pause'),
  jump:           document.getElementById('jump'),
  spinJump:       document.getElementById('spinJump'),
  lostLife:       document.getElementById('lostLife'),
  buttonClick:    document.getElementById('buttonClick'),
  gameWin:        document.getElementById('gameWinSound'),
  gameInProgress: document.getElementById('gameSoundtrack'),
  gameOver:       document.getElementById('gameOverSound'),
});
