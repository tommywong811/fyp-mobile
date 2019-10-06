'use strict'

import { pointInPolygon } from "./pointInPolygon";
import { validatePoint, validatePolygon } from "./validate";

// ref: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment

function _square(x) {
    return x * x;
}

function _dist2([x1, y1], [x2, y2]) {
    return _square(x1 - x2) + _square(y1 - y2);
}

function _distToSegment2(p, a, b) {
    let l2 = _dist2(a, b);
    if (l2 === 0) {
        return _dist2(p, a);
    }
    let t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    let proj = [
        a[0] + t * (b[0] - a[0]),
        a[1] + t * (b[1] - a[1])
    ]
    return _dist2(p, proj);
}

function _distToSegment(p, a, b) {
    return Math.sqrt(_distToSegment2(p, a, b));
}

function distanceToPolygon(point, polygon) {
    validatePoint(point);
    validatePolygon(polygon);
    
    if (pointInPolygon(point, polygon)) {
        return 0;
    }
    let result = _distToSegment(point, polygon[0], polygon[polygon.length - 1]);
    for (let i = 0; i < polygon.length - 1; i++) {
        let distToSeg = _distToSegment(point, polygon[i], polygon[i + 1]);
        result = Math.min(result, distToSeg);
    }
    return result;
}

export { distanceToPolygon };
