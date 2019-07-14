import copy from "./copy";

import nodes from "./nodes";
import settings from "./settings";
import connectors from "./connectors";

import ObjectId from "./ObjectId";
import SaveImage from "./SaveImage";

/**
 * Transform a document to a realm serializable object, and stores images to fs.
 * @param {Object} obj A JSON object converted from BSON document.
 * @param {string} name The collection name in camelStyle.
 * @returns {Promise<Object>} The transformed object in a Promise.
 */
async function fromDump(obj, name) {
    switch(name) {
        case 'images':
        case 'mapImages':
        case 'mapTiles':
        case 'tags':
            return SaveImage.fromDump(obj, name);
        case 'nodes':
            return nodes.fromDump(obj);
        case 'settings':
            return settings.fromDump(obj);
        case 'suggestions':
        case 'meta':
            return ObjectId.fromDump(obj);
        default:
            return obj;
    }
}

function toResponse(obj, name) {
    if (Array.isArray(obj)) {
        return obj.map(o => toResponse(o, name));
    }
    let copied = copy(obj);
    switch(name) {
        case 'connectors': 
            return connectors.toResponse(copied);
        case 'nodes':
            return nodes.toResponse(copied);
        case 'settings':
            return settings.toResponse(copied);
        default:
            return copied;
    }
}

export {
    fromDump,
    toResponse
}