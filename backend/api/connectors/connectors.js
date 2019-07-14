import {findConnectorsById} from "./findConnectorsById";

function connectors(payload) {
    if (!payload.connectorId || typeof payload.connectorId !== 'string') {
        throw new Error('Invalid payload of connectors()');
    }
    return findConnectorsById(payload.connectorId);
}

export {connectors};