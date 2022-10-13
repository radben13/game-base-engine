import { HasRenderAnimation } from "../render-engine/has-render-animation";
import { Bounds } from "../render-engine/util/bounds";
import { Shape } from "./shape";

export class BouncingBall extends Shape implements HasRenderAnimation
{

    private angle: number = 0.5 * Math.PI;
    private speed: number = 0;
    private acceleration: number = 50;

    private originalPos: number[] = []
    private lastTime: number = 0;

    constructor(x: number, y: number, radius: number, private fill: string = "black", zValue: number = 1) {
        super(x, y, radius * 2, radius * 2, zValue)
    }

    public render(context: CanvasRenderingContext2D, renderBounds: Bounds, renderTime: number): void {
        this.animate(renderTime)
        const radius = renderBounds.height * .5
        context.beginPath();
        context.ellipse(renderBounds.left + radius, renderBounds.top + radius, radius, radius, 2 * Math.PI, 0, 2 * Math.PI);
        context.fillStyle = this.fill;
        context.fill();
    }

    public animate(time: number): void {
        if (!this.originalPos.length) this.originalPos.push(this.x, this.y);
        if (!this.lastTime || !this.speed) {
            this.lastTime = time
            return
        }
        const changeTime = time - this.lastTime;
        this.lastTime = time
        const lastPosition = this.getPosition()
        const speed = (this.speed * changeTime / 1000)
        let [x,y] = lastPosition

        if (speed) {
            x += Math.cos(this.angle) * speed
            y += Math.sin(this.angle) * speed
        }
        this.speed += this.acceleration * changeTime / 1000
        if (y > this.originalPos[1]) {
            this.y = this.originalPos[1] - (y - this.originalPos[1]) * 0.5
            this.speed = Math.round(-this.speed * 0.5)
        } else {
            this.y = y;
        }
        this.x = x
    }

    public touch(): void {
        console.log('touch this')
        this.speed = -200
    }

    public getInteractable(): boolean {
        return true;
    }
}

