import { Actor, Vector } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';

export class Zombie extends Actor {
  constructor(shooter) {
    super({
      width: 64,
      height: 64
    });

    this.shooter = shooter;
    this.speed = 80 + Math.random() * 100; // 👈 Speed between 80 and 180
  }

  onInitialize() {
    this.graphics.use(Resources.Zombie.toSprite());
    this.scale = new Vector(0.25, 0.25);

    this.on('postupdate', () => {
      const dir = this.shooter.pos.sub(this.pos).normalize();
      this.vel = dir.scale(this.speed);
      this.rotation = Math.atan2(dir.y, dir.x);
    });

    this.on('collisionstart', (evt) => {
      if (evt.other instanceof Bullet) {
        evt.other.kill();
        this.kill();
      }
    });

    this.on('exitviewport', () => this.kill());

    this.setSpawnPosition();
  }

  setSpawnPosition() {
    const screenWidth = 1280;
    const screenHeight = 720;
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
      case 0:
        this.pos = new Vector(Math.random() * screenWidth, -50);
        break;
      case 1:
        this.pos = new Vector(screenWidth + 50, Math.random() * screenHeight);
        break;
      case 2:
        this.pos = new Vector(Math.random() * screenWidth, screenHeight + 50);
        break;
      case 3:
        this.pos = new Vector(-50, Math.random() * screenHeight);
        break;
    }
  }
}
