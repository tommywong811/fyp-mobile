import Realm from 'realm';

class MetaModel extends Realm.Object {}
MetaModel.schema = {
    name: 'meta',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        version: 'string',
    }
}

export default MetaModel;