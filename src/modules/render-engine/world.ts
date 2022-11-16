import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { WorldEntity } from './world-entity';
import { WorldObject } from './world-object';

export class World
{

    private objects: WorldObject[];
    private objectsSubject: BehaviorSubject<WorldObject[]>;

    constructor() {
        this.objects = []
        this.objectsSubject = new BehaviorSubject(this.objects)
    }

    /**
     * getObjectsWithEntities$
     */
    public getObjectsWithEntities$(): Observable<WorldObject[]> {
        return this.objectsSubject.asObservable()
            .pipe(
                map(objects => {
                    const sortedEntities = this.getSortedEntities(objects)
                    return sortedEntities.map(([index]) => objects[index])
                })
            );
    }

    /**
     * getObjects$
     */
     public getObjects$(): Observable<WorldObject[]> {
        return this.objectsSubject.asObservable()
    }

    /**
     * getObjectsAt
     */
    public getObjectsAt(x: number, y: number): WorldObject[] {
        const objects = this.objectsSubject.getValue()
        return this.getSortedEntities(objects)
            .reverse()
            .filter(([_,entity]) => {
                const bounds = entity.getBounds()
                return bounds.left < x && bounds.right > x && bounds.top < y && bounds.bottom > y
            })
            .map(([index]) => objects[index])
    }

    private getSortedEntities(objects: WorldObject[]): [number, WorldEntity][] {
        const indexedEntities = objects.map((object, index) => [index, object.getEntity()])
            .filter(([_, entity]) => Boolean(entity)) as [number,WorldEntity][]
        return indexedEntities.sort(([_,a], [__,b]) => {
            if (a.getRenderPriority() == b.getRenderPriority()) {
                return 0
            }
            return a.getRenderPriority() < b.getRenderPriority() ? -1 : 1
        })
    }

    public addObject(object: WorldObject): void {
        this.objects.push(object)
        this.objectsSubject.next(this.objects)
    }

    public clearObjects(): void {
        this.objects.length = 0
        this.objectsSubject.next(this.objects)
    }

    public removeObject(object: WorldObject): void {
        if (this.objects.indexOf(object) > -1) {
            this.objects.splice(this.objects.indexOf(object), 1)
            this.objectsSubject.next(this.objects)
        } else {
            console.warn('Attempt to remove WorldObject which was not found')
        }
    }
}
