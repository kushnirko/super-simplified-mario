import PlayerState from './player-state.js';

export default class DamageGettingRight extends PlayerState {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'damageGettingRight';

    this.inputResponse.set('none', {
      nextStateName: 'damageGettingRight',
      vx: 'current',
      vy: 'current'
    });

    this.damageResponse = 'damageGettingRight';
  }

  handleBlockCollision(tile) {
    const { player } = this;
    const collisions = player.detectCollisions(tile.blocks);
    if (!collisions.sides.includes('none')) {
      player.stateMachine.setState('standingRight');
    }
  }

  changeOnce() {
    this.playSound('lostLife');
    const { player } = this;
    const damageGettingInertia = {
      x: -player.maxVelocity.x,
      y: -player.maxVelocity.y
    };
    player.velocity.x = damageGettingInertia.x;
    player.velocity.y = damageGettingInertia.y;
  }
}
