import Realm from 'realm';
import BuildingsModel from "./Models/buildings";
import ConnectorsModel from './Models/connectors';
import EdgesModel from "./Models/edges";
import FloorsModel from "./Models/floors";
import ImagesModel from "./Models/images";
// import MapImagesModel from "./Models/mapImages";
import MapTilesModel from "./Models/mapTiles";
import MetaModel from "./Models/meta";
import NodesModel from "./Models/nodes";
import SettingsModel from "./Models/settings";
// import SuggestionsModel from "./Models/suggestions";
import TagsModel from "./Models/tags";
const data = require('../../frontend/asset/data.json')

let realm = new Realm({
    schema: [
        BuildingsModel,
        ConnectorsModel,
        EdgesModel,
        FloorsModel,
        ImagesModel,
        // MapImagesModel,
        MapTilesModel,
        MetaModel,
        NodesModel,
        SettingsModel,
        // SuggestionsModel,
        TagsModel
    ]
})

export default realm

export async function createDB(){
    try {
        console.log("Creating DB");
        console.log("db path:" + realm.path);
        let db_names = Object.keys(data)
        realm.write(() => {
            for (let name in db_names) {
                data[db_names[name]].forEach((doc, index)=>{
                    if(db_names[name] === 'nodes') {
                        doc['tagIdsKeyword'] = doc['tagIds'].join(',');
                        doc['keywordCSV'] = doc['keywords'].join(',');
                    }
                    realm.create(db_names[name], doc, true)
                })
            }
        });
    } catch (error) {
        console.log(error)
        console.log("Error on creation");
    }
};