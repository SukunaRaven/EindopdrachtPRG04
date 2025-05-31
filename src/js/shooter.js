import { Actor, Vector, Keys, CollisionType, Shape } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';
import { Zombie } from './zombie.js';
import { AmmoPack } from './ammopack.js';


export class Shooter extends Actor {
  shoot () {
    let bullet = new Bullet(this.pos.x, this.pos.y)
    this.scene.add(bullet);
  };
  constructor(x, y) {
    super({
      pos: new Vector(x, y),
      width: 300,
      height: 300,
      collisionType: CollisionType.Active,
    });

    this.health = 200;
    this.maxHealth = 200;

    this.ammo = 30;      
    this.totalAmmo = 200;
    this.clipSize = 30;
    this.reloadTime = 2000; 
    this.isReloading = false;

    this._lastFacing = 0;
  }

  onInitialize(engine) {
    this.graphics.use(Resources.Shooter.toSprite());
    this.scale = new Vector(0.25, 0.25);

    this.collider.set(Shape.Box(this.width, this.height));

    engine.input.pointers.primary.on('down', (evt) => {
      if (this.isReloading || this.ammo <= 0) {
        if (!this.isReloading && this.totalAmmo > 0) {
          this.reload(engine);
        }
        return;
      }

      const click = evt.worldPos;
      const dir = click.sub(this.pos);
      const normalizedDir = dir.normalize();

      const spawnOffset = normalizedDir.scale(this.width * this.scale.x / 2 + 10);
      const bulletSpawnPos = this.pos.clone().add(spawnOffset);

      const bullet = new Bullet(bulletSpawnPos, normalizedDir.scale(400));
      engine.currentScene.add(bullet);

      engine.currentScene.camera.shake(3,3,100);

      Resources.ShootSound.volume = 0.1;
      Resources.ShootSound.play();

      this.rotation = Math.atan2(dir.y, dir.x);
      this._lastFacing = this.rotation;

      this.ammo--;
      if (this.ammo <= 0) {
        this.reload(engine);
      }

    });

    this.on('collisionstart', (evt) => {
        if (evt.other.owner instanceof AmmoPack) {
        this.totalAmmo += evt.other.owner.ammoPickUp;
        evt.other.owner.kill();
       }
         else if (evt.other.owner instanceof Zombie) {
          if (!this._isInvulnerable) {
            this.health -= 10;
            this._isInvulnerable = true;
            setTimeout(() => {
              this._isInvulnerable = false;
            }, 1000);
          }
        }


      });

    engine.input.keyboard.on('press', (evt) => {
      if (evt.key === Keys.R) {
        if (!this.isReloading && this.ammo < this.clipSize && this.totalAmmo > 0) {
          this.reload(engine);
        }
      }
    });
  }

  reload() {
    if (this.isReloading) return;
    this.isReloading = true;

    setTimeout(() => {
      const needed = this.clipSize - this.ammo;
      const ammoToLoad = Math.min(needed, this.totalAmmo);
      this.ammo += ammoToLoad;
      this.totalAmmo -= ammoToLoad;
      this.isReloading = false;
    }, this.reloadTime);
  }

  onPreUpdate(engine) {
    let xs = 0;
    let ys = 0;

    const kb = engine.input.keyboard;

    if (kb.isHeld(Keys.A)) xs = -175;
    if (kb.isHeld(Keys.D)) xs = 175;
    if (kb.isHeld(Keys.W)) ys = -175;
    if (kb.isHeld(Keys.S)) ys = 175;

    this.vel = new Vector(xs, ys);

    if (xs !== 0 || ys !== 0) {
      this._lastFacing = Math.atan2(ys, xs);
    }
    this.rotation = this._lastFacing;

    const worldWidth = 2000;
const worldHeight = 1200;
const hw = this.width * this.scale.x / 2;
const hh = this.height * this.scale.y / 2;

this.pos.x = Math.max(hw, Math.min(this.pos.x, worldWidth - hw));
this.pos.y = Math.max(hh, Math.min(this.pos.y, worldHeight - hh));

  }
}
