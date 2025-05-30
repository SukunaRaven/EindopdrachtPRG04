import { Actor, Vector } from "excalibur";
import { Resources } from './resources.js';

export class Background extends Actor {
    onInitialize() {
        this.graphics.use(Resources.Background.toSprite());
        this.scale = new Vector(7, 7);
    }
}