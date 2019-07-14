'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import {toResponse} from "../../Realm/Transform/transform";

function findTags() {
    let results = realm.objects(config.db.tags.name);
    results = toResponse(Array.from(results), config.db.tags.name);

    return {
        data: results.map(({ hasData, data, ...item }) => ({
            ...item,
            imageUrl: hasData ? data : undefined
        })),
        meta: {
            count: results.length
        }
    };
}

export {findTags};