import Realm from 'realm';

class FloorsModel extends Realm.Object {}
FloorsModel.schema = {
    name: 'floors',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        name: 'string?',
        buildingId: 'string',
        meterPerPixel: 'double',
        mapWidth: 'int',
        mapHeight: 'int',
        ratio: 'double',
        defaultX: 'int',
        defaultY: 'int',
        defaultLevel: 'int',
        mobileDefaultX: 'int',
        mobileDefaultY: 'int',
        mobileDefaultLevel: 'int',
        rank: 'double',
        startX: 'int',
        startY: 'int'
    }
}

export default FloorsModel;
