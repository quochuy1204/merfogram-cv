import { getAPIs } from '../../utils/fetchAPIs'

export const TYPES = {
    LOADING_SUGGESTION: 'LOADING_SUGGESTION',
    GET_USER_SUGGESTION: 'GET_USER_SUGGESTION'
}

export const getUserSuggestion = (token) => async (dispatch) => {
    try {
        dispatch({
            type: 'LOADING_SUGGESTION',
            payload: true
        })

        const res = await getAPIs('suggestionUser', token)

        dispatch({
            type: 'GET_USER_SUGGESTION',
            payload: res.data.users.filter(user => user.isBlocked === 0)
        })

        dispatch({
            type: 'LOADING_SUGGESTION',
            payload: false
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