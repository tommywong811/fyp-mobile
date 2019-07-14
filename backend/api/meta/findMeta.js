'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findMeta() {
    let result = realm.objects(config.db.meta.name).sorted("_id", true)[0];

    if (!result) {
        throw new Error('No meta found');
    }

    result = toResponse(result, config.db.meta.name);

    return {
        data: result
    };
}

export {findMeta};