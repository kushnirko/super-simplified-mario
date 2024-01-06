import AppPage from '../app-page.js';
import GamePageMedia from './game-page-media.js';
import GamePageInputManager from './game-page-input-manager.js';
import GamePageDrawManager from './game-page-draw-manager.js';
import GamePageSoundManager from './game-page-sound-manager.js';
import GameEventManager from '../../game/game-event-manager.js';
import Game from '../../game/core/game.js';

export default class GamePage extends AppPage {
  constructor() {
    super();
    this.canvas = document.getElementById('canvas1');
    this.canvas.width = 1280;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext('2d');

    this.media = new GamePageMedia();
    this.im = new GamePageInputManager(this.ee);
    this.dm = new GamePageDrawManager(
      this.ctx, this.media.src.drawable, this.ee
    );
    this.sm = new GamePageSoundManager(this.media.src.audio, this.ee);

    this.gameEM = GameEventManager.getInstance();
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const levelIndex = Number(queryParams.get('level')) - 1;
    this.game = new Game(
      this.canvas.width,
      this.canvas.height,
      this.media.metadata,
      levelIndex
    );

    this.gameUpdateInterval = 10;
    this.animationID = null;
    this.updateTimer = 0;
    this.previousTimeStamp = 0;
    this.onOpen();
    this.gameEM.emitEvent('gameStart');
    this.animate(0);
  }

  setStartSoundsState() {
    super.setStartSoundsState();
    const soundsSwitch = document.getElementById('toggleSounds');
    soundsSwitch.checked = this.sm.isSoundsOn;
  }

  setStartMusicState() {
    super.setStartMusicState();
    const musicSwitch = document.getElementById('toggleMusic');
    musicSwitch.checked = this.sm.isMusicOn;
  }

  setEventListeners() {
    super.setEventListeners();
    const { ee } = this;
    ee.onEvent('gamePause', () => {
      this.game.state = 'gamePause';
      cancelAnimationFrame(this.animationID);
      const dialog = document.getElementById('gamePauseDialog');
      dialog.style.display = 'block';
    });
    ee.onEvent('gameResume', () => {
      this.game.state = 'gameInProgress';
      this.game.previousUpdateTime = new Date().getTime();
      this.animate(this.previousTimeStamp);
      const dialog = document.getElementById('gamePauseDialog');
      dialog.style.display = 'none';
    });
    ee.onEvent('gameRetry', () => {
      setTimeout(() => location.reload(), this.sm.newPageDelay);
    });

    this.gameEM.onEvent('drawTime', time => {
      const str = `TIME : ${time}`;
      this.ee.emitEvent('changeText', 'gameTime', str);
    });
    this.gameEM.onEvent('drawScore', score => {
      const str = `SCORE : ${score}`;
      this.ee.emitEvent('changeText', 'gameScore', str);
    });
    this.gameEM.onEvent('gameWin', totalScore => {
      const gameTimeTextField = document.getElementById('gameTime');
      gameTimeTextField.style.display = 'none';
      const gameScoreTextField = document.getElementById('gameScore');
      gameScoreTextField.style.display = 'none';
      const dialog = document.getElementById('gameWinDialog');
      dialog.style.display = 'block';

      const str = `TOTAL SCORE : ${totalScore}`;
      this.ee.emitEvent('changeText', 'gameTotalScore', str);

      const maxScoreStr = sessionStorage.getItem('maxScore');
      if (!maxScoreStr || totalScore > parseInt(maxScoreStr)) {
        sessionStorage.setItem('maxScore', totalScore.toString());
      }
    });
    this.gameEM.onEvent('gameOver', () => {
      const dialog = document.getElementById('gameOverDialog');
      dialog.style.display = 'block';
    });
  }

  setButtonListeners() {
    super.setButtonListeners();
    const { ee } = this;
    const soundsSwitch = document.getElementById('toggleSounds');
    soundsSwitch.addEventListener('click', () => {
      ee.emitEvent('btnClick', soundsSwitch);
      ee.emitEvent('toggleSounds');
    });
    const musicSwitch = document.getElementById('toggleMusic');
    musicSwitch.addEventListener('click', () => {
      ee.emitEvent('btnClick', musicSwitch);
      ee.emitEvent('toggleMusic');
    });
    const gamePauseBtn = document.getElementById('gamePauseButton');
    gamePauseBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', gamePauseBtn);
      ee.emitEvent('gamePause');
    });
    const pauseBackBtn = document.getElementById('pauseBackButton');
    pauseBackBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', pauseBackBtn);
      ee.emitEvent('gameResume');
    });
    const pauseRetryBtn = document.getElementById('pauseRetryButton');
    pauseRetryBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', pauseRetryBtn);
      ee.emitEvent('gameRetry');
    });
    const pauseExitBtn = document.getElementById('pauseExitButton');
    pauseExitBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', pauseExitBtn);
      ee.emitEvent('pageClose');
      ee.emitEvent('newPage', pauseExitBtn.getAttribute('data-href'));
    });
    const gameWinExitBtn = document.getElementById('gameWinExitButton');
    gameWinExitBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', gameWinExitBtn);
      ee.emitEvent('pageClose');
      ee.emitEvent('newPage', gameWinExitBtn.getAttribute('data-href'));
    });
    const gameOverRetryBtn = document.getElementById('gameOverRetryButton');
    gameOverRetryBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', gameOverRetryBtn);
      ee.emitEvent('gameRetry');
    });
    const gameOverExitBtn = document.getElementById('gameOverExitButton');
    gameOverExitBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', gameOverExitBtn);
      ee.emitEvent('pageClose');
      ee.emitEvent('newPage', gameOverExitBtn.getAttribute('data-href'));
    });
  }

  animate(timeStamp) {
    const { game } = this;
    if (!this.animationID) game.draw();
    const delay = timeStamp - this.previousTimeStamp;
    this.previousTimeStamp = timeStamp;
    if (this.updateTimer > this.gameUpdateInterval) {
      this.updateTimer = 0;
      this.ctx.clearRect(
        game.box.pos.x, game.box.pos.y, game.box.width, game.box.height
      );
      game.update(delay);
      this.ctx.translate(game.camera.move, game.box.pos.y);
      game.draw();
    } else {
      this.updateTimer += delay;
    }
    if (game.state === 'gameInProgress') {
      this.animationID = requestAnimationFrame(
        timestamp => this.animate(timestamp)
      );
    }
  }
}
