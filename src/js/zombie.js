import { Actor, CollisionType, Vector, Shape } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';

export class Zombie extends Actor {
  // Static variable to track number of active zombies
  static activeZombiesCount = 0;

  constructor(shooter, scoreTracker = null) {
    super({
      width: 300,
      height: 300,
      collisionType: CollisionType.Passive,
    });

    this.shooter = shooter;
    this.scoreTracker = scoreTracker;
    this.speed = 80 + Math.random() * 100;
    this.health = 100;
  }

  onInitialize() {
    this.graphics.use(Resources.Zombie.toSprite());
    this.scale = new Vector(0.25, 0.25);

    this.collider.set(Shape.Box(this.width, this.height));

    // Increase active zombie count when a zombie is created
    Zombie.activeZombiesCount++;
    this.updateZombieSound();

    this.on('postupdate', () => {
      const dir = this.shooter.pos.sub(this.pos).normalize();
      this.vel = dir.scale(this.speed);
      this.rotation = Math.atan2(dir.y, dir.x);
    });

    this.on('collisionstart', (e) => {
      if (e.other.owner instanceof Bullet) {
        e.other.owner.kill();

        this.health -= e.other.owner.damage;

        if (this.health <= 0) {
          this.kill();
          if (this.scoreTracker) {
            this.scoreTracker.score += 5;
          }
        }
      }
    });

    this.on('exitviewport', () => this.kill());

    // When the zombie is killed or removed, decrease count and update sound
    this.on('postkill', () => {
      Zombie.activeZombiesCount = Math.max(0, Zombie.activeZombiesCount - 1);
      this.updateZombieSound();
    });

    this.setSpawnPosition();
  }

  updateZombieSound() {
    if (Zombie.activeZombiesCount > 0) {
      if (!Resources.ZombieSound.isPlaying()) {
        Resources.ZombieSound.volume = 0.2;
        Resources.ZombieSound.loop = true;
        Resources.ZombieSound.play();
      } else {
        Resources.ZombieSound.volume = 0.2;
      }
    } else {
      Resources.ZombieSound.volume = 0;
      Resources.ZombieSound.stop();
    }
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
