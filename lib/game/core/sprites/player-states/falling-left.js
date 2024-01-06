import PlayerState from './player-state.js';

export default class FallingLeft extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'fallingLeft';

    this.inputResponse.set('none', {
      nextStateName: 'fallingLeft',
      vx: 0,
      vy: 'current'
    });
    this.inputResponse.set('left', {
      nextStateName: 'fallingLeft',
      vx: -this.player.maxVelocity.x,
      vy: 'current'
    });
    this.inputResponse.set('right', { nextStateName: 'fallingRight' });

    this.blockResponse.set('bottom', 'standingLeft');

    this.damageResponse = 'damageGettingLeft';
  }
}
