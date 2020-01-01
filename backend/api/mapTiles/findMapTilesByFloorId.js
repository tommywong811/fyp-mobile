'use strict';

import realm from "../../Realm/realm";
import config from "../../config";

function findMapTilesByFloorId(floorId) {
    let result = realm.objects(config.db.mapTiles.name)
        .filtered(`floorId = "${floorId}"`)
        .sorted("lastUpdatedAt", true);

    if (!result) {
        throw new Error('MapTile Not Found With Given Floors');
    }
    return result;
}

export { findMapTilesByFloorId };