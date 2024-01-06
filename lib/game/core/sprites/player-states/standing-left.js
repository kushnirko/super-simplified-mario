

import PlayerState from './player-state.js';

export default class StandingLeft extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'standingLeft';

    this.inputResponse.set('none', {
      nextStateName: 'standingLeft',
      vx: 0,
      vy: 0
    });
    this.inputResponse.set('left', { nextStateName: 'runningLeft' });
    this.inputResponse.set('up', { nextStateName: 'jumpingLeft' });
    this.inputResponse.set('right', { nextStateName: 'runningRight' });

    this.blockResponse.set('none', 'fallingLeft');

    this.damageResponse = 'damageGettingLeft';
  }
}
