import PlayerState from './player-state.js';

export default class JumpingLeft extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'jumpingLeft';

    this.inputResponse.set('none', {
      nextStateName: 'jumpingLeft',
      vx: 0,
      vy: 'current'
    });
    this.inputResponse.set('left', {
      nextStateName: 'jumpingLeft',
      vx: -this.player.maxVelocity.x,
      vy: 'current'
    });
    this.inputResponse.set('right', { nextStateName: 'jumpingRight' });

    this.blockResponse.set('bottom', 'standingLeft');

    this.damageResponse = 'damageGettingLeft';
  }

  changeOnce() {
    this.playSound('jump');
    const { player } = this;
    const collisions = player.detectCollisions(player.tile.blocks);
    if (collisions.sides.includes('bottom')) {
      player.velocity.y -= player.maxVelocity.y;
    }
  }

  changeConstantly() {
    if (this.player.velocity.y > this.player.gravity) {
      this.player.stateMachine.setState('fallingLeft');
    }
  }
}
