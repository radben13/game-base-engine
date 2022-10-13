import { Entity } from "../render-engine";
import { Bounds } from "../render-engine/util/bounds";

export abstract class Shape implements Entity
{
    private removeCb: () => void = () => void(0);
    
    constructor(protected x: number, protected y: number, protected width: number, protected height: number, protected zValue: number = 1) {
    }

    public render(canvas: CanvasRenderingContext2D, renderBounds: Bounds, renderTime: number): void {
        throw new Error('Cannot render abstract Shape')
    }
    public getSize(): [number, number] {
        return [this.width, this.height]
    }
    public getPosition(): [number, number] {
        return [this.x, this.y]
    }
    public getBounds(): Bounds {
        return {
            top: this.y,
            left: this.x,
            right: this.x + this.width,
            bottom: this.y + this.height,
            width: this.width,
            height: this.height
        }
    }
    public getInteractable(): boolean {
        return false
    }
    public getZValue(): number {
        return this.zValue
    }
    public setRemoveCb(cb: Function): void {
        this.removeCb = () => cb(this)
    }
    public remove(): void {
        this.removeCb()
    }
}
