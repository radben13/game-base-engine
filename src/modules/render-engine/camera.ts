import { combineLatestWith, map } from "rxjs/operators"
import { Entity } from "./entity"
import { World } from "./world"
import type { Bounds } from "./util/bounds"
import { Subscription, Observable, Subject, BehaviorSubject } from "rxjs"
import { boundsIntersect } from "./util/bounds"

export type CameraPoint = {
    scale: number,
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

    private renderSubject: Subject<number> = new Subject();
    private rendering: boolean = false;

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
            .subscribe(([entities, context, dimensions, bounds, scale, renderTime]) => {
                context.clearRect(0,0, dimensions.width, dimensions.height)
                debugger
                entities.forEach(entity => entity.render(context, this.getEntityCameraBounds(bounds, scale, entity), renderTime))
            }))
    }

    /**
     * render
     */
    public async render() {
        this.rendering = true;
        while (this.rendering)
            await new Promise(res => {
                const frameId = window.requestAnimationFrame((time) => {
                    this.renderSubject.next(time)
                    res(frameId)
                })
            });
    }
    
    public pause() {
        this.rendering = false
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

    public getPosition$(): Observable<[number, number]> {
        return this.position.asObservable()
    }

    
    public getScale$(): Observable<number> {
        return this.scale.asObservable()
    }

    private filterWithinBounds(entities: Entity[], bounds: Bounds): Entity[] {
        return entities.filter(entity => boundsIntersect(entity.getBounds(), bounds))
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
            scale,
            camX: x,
            camY: y,
            posX: this.position.getValue()[0],
            posY: this.position.getValue()[1],
            x: x * scale + this.position.getValue()[0],
            y: y * scale + this.position.getValue()[1]
        }
    }

}
