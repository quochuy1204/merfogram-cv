import { getAPIs, patchAPIs } from '../../utils/fetchAPIs'

import { TYPES } from '../actions/postAction'

export const ADMIN_TYPES = {
    SET_ADMIN: 'SET_ADMIN',
    ALL_USERS: 'ALL_USERS',
    ALL_POSTS: 'ALL_POSTS',
    SEARCH_USERS: 'SEARCH_USERS',
    CHOOSE_USER: 'CHOOSE_USER',
    UPDATE_ALL_USERS: 'UPDATE_ALL_USERS',
    UPDATE_SEARCH_USERS: 'UPDATE_SEARCH_USERS',
    SEARCH_POSTS: 'SEARCH_POSTS',
    UPDATE_ALL_POSTS: 'UPDATE_ALL_POSTS',
    UPDATE_SEARCH_POSTS: 'UPDATE_SEARCH_POSTS',
}

export const getAllUser = ({ authentication }) => async (dispatch) => {
    try {
        const res = await getAPIs('admin/getallusers', authentication.token)

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

export const getAllPosts = ({ authentication }) => async (dispatch) => {
    try {
        const res = await getAPIs('admin/getallposts', authentication.token)


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


export const searchUser = ({ authentication, search }) => async (dispatch) => {
    try {
        const res = await getAPIs(`admin/searchuser?user_name=${search}`, authentication.token)

        dispatch({
            type: ADMIN_TYPES.SEARCH_USERS,
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

export const blockUser = ({ authentication, user }) => async (dispatch) => {
    try {
        const res = await patchAPIs(`admin/blockuser/${user._id}`, null, authentication.token)

        dispatch({
            type: ADMIN_TYPES.CHOOSE_USER,
            payload: {
                open: true,
                user: res.data.user
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_USERS,
            payload: {
                user: res.data.user
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_SEARCH_USERS,
            payload: {
                user: res.data.user
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

export const unblockUser = ({ authentication, user }) => async (dispatch) => {
    try {
        const res = await patchAPIs(`admin/unblockuser/${user._id}`, null, authentication.token)

        dispatch({
            type: ADMIN_TYPES.CHOOSE_USER,
            payload: {
                open: true,
                user: res.data.user
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_ALL_USERS,
            payload: {
                user: res.data.user
            }
        })

        dispatch({
            type: ADMIN_TYPES.UPDATE_SEARCH_USERS,
            payload: {
                user: res.data.user
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

export const searchByPostOwner = ({ authentication, searchUsername }) => async (dispatch) => {
    try {
        const res = await getAPIs(`admin/searchpost?username=${searchUsername}`, authentication.token)

        dispatch({
            type: ADMIN_TYPES.SEARCH_POSTS,
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
