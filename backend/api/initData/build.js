'use strict';

import keyBy from "lodash.keyby";
import config from "../../config";
import realm from "../../Realm/realm";
import { toResponse } from "../../Realm/Transform/transform";
import initDataCache from "./cache";

function build() {
  const buildings = realm.objects(config.db.buildings.name).map(o => toResponse(o, config.db.buildings.name));
  const floors = realm.objects(config.db.floors.name).map(o => toResponse(o, config.db.floors.name));
  const tags = realm.objects(config.db.tags.name).map(o => toResponse(o, config.db.tags.name));
  const settings = toResponse(realm.objects(config.db.settings.name).sorted("_id", true)[0], config.db.settings.name);

  initDataCache.data = {
    floors: keyBy(floors, o => o._id),
    buildingIds: buildings.map(o => o._id),
    buildings: keyBy(
      buildings.map(building => ({
        ...building,
        floorIds: floors
          .filter(floor => floor.buildingId === building._id)
          .sort((a, b) => a.rank - b.rank)
          .map(floor => floor._id),
      })),
      o => o._id,
    ),
    tags: keyBy(
      tags.map(({ hasData, data, ...tag }) => ({
        ...tag,
        imageUrl: hasData ? data : undefined,
      })),
      o => o._id,
    ),
    tagIds: tags.map(o => o._id),
    settings,
  };
}

export default build;

