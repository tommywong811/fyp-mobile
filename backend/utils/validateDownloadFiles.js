import RNFetchBlob from "rn-fetch-blob";
import config from "../config";

async function validateDownloadFiles() {
    if (!(await RNFetchBlob.fs.isDir(config.download.dirs.archiveExtracted))) {
        throw new Error(`Expected ${config.download.dirs.archiveExtracted} to be a directory on loading database.`);
    }
    __DEV__ && console.log(`Checking db folder... OK`);

    const dbList = Object.values(config.db);
    for (const {file} of dbList) {
        const path = `${config.download.dirs.archiveExtracted}/${file}`
        if (
            !(await RNFetchBlob.fs.exists(path)) ||
            (await RNFetchBlob.fs.isDir(path))
        ) {
            throw new Error(`Expected ${path} to be a file on loading database.`);
        }
    }

    __DEV__ && console.log(`Checking db files... OK`);
}

export default validateDownloadFiles;