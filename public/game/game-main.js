import { mediaSrc } from "../../media/media-src.js";
import InputHandler from "../../scripts/input.js";
import SoundPlayer from "../../scripts/sound-player.js";
import Game from '../../scripts/game/game.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1');
  const CANVAS_WIDTH = canvas.width = 1280;
  const CANVAS_HEIGHT = canvas.height = 640;
  const ctx = canvas.getContext('2d');

  const input = new InputHandler();
  const soundPlayer = new SoundPlayer(mediaSrc.get('sounds'));
  const game = new Game(
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    mediaSrc,
    Number(localStorage.getItem('levelIndex')),
    soundPlayer
  );

  let animationID = null;
  const delayForSoundPlayback = 650;
  let isMusicOn = true;

  const musicOnButton = document.getElementById('musicOnButton');
  musicOnButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    if (!isMusicOn) {
      soundPlayer.play('gameInProgress');
      isMusicOn = true;
    } else {
      soundPlayer.pause('gameInProgress');
      isMusicOn = false;
    }
  });

  const gamePauseWindow = document.getElementById('gamePauseWindow');
  const gamePauseButton = document.getElementById('gamePauseButton');
  gamePauseButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    game.state = 'gamePause';
    cancelAnimationFrame(animationID);
    gamePauseWindow.style.display = 'block';
  });
  const pauseBackButton = document.getElementById('pauseBackButton');
  pauseBackButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    game.state = 'gameInProgress';
    animate(previousTimeStamp);
    gamePauseWindow.style.display = 'none';
  });
  const pauseRetryButton = document.getElementById('pauseRetryButton');
  pauseRetryButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    setTimeout(() => (
      location.reload()
    ), delayForSoundPlayback);
  });
  const pauseExitButton = document.getElementById('pauseExitButton');
  pauseExitButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    setTimeout(() => (
      window.location.href = pauseExitButton.getAttribute('data-href')
    ), delayForSoundPlayback);
  });

  const gameWinExitButton = document.getElementById('gameWinExitButton');
  gameWinExitButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    setTimeout(() => (
      window.location.href = gameWinExitButton.getAttribute('data-href')
    ), delayForSoundPlayback);
  });

  const gameOverRetryButton = document.getElementById('gameOverRetryButton');
  gameOverRetryButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    setTimeout(() => (
      location.reload()
    ), delayForSoundPlayback);
  });
  const gameOverExitButton = document.getElementById('gameOverExitButton');
  gameOverExitButton.addEventListener('click', () => {
    soundPlayer.play('buttonClick');
    setTimeout(() => (
      window.location.href = gameOverExitButton.getAttribute('data-href')
    ), delayForSoundPlayback);
  });

  const gameUpdateInterval = 10;
  let updateTimer = 0;
  let previousTimeStamp = 0;
  const animate = (timeStamp) => {
    const delay = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;
    if (updateTimer > gameUpdateInterval) {
      updateTimer = 0;
      ctx.translate(game.camera.move, game.box.pos.y);
      ctx.clearRect(game.box.pos.x, game.box.pos.y, game.box.width, game.box.height);
      game.update(delay, input.keys);
      game.draw(ctx);
    } else updateTimer += delay;
    if (game.state === 'gameInProgress') {
      animationID = requestAnimationFrame(animate);
    } else {
      if (isMusicOn) soundPlayer.pause('gameInProgress');
      soundPlayer.play(game.state);
      const element = document.getElementById(`${ game.state }Window`);
      element.style.display = 'block';
    }
  }
  animate(0);
});
