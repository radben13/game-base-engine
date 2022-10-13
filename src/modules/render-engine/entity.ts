import type { Bounds } from "./util/bounds"

export interface Entity
{
    render(canvas: CanvasRenderingContext2D, renderBounds: Bounds, renderTime: number): void;
    getSize(): [number, number];
    getPosition(): [number, number];
    getBounds(): Bounds;
    getInteractable(): boolean;
    getZValue(): number;
    setRemoveCb(cb: Function): void;
}
