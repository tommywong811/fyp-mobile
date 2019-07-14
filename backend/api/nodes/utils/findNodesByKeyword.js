'use strict';

import realm from "../../../Realm/realm";
import config from "../../../config";
import { toResponse } from "../../../Realm/Transform/transform";

function findNodesByKeyword(name) {
  const MAX_NODES_RETURN_LIMIT = 10;

  if (!name) {
    throw new Error('Empty query is not allowed');
  }

  let data = realm.objects(config.db.nodes.name)
  .filtered('unsearchable != true')
  .filter(o => ( o.name && o.name.includes(name) ) || ( o.keywords.some(k => k.includes(name)) ))
  .slice(0, MAX_NODES_RETURN_LIMIT)
  .map(o => toResponse(o, config.db.nodes.name));

  return data;
}

export { findNodesByKeyword };
