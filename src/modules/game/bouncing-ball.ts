import { Bounds } from "../render-engine/util/bounds";
import { Shape } from "./shape";
import { Circle } from "./renderers/circle"
import { SimpleEntity } from "../render-engine/simple-entity";
import { WorldActor } from "../render-engine/world-actor";
import { ActorCondition } from "../render-engine/actor-condition";
import { WorldEntity } from "../render-engine";

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
        super({x, y, width: radius * 2, height: radius * 2, renderPriority}, renderer)
        this.originalPos = [x, y]
    }

    public animate(time: number): void {
        const entity = this.entity as SimpleEntity
        
        if (!this.lastTime || this.condition != ActorCondition.moving) {
            this.lastTime = time
            return
        }
        const changeTime = time - this.lastTime;
        this.lastTime = time
        entity.setPosition(this.speed.map((val, direction) => {
            let change = val * changeTime / 1000
            let pos = entity.getPosition()[direction]
            pos += change
            if (pos > this.originalPos[direction]) {
                this.speed[direction]
            }
        }) as [number, number])
        if (speed) {
            x += Math.cos(this.angle) * speed
            y += Math.sin(this.angle) * speed
        }
        this.speed += this.acceleration * changeTime / 1000
        if (y > this.originalPos[1]) {
            y = this.originalPos[1] - (y - this.originalPos[1]) * 0.5
            this.speed = Math.round(-this.speed * 0.5)
        }
        entity.setPosition([x, y])
    }

    public touch(): void {
        this.actor = this.actor || new class extends WorldActor {
            constructor(entity: WorldEntity, private parent: BouncingBall) {
                super(entity)
            }
            public animationFrame(time: number): void {
                this.parent.animate(time)
            }
        }(this.entity, this)
        this.speed[1] -= 200
    }
}
