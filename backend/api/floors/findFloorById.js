'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findFloorById(id) {
    let result = Array.from(realm.objects(config.db.floors.name).filtered(`_id = '${id}'`))
    result = toResponse(result, config.db.floors.name);
    if(result.length === 0) throw new Error(`No floor with _id: ${id} is found`)
    return result[0];
}

export {findFloorById};