import { getAPIs } from '../../utils/fetchAPIs'

export const TYPES = {
    GET_POSTS_DISCOVER: 'GET_POSTS_DISCOVER',
    LOADING_DISCOVER: 'LOADING_DISCOVER',
    UPDATE_POSTS_DISCOVER: 'UPDATE_POSTS_DISCOVER'
}

export const getPostsDiscover = (token) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        dispatch({
            type: 'LOADING_DISCOVER',
            payload: true
        })

        const res = await getAPIs('posts_discover', token)

        dispatch({
            type: 'GET_POSTS_DISCOVER',
            payload: res.data
        })

        dispatch({
            type: 'LOADING_DISCOVER',
            payload: false
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