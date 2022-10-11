import { combineLatestWith, map } from "rxjs/operators"
import { Entity } from "./entity"
import { World } from "./world"
import type { Bounds } from "./bounds"
import { Subscription, Observable, Subject, BehaviorSubject } from "rxjs"

export type CameraPoint = {
    posX: number,
    posY: number,
    x: number,
    y: number,
    camX: number,
    camY: number
}

export class Camera
{

    private subscriptions: Subscription[] = [];
    private position: BehaviorSubject<[number, number]> = new BehaviorSubject([0,0]);
    private scale: BehaviorSubject<number> = new BehaviorSubject(1);

    private renderSubject: Subject<void> = new Subject();

    constructor(
            private world: World,
            private context$: Observable<CanvasRenderingContext2D>,
            private dimensions$: Observable<{width: number, height: number}>,
            position: [number, number] = [0,0],
            scale: number = 100) {
        this.position.next(position)
        this.scale.next(scale)
        
        this.subscriptions.push(this.getRenderingEntities$()
            .pipe(combineLatestWith(this.context$, this.dimensions$, this.getBounds$(), this.getScale$(), this.renderSubject.asObservable()))
            .subscribe(([entities, context, dimensions, bounds, scale]) => {
                context.clearRect(0,0, dimensions.width, dimensions.height)
                entities.forEach(entity => entity.render(context, this.getEntityCameraBounds(bounds, scale, entity)))
            }))
    }

    /**
     * render
     */
    public render() {
        this.renderSubject.next(void(0));
    }
    
    public pause() {
        this.subscriptions.forEach(sub => sub.unsubscribe())
        this.subscriptions.length = 0
    }

    public getRenderingEntities$() {
        return this.world.getEntities$()
            .pipe(
                combineLatestWith(this.getBounds$()),
                map(([entities, cameraBounds]) => this.filterWithinBounds(entities, cameraBounds))
            )
    }

    public getBounds$(): Observable<Bounds> {
        return this.dimensions$.pipe(
            combineLatestWith(this.getPosition$(), this.getScale$()),
            map(([{width,height}, [x,y], scale]) => {
                width *= scale, height *= scale
                return ({
                    scale: scale,
                    left: x,
                    right: x + width,
                    top: y,
                    bottom: y + height,
                    width: width,
                    height: height
                })
            }
        ))
    }

    private getPosition$(): Observable<[number, number]> {
        return this.position.asObservable()
    }

    
    private getScale$(): Observable<number> {
        return this.scale.asObservable()
    }

    private filterWithinBounds(entities: Entity[], cameraBounds: Bounds): Entity[] {
        const withinBounds = (bounds: Bounds) => {
            let overrideBounds: {left?: number, right?: number, top?: number, bottom?: number} = {}
            if (bounds.left > bounds.right) {
                overrideBounds.left = bounds.right
                overrideBounds.right = bounds.left
            }
            if (bounds.top > bounds.bottom) {
                overrideBounds.top = bounds.bottom
                overrideBounds.bottom = bounds.top
            }
            bounds = {...bounds, ...overrideBounds}
            return bounds.right > cameraBounds.left && cameraBounds.right > bounds.left
                && bounds.bottom > cameraBounds.top && cameraBounds.bottom > bounds.top
        }
        return entities.filter(entity => withinBounds(entity.getBounds()))
    }

    private getEntityCameraBounds(bounds: Bounds, scale: number, entity: Entity): Bounds {
        const entityBounds = entity.getBounds(),
            left = (entityBounds.left - bounds.left) / scale,
            top = (entityBounds.top - bounds.top) / scale,
            width = entityBounds.width / (scale),
            height = entityBounds.height / (scale)
        return {
            top,
            left,
            right: left + width,
            bottom: top + height,
            width,
            height
        }
    }

    public getCameraPoint({x, y}: {x: number, y: number}): CameraPoint {
        const scale = this.scale.getValue()
        return {
            camX: x,
            camY: y,
            posX: this.position.getValue()[0],
            posY: this.position.getValue()[1],
            x: x * scale + this.position.getValue()[0],
            y: y * scale + this.position.getValue()[1]
        }
    }

}
