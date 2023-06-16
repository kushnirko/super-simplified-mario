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
    for (let i = 0; i < tilesNumber + 1; i++) {
      ctx.drawImage(this.image,
        this.box.pos.x + i * this.box.width, this.box.pos.y,
        this.box.width, this.box.height);
    }
  }
}

class DynamicLayer extends BackgroundLayer {
  constructor(src) {
    super(src);
    this.speed = src.speed;
  }

  update() {
    this.box.pos.x < -this.box.width
      ? this.box.pos.x = 0
      : this.box.pos.x -= this.speed;
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
    this.layers = layersSrc.map((layerSrc) => (
      layerSrc.speed !== undefined
        ? new DynamicLayer(layerSrc)
        : new ParallaxLayer(layerSrc)
    ));
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
