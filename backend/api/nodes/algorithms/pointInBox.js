'use strict';

import { validatePoint, validateBox } from "./validate";

/**
 * Determine whether a point is inside a rectangular box or on its edges
 * @param {Array<Number>} point 
 * @param {Array<Array<Number>>} box An array of exactly **two** points indicating a rectangular box
 * @returns {Boolean}
 */
function pointInBox(point, box) {
    validatePoint(point);
    validateBox(box);

    let [[left, bottom], [right, top]] = box;
    let [x, y] = point;
    return ((x - left) * (x - right) <= 0) && ((y - bottom) * (y - top) <= 0)
}

export { pointInBox };