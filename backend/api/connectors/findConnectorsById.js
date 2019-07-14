'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findConnectorsById(connectorId) {
    let result = realm.objectForPrimaryKey(config.db.connectors.name, connectorId);
    result = toResponse(result, config.db.connectors.name);

    if (!result) {
        throw new Error('Connector not found');
    }

    delete result.ignoreMinLiftRestriction;

    return {
        data: result
    }
}

export { findConnectorsById };