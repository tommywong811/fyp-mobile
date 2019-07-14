import Realm from 'realm';

class MapImages extends Realm.Object {}
MapImages.schema = {
    name: 'mapImages',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        floorId: 'string',
        data: 'string', // path
        lastUpdatedAt: 'int'
    }
}

export default MapImages;
