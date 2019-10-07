import {api} from '../../../backend'
import { CHANGE_NODE } from './actionList'


let initialState = {
    data: api.nodes().data,
    currentNode: null
}

function changeNode(data, payload, currentNode) {
    if(payload.nodeId == currentNode._id) return currentNode
    return data.find(e=>e._id=payload.nodeId);
}

export default nodesReducer = (state = initialState, action) => {
    switch(action.type){
        case CHANGE_NODE:
            return {
                ...state,
                currentNode: changeNode(state.data, action.payload, state.currentNode)
            }
        default:
            return state;
    }
}
