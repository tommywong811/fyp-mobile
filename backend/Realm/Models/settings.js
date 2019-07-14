import Realm from 'realm';

class SettingsModel extends Realm.Object {}
SettingsModel.schema = {
    name: 'settings',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        levelToScale: 'double[]',
        highestLevel: 'int',
        lowestLevel: 'int',
        minutesPerMeter: 'double',
        defaultFloor: 'string',
        defaultX: 'int',
        defaultY: 'int',
        defaultLevel: 'int',
        mobileDefaultFloor: 'string',
        mobileDefaultX: 'int',
        mobileDefaultY: 'int',
        mobileDefaultLevel: 'int',
    }
}

export default SettingsModel;
