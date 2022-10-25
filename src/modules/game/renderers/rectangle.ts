import { Bounds } from "../../render-engine/util/bounds";

export function Rectangle (context: CanvasRenderingContext2D, {top, left, width, height}: Bounds) {
    context.beginPath();
    context.rect(left, top, width, height);
    context.fill();
    context.closePath();
}
