'use strict';

import { getImageUrl } from "../images/getImageUrl";
import { getCenterCoordinates } from "./algorithms/getCenterCoordinates";

function transformNodeResponse(node) {
  return {
    ...node,
    ...(node.geoLocs ? getCenterCoordinates(node.geoLocs) : {}),
    ...(node.image ? { imageUrl: getImageUrl(node.image) } : {}),
  };
}

export { transformNodeResponse };

