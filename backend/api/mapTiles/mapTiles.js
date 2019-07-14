import { object, string, number } from "yup";

import { findMapTiles, findMapTilesPerFloor } from "./findMapTiles";


let schema = object().shape({
    floorId: string().required(),
    x: number().integer().required(),
    y: number().integer().required(),
    zoomLevel: number().integer().required()
});

function mapTiles(payload) {
    if (schema.isValidSync(payload)) {
        let {floorId, x, y, zoomLevel} = payload;
        return findMapTiles(floorId, x, y, zoomLevel);
    }
    else {
        throw new Error('Invalid payload');
    }
}

export { mapTiles };