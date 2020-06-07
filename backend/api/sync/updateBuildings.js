'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";


function updateBuildings(buildings) {
  let db_buildings = realm.objects(config.db.buildings.name)
  realm.write(() => {
    realm.delete(db_buildings)
    buildings.forEach(function(item) {
      if(item.name == "Academic Building") {

      } else {
        let building = realm.create(config.db.buildings.name, item)
      }
    })
  })
  console.log('finished updating buildings')
}

export { updateBuildings };
