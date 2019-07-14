'use strict';

import { INF } from "./constants";
import FastPriorityQueue from "fastpriorityqueue";

function breadthFirstSearch(graph, fromId, customCondition) {
  const dist = {};
  const prev = {};
  const priQueue = new FastPriorityQueue(([a], [b]) => a < b);

  Object.keys(graph).forEach(nodeId => {
    dist[nodeId] = INF;
  });

  priQueue.add([0, fromId]);

  while (!priQueue.isEmpty()) {
    const [weight, nodeId, prevNodeId] = priQueue.poll();
    if (weight > dist[nodeId]) {
      continue;
    }

    dist[nodeId] = weight;
    prev[nodeId] = prevNodeId;

    const neighbors = graph[nodeId];

    if (!neighbors) {
      throw new Error(`Graph is missing node ${nodeId}`);
    }

    neighbors.forEach(([neighborId, neighborWeight, isConnectorEdge]) => {
      const { weight: customWeight, shouldSkip } = customCondition({
        prevNodeId: nodeId,
        nodeId: neighborId,
        weight: neighborWeight,
        isConnectorEdge,
      });

      if (shouldSkip) {
        return;
      }

      const newWeight = dist[nodeId] + customWeight;
      if (newWeight < dist[neighborId]) {
        priQueue.add([newWeight, neighborId, nodeId]);
      }
    });
  }

  return { prev, dist };
}

export { breadthFirstSearch };
