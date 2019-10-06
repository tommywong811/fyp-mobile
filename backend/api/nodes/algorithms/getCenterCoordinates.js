'use strict';

import { validateGeoLocs } from "./validate";

function getCenterCoordinates(geoLocs) {
  validateGeoLocs(geoLocs);

  const firstInnerPolygon = geoLocs.coordinates[0][0];
  let sumX = 0;
  let sumY = 0;

  firstInnerPolygon.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
  });

  return {
    centerCoordinates: [sumX / firstInnerPolygon.length, sumY / firstInnerPolygon.length].map(v =>
      Math.round(v),
    ),
  };
}

export { getCenterCoordinates };
