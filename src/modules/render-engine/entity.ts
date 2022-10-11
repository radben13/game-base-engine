import type { Bounds } from './bounds'

export interface Entity
{
    render(canvas: CanvasRenderingContext2D, renderBounds: Bounds): void;
    getSize(): [number, number];
    getPosition(): [number, number];
    getBounds(): Bounds;
    getInteractable(): boolean;
    getZValue(): number;
    setRemoveCb(cb: Function): void;
}
