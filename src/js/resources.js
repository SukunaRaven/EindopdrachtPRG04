import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    Shooter: new ImageSource('images/shooter.png'),
    Zombie: new ImageSource('images/zombie.png'),
    Background: new ImageSource('images/background.avif'),
}




const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }