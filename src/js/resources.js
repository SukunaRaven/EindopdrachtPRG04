import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    Shooter: new ImageSource('images/shooter.png'),
    Zombie: new ImageSource('images/zombie.png'),
    Background: new ImageSource('images/background.avif'),
    ShootSound : new Sound('/sounds/shooting.mp3'),
    ZombieSound: new Sound('/sounds/zombie.mp3'),
    Music      : new Sound('/sounds/backgroundmusic.mp3')
}



const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }