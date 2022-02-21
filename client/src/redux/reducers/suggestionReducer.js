import { TYPES } from '../actions/suggestionAction'

const initialState = {
    loading: false,
    users: []
}

const suggestionReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.LOADING_SUGGESTION:
            return {
                ...state,
                loading: action.payload
            }
        case TYPES.GET_USER_SUGGESTION:
            return {
                ...state,
                users: [...action.payload]
            }
        default:
            return state;
    }
}

export default suggestionReducer;