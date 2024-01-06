export default class LevelSelectorPageMedia {
  constructor() {
    this.src = {
      drawable: new Map(),
      audio: new Map([
        ['buttonClick', document.getElementById('buttonClick')],
        ['pageSoundtrack', document.getElementById('gameSoundtrack')]
      ])
    };
    this.metadata = {};
  }
}
