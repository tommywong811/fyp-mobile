'use strict';

import realm from "../../Realm/realm";
import config from "../../config";

function updateMeta(payload) {
    let result = realm.objects(config.db.meta.name).sorted("_id", true)[0];
    var newRecord;

    realm.write(() => {
      if (!result) {
        newRecord = {
          _id: payload._id,
          version: payload.version
        }
        realm.create(config.db.meta.name, newRecord)
      } else {
        newRecord = {
          _id: result._id,
          version: payload.version
        }
        realm.create(config.db.meta.name, newRecord, 'modified')
      }
      console.log("map version updated: "+JSON.stringify(newRecord))
    })
}

export {updateMeta};
