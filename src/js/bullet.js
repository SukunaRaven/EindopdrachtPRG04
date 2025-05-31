import { Actor, Color, CollisionType, Shape } from 'excalibur';


export class Bullet extends Actor {
  damage = 50;

  constructor(pos, velocity) {
    super({
      pos,
      width: 10,
      height: 10,
      color: Color.Yellow,
    });

    this.vel = velocity;
  }

  onInitialize() {
    this.collider.set(Shape.Box(this.width, this.height));
  }

  update(engine, delta) {
    super.update(engine, delta);

    const { worldWidth, worldHeight } = engine;
    if (
      this.pos.x < 0 || this.pos.x > worldWidth ||
      this.pos.y < 0 || this.pos.y > worldHeight
    ) {
      this.kill();
    }
  }
}
