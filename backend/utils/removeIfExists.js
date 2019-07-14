import RNFetchBlob from 'rn-fetch-blob';

async function removeRecursive(path) {
    if (await RNFetchBlob.fs.isDir(path)) {
        const files = await RNFetchBlob.fs.ls(path);
        for (const file of files) {
            await removeRecursive(`${path}/${file}`);
        }
    }
    else {
        console.log(`Deleting ${path}`);
        await RNFetchBlob.fs.unlink(path);
    }
}

async function removeIfExists(path) {
    if (await RNFetchBlob.fs.exists(path)) {
        await removeRecursive(path);
    }
}

export default removeIfExists;
