class State {
  constructor(player, stateData) {
    this.player = player;
    this.name = '';
    this.maxFrameIndex = stateData.maxFrame - 1;
    this.index = stateData.index;
    this.inputResponse = new Map();
    this.blockResponse = new Map();
    this.damageResponse = '';
  }

  setFrame() {
    this.player.currentFrame.index = 0;
    this.player.currentFrame.state = this.index;
    this.player.currentFrame.max = this.maxFrameIndex;
  }

  playSound(event) {
    this.player.soundPlayer.play(event);
  }

  handleBlockCollision() {
    const collisions =  this.player.detectCollisions(this.player.tile.blocks);
    for (const side of collisions.sides)
      if (this.blockResponse.has(side))
        this.player.stateMachine.setState(this.blockResponse.get(side));
  }

  handleEnemyCollision() {
    const collisions = this.player.detectCollisions(this.player.tile.enemies);
    if (!collisions.sides.includes('none')) {
      for (let i = 0; i < collisions.sides.length; i++) {
        if (collisions.sides[i] === 'bottom' &&
            collisions.objects[i].lives !== Infinity) {
          this.playSound('kick');
          collisions.objects[i].lives -= this.player.damage;
          const kickInertia = this.player.maxVelocity.y * 0.25;
          this.player.velocity.y -= kickInertia;
        } else {
          this.player.lives -= collisions.objects[i].damage;
          this.player.stateMachine.setState(this.damageResponse);
        }
      }
    }
  }

  handleInteractItemCollision() {
    const collisions = this.player.detectCollisions(this.player.tile.interactObjs);
    if (!collisions.sides.includes('none'))
      for (let i = 0; i < collisions.sides.length; i++)
        collisions.objects[i].interact(collisions.sides[i], this.player.setProps());
  }

  handleInput(input) {
    let response = this.inputResponse.get('None');
    for (const key of input)
      if (this.inputResponse.has(key))
        response = this.inputResponse.get(key);
    if (response.nextStateName !== this.name) {
      this.player.stateMachine.setState(response.nextStateName);
    } else {
      if (response.hasOwnProperty('vx'))
        this.player.velocity.x = response.vx;
      if (response.hasOwnProperty('vy'))
        this.player.velocity.y = response.vy;
    }
  }

  changeOnce() {}

  changeConstantly() {}
}

class StandingRight extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'standingRight';

    this.inputResponse.set('None', {
      nextStateName: 'standingRight',
      vx: 0,
      vy: 0,
    });
    this.inputResponse.set('ArrowUp',    { nextStateName: 'jumpingRight' });
    this.inputResponse.set('ArrowRight', { nextStateName: 'runningRight' });
    this.inputResponse.set('ArrowLeft',  { nextStateName: 'runningLeft' });

    this.blockResponse.set('none', 'fallingRight');

    this.damageResponse = 'damageGettingRight';
  }
}

class StandingLeft extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'standingLeft';

    this.inputResponse.set('None', {
      nextStateName: 'standingLeft',
      vx: 0,
      vy: 0,
    });
    this.inputResponse.set('ArrowUp',    { nextStateName: 'jumpingLeft' });
    this.inputResponse.set('ArrowRight', { nextStateName: 'runningRight' });
    this.inputResponse.set('ArrowLeft',  { nextStateName: 'runningLeft' });

    this.blockResponse.set('none', 'fallingLeft');

    this.damageResponse = 'damageGettingLeft';
  }
}

class RunningRight extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'runningRight';

    this.inputResponse.set('None',       { nextStateName: 'standingRight' });
    this.inputResponse.set('ArrowUp',    { nextStateName: 'jumpingRight' });
    this.inputResponse.set('ArrowRight', {
      nextStateName: 'runningRight',
      vx: this.player.maxVelocity.x * 0.5,
      vy: 0,
    });
    this.inputResponse.set('ArrowLeft',  { nextStateName: 'runningLeft' });

    this.blockResponse.set('none', 'fallingRight');

    this.damageResponse = 'damageGettingRight';
  }
}

class RunningLeft extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'runningLeft';

    this.inputResponse.set('None',       { nextStateName: 'standingLeft' });
    this.inputResponse.set('ArrowUp',    { nextStateName: 'jumpingLeft' });
    this.inputResponse.set('ArrowRight', { nextStateName: 'runningRight' });
    this.inputResponse.set('ArrowLeft',  {
      nextStateName: 'runningLeft',
      vx: this.player.maxVelocity.x * -0.5,
      vy: 0,
    });

    this.blockResponse.set('none', 'fallingLeft');

    this.damageResponse = 'damageGettingLeft';
  }
}

class JumpingRight extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'jumpingRight';

    this.inputResponse.set('None', {
      nextStateName: 'jumpingRight',
      vx: 0,
    });
    this.inputResponse.set('ArrowRight', {
      nextStateName: 'jumpingRight',
      vx: this.player.maxVelocity.x * 0.5,
    });
    this.inputResponse.set('ArrowLeft', { nextStateName: 'jumpingLeft' });

    this.damageResponse = 'damageGettingRight';
  }

  handleBlockCollision() {
    const collisions =  this.player.detectCollisions(this.player.tile.blocks);
    if (collisions.sides.includes('bottom'))
      this.player.velocity.y -= this.player.maxVelocity.y * 0.5;
  }

  changeOnce() {
    this.playSound('jump');
  }

  changeConstantly() {
    if (this.player.velocity.y > this.player.gravity)
      this.player.stateMachine.setState('fallingRight');
  }
}

