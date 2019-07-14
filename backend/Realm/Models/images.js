import Realm from 'realm';

class ImagesModel extends Realm.Object {}
ImagesModel.schema = {
    name: 'images',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        data: 'string', // path
        lastUpdatedAt: 'int',
    }
}

export default ImagesModel;
