import { getAPIs, patchAPIs } from '../../utils/fetchAPIs'

import { TYPES } from '../actions/postAction'

export const ADMIN_TYPES = {
    SET_ADMIN: 'SET_ADMIN',

    ALL_USERS: 'ALL_USERS',
    ALL_POSTS: 'ALL_POSTS',
    ALL_REPORTS: 'ALL_REPORTS',

    UPDATE_ALL_USERS: 'UPDATE_ALL_USERS',
    MANAGE_USER: 'MANAGE_USER',

    UPDATE_ALL_POSTS: 'UPDATE_ALL_POSTS',

    MANAGE_REPORT: 'MANAGE_REPORT',
    UPDATE_ALL_REPORTS: 'UPDATE_ALL_REPORTS'
}

export const getAllUser = ({ authentication, search, status, role, sort }) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })


        const res = await getAPIs(`admin/getallusers?user_name[regex]=${search}&${role}&${status}&${sort}`, authentication.token)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: ADMIN_TYPES.ALL_USERS,
            payload: {
                users: res.data.users
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const getAllPosts = ({ authentication, searchByCreator, searchById, status, sort }) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await getAPIs(`admin/getallposts?_id=${searchById}&owner_username[regex]=${searchByCreator}&${status}&${sort}`, authentication.token)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: ADMIN_TYPES.ALL_POSTS,
            payload: {
                posts: res.data.posts
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const blockUser = ({ token, user }) => async (dispatch) => {

    // Check if the user exist or not 
    if (!user._id) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose a user."
            }
        })
    }

    // Check if the token exist or not
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Token invalid!"
            }
        })
    }
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await patchAPIs(`admin/blockuser/${user._id}`, null, token)

        let blockedUser = {
            ...res.data.user,
            postsLength: user.postsLength
        }

        dispatch({
            type: ADMIN_TYPES.MANAGE_USER,
            payload: {
                open_modal: true,
                user_detail: blockedUser
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_USERS,
            payload: {
                user: blockedUser
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: "Blocked user!"
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const unblockUser = ({ token, user }) => async (dispatch) => {
    // Check if the user exist or not 
    if (!user._id) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose a user."
            }
        })
    }

    // Check if the token exist or not
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Token invalid!"
            }
        })
    }
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await patchAPIs(`admin/unblockuser/${user._id}`, null, token)

        let unblockUser = {
            ...res.data.user,
            postsLength: user.postsLength
        }

        dispatch({
            type: ADMIN_TYPES.MANAGE_USER,
            payload: {
                open_modal: true,
                user_detail: unblockUser
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_USERS,
            payload: {
                user: unblockUser
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: "Unblock user!"
            }
        })

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const blockPostAdmin = ({ post, authentication }) => async (dispatch) => {
    try {
        await patchAPIs(`admin/blockpost/${post._id}`, null, authentication.token)

        const newPost = { ...post, isDeleted: true }

        dispatch({
            type: TYPES.RELOAD_POST,
            payload: newPost
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_POSTS,
            payload: {
                post: newPost
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_SEARCH_POSTS,
            payload: {
                post: newPost
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const unblockPostAdmin = ({ post, authentication }) => async (dispatch) => {
    try {
        await patchAPIs(`admin/unblockpost/${post._id}`, null, authentication.token)

        const newPost = { ...post, isDeleted: false }

        dispatch({
            type: TYPES.RELOAD_POST,
            payload: newPost
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_POSTS,
            payload: {
                post: newPost
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_SEARCH_POSTS,
            payload: {
                post: newPost
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

// Quoc Huy Add new Action Date 09/05/2022
export const getReports = ({ authentication, status, search, sort }) => async (dispatch) => {
    try {
        // dispatch({
        //     type: 'ALERT',
        //     payload: {
        //         loading: true
        //     }
        // })

        const res = await getAPIs(`admin/get_reports?_id=${search}&${status}&${sort}`, authentication.token)

        // dispatch({
        //     type: 'ALERT',
        //     payload: {
        //         loading: false
        //     }
        // })

        dispatch({
            type: ADMIN_TYPES.ALL_REPORTS,
            payload: {
                reports: res.data.reports
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}
// End Work of Date 09/05/2022

// Quoc Huy Add new Action Date 11/05/22

// Function to get report detail when admin choose a report and click on the Show Detail Report button
export const getReportDetail = ({ report, token }) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // send get request to server to get all detailed information about specification report
        const res = await getAPIs(`admin/get_report_detail/${report._id}`, token)

        // let similarReports = res.data.relatedReports.filter(item => item._id !== report._id)

        // console.log(similarReports)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        // Once the request successful, dispatch an action MANAGE_REPORT to Reducer 
        // to update the report_detail and open_modal state
        dispatch({
            type: ADMIN_TYPES.MANAGE_REPORT,
            payload: {
                open_modal: true,
                report_detail: res.data.reportDetail
            }
        })

    } catch (error) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

// Function to handle checkedReport onclick button
// When admin click on the Checked Report button this function will be called
export const checkedReport = ({ report, token }) => async (dispatch) => {

    // Check if the user's token exist or not
    // If the token doesn't exist then dispatch the ALERT action
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: 'Please login now.'
            }
        })
    }

    // Check if the admin already chose the report or not
    // If the admin doesn't choose any report then dispatch the ALERT action
    if (!report) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose the report."
            }
        })
    }

    // Check the report status
    // If the report's status = 1 this mean the report is already checked
    // so return the dispatch ALERT action
    if (report.status === 1) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: 'This report are already checked.'
            }
        })
    }

    try {

        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Send the patch request to server to update report status 
        const res = await patchAPIs(`admin/checked_report/${report._id}`, null, token)

        // Clone all information about the target report and change the status variable to 1
        // This updatedReport contains the population information of target_id and reporter_id
        const updatedReport = { ...report, status: 1 }

        // Dispatch action MANAGE_REPORT to update report_detail state 
        // for Manage Report Modal to display the updated information of the report
        dispatch({
            type: ADMIN_TYPES.MANAGE_REPORT,
            payload: {
                open_modal: true,
                report_detail: updatedReport
            }
        })

        // Dispatch the action UPDATE_ALL_REPORTS to update the all_reports state 
        // to display the updated information of the report into the Reports List Table
        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_REPORTS,
            payload: {
                updatedReport: res.data.updatedReport
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.success
            }
        })
    } catch (error) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}
// End Work for Date 11/05/22

// Quoc Huy Add new Action Date 12/05/22

// Action to unchecked report when admin click on the Uncheck Report button
export const uncheckedReport = ({ report, token }) => async (dispatch) => {

    // Check if the user's token exist or not
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please login now."
            }
        })
    }

    // Check if the admin chose report or the report is exist or not
    if (!report) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose a report and try again."
            }
        })
    }

    // Check if the report status = 0 or not
    // If the status = 0 it mean the report are already unchecked then return dispatch an error
    if (report.status === 0) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "This report are already unchecked. Please choose another report and try it again."
            }
        })
    }

    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Send the Patch Request to server to update the status value of report to 0
        const res = await patchAPIs(`admin/unchecked_report/${report._id}`, null, token)

        // Clone the report information and change the status value to 0
        let updatedReport = { ...report, status: 0 }

        // Dispatch MANAGE_REPORT action to Reducer to update the report_detail state
        // to Manage Report Modal component to display the updated report's information
        dispatch({
            type: ADMIN_TYPES.MANAGE_REPORT,
            payload: {
                open_modal: true,
                report_detail: updatedReport
            }
        })

        // Dispatch UPDATE_ALL_REPORTS action to Reducer to update all_reports state
        // for Manage Report component to render the updated report's information
        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_REPORTS,
            payload: {
                updatedReport: res.data.updatedReport
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.success
            }
        })

    } catch (error) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}