class JumpingLeft extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'jumpingLeft';

    this.inputResponse.set('None', {
      nextStateName: 'jumpingLeft',
      vx: 0,
    });
    this.inputResponse.set('ArrowRight', { nextStateName: 'jumpingRight' });
    this.inputResponse.set('ArrowLeft', {
      nextStateName: 'jumpingLeft',
      vx: this.player.maxVelocity.x * -0.5,
    });

    this.damageResponse = 'damageGettingLeft';
  }

  handleBlockCollision() {
    const collisions =  this.player.detectCollisions(this.player.tile.blocks);
    if (collisions.sides.includes('bottom'))
      this.player.velocity.y -= this.player.maxVelocity.y * 0.5;
  }

  changeOnce() {
    this.playSound('jump');
  }

  changeConstantly() {
    if (this.player.velocity.y > this.player.gravity)
      this.player.stateMachine.setState('fallingLeft');
  }
}

class FallingRight extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'fallingRight';

    this.inputResponse.set('None', {
      nextStateName: 'fallingRight',
      vx: 0,
    });
    this.inputResponse.set('ArrowRight', {
      nextStateName: 'fallingRight',
      vx: this.player.maxVelocity.x * 0.5,
    });
    this.inputResponse.set('ArrowLeft', { nextStateName: 'fallingLeft' });

    this.blockResponse.set('bottom', 'standingRight');

    this.damageResponse = 'damageGettingRight';
  }
}

class FallingLeft extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'fallingLeft';

    this.inputResponse.set('None', {
      nextStateName: 'fallingLeft',
      vx: 0,
    });
    this.inputResponse.set('ArrowRight', { nextStateName: 'fallingRight' });
    this.inputResponse.set('ArrowLeft', {
      nextStateName: 'fallingLeft',
      vx: this.player.maxVelocity.x * -0.5,
    });

    this.blockResponse.set('bottom', 'standingLeft');

    this.damageResponse = 'damageGettingLeft';
  }
}

class DamageGettingRight extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'damageGettingRight';

    this.inputResponse.set('None', { nextStateName: 'damageGettingRight' });

    this.damageResponse = 'damageGettingRight';
  }

  handleBlockCollision() {
    const collisions =  this.player.detectCollisions(this.player.tile.blocks);
    if (!collisions.sides.includes('none'))
      this.player.stateMachine.setState('standingRight');
  }

  changeOnce() {
    this.playSound('lostLife');
    const damageGettingInertia = {
      x: -this.player.maxVelocity.x * 0.5,
      y: -this.player.maxVelocity.y * 0.5,
    }
    this.player.velocity.x = damageGettingInertia.x;
    this.player.velocity.y = damageGettingInertia.y;
  }
}

class DamageGettingLeft extends State {
  constructor(player, stateData) {
    super(player, stateData);
    this.name = 'damageGettingLeft';

    this.inputResponse.set('None', { nextStateName: 'damageGettingLeft' });

    this.damageResponse = 'damageGettingLeft';
  }

  handleBlockCollision() {
    const collisions =  this.player.detectCollisions(this.player.tile.blocks);
    if (!collisions.sides.includes('none'))
      this.player.stateMachine.setState('standingLeft');
  }

  changeOnce() {
    this.playSound('lostLife');
    const damageGettingInertia = {
      x: this.player.maxVelocity.x * 0.5,
      y: -this.player.maxVelocity.y * 0.5,
    }
    this.player.velocity.x = damageGettingInertia.x;
    this.player.velocity.y = damageGettingInertia.y;
  }
}

export default class PlayerStates {
  constructor(player) {
    this.player = player;
    this.statesData = this.player.states;
    this.states = new Map([
      [ 'standingRight',
        new StandingRight(player, this.statesData.standingRight) ],
      [ 'standingLeft',
        new StandingLeft(player, this.statesData.standingLeft) ],
      [ 'runningRight',
        new RunningRight(player, this.statesData.runningRight) ],
      [ 'runningLeft',
        new RunningLeft(player, this.statesData.runningLeft) ],
      [ 'jumpingRight',
        new JumpingRight(player, this.statesData.jumpingRight) ],
      [ 'jumpingLeft',
        new JumpingLeft(player, this.statesData.jumpingLeft) ],
      [ 'fallingRight',
        new FallingRight(player, this.statesData.fallingRight) ],
      [ 'fallingLeft',
        new FallingLeft(player, this.statesData.fallingLeft) ],
      [ 'damageGettingRight',
        new DamageGettingRight(player, this.statesData.damageGettingRight) ],
      [ 'damageGettingLeft',
        new DamageGettingLeft(player, this.statesData.damageGettingLeft) ],
    ]);
    this.currentState = this.states.get('standingRight');
  }

  setState(stateName) {
    this.currentState = this.states.get(stateName);
    this.currentState.setFrame();
    this.currentState.changeOnce();
  }

  update(input) {
    this.currentState.handleBlockCollision();
    this.currentState.handleEnemyCollision();
    this.currentState.handleInteractItemCollision();
    this.currentState.handleInput(input);
    this.currentState.changeConstantly();
  }
}
