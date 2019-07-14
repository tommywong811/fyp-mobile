import Realm from "realm";

class ConnectorsModel extends Realm.Object {}
ConnectorsModel.schema = {
    name: 'connectors',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        floorIds: 'string[]',
        weight: 'double?',
        tagIds: 'string?[]',
        ignoreMinLiftRestriction: 'bool?',
    }
}

export default ConnectorsModel;
