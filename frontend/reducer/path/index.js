import {api} from '../../../backend'
import {UPDATE_PATH } from './actionList'
import {searchShortestPath} from '../../../backend/api/search/searchShortestPath'
import {transformNodeResponse} from '../../../backend/api/nodes/transformNodeResponse'

let initialState = {
    data: null,
    fromNodeId: null,
    toNodeId: null,
}

function serializedSearchPath(path) {
    return {
        ...path,
        data: path.data.map((nodes) => transformNodeResponse(nodes)),
    }
}

export default pathReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_PATH:
            return {
                ...state,
                data: serializedSearchPath(
                        searchShortestPath(
                            action.payload.fromId,
                            action.payload.toId,
                            action.payload.noStairCase,
                            action.payload.noEscalator
                        )
                    ).data,
            };
        default:
            return state;
    }
}
