import Realm from 'realm';

class MapTiles extends Realm.Object {}
MapTiles.schema = {
    name: 'mapTiles',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        floorId: 'string',
        x: 'int',
        y: 'int',
        zoomLevel: 'int',
        data: 'string', // path
        lastUpdatedAt: 'int',
    }
}

export default MapTiles;
