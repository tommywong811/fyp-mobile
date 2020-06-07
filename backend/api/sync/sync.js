'use strict'

import realm from "../../Realm/realm";
import config from "../../config";
import { string, object, array, number, boolean } from "yup";
import { updateTags } from "./updateTags";
import { updateBuildings} from "./updateBuildings";
import { updateFloors} from "./updateFloors";
import { updateNodes} from "./updateNodes";

function syncTags(payload) {
  var tags = []
  payload.forEach(function(item) {
    var tag = {
      _id: item._id,
      name: item.name,
      data: item.imageUrl !== undefined ? item.imageUrl.substring(item.imageUrl.lastIndexOf('/') + 1) : null,
      hasData: item.imageUrl !== undefined ? true : false ,
    }
    tags.push(tag)
  })
  updateTags(tags)
}

function syncBuildings(payload) {
  var buildings = payload
  updateBuildings(buildings)
}

function syncFloors(payload) {
  var floors = payload
  updateFloors(floors)
}

function syncNodes(payload) {
  var nodes = payload
  updateNodes(nodes)
}

export {
  syncTags,
  syncBuildings,
  syncFloors,
  syncNodes
};
