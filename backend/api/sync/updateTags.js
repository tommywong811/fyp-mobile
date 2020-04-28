'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";


function updateTags(tags) {
  let db_tags = realm.objects('tags')
  realm.write(() => {
    realm.delete(db_tags)
    tags.forEach(function(item) {
      let tag = realm.create(config.db.tags.name, item)
    })
  })
  console.log('finished updating tags')
}

export { updateTags };
