import PlayerState from './player-state.js';

export default class RunningRight extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'runningRight';

    this.inputResponse.set('none', { nextStateName: 'standingRight' });
    this.inputResponse.set('left', { nextStateName: 'runningLeft' });
    this.inputResponse.set('up', { nextStateName: 'jumpingRight' });
    this.inputResponse.set('right', {
      nextStateName: 'runningRight',
      vx: this.player.maxVelocity.x,
      vy: 0
    });

    this.blockResponse.set('none', 'fallingRight');

    this.damageResponse = 'damageGettingRight';
  }
}
