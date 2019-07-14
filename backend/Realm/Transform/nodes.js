function fromDump(obj) {
    let r = Object.assign({}, obj);
    if (obj.image) {
        r.image = obj.image.toString();
    }
    if (obj.polygonCoordinates) {
        r.polygonCoordinates = JSON.stringify(obj.polygonCoordinates);
    }
    if (obj.geoLocs) {
        r.geoLocs = JSON.stringify(obj.geoLocs);
    }
    if (obj.others) {
        r.others = JSON.stringify(obj.others);
    }
    return r;
}

function toResponse(obj) {
    if (obj.polygonCoordinates) {
        obj.polygonCoordinates = JSON.parse(obj.polygonCoordinates);
    }
    if (obj.geoLocs) {
        obj.geoLocs = JSON.parse(obj.geoLocs);
    }
    if (obj.others) {
        obj.others = JSON.parse(obj.others);
    }
    if (obj.coordinates) {
        obj.coordinates = Array.from(obj.coordinates);
    }
    if (obj.tagIds) {
        obj.tagIds = Array.from(obj.tagIds);
    }
    if (obj.keywords) {
        obj.keywords = Array.from(obj.keywords);
    }
    return obj;
}

export default {
    fromDump,
    toResponse
}
