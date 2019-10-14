import {api} from '../../../backend'
import { FIND_NODE, UPDATE_NODE_DATA } from './actionList'


let initialState = {
    data: api.nodes().data,
    currentNode: null
}

function findNode(payload) {
    return api.nodes({name: payload.name})['data'][0]
}

export default nodesReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_NODE_DATA:
            return {
                ...state,
                data: action.payload.data
            };
        case FIND_NODE:
            return {
                ...state,
                currentNode: findNode(action.payload)
            }
        default:
            return state;
    }
}