// End Work for Date 12/05/22

// Quoc Huy Add new Action Date 13/05/22
export const blockPostOnReport = ({ report, token }) => async (dispatch) => {

    // Check if the report exist or not
    if (!report) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose a report and try it again."
            }
        })
    }

    // Check if the target post's ID exist or not
    if (!report.target_id._id) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Post ID does not valid."
            }
        })
    }

    // Check if the token exist or not
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Token doesn not valid."
            }
        })
    }

    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Send the Patch Request to server to update the isDeleted state of post belong to post's ID
        const res = await patchAPIs(`admin/blockpost/${report.target_id._id}`, null, token)

        // Clone all information of report just change the isDeleted value of target post to true
        let updatedReport = { ...report, target_id: { ...report.target_id, isDeleted: true } }

        // Dispatch an action MANAGE_REPORT to Reducer to update the report_detail state
        // for ManageReportModal component to display the updated report information
        dispatch({
            type: ADMIN_TYPES.MANAGE_REPORT,
            payload: {
                open_modal: true,
                report_detail: updatedReport
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.success
            }
        })
    } catch (error) {
        return dispatch({
            type: "ALERT",
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const unblockPostOnReport = ({ report, token }) => async (dispatch) => {
    // Check if the report exist or not
    if (!report) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose a report and try it again."
            }
        })
    }

    // Check if the target post's ID exist or not
    if (!report.target_id._id) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Post ID does not valid."
            }
        })
    }

    // Check if the token exist or not
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Token doesn not valid."
            }
        })
    }

    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Send the Patch Request to server to update the isDeleted state of post belong to post's ID
        const res = await patchAPIs(`admin/unblockpost/${report.target_id._id}`, null, token)

        // Clone all information of report just change the isDeleted value of target post to true
        let updatedReport = { ...report, target_id: { ...report.target_id, isDeleted: false } }

        // Dispatch an action MANAGE_REPORT to Reducer to update the report_detail state
        // for ManageReportModal component to display the updated report information
        dispatch({
            type: ADMIN_TYPES.MANAGE_REPORT,
            payload: {
                open_modal: true,
                report_detail: updatedReport
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.success
            }
        })
    } catch (error) {
        return dispatch({
            type: "ALERT",
            payload: {
                error: error.response.data.message
            }
        })
    }
}
// End Work for Date 13/05/22

// Quoc Huy Add new Action Date 19/05/2022

// Function to get all of the information of user that admin clicked on
export const getUserDetail = ({ user, token }) => async (dispatch) => {
    // Check if admin choose the user or not
    // if not return the alert
    if (!user._id) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please choose a user."
            }
        })
    }

    // Check if the access token exist or not, if not return the alert
    if (!token) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Access token invalid."
            }
        })
    }

    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const userPosts = await getAPIs(`admin/getposts/${user._id}`, token)

        let userDetail = {
            ...user,
            postsLength: userPosts.data.posts.length
        }

        dispatch({
            type: ADMIN_TYPES.MANAGE_USER,
            payload: {
                open_modal: true,
                user_detail: userDetail
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}
// End Work for Date 19/05/2022