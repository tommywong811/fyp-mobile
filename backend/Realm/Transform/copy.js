'use strict'

function copy(obj) {
    let result = {};
    for (const k of Object.keys(obj)) {
        result[k] = obj[k];
    }
    return result;
}

export default copy;