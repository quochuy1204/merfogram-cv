import { ADMIN_TYPES } from "../actions/adminAction";
import { editData } from '../../utils/globalTypes'

const initialState = {
    all_users: [],
    manage_user: {
        open_modal: false,
        user_detail: {}
    },
    all_posts: [],
    all_reports: [],
    manage_report: {
        open_modal: false,
        report_detail: {}
    }
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_TYPES.MANAGE_USER:
            return {
                ...state,
                manage_user: {
                    open_modal: action.payload.open_modal,
                    user_detail: action.payload.user_detail
                }
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
        case ADMIN_TYPES.UPDATE_ALL_USERS:
            return {
                ...state,
                all_users: editData(state.all_users, action.payload.user._id, action.payload.user)
            }
        case ADMIN_TYPES.UPDATE_ALL_POSTS:
            return {
                ...state,
                all_posts: editData(state.all_posts, action.payload.post._id, action.payload.post)
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