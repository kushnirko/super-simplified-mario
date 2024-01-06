import DynamicLayer from './dynamic-layer.js';
import ParallaxLayer from './parallax-layer.js';

export default class Background {
  constructor(layersData) {
    this.layers = layersData.map(data => {
      const Layer = data.speed !== undefined ? DynamicLayer : ParallaxLayer;
      return new Layer(data);
    });
  }

  update(playerVelocityX) {
    for (const layer of this.layers) {
      if (layer instanceof DynamicLayer) layer.update();
      else layer.update(playerVelocityX);
    }
  }

  draw(tilesNumber) {
    for (const layer of this.layers) {
      layer.draw(tilesNumber);
    }
  }
}
