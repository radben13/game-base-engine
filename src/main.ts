import { combineLatestWith, map } from "rxjs/operators";
import { Camera, CameraPoint, Entity, World } from "./modules/render-engine";
import { Bounds } from "./modules/render-engine/bounds";
import { TouchCanvas } from "./modules/touch-canvas";

const touchCanvas = new TouchCanvas();
touchCanvas.init();
const win = window as any;
win.touchCanvas = touchCanvas;
touchCanvas.getCanvasClick$()
    .subscribe(({x, y}) => {
        world.addEntity(win.entityConstructor(downPoint, camera.getCameraPoint({x,y})))
    });

let downPoint: {x:number, y:number, posX: number, posY: number}
touchCanvas.getCanvasMouseDown$()
    .subscribe(({x,y}) => {downPoint = camera.getCameraPoint({x,y})});
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
win.entityConstructor = (start: CameraPoint, end: CameraPoint) => {
    let width = end.x - start.x, height = end.y - start.y
    let bounds = {
        width, height, left: start.x, top: start.y, right: end.x, bottom: end.y
    }
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

win.moving = true;
(async () => {
    while(win.moving) {
    await new Promise(res => requestAnimationFrame(res));
    const [x,y] = win.camera.position.getValue()
    win.camera.position.next([x + .1, y + .05])
    win.camera.render()
}})()