import type { Bounds } from "./util/bounds"

export interface WorldEntity
{
    render(canvas: CanvasRenderingContext2D, renderBounds: Bounds): void;
    getPosition(): [number, number];
    getBounds(): Bounds;
    getRenderPriority(): number;
}
