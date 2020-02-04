import {api} from '../../../backend'
import {UPDATE_PATH } from './actionList'
import {searchShortestPath} from '../../../backend/api/search/searchShortestPath'
import {transformNodeResponse} from '../../../backend/api/nodes/transformNodeResponse'

let initialState = {
    data: null,
    fromNodeId: null,
    toNodeId: null,
    floors: [],
}

function serializedSearchPath(path) {
    return {
        ...path,
        floors: [...new Set(path.data.map((nodes) => nodes.floorId))], // for the floor included in path in order 
        data: path.data.map((nodes) => ({...nodes, centerCoordinates: [nodes.coordinates[0], nodes.coordinates[1]]})), // centerCoordinates = coordinates
    }
}

export default pathReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_PATH:
            const shortest_path = serializedSearchPath(
                searchShortestPath(
                    action.payload.fromId,
                    action.payload.toId,
                    action.payload.noStairCase,
                    action.payload.noEscalator
                )
            );
            return {
                ...state,
                data: shortest_path.data,
                floors: shortest_path.floors,
            };
        default:
            return state;
    }
}
