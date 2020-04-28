'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";


function updateNodes(nodes) {
  let db_nodes = realm.objects(config.db.nodes.name)
  realm.write(() => {
    realm.delete(db_nodes)
    nodes.forEach(function(item) {
      let building = realm.create(config.db.nodes.name, item)
    })
  })
}

export { updateNodes };
