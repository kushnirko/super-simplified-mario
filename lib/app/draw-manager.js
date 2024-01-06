export default class DrawManager {
  constructor(ctx, drawableSrc, ee) {
    this.ctx = ctx;
    this.src = drawableSrc;
    this.ee = ee;
  }

  onCreate() {
    this.setEventListeners();
  }

  setEventListeners() {
    this.ee.onEvent('changeText', (textFieldId, newText) => {
      this.changeText(textFieldId, newText);
    });
  }

  drawImage(objectName, sBox, dBox) {
    const image = this.src.get(objectName);
    this.ctx.drawImage(image,
      sBox.x, sBox.y, sBox.width, sBox.height,
      dBox.x, dBox.y, dBox.width, dBox.height);
  }

  changeText(textFieldId, newText) {
    const textField = document.getElementById(textFieldId);
    textField.innerHTML = newText;
  }
}
