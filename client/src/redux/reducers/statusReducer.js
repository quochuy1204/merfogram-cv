import { TYPES } from '../actions/statusAction'

const statusReducer = (state = false, action) => {
    switch (action.type) {
        case TYPES.STATUS:
            return action.payload;
        default:
            return state;
    }
}

export default statusReducer;