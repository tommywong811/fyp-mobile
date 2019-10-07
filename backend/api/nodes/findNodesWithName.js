'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";
import { transformNodeResponse } from './transformNodeResponse';
import _ from 'lodash';


function findNodesWithName() {
//   let node = realm.objectForPrimaryKey(config.db.nodes.name, _id);
  let nodes = realm.objects('nodes').filtered(`name != nil`)

  if (!nodes) {
    throw new Error(query, 'Node not found');
  }
  
  nodes = toResponse(nodes, config.db.nodes.name);
  nodes = _.values(nodes).map((node)=> transformNodeResponse(node));

  return {
    data: nodes,
  };
}

export { findNodesWithName };
