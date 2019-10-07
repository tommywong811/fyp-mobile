import { string, object } from "yup";
import { findBuildings } from "./findBuildings";
import { findBuildingById } from "./findBuildingById";

const findBuildingByIdSchema = object().shape({
    id: string().required()
})

function buildings(payload={}) {
    if(findBuildingByIdSchema.isValidSync(payload)) {
        let { id } = payload;
        return findBuildingById(id);
    } else {
        return findBuildings();
    }
}

export { buildings }