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

export default new Realm({
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