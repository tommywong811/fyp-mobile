'use strict';

import { validateGeoLocs } from "./validate";
import { isObject } from "util";

function getCenterCoordinates(geoLocs) {
  geoLocs = isObject(geoLocs) ? geoLocs : JSON.parse(geoLocs); // geoLocs is not a string in the data, need to Parse
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
