import Player from '../../game/core/sprites/player.js';
import Rex from '../../game/core/sprites/rex.js';
import FinalGates from '../../game/core/sprites/final-gates.js';

export default class GamePageMedia {
  constructor() {
    this.src = {
      drawable: new Map([
        ['miniMario', document.getElementById('miniMario')],
        ['playerHeart', document.getElementById('playerHeart')],
        // Enemies
        ['rex', document.getElementById('rex')],
        // Interactive objects
        ['finalGatesGates', document.getElementById('finalGates')],
        ['finalGatesStage', document.getElementById('finalGatesStage')],
        // Blocks
        ['soilGrass', document.getElementById('soilGrass')],
        ['stone', document.getElementById('stone')],
        ['singleStone', document.getElementById('singleStone')],
        ['singleBricks', document.getElementById('singleBricks')],
        // Background layers
        ['skyLayer', document.getElementById('skyLayer')],
        ['cloudsLayer', document.getElementById('cloudsLayer')],
        ['largeCloudsLayer', document.getElementById('largeCloudsLayer')]
      ]),
      audio: new Map([
        ['kick', document.getElementById('kick')],
        ['pause', document.getElementById('pause')],
        ['jump', document.getElementById('jump')],
        ['spinJump', document.getElementById('spinJump')],
        ['lostLife', document.getElementById('lostLife')],
        ['buttonClick', document.getElementById('buttonClick')],
        ['gameWin', document.getElementById('gameWinSound')],
        ['gameOver', document.getElementById('gameOverSound')],
        ['gameInProgress', document.getElementById('gameSoundtrack')]
      ])
    };
    this.metadata = {
      player: {
        name: 'miniMario',
        ref: Player,
        box: {
          width: 48,
          height: 70
        },
        frame: {
          width: 64,
          height: 100,
          drawOffset: {
            x: -8,
            y: -30
          },
          interval: 1000 / 16
        },
        states: {
          standingRight: { index: 0, maxFrame: 1 },
          standingLeft: { index: 1, maxFrame: 1 },
          runningRight: { index: 2, maxFrame: 2 },
          runningLeft: { index: 3, maxFrame: 2 },
          fastRunningRight: { index: 4, maxFrame: 2 },
          fastRunningLeft: { index: 5, maxFrame: 2 },
          jumpingRight: { index: 6, maxFrame: 1 },
          jumpingLeft: { index: 7, maxFrame: 1 },
          fallingRight: { index: 8, maxFrame: 1 },
          fallingLeft: { index: 9, maxFrame: 1 },
          landingRight: { index: 10, maxFrame: 1 },
          landingLeft: { index: 11, maxFrame: 1 },
          spinningRight: { index: 12, maxFrame: 4 },
          spinningLeft: { index: 13, maxFrame: 4 },
          damageGettingRight: { index: 14, maxFrame: 1 },
          damageGettingLeft: { index: 15, maxFrame: 1 }
        }
      },
      playerHeart: {
        width: 40,
        height: 40
      },
      enemies: [
        {
          name: 'rex',
          ref: Rex,
          box: {
            width: 69,
            height: 120
          },
          frame: {
            width: 76,
            height: 120,
            drawOffset: {
              x: -3,
              y: 0
            },
            interval: 125
          },
          states: {
            lives2Left: { index: 0, maxFrame: 2 },
            lives2Right: { index: 1, maxFrame: 2 },
            lives1Left: { index: 2, maxFrame: 2 },
            lives1Right: { index: 3, maxFrame: 2 },
            lives0Left: { index: 4, maxFrame: 1 },
            lives0Right: { index: 5, maxFrame: 1 }
          }
        }
      ],
      interactObjs: [
        {
          name: 'finalGates',
          ref: FinalGates,
          gates: {
            name: 'finalGatesGates',
            box: {
              width: 96,
              height: 256
            }
          },
          stage: {
            name: 'finalGatesStage',
            box: {
              width: 49,
              height: 16
            }
          }
        }
      ],
      block: {
        width: 64,
        height: 64
      },
      blocks: [
        { name: 'soilGrass' },
        { name: 'stone' },
        { name: 'singleStone' },
        { name: 'singleBricks' }
      ],
      bgLayer: {
        width: 1280,
        height: 640
      },
      bgLayers: [
        {
          name: 'skyLayer',
          speed: 0.01
        },
        {
          name: 'cloudsLayer',
          speed: 0.5
        },
        {
          name: 'largeCloudsLayer',
          speedModifier: 0.05
        }
      ]

    };
  }
}
