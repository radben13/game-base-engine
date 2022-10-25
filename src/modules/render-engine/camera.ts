import { combineLatestWith, map } from "rxjs/operators"
import { WorldEntity } from "./world-entity"
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
            .subscribe(([entities, context, dimensions, bounds, scale]) => {
                context.clearRect(0,0, dimensions.width, dimensions.height)
                entities.forEach(worldEntity => worldEntity.render(context, this.getWorldEntityCameraBounds(bounds, scale, worldEntity)))
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
        return this.world.getObjectsWithEntities$()
            .pipe(
                combineLatestWith(this.getBounds$()),
                map(([objects, cameraBounds]) => this.filterWithinBounds(
                    objects.map(o => o.getEntity()).filter(Boolean) as WorldEntity[],
                    cameraBounds
                ))
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

    private filterWithinBounds(entities: WorldEntity[], bounds: Bounds): WorldEntity[] {
        return entities.filter(worldEntity => boundsIntersect(worldEntity.getBounds(), bounds))
    }

    private getWorldEntityCameraBounds(bounds: Bounds, scale: number, worldEntity: WorldEntity): Bounds {
        const worldEntityBounds = worldEntity.getBounds(),
            left = (worldEntityBounds.left - bounds.left) / scale,
            top = (worldEntityBounds.top - bounds.top) / scale,
            width = worldEntityBounds.width / (scale),
            height = worldEntityBounds.height / (scale)
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
