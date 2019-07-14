import Realm from "realm";

class BuildingsModel extends Realm.Object {}
BuildingsModel.schema = {
    name: 'buildings',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        name: 'string',
    }
}

export default BuildingsModel;
