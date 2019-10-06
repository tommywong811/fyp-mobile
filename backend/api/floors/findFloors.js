'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findFloors() {
    let results = realm.objects(config.db.floors.name);
    results = toResponse(Array.from(results), config.db.floors.name);
    return {
        data: results,
        meta: {
            count: results.length
        }
    };
}

export {findFloors};