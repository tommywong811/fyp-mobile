'use strict';

import pick from "lodash.pick";
import uniq from "lodash.uniq";
import compact from "lodash.compact";
import keyBy from "lodash.keyby";
import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";
import { transformNodeResponse } from "./transformNodeResponse";

function findNodesByKeyword(name) {
  const MAX_NODES_RETURN_LIMIT = 10;

  if (!name) {
    throw new Error('Empty query is not allowed');
  }

  let data = realm.objects(config.db.nodes.name)
  .filtered('unsearchable != true')
  .filter(o => {
    return ( o.name && o.name.includes(name) ) || ( o.keywords.some(k => k.includes(name)) || Object.keys(o.tagIds).some(e=>o.tagIds[e].includes(name.toLowerCase())))
  })
  .slice(0, MAX_NODES_RETURN_LIMIT);

  data = toResponse(Array.from(data), config.db.nodes.name);
  data.forEach(o => delete o.polygonCoordinates);
  
  let connectorIds = data.map(({ connectorId }) => connectorId);
  connectorIds = uniq(compact(connectorIds));
  
  let connectorFinds = connectorIds.map(_id => pick(realm.objectForPrimaryKey(config.db.connectors.name, _id), ["tagIds", "_id"]));
  connectorFinds = toResponse(connectorFinds, config.db.connectors.name);
  
  const connectorsById = keyBy(connectorFinds, o => o._id);

  const filteredData = data.filter(
    ({ connectorId }) =>
      !connectorId ||
      !['crossBuildingConnector', 'stair', 'escalator'].some(tag =>
        (connectorsById[connectorId].tagIds || []).includes(tag),
      ),
  );

  return {
    data: filteredData.map(node => transformNodeResponse(node)),
    meta: { count: filteredData.length },
  }
}

export { findNodesByKeyword };
