export default class MenuPageMedia {
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
