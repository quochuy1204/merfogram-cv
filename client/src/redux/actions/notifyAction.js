import { getAPIs, postAPIs, deleteAPIs, patchAPIs } from '../../utils/fetchAPIs'

export const NOTIFY_TYPES = {
    GET_NOTIFIES: 'GET_NOTIFIES',
    CREATE_NOTIFY: 'CREATE_NOTIFY',
    DELETE_NOTIFY: 'DELETE_NOTIFY',
    UPDATE_NOTIFY: 'UPDATE_NOTIFY'
}

export const getNotifies = (token) => async (dispatch) => {
    try {
        const res = await getAPIs('notifies', token)

        dispatch({
            type: 'GET_NOTIFIES',
            payload: res.data.notifies
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

export const createNotify = ({ authentication, msg, socket }) => async (dispatch) => {
    try {
        // Gọi request post một notify xuống server
        const res = await postAPIs('notify', msg, authentication.token)

        // Gửi emit request tới server socket 
        socket.emit('createNotify', {
            ...res.data.notify,
            user: {
                user_name: authentication.user.user_name,
                photo: authentication.user.photo
            }
        })

        console.log(msg)
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const deleteNotify = ({ authentication, msg, socket }) => async (dispatch) => {
    try {
        const res = await deleteAPIs(`notify/${msg.recognize_id}?url=${msg.url}&recipents=${msg.recipents}`, authentication.token)

        socket.emit('deleteNotify', res.data.notify)

        console.log(msg)
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const isReadNotify = ({ noti, authentication }) => async (dispatch) => {
    dispatch({
        type: 'UPDATE_NOTIFY',
        payload: {
            ...noti, isRead: true
        }
    })

    try {
        await patchAPIs(`isReadNotify/${noti._id}`, null, authentication.token)
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const markReadAll = ({ authentication, notRead, notify }) => async (dispatch) => {
    notRead.forEach(item => {
        dispatch({
            type: NOTIFY_TYPES.UPDATE_NOTIFY,
            payload: {
                ...item,
                isRead: true
            }
        })
    })

    try {
        notRead.forEach((item) => {
            patchAPIs(`markReadAll/${item._id}`, null, authentication.token)
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