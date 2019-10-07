import {api} from '../../../backend'
import { FIND_NODE } from './actionList'


let initialState = {
    data: api.nodes().data,
    currentNode: null
}

function findNode(payload) {
    return api.nodes({name: payload.name})['data'][0]
}

export default nodesReducer = (state = initialState, action) => {
    switch(action.type){
        case FIND_NODE:
            return {
                ...state,
                currentNode: findNode(action.payload)
            }
        default:
            return state;
    }
}
