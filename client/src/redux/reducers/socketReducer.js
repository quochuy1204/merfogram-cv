import { GLOBALTYPES } from "../../utils/globalTypes";

const socketReducer = (state = [], action) => {
    switch (action.type) {
        case GLOBALTYPES.SOCKET:
            return action.payload;
        default:
            return state;
    }
}

export default socketReducer;