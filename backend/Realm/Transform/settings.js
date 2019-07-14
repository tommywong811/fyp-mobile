function fromDump(obj) {
    const {
        _id,
        defaultPosition,
        mobileDefaultPosition,
        ...rests
    } = obj;
    return {
        ...rests,
        _id: _id.toString(),
        defaultFloor: defaultPosition.floor,
        defaultX: defaultPosition.x,
        defaultY: defaultPosition.y,
        defaultLevel: defaultPosition.level,
        mobileDefaultFloor: mobileDefaultPosition.floor,
        mobileDefaultX: mobileDefaultPosition.x,
        mobileDefaultY: mobileDefaultPosition.y,
        mobileDefaultLevel: mobileDefaultPosition.level,
    }
}

function toResponse(obj) {
    const {
        defaultFloor,
        defaultX,
        defaultY,
        defaultLevel,
        mobileDefaultFloor,
        mobileDefaultX,
        mobileDefaultY,
        mobileDefaultLevel,
        ...rests
    } = obj;
    return {
        ...rests,
        defaultPosition: {
            floor: defaultFloor,
            x: defaultX,
            y: defaultY,
            level: defaultLevel,
        },
        mobileDefaultPosition: {
            floor: mobileDefaultFloor,
            x: mobileDefaultX,
            y: mobileDefaultY,
            level: mobileDefaultLevel,
        }
    }
}

export default {
    fromDump,
    toResponse
}
