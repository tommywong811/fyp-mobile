'use strict';

import keyBy from "lodash.keyby";
import config from "../../config";
import realm from "../../Realm/realm";
import { toResponse } from "../../Realm/Transform/transform";
import { breadthFirstSearch } from "../graph/breadthFirstSearch";
import buildGraph from "../graph/build";
import graphCache from "../graph/cache";
import { CONNECTOR_SMALLEST_WEIGHT, MAX_WEIGHT } from "../graph/constants";
import { transformNodeResponse } from "../nodes/transformNodeResponse";

const MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

const DISTANCE_UNIT = {
  MINUTE: 'MINUTE',
  METER: 'METER',
};

const PATH_NOT_FOUND_MESSAGE = 'No path found';

function searchShortestPath(fromId, toId, mode=MODES.SHORTEST_TIME, noStairCase=true, noEscalator=false) {
  if (!graphCache.data) {
    graphCache.data = buildGraph();
  }
  const {
    data: { graph, nodesById, connectorsById, settings }
  } = graphCache;

  if (!graph) {
    throw new Error('No graph is found');
  }

  if (!nodesById) {
    throw new Error('nodesById not found');
  }

  if (!connectorsById) {
    throw new Error('connectorsById not found');
  }

  if (!graph[fromId]) {
    throw new Error(PATH_NOT_FOUND_MESSAGE);
  }

  const { prev, dist } = breadthFirstSearch(
    graph,
    fromId,
    ({ prevNodeId, nodeId, weight, isConnectorEdge }) => {
      const { tags, connectorId } = nodesById[nodeId];
      const { connectorId: prevConnectorId } = nodesById[prevNodeId];

      if (noEscalator && isConnectorEdge && tags && tags.escalator) {
        return { shouldSkip: true };
      }

      if (noStairCase && isConnectorEdge && tags && tags.stair) {
        return { shouldSkip: true };
      }

      if (
        mode === MODES.MIN_NO_OF_LIFTS &&
        connectorId &&
        connectorId === prevConnectorId &&
        !connectorsById[connectorId].ignoreMinLiftRestriction &&
        (tags.lift || tags.escalator || tags.crossBuildingConnector)
      ) {
        return { weight: MAX_WEIGHT };
      }

      if (mode === MODES.SHORTEST_DISTANCE && connectorId && connectorId === prevConnectorId) {
        return { weight: CONNECTOR_SMALLEST_WEIGHT };
      }

      return { weight };
    },
  );

  const pathNodeIds = [toId];
  let prevNodeId = toId;
  while (prev[prevNodeId]) {
    pathNodeIds.push(prev[prevNodeId]);
    prevNodeId = prev[prevNodeId];
  }

  if (prevNodeId !== fromId) {
    throw new Error(PATH_NOT_FOUND_MESSAGE);
  }

  const nodes = pathNodeIds.map(_id => realm.objectForPrimaryKey(config.db.nodes.name, _id))
  .map(o => toResponse(o, config.db.nodes.name));

  nodes.forEach(o => {
    delete o.polygonCoordinates;
    delete o.geoLocs;
    delete o.keywords;
    delete o.others;
  })

  const fullNodesById = keyBy(nodes, o => o._id);
  const data = pathNodeIds
    .map((nodeId, i) => {
      const nextNodeId = i + 1 >= pathNodeIds.length ? null : pathNodeIds[i + 1];
      const nextDist = !nextNodeId ? 0 : dist[nextNodeId];
      const node = fullNodesById[nodeId];
      const nextNode = !nextNodeId ? null : fullNodesById[nextNodeId];
      const isTravellingInLift =
        nextNode &&
        node.connectorId &&
        node.connectorId === nextNode.connectorId &&
        nodesById[nodeId].tags.lift;
      let distance = dist[nodeId] - nextDist;

      if (isTravellingInLift) {
        distance = mode === MODES.MIN_NO_OF_LIFTS ? 0 : distance * settings.minutesPerMeter;
      }

      return {
        ...transformNodeResponse(node),
        distance,
        unit: isTravellingInLift ? DISTANCE_UNIT.MINUTE : DISTANCE_UNIT.METER,
      };
    })
    .reverse();
  return { data };
}

export { searchShortestPath };

