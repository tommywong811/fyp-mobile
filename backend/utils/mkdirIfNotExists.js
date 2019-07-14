import RNFetchBlob from "rn-fetch-blob";

async function mkdirIfNotExists(path) {
    let exists = await RNFetchBlob.fs.exists(path);
    let isdir = await RNFetchBlob.fs.isDir(path);
    if (exists && !isdir) {
        throw new Error(`${path} exists and is NOT a directory`);
    }
    else if (!exists) {
        await RNFetchBlob.fs.mkdir(path);
    }
}

export default mkdirIfNotExists;