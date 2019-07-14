function fromDump(obj) {
    return {
        ...obj,
        _id: obj._id.toString()
    }
}

export default {
    fromDump
}
