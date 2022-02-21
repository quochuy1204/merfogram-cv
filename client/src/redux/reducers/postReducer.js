import { TYPES } from '../actions/postAction'

const initialState = {
    posts: [],
    result: 0,
    page: 4,
    editPost: {},
    openEditModal: false,
    sharePost: false
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.CREATE_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            }
        case TYPES.GET_POSTS:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result
            }
        case TYPES.EDIT_POST:
            return {
                ...state,
                editPost: action.payload
            }
        case TYPES.OPEN_EDIT_MODAL:
            return {
                ...state,
                openEditModal: action.payload
            }
        case TYPES.RELOAD_POST:
            const newPosts = state.posts.map(post => post._id === action.payload._id ? action.payload : post)
            return {
                ...state,
                posts: newPosts
            }
        case TYPES.RELOAD_LOAD_MORE_POSTS:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                page: action.payload.page
            }
        case TYPES.DELETE_POST:
            return {
                ...state,
                posts: [...state.posts.filter(item => item._id !== action.payload._id)]
            }
        case TYPES.SHARE_POST:
            return {
                ...state,
                sharePost: action.payload
            }
        default:
            return state;
    }
}

export default postReducer