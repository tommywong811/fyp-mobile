import RNFetchBlob from "rn-fetch-blob";
import { unzip } from "react-native-zip-archive";
import config from "../config";
import removeIfExists from "../utils/removeIfExists";
import validateDownloadFiles from "../utils/validateDownloadFiles";

/**
 * Download the remote database .zip file to local storage. Then unzip it in-place.
 * @param {function (written, total)} [progressHandler] A download progress handler.
 * @returns {Promise<string>} The full path of the extracted folder.
 */
async function downloadDatabase(progressHandler) {
    let { archiveFile, archiveExtracted, archiveExtractTarget } = config.download.dirs;
    let url = config.download.url.database;

    if (!progressHandler) {
        progressHandler = function () {};
    }

    // remove previous download files
    await Promise.all([
        removeIfExists(archiveFile),
        removeIfExists(archiveExtracted)
    ]);

    // download new file
    await RNFetchBlob.config({
        path: archiveFile
    })
    .fetch('GET', url, {
        // headers
    })
    .progress(progressHandler)
    .then(() => unzip(archiveFile, archiveExtractTarget));

    // validating downloaded files
    await validateDownloadFiles();

    return archiveExtracted;
}

export { downloadDatabase };
