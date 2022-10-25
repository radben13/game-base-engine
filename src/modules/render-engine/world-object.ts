import { WorldActor } from './world-actor'
import { WorldEntity } from './world-entity'

export interface WorldObject
{
    getEntity(): WorldEntity | void;
    getActor(): WorldActor | void;
}
