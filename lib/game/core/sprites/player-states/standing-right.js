

import PlayerState from './player-state.js';

export default class StandingRight extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'standingRight';

    this.inputResponse.set('none', {
      nextStateName: 'standingRight',
      vx: 0,
      vy: 0
    });
    this.inputResponse.set('left', { nextStateName: 'runningLeft' });
    this.inputResponse.set('up', { nextStateName: 'jumpingRight' });
    this.inputResponse.set('right', { nextStateName: 'runningRight' });

    this.blockResponse.set('none', 'fallingRight');

    this.damageResponse = 'damageGettingRight';
  }
}
