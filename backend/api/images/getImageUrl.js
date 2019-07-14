'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
// import {toResponse} from "../../Realm/Transform/transform";

function getImageUrl(id) {
  return realm.objectForPrimaryKey(config.db.images.name, id).data;
}

export { getImageUrl };
