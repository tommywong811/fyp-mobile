'use strict';

import keyBy from "lodash.keyby";
import pick from "lodash.pick";
import config from "../../config";
import realm from "../../Realm/realm";
import { toResponse } from "../../Realm/Transform/transform";
import { pointInsideBox } from "./algorithms/pointInsideBox";
import { polygonInsideBox } from "./algorithms/polygonInsideBox";
import { transformNodeResponse } from "./transformNodeResponse";

function findNodesWithinBox(floorId, boxCoordinates, includePoints = false) {
    const MAX_NODES_RETURN_LIMIT = 200;

    boxCoordinates = [[boxCoordinates[0], boxCoordinates[1]], [boxCoordinates[2], boxCoordinates[3]]];

    const data = realm.objects(config.db.nodes.name)
    .filtered(`floorId = "${floorId}"`)
    .map(o => toResponse(o, config.db.nodes.name))
    .filter(o => (
        ( o.polygonCoordinates && polygonInsideBox(o.polygonCoordinates, boxCoordinates) ) ||
        ( includePoints && this.coordinates && pointInsideBox(this.coordinates, boxCoordinates) )
    ))
    .slice(0, MAX_NODES_RETURN_LIMIT);

    data.forEach(o => delete o.polygonCoordinates);

    const indexesByConnectorId = {};

    data.forEach(({ connectorId }, i) => {
        if (!connectorId) {
            return;
        }

        if (indexesByConnectorId[connectorId]) {
            indexesByConnectorId[connectorId].push(i);
        }
        else {
            indexesByConnectorId[connectorId] = [i]
        }
    });

    const connectorIds = Object.keys(indexesByConnectorId);
    // no need for uniq() and compact() since it is guaranteed.

    if (connectorIds.length) {
        let connectorFinds = connectorIds.map(_id => pick(realm.objectForPrimaryKey(config.db.connectors.name, _id), ["tagIds", "_id"]));
        connectorFinds = toResponse(connectorFinds, config.db.connectors.name);
        const connectorsById = keyBy(connectorFinds, o => o._id);
    
        // Concat tagIds from connectors to nodes
        connectorIds.forEach(connectorId => {
            const dataIndexes = indexesByConnectorId[connectorId];
            dataIndexes.forEach(dataIndex => {
                data[dataIndex].tagIds = (data[dataIndex].tagIds || []).concat(connectorsById[connectorId].tagIds || [])
            });
        });
    }

    return {
        data: data.map((node) => transformNodeResponse(node)),
        meta: { count: data.length },
    }
}

export { findNodesWithinBox };
