import { TYPES } from '../actions/discoverAction'

const initialState = {
    posts: [],
    loading: false,
    result: 9,
    page: 4,
    firstLoad: false
}

const discoverReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.LOADING_DISCOVER:
            return {
                ...state,
                loading: action.payload
            }
        case TYPES.GET_POSTS_DISCOVER:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                firstLoad: true
            }
        case TYPES.UPDATE_POSTS_DISCOVER:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                page: state.page + 1
            }
        default:
            return state;
    }
}

export default discoverReducer;