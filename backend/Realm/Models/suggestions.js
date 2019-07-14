import Realm from 'realm';

class SuggestionsModel extends Realm.Object {}
SuggestionsModel.schema = {
    name: 'suggestions',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        type: 'string', // enum: ['new', 'wrong', 'bug', 'general'], if ('new' or 'wrong') then require ['coordinates', 'floorId']
        email: 'string?', // email
        name: 'string?',
        description: 'string',
        floorId: 'string?',
        coordinates: 'string?', // pattern: '^-?[0-9]+,-?[0-9]+$'
        createdAt: 'int',
        updatedAt: 'int',
        resolved: 'bool',
    }
}

export default SuggestionsModel;
