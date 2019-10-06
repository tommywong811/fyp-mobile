'use strict';

// modified form https://stackoverflow.com/a/9997374/5735654

// function ccw(A, B, C) {
//     return (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0])
// }

// /**
//  * Determine whether AB intersects CD. Returns `false` on colinearity regardless of intersection
//  * @param {Array<Number>} A 
//  * @param {Array<Number>} B 
//  * @param {Array<Number>} C 
//  * @param {Array<Number>} D 
//  * @returns {Boolean}
//  */
// function lineSegmentsIntersect(A, B, C, D) {
//     return ccw(A ,C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D)
// }

// modified from https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

function onSegment(p, q, r) { 
    if (q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) && 
        q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1])) 
       return true; 
  
    return false; 
}

function orientation(p, q, r)  { 
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    let val = (q[1] - p[1]) * (r[0] - q[0]) - 
              (q[0] - p[0]) * (r[1] - q[1]);
  
    if (val == 0) return 0;  // colinear 
  
    return (val > 0) ? 1 : 2; // clock or counterclock wise 
}

/**
 * Determine whether P1Q1 intersects P2Q2.
 * @param {Array<Number>} p1
 * @param {Array<Number>} q1
 * @param {Array<Number>} p2
 * @param {Array<Number>} q2
 * @returns {Boolean}
 */
function lineSegmentsIntersect(p1, q1, p2, q2) { 
    // Find the four orientations needed for general and 
    // special cases 
    let o1 = orientation(p1, q1, p2); 
    let o2 = orientation(p1, q1, q2); 
    let o3 = orientation(p2, q2, p1); 
    let o4 = orientation(p2, q2, q1); 
  
    // General case 
    if (o1 != o2 && o3 != o4) 
        return true; 
  
    // Special Cases 
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
    if (o1 == 0 && onSegment(p1, p2, q1)) return true; 
  
    // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
    if (o2 == 0 && onSegment(p1, q2, q1)) return true; 
  
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
    if (o3 == 0 && onSegment(p2, p1, q2)) return true; 
  
     // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
    if (o4 == 0 && onSegment(p2, q1, q2)) return true; 
  
    return false; // Doesn't fall in any of the above cases 
} 

export { lineSegmentsIntersect };