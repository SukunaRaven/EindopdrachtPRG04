import { Actor, Vector, Keys } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';

export class Shooter extends Actor {
  constructor(x, y) {
    super({
      pos: new Vector(x, y),
      width: 64,
      height: 64
    });

    this._lastFacing = 0;
  }

  onInitialize(engine) {
    this.graphics.use(Resources.Shooter.toSprite());
    this.scale = new Vector(0.25, 0.25);

    engine.input.pointers.primary.on('down', (evt) => {
      const click = evt.worldPos;
      const dir = click.sub(this.pos);

      const bullet = new Bullet(this.pos, dir);
      this.scene.add(bullet);

      this.rotation = Math.atan2(dir.y, dir.x);
      this._lastFacing = this.rotation;
    });
  }

  onPreUpdate(engine) {
    let xs = 0;
    let ys = 0;

    const kb = engine.input.keyboard;

    if (kb.isHeld(Keys.Left) || kb.isHeld(Keys.A)) xs = -175;
    if (kb.isHeld(Keys.Right) || kb.isHeld(Keys.D)) xs = 175;
    if (kb.isHeld(Keys.Up) || kb.isHeld(Keys.W)) ys = -175;
    if (kb.isHeld(Keys.Down) || kb.isHeld(Keys.S)) ys = 175;

    this.vel = new Vector(xs, ys);

    if (xs !== 0 || ys !== 0) {
      this._lastFacing = Math.atan2(ys, xs);
    }
    this.rotation = this._lastFacing;

    const drawWidth = engine.drawWidth;
    const drawHeight = engine.drawHeight;
    const hw = this.width / 2;
    const hh = this.height / 2;

    this.pos.x = Math.max(hw, Math.min(this.pos.x, drawWidth - hw));
    this.pos.y = Math.max(hh, Math.min(this.pos.y, drawHeight - hh));
  }
}
