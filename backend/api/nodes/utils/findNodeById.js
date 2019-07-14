'use strict';

import realm from "../../../Realm/realm";
import config from "../../../config";
import { toResponse } from "../../../Realm/Transform/transform";

function findNodeById(_id) {
  let node = realm.objectForPrimaryKey(config.db.nodes.name, _id);

  if (!!node) {
    node = toResponse(node, config.db.nodes.name);
  }

  return node;
}

export { findNodeById };
