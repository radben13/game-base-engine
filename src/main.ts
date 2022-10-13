import { combineLatestWith, map, filter } from "rxjs/operators";
import { BouncingBall } from "./modules/game/bouncing-ball";
import { Camera, CameraPoint, Entity, World } from "./modules/render-engine";
import type { Bounds } from "./modules/render-engine/util/bounds";
import { orderBounds } from "./modules/render-engine/util/bounds";
import { TouchCanvas } from "./modules/touch-canvas";

const touchCanvas = new TouchCanvas();
touchCanvas.init();
const win = window as any;
win.touchCanvas = touchCanvas;
touchCanvas.getCanvasClick$()
    .subscribe(({x, y}) => {
        mouseDown = false;
        let cameraPoint = camera.getCameraPoint({x,y}), entity: Entity | void
        switch(interactMode) {
            case 'draw':
                world.addEntity(win.entityConstructor(downPoint, cameraPoint));
                break;
            case 'delete':
                entity = world.getEntitiesAt(cameraPoint.x, cameraPoint.y).reverse().find(() => true)
                if (entity) world.removeEntity(entity)
                break;
            case 'move':
                win.camera.position.next([x,y]);
                break;
            case 'create':
                world.addEntity(new BouncingBall(cameraPoint.x - win.camera.scale.getValue() * 50, cameraPoint.y - win.camera.scale.getValue() * 50, win.camera.scale.getValue() * 50, "purple"));
                break;
            case 'touch':
                entity = world.getEntitiesAt(cameraPoint.x, cameraPoint.y).reverse().find(() => true)
                if (entity && (entity as any).touch) (entity as any).touch()
                break;
        }
    });

let downPoint: CameraPoint
let mouseDown: boolean = false
touchCanvas.getCanvasMouseDown$()
    .subscribe(({x,y}) => {
        downPoint = camera.getCameraPoint({x,y});
        mouseDown = true;
    });
const dimensions$ = touchCanvas.getCanvas$()
    .pipe(
        combineLatestWith(touchCanvas.getDimension$()),
        map(([canvas]) => {
            const {width, height} = canvas.getBoundingClientRect()
            return {width, height}
        })
    )

const world = new World(10000,5000);
const camera = win.camera = new Camera(world, touchCanvas.getCanvasContext$(), dimensions$);

touchCanvas.getCanvasMouseMove$().pipe(
        filter(() => interactMode == 'drag' && mouseDown)
    )
    .subscribe(({x, y}) =>  {
        let cameraPoint = camera.getCameraPoint({x,y})
        win.camera.position.next([
            (downPoint.camX - cameraPoint.camX) * downPoint.scale + downPoint.posX,
            (downPoint.camY - cameraPoint.camY) * downPoint.scale + downPoint.posY
        ])
    });

win.entityConstructor = (start: CameraPoint, end: CameraPoint) => {
    let width = end.x - start.x, height = end.y - start.y
    let bounds: Bounds = orderBounds({
        width, height, left: start.x, top: start.y, right: end.x, bottom: end.y
    })
    let color: string;
    switch (win.camera.world.entities.length % 4) {
        case 0:
            color = 'green';
            break;
        case 1:
            color = 'blue';
            break;
        case 2:
            color = 'red';
            break;
        case 3:
            color = 'black'
    }
    return {
        bounds,
        getBounds: () => bounds,
        render: (context: CanvasRenderingContext2D, bounds: Bounds) => {
            context.fillStyle = color;
            context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height)
        },
        setRemoveCb: (cb: Function) => {},
        getZValue: () => 1
    }
};

win.camera.render();

let interactMode = 'draw'
win.setMode = function (mode: string): void {
    interactMode = mode
}

