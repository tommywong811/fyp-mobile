'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";


function updateFloors(floors) {
  let db_floors = realm.objects(config.db.floors.name)
  realm.write(() => {
    realm.delete(db_floors)
    floors.forEach(function(item) {
      let floor = realm.create(config.db.floors.name, item)
    })
  })
  console.log('finished updating floors')
}

export { updateFloors };
