import { WorldEntity } from './world-entity'

export abstract class WorldActor
{
    protected lastFrameTime: number = -1;

    constructor(public entity: WorldEntity) {

    }

    public animationFrame(time: number): void {
        throw new Error('animationFrame not implemented')
    }

}
