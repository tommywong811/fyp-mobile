import { pointInBox } from "./pointInBox";
import { validateBox, validatePolygon } from "./validate";

/**
 * Determine whether a polygon is inside a rectangular box. 
 * Returns `true` if some edges are colinear as long as the polygon is not outside the box.
 * @param {Array<Array<Number>>} polygon 
 * @param {Array<Array<Number>>} box  An array of exactly two coordinates indicating a rectangular box.
 */
function polygonInsideBox(polygon, box) {
    validatePolygon(polygon);
    validateBox(box);
    
    return polygon.every(point => pointInBox(point, box));
}

export { polygonInsideBox };