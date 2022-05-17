import { ADMIN_TYPES } from "../actions/adminAction";
import { editData } from '../../utils/globalTypes'

const initialState = {
    open_manage_user_modal: false,
    all_users: [],
    search_users: [],
    all_posts: [],
    search_posts: [],
    all_reports: [],
    manage_report: {
        open_modal: false,
        report_detail: {}
    }
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_TYPES.CHOOSE_USER:
            return {
                ...state,
                open_manage_user_modal: action.payload.open,
                manage_user: action.payload.user
            };
        case ADMIN_TYPES.ALL_USERS:
            return {
                ...state,
                all_users: action.payload.users
            }
        case ADMIN_TYPES.ALL_POSTS:
            return {
                ...state,
                all_posts: action.payload.posts
            }
        case ADMIN_TYPES.SEARCH_USERS:
            return {
                ...state,
                search_users: action.payload.users
            }
        case ADMIN_TYPES.SEARCH_POSTS:
            return {
                ...state,
                search_posts: action.payload.posts
            }
        case ADMIN_TYPES.UPDATE_ALL_USERS:
            return {
                ...state,
                all_users: editData(state.all_users, action.payload.user._id, action.payload.user)
            }
        case ADMIN_TYPES.UPDATE_SEARCH_USERS:
            return {
                ...state,
                search_users: editData(state.search_users, action.payload.user._id, action.payload.user)
            }
        case ADMIN_TYPES.UPDATE_ALL_POSTS:
            return {
                ...state,
                all_posts: editData(state.all_posts, action.payload.post._id, action.payload.post)
            }
        case ADMIN_TYPES.UPDATE_SEARCH_POSTS:
            return {
                ...state,
                search_posts: editData(state.search_posts, action.payload.post._id, action.payload.post)
            }
        case ADMIN_TYPES.ALL_REPORTS:
            return {
                ...state,
                all_reports: action.payload.reports
            }
        case ADMIN_TYPES.MANAGE_REPORT:
            return {
                ...state,
                manage_report: {
                    open_modal: action.payload.open_modal,
                    report_detail: action.payload.report_detail
                }
            }
        case ADMIN_TYPES.UPDATE_ALL_REPORTS:
            return {
                ...state,
                all_reports: editData(state.all_reports, action.payload.updatedReport._id, action.payload.updatedReport)
            }
        default:
            return state;
    }
}

export default adminReducer