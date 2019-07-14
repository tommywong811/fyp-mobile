'use strict';

// Modified from https://stackoverflow.com/a/15308571

function sub(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function crossProduct(v1, v2) {
  return v1[0] * v2[1] - v1[1] * v2[0];
}

function pointInPolygon(point, polygon) {
  if (polygon.length < 3) {
    throw new Error('Polygon must have at least 3 vertices');
  }

  let sign = 0;

  return polygon.every((vertex, i) => {
    const nextVertex = polygon[(i + 1) % polygon.length];
    const v1 = sub(vertex, point);
    const v2 = sub(nextVertex, point);
    const edge = sub(v1, v2);
    const currentSign = Math.sign(crossProduct(edge, v1));

    if (!sign) {
      sign = currentSign;
    }
    // point on the edge considered as in the polygon
    return sign === currentSign || currentSign === 0;
  });
}

export { pointInPolygon };
