import { pointInsideBox } from "./pointInsideBox";

function polygonInsideBox(polygon, box) {
    if (polygon.length < 3) {
        throw new Error('Polygon must have at least 3 vertices');
    }
    return polygon.every(point => pointInsideBox(point, box));
}

export { polygonInsideBox };