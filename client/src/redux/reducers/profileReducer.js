import { TYPES } from "../actions/profileAction";

const initialState = {
    loading: false,
    users: [],
    user_posts: [],
    ids: [],
    change_password_modal: false
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case TYPES.GET_USER:
            return {
                // Return về tất cả các giá trị state của reducer profileReducer
                // và thay thế state.users = list users ban đầu và thêm vào 1 user mới chính là user có id = id params
                ...state,
                users: [...state.users, action.payload.user]
            }
        case TYPES.FOLLOW:
            const users = state.users.map(user => user._id === action.payload._id ? action.payload : user)
            return {
                ...state,
                users: users
            }
        case TYPES.UNFOLLOW:
            const users2 = state.users.map(user => user._id === action.payload._id ? action.payload : user)
            return {
                ...state,
                users: users2
            }
        case TYPES.GET_USER_ID:
            return {
                ...state,
                ids: [...state.ids, action.payload]
            }
        case TYPES.GET_USER_POSTS:
            return {
                ...state,
                user_posts: [...state.user_posts, action.payload]
            }
        case TYPES.UPDATE_USER_POSTS:
            return {
                ...state,
                user_posts: [...state.user_posts.map(item => item._id === action.payload._id ? action.payload : item)]
            }
        case TYPES.CHANGE_PASSWORD_MODAL:
            return {
                ...state,
                change_password_modal: action.payload
            }
        default:
            return state;
    }
}

export default profileReducer;