import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from './background.js'
import { Shooter } from './shooter.js'
import { Zombie } from './zombie.js'

export class Game extends Engine {

    constructor() {
        super({ 
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
        });

        this.start(ResourceLoader).then(() => this.startGame());
    }

    startGame() {
        console.log("start de game!");

        this.add(new Background());

        const shooter = new Shooter(625, 300);
        this.add(shooter);

        const spawnZombieLoop = () => {
            const zombie = new Zombie(shooter);
            this.add(zombie); // use 'this', not 'engine'

            const delay = 500 + Math.random() * 1500;
            this.clock.schedule(() => spawnZombieLoop(), delay);
        };

        spawnZombieLoop();
    }

    shooterLeft(e) {
        e.target.pos = new Vector(1350, 500);
    }
}

new Game();
