'use strict';

import config from "../../config";
import realm from "../../Realm/realm";
import { toResponse } from "../../Realm/Transform/transform";
import { distanceToPolygon } from "./algorithms/distanceToPolygon";
import { pointInPolygon } from "./algorithms/pointInPolygon";
import { transformNodeResponse } from "./transformNodeResponse";

function findNodeNearCoordinates(floorId, point) {
  const MAX_NEAR_DISTANCE = 300;

  // hack replace find({..., polygonCoordinates: $near ...})

  const nodes = realm.objects(config.db.nodes.name)
  .filtered(`floorId = "${floorId}"`)
  .map(o => toResponse(o, config.db.nodes.name))
  .filter(o => o.polygonCoordinates && distanceToPolygon(point, o.polygonCoordinates) <= MAX_NEAR_DISTANCE);

  nodes.forEach(o => delete o.polygonCoordinates);

  // end hack

  const node = nodes.find(_node => {
    if (_node && _node.geoLocs && _node.geoLocs.type === 'MultiPolygon') {
      return _node.geoLocs.coordinates.some(([outerPolygon]) =>
        pointInPolygon(point, outerPolygon),
      );
    }
    return false;
  });

  return {
    data: node ? transformNodeResponse(node) : null,
  };
}

export { findNodeNearCoordinates };

