import PlayerState from './player-state.js';

export default class RunningLeft extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'runningLeft';

    this.inputResponse.set('none', { nextStateName: 'standingLeft' });
    this.inputResponse.set('left', {
      nextStateName: 'runningLeft',
      vx: -this.player.maxVelocity.x,
      vy: 0
    });
    this.inputResponse.set('up', { nextStateName: 'jumpingLeft' });
    this.inputResponse.set('right', { nextStateName: 'runningRight' });

    this.blockResponse.set('none', 'fallingLeft');

    this.damageResponse = 'damageGettingLeft';
  }
}
