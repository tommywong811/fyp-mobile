import { lineSegmentsIntersect } from "./lineSegmentsIntersect";
import { pointInBox } from "./pointInBox";
import { validateBox, validatePolygon } from "./validate";

/**
 * Determine whether a polygon is inside *or intersects* a rectangular box. 
 * Returns `true` if the polygon and the box only share edges or vertices.
 * @param {Array<Array<Number>>} polygon 
 * @param {Array<Array<Number>>} box  An array of exactly two coordinates indicating a rectangular box.
 */
function polygonInBox(polygon, box) {
    validatePolygon(polygon);
    validateBox(box);

    let [[x1, y1], [x2, y2]] = box;
    let edgeCount = polygon.length
    let hasEdgesIntersect = false;

    // check if some pairs of edges from each polygon 
    hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[0], polygon[edgeCount-1], [x1, y1], [x1, y2]);
    hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[0], polygon[edgeCount-1], [x1, y2], [x2, y2]);
    hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[0], polygon[edgeCount-1], [x2, y2], [x2, y1]);
    hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[0], polygon[edgeCount-1], [x2, y1], [x1, y1]);

    for (let i = 0; i < edgeCount - 1; i++) {
        hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[i], polygon[i+1], [x1, y1], [x1, y2]);
        hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[i], polygon[i+1], [x1, y2], [x2, y2]);
        hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[i], polygon[i+1], [x2, y2], [x2, y1]);
        hasEdgesIntersect = hasEdgesIntersect || lineSegmentsIntersect(polygon[i], polygon[i+1], [x2, y1], [x1, y1]);
    }

    // if some edges intersect, the polygons must intersect, hence is true
    if (hasEdgesIntersect) {
        return true;
    }

    // if no edges intersect, 
    // the polygon is outside iff no vertices are inside or on the box
    const hasPointInBox = polygon.some(point => pointInBox(point, box));
    return hasPointInBox;
}

export { polygonInBox };

