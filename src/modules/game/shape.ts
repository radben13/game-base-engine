import { WorldObject, WorldEntity } from "../render-engine";
import { EntityConstruct, SimpleEntity } from "../render-engine/simple-entity";
import { CanvasRenderer } from "../render-engine/util/canvas-renderer";
import { WorldActor } from "../render-engine/world-actor";

export abstract class Shape implements WorldObject
{
    protected entity: WorldEntity;
    protected actor: WorldActor | void = undefined;
    
    constructor(entityConstruct: EntityConstruct, renderer: CanvasRenderer = () => {}) {
        this.entity = new SimpleEntity(renderer, entityConstruct)
    }
    getEntity(): void | WorldEntity {
        return this.entity
    }
    getActor(): void | WorldActor {
        return this.actor
    }
}
