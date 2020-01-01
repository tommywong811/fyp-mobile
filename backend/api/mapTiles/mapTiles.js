import { object, string, number } from "yup";

import { findMapTiles } from "./findMapTiles";
import { findMapTilesByFloorId } from "./findMapTilesByFloorId";

let schema = object().shape({
    floorId: string().required(),
    x: number().integer().required(),
    y: number().integer().required(),
    zoomLevel: number().integer().required()
});

let findMapTilesByFloorIdSchema = object().shape({
    floorId: string().required(),
});



function mapTiles(payload) {
    if (schema.isValidSync(payload)) {
        let {floorId, x, y, zoomLevel} = payload;
        return findMapTiles(floorId, x, y, zoomLevel);
    } else if (findMapTilesByFloorIdSchema.isValidSync(payload)) {
        let {floorId} = payload;
        return findMapTilesByFloorId(floorId);
    } else {
        throw new Error('Invalid payload');
    }
}

export { mapTiles };