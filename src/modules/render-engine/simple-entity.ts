import { Bounds } from "./util/bounds"
import { CanvasRenderer } from "./util/canvas-renderer"
import { WorldEntity } from "./world-entity"

export declare type EntityConstruct = {
    x: number,
    y: number,
    width: number,
    height: number,
    renderPriority: number
}

export class SimpleEntity implements WorldEntity
{
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private renderPriority: number;

    constructor(
        private renderer: CanvasRenderer,
        entityConstruct: EntityConstruct
    ) {
        this.x = entityConstruct.x;
        this.y = entityConstruct.y;
        this.width = entityConstruct.width;
        this.height = entityConstruct.height;
        this.renderPriority = entityConstruct.renderPriority;
    }

    getWidth(): number {
        return this.width
    }
    setWidth(width: number): void {
        this.width = width
    }
    getHeight(): number {
        return this.height
    }
    setHeight(height: number): void {
        this.height = height
    }

    render(canvas: CanvasRenderingContext2D, renderBounds: Bounds): void {
        this.renderer(canvas, renderBounds)
    }

    public getPosition(): [number, number] {
        return [this.x, this.y]
    }
    public setPosition([x, y]: [number, number]): void {
        this.x = x
        this.y = y
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

    public getRenderPriority(): number {
        return this.renderPriority
    }

    public setRenderer(renderer: CanvasRenderer) {
        this.renderer = renderer
    }
}
