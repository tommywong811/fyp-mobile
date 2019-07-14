'use strict'

import { string, object, array, number, boolean } from "yup";
import { findNodeById } from "./findNodeById";
import { findNodesByKeyword } from "./findNodesByKeyword";
import { findNodesWithinBox } from "./findNodesWithinBox";
import { findNodeNearCoordinates } from "./findNodeNearCoordinates";

const findNodesByKeywordSchema = object().shape({
    name: string().required()
})

const findNodeByIdSchema = object().shape({
    id: string().required()
})

const findNodesWithinBoxSchema = object().shape({
    floorId: string().required(),
    boxCoordinates: array().of(number()).min(4).max(4).required(),
    includePoints: boolean()
})

const findNodeNearCoordinatesSchema = object().shape({
    floorId: string().required(),
    nearCoordinates: array().of(number()).min(2).max(2).required()
})

function nodes(payload) {
    if (findNodeByIdSchema.isValidSync(payload)) {
        let { id } = payload;
        return findNodeById(id);
    }
    else if (findNodesByKeywordSchema.isValidSync(payload)) {
        let { name } = payload;
        return findNodesByKeyword(name);
    }
    else if (findNodesWithinBoxSchema.isValidSync(payload)) {
        let { floorId, boxCoordinates, includePoints = false } = payload;
        return findNodesWithinBox(floorId, boxCoordinates, includePoints);
    }
    else {
        throw new Error('Invalid payload');
    }
}

function node(payload) {
    if (findNodeNearCoordinatesSchema.isValidSync(payload)) {
        let { floorId, nearCoordinates } = payload;
        return findNodeNearCoordinates(floorId, nearCoordinates);
    }
    else {
        throw new Error('Invalid payload');
    }
}

export {
    nodes,
    node
};
