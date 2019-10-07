'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findBuildingById(id) {
    let result = Array.from(realm.objects(config.db.buildings.name).filtered(`_id = '${id}'`))
    result = toResponse(result, config.db.buildings.name);
    if(result.length === 0) throw new Error(`No building with _id: ${id} is found`)
    return result[0];
}

export {findBuildingById};