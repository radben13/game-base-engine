import { Bounds } from "../render-engine/util/bounds";
import { Shape } from "./shape";
import { Circle } from "./renderers/circle"
import { Bouncer } from "./actors/bouncer"
import { ActorCondition } from "../render-engine/actor-condition";


export class BouncingBall extends Shape
{
    private acceleration: [number, number] = [0,50];
    private speed: [number, number] = [0,0];

    private originalPos: [number, number]
    private lastTime: number = 0;

    private condition: ActorCondition = ActorCondition.stopped;

    constructor(x: number, y: number, radius: number, private fill: string = "black", renderPriority: number = 1) {
        const renderer = (context: CanvasRenderingContext2D, renderBounds: Bounds) => {
            context.fillStyle = this.fill
            Circle(context, renderBounds)
        }
        super(renderer, {x, y, width: radius * 2, height: radius * 2, renderPriority})
        this.originalPos = [x, y]
    }

    public touch(): void {
        this.actor = this.actor || new Bouncer(this.entity, this)
        this.speed[1] -= 200
    }
}
