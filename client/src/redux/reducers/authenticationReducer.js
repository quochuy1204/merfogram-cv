import { TYPES } from '../actions/authenticationAction'


const initialState = {}

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.AUTH: {
            return action.payload;
        }
        default:
            return state;
    }
}

export default authenticationReducer