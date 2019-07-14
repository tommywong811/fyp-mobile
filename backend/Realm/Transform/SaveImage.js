import RNFetchBlob from 'rn-fetch-blob';

async function fromDump(obj, name) {
    let _id = obj._id.toString();
    if (!obj.data) {
        return {
            ...obj,
            _id
        };
    }
    
    let savepath = `${RNFetchBlob.fs.dirs.DocumentDir}/${name}/${_id}.${name === 'images' ? 'jpg' : 'png'}`;
    await RNFetchBlob.fs.writeFile(savepath, obj.data.toString('base64'), 'base64');
    return {
        ...obj, 
        _id,
        data: savepath
    };
}

export default {
    fromDump
}
