import { Actor, Color, Vector, CollisionType, Shape } from 'excalibur';

export class AmmoPack extends Actor {
  constructor(x, y) {
    super({
      pos: new Vector(x, y),
      width: 20,
      height: 20,
      color: Color.Yellow,
      collisionType: CollisionType.Passive, 
    });
    this.ammoPickUp = 10;
  }

  onInitialize() {
    

    this.collider.set(Shape.Box(this.width, this.height));

   this.on('collisionstart', (evt) => {
    if (evt.other.owner === this.shooter) {  // or however you refer to the player
      this.pickup();
    }
});
}
}
