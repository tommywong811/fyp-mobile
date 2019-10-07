import { string, object } from "yup";
import { findFloorById } from "./findFloorById";
import { findFloors } from "./findFloors";

const findFloorByIdSchema = object().shape({
    id: string().required()
})

function floors(payload={}) {
    if(findFloorByIdSchema.isValidSync(payload)) {
        let { id } = payload;
        return findFloorById(id);
    } else {
        return findFloors();
    }
}

export { floors }