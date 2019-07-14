'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findSettings() {
    let result = realm.objects(config.db.settings.name).sorted("_id", true)[0];

    if (!result) {
        throw new Error('Settings not found');
    }

    result = toResponse(result, config.db.settings.name);

    return {
        data: result
    };
}

export {findSettings};