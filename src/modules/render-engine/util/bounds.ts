export declare type Bounds = {
    left: number,
    right: number,
    top: number,
    bottom: number,
    height: number,
    width: number
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
    a = orderBounds(a)
    b = orderBounds(b)
    return (
        a.right > b.left && b.right > a.left
        && a.bottom > b.top && b.bottom > a.top
    )
    || (
        b.right < a.right && b.left > a.left
        && b.top < a.top && b.bottom > a.bottom
    );
}

export function orderBounds(bounds: Bounds) {
    let overrideBounds: Bounds = {...bounds}
    if (bounds.left > bounds.right) {
        overrideBounds.left = bounds.right
        overrideBounds.right = bounds.left
        overrideBounds.width = -bounds.width
    }
    if (bounds.top > bounds.bottom) {
        overrideBounds.top = bounds.bottom
        overrideBounds.bottom = bounds.top
        overrideBounds.height = -bounds.height
    }
    return overrideBounds
}
