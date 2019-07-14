'use strict'

function toResponse(obj) {
    if (obj.floorIds) {
        obj.floorIds = Array.from(obj.floorIds);
    }
    if (obj.tagIds) {
        obj.tagIds = Array.from(obj.tagIds);
    }
    return obj;
}

export default {
    toResponse
};