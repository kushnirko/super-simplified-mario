import PlayerState from './player-state.js';

export default class JumpingRight extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'jumpingRight';

    this.inputResponse.set('none', {
      nextStateName: 'jumpingRight',
      vx: 0,
      vy: 'current'
    });
    this.inputResponse.set('left', { nextStateName: 'jumpingLeft' });
    this.inputResponse.set('right', {
      nextStateName: 'jumpingRight',
      vx: this.player.maxVelocity.x,
      vy: 'current'
    });

    this.blockResponse.set('bottom', 'standingRight');

    this.damageResponse = 'damageGettingRight';
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
    const { player } = this;
    const isMaxJumpPoint = player.velocity.y > player.gravity;
    if (isMaxJumpPoint) player.stateMachine.setState('fallingRight');
  }
}
