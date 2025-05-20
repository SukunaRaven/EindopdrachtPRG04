import { Actor, Vector, CollisionType, Color } from 'excalibur';

export class Bullet extends Actor {
  constructor(startPos, direction) {
    super({
      pos: startPos.clone(),
      radius: 4,
      collisionType: CollisionType.Passive
    });

    this.vel = direction.normalize().scale(450);
    this.color = Color.Yellow;

    this.on('exitviewport', () => this.kill());
  }
}
