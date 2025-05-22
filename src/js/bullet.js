import { Actor, Color, CollisionType, Shape } from 'excalibur';
import { Zombie } from './zombie.js';


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

    const { drawWidth, drawHeight } = engine;
    if (
      this.pos.x < 0 || this.pos.x > drawWidth ||
      this.pos.y < 0 || this.pos.y > drawHeight
    ) {
      this.kill();
    }
  }
}
