'use strict'

import { object, string, boolean, mixed } from 'yup';
import { searchNearestItem } from "./searchNearestItem";
import { searchShortestPath } from "./searchShortestPath"

const nearestItemSchema = object().shape({
    type: string().required(),
    startId: string(),
    startName: string(),
    sameFloor: boolean()
})

const shortestPathSchema = object().shape({
    fromId: string(),
    toId: string().required(),
    mode: mixed().oneOf(['SHORTEST_TIME', 'SHORTEST_DISTANCE', 'MIN_NO_OF_LIFTS']),
    noStairCase: boolean(),
    noEscalator: boolean()
})

function nearestItem(payload) {
    if (
        nearestItemSchema.isValidSync(payload) && 
        ((!!payload.startId && !payload.startName) || (!payload.startId && !!payload.startName))
    ) {
        let { startId, startName, type, sameFloor } = payload;
        return searchNearestItem(startName, startId, type, sameFloor);
    }
    else {
        throw new Error('Invalid payload');
    }
}

function shortestPath(payload) {
    if (shortestPathSchema.isValidSync(payload)) {
        let { fromId, toId, mode, noStairCase, noEscalator } = payload;
        return searchShortestPath(fromId, toId, mode, noStairCase, noEscalator);
    }
    else {
        throw new Error('Invalid payload');
    }
}

export {
    nearestItem,
    shortestPath
}