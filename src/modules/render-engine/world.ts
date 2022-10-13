import { BehaviorSubject, Observable, of } from 'rxjs'
import { map } from 'rxjs/operators';
import { Entity } from './entity';

export class World
{

    private entities: Entity[] = [];
    private entitySubject: BehaviorSubject<Entity[]> = new BehaviorSubject(this.entities);
    private dimensionsSubject: BehaviorSubject<[number, number]> = new BehaviorSubject([0,0]);

    constructor(private width: number, private height: number) {
        this.dimensionsSubject.next([this.width, this.height])
    }

    /**
     * getHeight$ in world units
     */
    public getHeight$() {
        return this.dimensionsSubject.asObservable()
            .pipe(
                map(([_, height]) => height)
            )
    }
    
    /**
     * getWidth$ in world units
     */
     public getWidth$() {
        return this.dimensionsSubject.asObservable()
            .pipe(
                map(([width]) => width)
            )
    }

    /**
     * getDimensions$ in world units
     */
    public getDimensions$(): Observable<[number, number]> {
        return this.dimensionsSubject.asObservable()
    }

    /**
     * getEntities$
     */
    public getEntities$() {
        return this.entitySubject.asObservable()
            .pipe(
                map(entities => entities.slice().sort((a, b) => {
                        if (a.getZValue() == b.getZValue()) {
                            return 0
                        }
                        return a.getZValue() < b.getZValue() ? -1 : 1
                    })
                )
            );
    }

    /**
     * getEntityAt
     */
    public getEntitiesAt(x: number, y: number): Entity[] {
        return this.entitySubject.getValue().slice()
            .sort((a,b) => a.getZValue() == b.getZValue() ? 0
                : (a.getZValue() > b.getZValue() ? -1 : 0))
            .filter(entity => {
                const bounds = entity.getBounds()
                return bounds.left < x && bounds.right > x && bounds.top < y && bounds.bottom > y
            })
    }

    private updateDimensions() {
        this.dimensionsSubject.next([this.width, this.height])
    }

    public setWidth(width: number) {
        this.width = width
        this.updateDimensions()
    }

    public setHeight(height: number) {
        this.height = height
        this.updateDimensions()
    }
    
    public setDimensions(width: number, height: number) {
        this.width = width
        this.height = height
        this.updateDimensions()
    }

    public addEntity(entity: Entity) {
        entity.setRemoveCb(() => this.removeEntity(entity))
        this.entities.push(entity)
        this.entitySubject.next(this.entities)
    }

    public clearEntities() {
        this.entities.length = 0
        this.entitySubject.next(this.entities)
    }

    public removeEntity(entity: Entity) {
        if (this.entities.indexOf(entity) > -1) {
            this.entities.splice(this.entities.indexOf(entity), 1)
            this.entitySubject.next(this.entities)
        } else {
            console.warn('Attempt to remove entity not found')
        }
    }
}
