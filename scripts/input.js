export default class InputHandler {
  constructor() {
    this.keys = [];
    window.addEventListener('keydown', action => {
      if (!this.keys.includes(action.key))
        this.keys.push(action.key);
    });
    window.addEventListener('keyup', action => {
      this.keys.splice(this.keys.indexOf(action.key), 1);
    });
  }
}
