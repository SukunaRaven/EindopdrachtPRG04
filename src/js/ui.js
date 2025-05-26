import { Actor, Label, Color, Font, FontUnit, Vector, ScreenElement, Rectangle } from 'excalibur';


export class GameUI extends ScreenElement {
  constructor(shooter, scoreTracker, highScoreTracker) {
    super({ x: 0, y: 0, z: 100 });
    this.shooter = shooter;
    this.scoreTracker = scoreTracker;
    this.highScoreTracker = highScoreTracker;
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

    this.highScoreLabel = new Label({
      text: `High Score: ${this.highScoreTracker?.score ?? 0}`,
      pos: new Vector(20, 45),
      font: font
    });

    this.healthBg = new Actor({
      pos: new Vector(20, 75),
      anchor: Vector.Zero
    });
    this.healthBg.graphics.use(new Rectangle({
      width: 200,
      height: 20,
      color: Color.Red
    }));

    this.healthBar = new Actor({
      pos: new Vector(20, 75),
      anchor: Vector.Zero
    });
    this.healthBar.graphics.use(new Rectangle({
      width: 200,
      height: 20,
      color: Color.Green
    }));

    this.ammoLabel = new Label({
      text: 'Ammo: 30/200',
      pos: new Vector(20, 105),
      font: font
    });

    this.reloadLabel = new Label({
      text: '',
      pos: new Vector(20, 135),
      font: font,
      color: Color.Red
    });

    this.addChild(this.healthBg);
    this.addChild(this.healthBar);
    this.addChild(this.scoreLabel);
    this.addChild(this.highScoreLabel);
    this.addChild(this.ammoLabel);
    this.addChild(this.reloadLabel);
  }

  onPreUpdate() {
    if (!this.scoreTracker || !this.highScoreTracker) return;

    this.scoreLabel.text = `Score: ${this.scoreTracker.score}`;
    this.highScoreLabel.text = `High Score: ${this.highScoreTracker.score}`;

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
