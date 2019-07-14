function pointInsideBox(point, box) {
    if (!box || !box[0] || !Number.isInteger(box[0][0])) {
        throw new Error('Invalid box format');
    }
    if (box.length !== 2) {
        throw new Error('Box must have exactly 2 vertices (bottom left & top right)');
    }
    if (!point || !Number.isInteger(point[0])) {
        throw new Error('Invalid point format');
    }
    if (point.length !== 2) {
        throw new Error('Point must have exactly 2 coordinates');
    }
    let [[left, bottom], [right, top]] = box;
    let [x, y] = point;
    return ((x - left) * (x - right) < 0) && ((y - bottom) * (y - top) < 0)
}

export { pointInsideBox };