import '../css/style.css';
import { Engine, Vector, DisplayMode, BoundingBox } from 'excalibur';
import { ResourceLoader, Resources } from './resources.js';
import { Background } from './background.js';
import { Shooter } from './shooter.js';
import { Zombie } from './zombie.js';
import { GameUI } from './ui.js';

export class Game extends Engine {
  constructor() {
    super({
      width: 1000,
      height: 720,
      maxFps: 60,
      displayMode: DisplayMode.FitScreen
    });

    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    this.gameHasEnded = false;

    this.start(ResourceLoader).then(() => this.startGame());
  }

  startGame() {
    console.log('start the game!');

    if (this.currentScene) {
      this.currentScene.actors.forEach(actor => this.currentScene.remove(actor));
    }

    this.add(new Background());

    this.scoreTracker     = { score: 0 };
    this.highScoreTracker = { score: this.highScore }; 

    this.shooter = new Shooter(625, 300);
    this.shooter.health    = this.shooter.maxHealth || 200;
    this.shooter.ammo      = this.shooter.clipSize  || 30;
    this.shooter.totalAmmo = 200 - this.shooter.ammo;

    this.add(this.shooter);

    this.ui = new GameUI(
      this.shooter,
      this.scoreTracker,
      this.highScoreTracker  
    );
    this.add(this.ui);

    this.currentScene.camera.strategy.lockToActor(this.shooter);
    this.currentScene.camera.strategy.limitCameraBounds(
      new BoundingBox(0, 0, 2000, 1200)
    );

    if (Resources.Music) {
      Resources.Music.loop = true;
      Resources.Music.volume = 0.5;
      Resources.Music.play();
    }

    this.spawnZombieLoop = () => {
      if (
        this.shooter.health <= 0 ||
        (this.shooter.ammo === 0 && this.shooter.totalAmmo === 0)
      )
        return;

      const zombie = new Zombie(this.shooter, this.scoreTracker);
      this.add(zombie);

      const delay = 500 + Math.random() * 1500;
      this.clock.schedule(this.spawnZombieLoop, delay);
    };
    this.spawnZombieLoop();

    this.on('postupdate', () => {
      if (
        !this.gameHasEnded &&
        (this.shooter.health <= 0 ||
          (this.shooter.ammo === 0 && this.shooter.totalAmmo === 0))
      ) {
        this.gameOver();
      }
    });
  }

  gameOver() {
    this.gameHasEnded = true;
    console.log('Game Over!');

    if (Resources.Music) {
      Resources.Music.stop();
    }

    if (this.scoreTracker.score > this.highScore) {
      this.highScore = this.scoreTracker.score;
      localStorage.setItem('highScore', this.highScore.toString());
      this.highScoreTracker.score = this.highScore; 
      console.log(`New High Score: ${this.highScore}`);
    }

    setTimeout(() => window.location.reload(), 3000);
  }
}

new Game();
