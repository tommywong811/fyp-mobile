import Realm from 'realm';

class NodesModel extends Realm.Object {}
NodesModel.schema = {
    name: 'nodes',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        coordinates: 'int?[]', // int[2]
        floorId: 'string',
        tagIds: 'string?[]',
        connectorId: 'string?',
        name: {
            type: 'string',
            indexed: true,
            optional: true,
        },
        keywords: 'string?[]',
        image: 'string?', // ObjectId
        url: 'string?',
        polygonCoordinates: 'string?', // int[2][], stringified
        geoLocs: 'string?', // multipolygon geoJSON, stringified
        unsearchable: 'bool?',
        others: 'string?', // arbitrary object, stringified
    }
}

export default NodesModel;