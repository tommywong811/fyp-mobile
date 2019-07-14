'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
// import {toResponse} from "../../Realm/Transform/transform";

function findMapTiles(floorId, x, y, zoomLevel) {
    let result = realm.objects(config.db.mapTiles.name)
        .filtered(`floorId = "${floorId}" AND x = ${x} AND y = ${y} AND zoomLevel = ${zoomLevel}`)
        .sorted("lastUpdatedAt", true)[0];

    if (!result) {
        throw new Error('Image not found');
    }

    if (!result.data) {
        throw new Error('Unknown image file');
    }

    return result.data;
}

export { findMapTiles };