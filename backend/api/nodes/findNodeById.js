'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";
import { transformNodeResponse } from './transformNodeResponse';

function findNodeById(_id) {
  let node = realm.objectForPrimaryKey(config.db.nodes.name, _id);

  if (!node) {
    throw new Error(query, 'Node not found');
  }
  
  node = toResponse(node, config.db.nodes.name);
  delete node.polygonCoordinates;

  return {
    data: transformNodeResponse(node),
  };
}

export { findNodeById };
