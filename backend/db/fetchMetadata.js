import RNFetchBlob from "rn-fetch-blob";
import config from "../config";

async function fetchMetadata(progressHandler) {
    if (!progressHandler) {
        progressHandler = function () {};
    }

    const res = await RNFetchBlob.fetch('GET', config.download.url.metadata, {
        // headers
    }).progress(progressHandler);
    
    if (res.respInfo.status === 200) {
        return res.json();
    }
    throw new Error(`Bad HTTP response ${res.respInfo.status}: ${res.text()}`);
}

export { fetchMetadata };
