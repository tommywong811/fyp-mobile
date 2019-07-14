'use strict';

import config from "../../config";
import realm from "../../Realm/realm";
import { toResponse } from "../../Realm/Transform/transform";
import { breadthFirstSearch } from "../graph/breadthFirstSearch";
import buildGraph from "../graph/build";
import graphCache from "../graph/cache";
import { INF } from "../graph/constants";
import buildInitData from "../initData/build";
import initDataCache from "../initData/cache";
import { transformNodeResponse } from "../nodes/transformNodeResponse";
import { findNodeById } from "../nodes/utils/findNodeById";
import { findNodesByKeyword } from "../nodes/utils/findNodesByKeyword";

const NO_NEAREST_ITEM_FOUND_MESSAGE = 'No nearest item found';

function searchNearestItem(startName, startId, type, sameFloor=false) {
  if (!graphCache.data) {
    buildGraph();
  }
  const {
    data: { graph, nodesById, connectorsById }
  } = graphCache;
  console.log("graphCache");
  console.log(graphCache);
  console.log("=====");

  if (!initDataCache.data) {
    buildInitData();
  }
  const {
    data: { floors, buildingIds },
  } = initDataCache;
  console.log("initDataCache");
  console.log(initDataCache);
  console.log("=====");

  if (!graph) {
    throw new Error('No graph is found');
  }

  if (!nodesById) {
    throw new Error('nodesById not found');
  }

  if (!connectorsById) {
    throw new Error('connectorsById not found');
  }

  const startNodes = startName ? findNodesByKeyword(startName) : [findNodeById(startId)];
  startNodes.forEach(o => delete o.polygonCoordinates);

  // If there more than one result, sort it by the rank of buildings
  if (startNodes.length > 1) {
    startNodes.sort(
      (a, b) =>
        buildingIds.indexOf(floors[a.floorId].buildingId) -
        buildingIds.indexOf(floors[b.floorId].buildingId),
    );
  }

  const startNode = startNodes[0];

  if (!startNode) {
    throw new Error(NO_NEAREST_ITEM_FOUND_MESSAGE);
  }

  startId = startNode._id;

  if (!graph[startId]) {
    throw new Error(NO_NEAREST_ITEM_FOUND_MESSAGE);
  }

  const startNodeFloor = nodesById[startId].floorId;

  const { prev, dist } = breadthFirstSearch(graph, startId, ({ nodeId, weight }) => {
    if (sameFloor && nodesById[nodeId].floorId !== startNodeFloor) {
      return {
        shouldSkip: true,
      };
    }

    return { weight };
  });

  let minDist = INF;
  let nearestNodeId = null;

  Object.keys(prev).forEach(nodeId => {
    if (nodeId === startId) {
      return;
    }

    if (nodesById[nodeId].tags[type] && dist[nodeId] < minDist) {
      minDist = dist[nodeId];
      nearestNodeId = nodeId;
    }
  });

  if (!nearestNodeId) {
    throw new Error(NO_NEAREST_ITEM_FOUND_MESSAGE);
  }

  let nearestItem = realm.objectForPrimaryKey(config.db.nodes.name, nearestNodeId);
  nearestItem = toResponse(nearestItem, config.db.nodes.name);
  delete nearestItem.polygonCoordinates;

  return {
    data: {
      nearestItem: transformNodeResponse(nearestItem),
      from: transformNodeResponse(startNode),
    },
  };
}

export { searchNearestItem };
