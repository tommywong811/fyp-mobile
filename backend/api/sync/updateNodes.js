'use strict';

import realm from "../../Realm/realm";
import config from "../../config";
import { toResponse } from "../../Realm/Transform/transform";


function updateNodes(nodes) {

  realm.write(() => {
    nodes.forEach((node) => {
      let db_nodes = realm.objects(config.db.nodes.name)
      .filtered(`floorId = "${node.floorId}"`)
      .filter(o => {
        var o_coordinates = [o.coordinates["0"], o.coordinates["1"]]
        return JSON.stringify(o_coordinates) == JSON.stringify(node.coordinates)
      })
      if(db_nodes.length == 1) {
        var db_node = db_nodes[0]
        var updatedNode = {}
        updatedNode._id = db_node._id
        updatedNode.coordinates = node.coordinates
        updatedNode.floorId = node.floorId
        updatedNode.tagIds = node.tagIds ? node.tagIds : []
        updatedNode.connectorId = node.connectorId ? node.connectorId : null
        updatedNode.name = node.name ? node.name : null
        updatedNode.keywords = node.keywords ? node.keywords : []
        updatedNode.image = db_node.image
        updatedNode.url = node.url ? node.url : null
        updatedNode.polygonCoordinates = node.geoLocs ? JSON.stringify(node.geoLocs.coordinates) : null
        updatedNode.geoLocs = node.geoLocs ? JSON.stringify(node.geoLocs) : null
        updatedNode.unsearchable = db_node.unsearchable
        updatedNode.others = db_node.others
        updatedNode.tagIdsKeyword = db_node.tagIdsKeyword
        updatedNode.keywordCSV = db_node.keywordCSV
        realm.delete(db_node)
        realm.create(config.db.nodes.name, updatedNode)
      }

    });
  })
}

export { updateNodes };
