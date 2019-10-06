import Realm from 'realm';

class EdgesModel extends Realm.Object {}
EdgesModel.schema = {
    name: 'edges',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        fromNodeId: 'string',
        toNodeId: 'string',
        weightType: 'string', // enum: ['nodeDistance', 'max', 'number']
        weight: 'double?',
        floorId: {
            type: 'string',
            indexed: true,
        },
    }
}

export default EdgesModel;
