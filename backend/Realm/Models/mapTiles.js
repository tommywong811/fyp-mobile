import Realm from 'realm';

class MapTiles extends Realm.Object {}
MapTiles.schema = {
    name: 'mapTiles',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        floorId: {
            type: 'string',
            indexed: true,
        },
        x: {
            type: 'int',
            indexed: true,
        },
        y: {
            type: 'int',
            indexed: true,
        },
        zoomLevel: {
            type: 'int',
            indexed: true,
        },
        data: 'string', // path
        lastUpdatedAt: 'int',
    }
}

export default MapTiles;
