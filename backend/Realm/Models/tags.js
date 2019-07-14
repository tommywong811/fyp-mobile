import Realm from "realm";

class TagsModel extends Realm.Object {}
TagsModel.schema = {
    name: 'tags',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        name: 'string',
        data: 'string?', // path
        hasData: 'bool?',
    }
}

export default TagsModel;