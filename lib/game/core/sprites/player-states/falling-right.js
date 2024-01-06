import PlayerState from './player-state.js';

export default class FallingRight extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'fallingRight';

    this.inputResponse.set('none', {
      nextStateName: 'fallingRight',
      vx: 0,
      vy: 'current'
    });
    this.inputResponse.set('left', { nextStateName: 'fallingLeft' });
    this.inputResponse.set('right', {
      nextStateName: 'fallingRight',
      vx: this.player.maxVelocity.x,
      vy: 'current'
    });

    this.blockResponse.set('bottom', 'standingRight');

    this.damageResponse = 'damageGettingRight';
  }
}
