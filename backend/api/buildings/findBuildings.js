'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findBuildings() {
    let results = realm.objects(config.db.buildings.name);
    results = toResponse(Array.from(results), config.db.buildings.name);

    return {
        data: results,
        meta: {
            count: results.length
        }
    };
}

export {findBuildings};