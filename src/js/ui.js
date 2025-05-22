import { Actor, Label, Color, Font, FontUnit, Vector, ScreenElement, Rectangle } from 'excalibur';
import { Resources } from './resources.js';
import { Shooter } from './shooter.js';
import { Zombie } from './zombie.js';
import { Bullet } from './bullet.js';

export class GameUI extends ScreenElement {
  constructor(shooter, scoreTracker) {
    super({ x: 0, y: 0, z: 100 });
    this.shooter = shooter;
    this.scoreTracker = scoreTracker;
  }

  onInitialize(engine) {
    const font = new Font({
      family: 'Arial',
      size: 18,
      unit: FontUnit.Px,
      color: Color.Black
    });

    this.scoreLabel = new Label({
      text: 'Score: 0',
      pos: new Vector(20, 20),
      font: font
    });

    this.healthBg = new Actor({
      pos: new Vector(20, 50),
      anchor: Vector.Zero
    });
    this.healthBg.graphics.use(new Rectangle({
      width: 200,
      height: 20,
      color: Color.Red
    }));

    this.healthBar = new Actor({
      pos: new Vector(20, 50),
      anchor: Vector.Zero
    });
    this.healthBar.graphics.use(new Rectangle({
      width: 200,
      height: 20,
      color: Color.Green
    }));

    this.ammoLabel = new Label({
      text: 'Ammo: 30/200',
      pos: new Vector(20, 80),
      font: font
    });

    this.reloadLabel = new Label({
      text: '',
      pos: new Vector(20, 110),
      font: font,
      color: Color.Red
    });

    engine.add(this.healthBg);
    engine.add(this.healthBar);
    engine.add(this.scoreLabel);
    engine.add(this.ammoLabel);
    engine.add(this.reloadLabel);
  }

  onPreUpdate() {
    this.scoreLabel.text = `Score: ${this.scoreTracker.score}`;

    const maxHealth = this.shooter.maxHealth || 100;
    const currentHealth = Math.max(this.shooter.health, 0);
    const ratio = currentHealth / maxHealth;
    const barWidth = 200 * ratio;

    this.healthBar.graphics.use(new Rectangle({
      width: barWidth,
      height: 20,
      color: Color.Green
    }));

    this.ammoLabel.text = `Ammo: ${this.shooter.ammo}/${this.shooter.totalAmmo}`;

    this.reloadLabel.text = this.shooter.isReloading ? 'Reloading...' : '';
  }
}
