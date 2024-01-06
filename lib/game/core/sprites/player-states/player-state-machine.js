import StandingRight from './standing-right.js';
import StandingLeft from './standing-left.js';
import RunningRight from './running-right.js';
import RunningLeft from './running-left.js';
import JumpingRight from './jumping-right.js';
import JumpingLeft from './jumping-left.js';
import FallingRight from './falling-right.js';
import FallingLeft from './falling-left.js';
import DamageGettingRight from './damage-getting-right.js';
import DamageGettingLeft from './damage-getting-left.js';

export default class PlayerStateMachine {
  constructor(player) {
    this.player = player;
    this.statesData = this.player.states;
    this.states = new Map([
      [
        'standingRight',
        new StandingRight(player, this.statesData.standingRight)
      ],
      [
        'standingLeft',
        new StandingLeft(player, this.statesData.standingLeft)
      ],
      [
        'runningRight',
        new RunningRight(player, this.statesData.runningRight)
      ],
      [
        'runningLeft',
        new RunningLeft(player, this.statesData.runningLeft)
      ],
      [
        'jumpingRight',
        new JumpingRight(player, this.statesData.jumpingRight)
      ],
      [
        'jumpingLeft',
        new JumpingLeft(player, this.statesData.jumpingLeft)
      ],
      [
        'fallingRight',
        new FallingRight(player, this.statesData.fallingRight)
      ],
      [
        'fallingLeft',
        new FallingLeft(player, this.statesData.fallingLeft)
      ],
      [
        'damageGettingRight',
        new DamageGettingRight(player, this.statesData.damageGettingRight)
      ],
      [
        'damageGettingLeft',
        new DamageGettingLeft(player, this.statesData.damageGettingLeft)
      ]
    ]);
    this.currentState = this.states.get('standingRight');
  }

  setState(stateName) {
    this.currentState = this.states.get(stateName);
    this.currentState.setFrame();
    this.currentState.changeOnce();
  }

  update(tile, inputs) {
    this.currentState.handleBlockCollision(tile);
    this.currentState.handleEnemyCollision(tile);
    this.currentState.handleInteractItemCollision(tile);
    this.currentState.handleInputs(inputs);
    this.currentState.changeConstantly();
  }
}
