import '../css/style.css';
import { Engine, Vector, DisplayMode } from 'excalibur';
import { ResourceLoader } from './resources.js';
import { Background } from './background.js';
import { Shooter } from './shooter.js';
import { Zombie } from './zombie.js';
import { GameUI } from './ui.js';

export class Game extends Engine {
  constructor() {
    super({
      width: 1280,
      height: 720,
      maxFps: 60,
      displayMode: DisplayMode.FitScreen
    });

    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;

    this.start(ResourceLoader).then(() => this.startGame());
  }

  startGame() {
  console.log('start the game!');


  if (this.currentScene) {
    this.currentScene.actors.forEach(actor => this.currentScene.remove(actor));
  }

  this.add(new Background());

  this.scoreTracker = { score: 0 };
  this.shooter = new Shooter(625, 300);
  this.shooter.health = this.shooter.maxHealth || 200;      
  this.shooter.ammo = this.shooter.clipSize || 30;     
  this.shooter.totalAmmo = 200 - this.shooter.ammo; 

  this.add(this.shooter);

  this.ui = new GameUI(this.shooter, this.scoreTracker);
  this.add(this.ui);

  this.spawnZombieLoop = () => {
    if (this.shooter.health <= 0) return;

    const zombie = new Zombie(this.shooter, this.scoreTracker);
    this.add(zombie);

    const delay = 500 + Math.random() * 1500;
    this.clock.schedule(this.spawnZombieLoop, delay);
  };

  this.spawnZombieLoop();
  
  this.on('postupdate', () => {
    if (this.shooter.health <= 0) {
      this.gameOver();
    }
  });
}
}

new Game();
