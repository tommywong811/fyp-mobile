import {api} from '../../../backend'

import {
    CHANGE_FLOOR,
    CHANGE_BUILDING,
    CHANGE_CURRX,
    CHANGE_CURRY,
    CHANGE_SUMX,
    CHANGE_SUMY,
    CHANGE_NODE,
    UPDATE_FLOOR_DATA,
    UPDATE_CURRENT_FLOOR,
    RENDER_LOADING_PAGE,
} from './actionList'

import { AsyncStorage } from "react-native";

let initialState = {
    data: api.floors().data,
    currentFloor: api.floors().data[0],
    currX: 0,
    currY: 0,
    sumX: 0,
    sumY: 0,
    suggestedNodes: [],
    currentNode: null,
    currentBuilding: null,
    renderLoadingPage: false,
}

function changeBuilding(data, payload, currentFloor){
    for(i = 0; i < data.length; i++){
        if(payload.buildingId === data[i].buildingId){
            return data[i];
        }
    }
    return currentFloor;
}

function changeFloor(data, payload, currentFloor){
    console.log(`${payload.buildingId} ${payload.floor}`);
    for(i = 0; i < data.length; i++){
        if(payload.buildingId === data[i].buildingId &&
            payload.floor === data[i]._id){
            return data[i];
        }
    }
    return currentFloor;
}

function changeNode(payload) {
    let result = null;
    if(payload.currentNode) {
        let floor = api.floors({id: payload.currentNode.floorId})
        result =  {
            currentNode: payload.currentNode,
            currentFloor: floor,
            currentBuilding: floor.buildingId
        }
    } else {
        let node = api.nodes({name: payload.name})['data'][0];
        let floor = api.floors({id: node.floorId});
        result = {
            currentNode: node,
            currentFloor: floor,
            currentBuilding: api.buildings({id: floor.buildingId}),
        }
    }
    
    (async () => {   // store the recent searched node to cache
        // cache format: {data: [...suggestions]}
        let cache = await AsyncStorage.getItem('suggestions');
        if (cache) {    // save the suggestion cache
            let cacheData = JSON.parse(cache).data;
            if (cacheData.length > 4) {
                cacheData.shift();
            }
            cacheData.unshift(result.currentNode);
            await AsyncStorage.setItem('suggestions', JSON.stringify({data: cacheData}));
        } else {
            await AsyncStorage.setItem('suggestions', JSON.stringify({data: [result.currentNode]}));
        }
    })();

    return result;

}

export default floorReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_FLOOR_DATA:
            return {
                ...state,
                data: action.payload.data
            };
        case UPDATE_CURRENT_FLOOR:
            return {
                ...state,
                currentFloor: action.payload.currentFloor
            };
        case CHANGE_BUILDING:
            return {
                ...state,
                currentFloor: changeBuilding(state.data, action.payload, state.currentFloor)
            };
        case CHANGE_FLOOR:
            return {
                ...state,
                currentFloor: changeFloor(state.data, action.payload, state.currentFloor)
            };
        case CHANGE_CURRX:
            return {
                ...state,
                currX: action.payload.currX
            };
        case CHANGE_CURRY:
            return {
                ...state,
                currY: action.payload.currY
            };
        case CHANGE_SUMX:
            return {
                ...state,
                sumX: action.payload.sumX
            };
        case CHANGE_SUMY:
            return {
                ...state,
                sumY: action.payload.sumY
            }
        case CHANGE_NODE:
            return {
                ...state,
                ...changeNode(action.payload)
            }

        case RENDER_LOADING_PAGE:
            return {
                ...state,
                'renderLoadingPage': action.payload,
            }
        default:
            return state;
    }
}
