'use strict';

import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";
import pick from "lodash.pick";
import config from "../../config";
import realm from "../../Realm/realm";
import { toResponse } from "../../Realm/Transform/transform";
import { CONNECTOR_SMALLEST_WEIGHT, MAX_WEIGHT } from "./constants";
import graphCache from "./cache";
// const logger = require('../logger/logger');


function getDistance([x1, y1], [x2, y2]) {
  return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
}

function build() {
  // logger.info('Building Graph...');

  const graph = {};

  const nodes = realm.objects(config.db.nodes.name).map(o => pick(
    toResponse(o, config.db.nodes.name), ['_id', 'coordinates', 'floorId', 'tagIds', 'connectorId']
  ));
  const edges = realm.objects(config.db.edges.name).map(o => toResponse(o, config.db.edges.name));
  const connectors = realm.objects(config.db.connectors.name).map(o => toResponse(o, config.db.connectors.name));
  const floors = realm.objects(config.db.floors.name).map(o => toResponse(o, config.db.floors.name));
  const settings = toResponse(realm.objects(config.db.settings.name).sorted("_id", true)[0], config.db.settings.name);

  const connectorsById = keyBy(connectors, o => o._id);
  nodes.forEach(({ tagIds, connectorId }, index) => {
    if (connectorId && !connectorsById[connectorId]) {
      throw new Error(`Connector ${connectorId} not found`);
    }

    nodes[index].tags = keyBy(tagIds);

    if (connectorId) {
      nodes[index].tags = { ...nodes[index].tags, ...keyBy(connectorsById[connectorId].tagIds) };
    }
  });

  const nodesById = keyBy(nodes, o => o._id);
  const nodeWithConnector = nodes.filter(({ connectorId }) => connectorId);
  const nodesByConnectorId = groupBy(nodeWithConnector, o => o.connectorId);
  const floorsById = keyBy(floors, o => o._id);

  if (!settings) {
    throw new Error('No settings found');
  }

  edges.forEach(({ _id, fromNodeId, toNodeId, weightType, weight }) => {
    let calculatedWeight = 0;
    const nodeFloorId = nodesById[toNodeId].floorId;

    switch (weightType) {
      case 'number':
        calculatedWeight = weight;
        break;

      case 'nodeDistance':
        if (!nodesById[fromNodeId]) {
          throw new Error(`Node ${fromNodeId} not found`);
        }

        if (!nodesById[toNodeId]) {
          throw new Error(`Node ${toNodeId} not found`);
        }

        calculatedWeight =
          getDistance(nodesById[fromNodeId].coordinates, nodesById[toNodeId].coordinates) *
          floorsById[nodeFloorId].meterPerPixel;
        break;

      case 'max':
        calculatedWeight = MAX_WEIGHT;
        break;

      default:
        throw new Error(`Invalid weightType ${weightType} for edge ${_id}`);
    }

    if (!graph[fromNodeId]) {
      graph[fromNodeId] = [];
    }

    graph[fromNodeId].push([toNodeId, calculatedWeight, false]);
  });

  // Add edges for connectors
  nodeWithConnector.forEach(({ _id, connectorId }) => {
    const connector = connectorsById[connectorId];

    if (!connector) {
      throw new Error(`Connector ${connectorId} not found`);
    }

    if (!nodesByConnectorId[connectorId].length) {
      throw new Error(`No nodes connecting to ${connectorId}`);
    }

    if (!graph[_id]) {
      graph[_id] = [];
    }

    nodesByConnectorId[connectorId].forEach(({ _id: toNodeId }) => {
      if (toNodeId === _id) {
        return;
      }

      graph[_id].push([
        toNodeId,
        (connector.weight && connector.weight / settings.minutesPerMeter) ||
          CONNECTOR_SMALLEST_WEIGHT,
        true,
      ]);
    });
  });

  // logger.info('Graph built');
  graphCache.data = { graph, nodesById, connectorsById, settings };
  return graphCache.data
}

export default build;
