import { Actor, Color, CollisionType, Vector, Shape } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';

export class Zombie extends Actor {
  static activeZombiesCount = 0;

  constructor(shooter, scoreTracker = null, worldWidth = 1280, worldHeight = 720) {
    super({
      width: 300,
      height: 300,
      collisionType: CollisionType.Passive,
    });

    this.shooter = shooter;
    this.scoreTracker = scoreTracker;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.speed = 80 + Math.random() * 100;
    this.health = 100;
  }

  onInitialize() {
    const sprite = Resources.Zombie.toSprite();
    this.graphics.use(sprite);
    this.scale = new Vector(0.25, 0.25);

    this.collider.set(Shape.Box(this.width, this.height));

    Zombie.activeZombiesCount++;
    this.updateZombieSound();

    this.applySpeedTint();

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


    this.on('postkill', () => {
      Zombie.activeZombiesCount = Math.max(0, Zombie.activeZombiesCount - 1);
      this.updateZombieSound();
    });

    this.setSpawnPosition();
  }

  applySpeedTint() {
  const minSpeed = 80;
  const maxSpeed = 180;
  const clampedSpeed = Math.min(Math.max(this.speed, minSpeed), maxSpeed);
  const normalized = 1 - (clampedSpeed - minSpeed) / (maxSpeed - minSpeed);
  const greenValue = Math.floor(50 + normalized * 150);

  const tintColor = new Color(0, greenValue, 0, 1);

  const sprite = this.graphics.current;
  if (sprite) {
    sprite.tint = tintColor;
  }
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
    const margin = 50;
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
      case 0:
        this.pos = new Vector(Math.random() * this.worldWidth, -margin);
        break;
      case 1:
        this.pos = new Vector(this.worldWidth + margin, Math.random() * this.worldHeight);
        break;
      case 2:
        this.pos = new Vector(Math.random() * this.worldWidth, this.worldHeight + margin);
        break;
      case 3:
        this.pos = new Vector(-margin, Math.random() * this.worldHeight);
        break;
    }
  }
}
