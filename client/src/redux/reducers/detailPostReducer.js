import { TYPES } from '../actions/postAction'

const detailPostReducer = (state = [], action) => {
    switch (action.type) {
        case TYPES.GET_POST_BY_ID:
            return [...state, action.payload]
        case TYPES.RELOAD_POST:
            const newPosts = state.map(post => post._id === action.payload._id ? action.payload : post)
            return [...newPosts]
        default:
            return state;
    }
}

export default detailPostReducer