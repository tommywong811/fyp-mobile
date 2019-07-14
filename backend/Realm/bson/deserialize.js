import RNFetchBlob from "rn-fetch-blob";
import BSONStream from "./bson-stream";
import realm from "../realm";
import mkdir from "../../utils/mkdirIfNotExists";
import { fromDump } from "../Transform/transform";

function b64ToBuffer(b64str) {
    return Buffer.from(b64str, 'base64');
}

/**
 * Deserialize an entire .bson file and stores documents to realm.
 * @param {string} path The full path of the .bson file to be deserialized.
 * @param {string} name The collection name in camelStyle.
 * @returns {Promise}
 */
async function deserialize(path, name) {
    if (!name) {
        name = path.split('/').pop().replace('.bson', '');
    }

    let savedir = RNFetchBlob.fs.dirs.DocumentDir + '/' + name;
    await mkdir(savedir);

    return new Promise((resolve, reject) => {
        let bs = new BSONStream();
        let promises = [];

        bs.on('data', (chunk) => {
            chunk = fromDump(chunk, name);
            promises.push(chunk);

            if (__DEV__ && promises.length % 1000 === 0) {
                console.log(`Has deserialized and upserted ${promises.length} data`);
            }
        });

        bs.on('finish', () => {
            Promise.all(promises)
                .then(docs => {
                    realm.write(() => {
                        docs.forEach(doc => {
                            realm.create(name, doc, true);
                        });
                    })
                })
                .then(() => resolve())
                .catch((err) => reject(err));
        });

        bs.on('error', err => reject(err));

        RNFetchBlob.fs.readStream(path, 'base64')
            .then(stream => {
                stream.open();
                stream.onData(chunk => bs.write(b64ToBuffer(chunk)));
                stream.onEnd(() => bs.end());
                stream.onError(err => reject(err));
            })
            .catch(err => reject(err));
    })
}

export default deserialize;