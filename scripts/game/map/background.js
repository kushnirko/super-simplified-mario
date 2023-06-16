class BackgroundLayer {
  constructor(src) {
    this.image = src.image;
    this.box = {
      pos: {
        x: 0,
        y: 0,
      },
      width: src.width,
      height: src.height,
    };
  }

  draw(ctx, tilesNumber) {
    const { pos: { x, y }, width, height  } = this.box;
    for (let i = 0; i < tilesNumber + 1; i++) {
      const dx = x + i * width;
      ctx.drawImage(this.image, dx, y, width, height);
    }
  }
}

class DynamicLayer extends BackgroundLayer {
  constructor(src) {
    super(src);
    this.speed = src.speed;
  }

  update() {
    const x = this.box.pos.x;
    if (x < -this.box.width) this.box.pos.x = 0
    else this.box.pos.x -= this.speed;
  }
}

class ParallaxLayer extends BackgroundLayer {
  constructor(src) {
    super(src);
    this.speedModifier = src.speedModifier;
  }

  update(playerVelocityX) {
    this.box.pos.x < -this.box.width
      ? this.box.pos.x = 0
      : this.box.pos.x -= this.speedModifier * playerVelocityX;
  }
}

export default class Background {
  constructor(layersSrc) {
    this.layers = layersSrc.map((layerSrc) => {
      const Layer = (layerSrc.speed !== undefined) ? DynamicLayer : ParallaxLayer;
      return new Layer(layerSrc);
    });
  }

  update(playerVelocityX) {
    for (const layer of this.layers)
      if (layer instanceof DynamicLayer) layer.update();
      else layer.update(playerVelocityX);
  }

  draw(ctx, tilesNumber) {
    for (const layer of this.layers)
      layer.draw(ctx, tilesNumber);
  }
}
