import type { Bounds } from "./util/bounds"

export interface WorldEntity
{
    render(canvas: CanvasRenderingContext2D, renderBounds: Bounds): void;
    getPosition(): [number, number];
    setPosition(position: [number, number]): void;
    getWidth(): number;
    setWidth(width: number): void;
    getHeight(): number;
    setHeight(height: number): void;
    getBounds(): Bounds;
    getRenderPriority(): number;
}
