import RNFetchBlob from "rn-fetch-blob";
import config from "../config";
import deserialize from "../Realm/bson/deserialize";
import validateDownloadFiles from "../utils/validateDownloadFiles";

async function loadDatabase(progressHandler) {
    progressHandler = progressHandler || (() => null);

    await validateDownloadFiles();

    const dbList = Object.values(config.db);

    const total = dbList.length;
    progressHandler(0, total);
    let i = 1;

    for (const {name, file} of dbList) {
        __DEV__ && console.log(`Loading database ${name}`);
        const fullpath = config.download.dirs.archiveExtracted + '/' + file;
        await deserialize(fullpath, name);
        progressHandler(i, total);
        i += 1;
    }
}

export { loadDatabase };
