import { Bounds } from "../../render-engine/util/bounds";

export function Circle (context: CanvasRenderingContext2D, renderBounds: Bounds) {
    context.beginPath();
    const radius = renderBounds.width / 2;
    context.ellipse(renderBounds.left + radius, renderBounds.top + radius, radius, radius, 0, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}
