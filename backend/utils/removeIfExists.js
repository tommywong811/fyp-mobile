import RNFetchBlob from 'rn-fetch-blob';

async function removeIfExists(path) {
    if (await RNFetchBlob.fs.exists(path)) {
        await RNFetchBlob.fs.unlink(path);
    }
}

export default removeIfExists;
