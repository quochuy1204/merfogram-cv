import { postAPIs, getAPIs, deleteAPIs } from '../../utils/fetchAPIs'
import { deleteData } from '../../utils/globalTypes'

export const MESSAGE_TYPES = {
    ADD_CHAT: 'ADD_CHAT',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGE: 'DELETE_MESSAGE',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION'
}

// export const addChat = ({ user, message }) => async (dispatch) => {
//     if (message.users.every(item => item._id !== user._id)) {
//         dispatch({
//             type: MESSAGE_TYPES.ADD_CHAT,
//             payload: user
//         })
//     }
// }

export const addMessage = ({ authentication, msg, socket }) => async (dispatch) => {

    try {
        const res = await postAPIs('message', msg, authentication.token)

        dispatch({
            type: MESSAGE_TYPES.ADD_MESSAGE,
            payload: res.data.newMessage
        })

        const { _id, photo, user_name, full_name, isBlocked } = authentication.user

        socket.emit('addMessage', { ...res.data.newMessage, user: { _id, photo, user_name, full_name, isBlocked } })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const getConversations = ({ authentication, page = 1 }) => async (dispatch) => {
    try {
        const res = await getAPIs(`conversations?limit=${page * 9}`, authentication.token)

        let newArr = [];

        res.data.conversations.forEach(cv => {
            cv.recipents.forEach(rc => {
                if (rc._id !== authentication.user._id) {
                    newArr.push({ ...rc, textMessage: cv.textMessage, media: cv.media })
                }
            })
        })

        dispatch({
            type: MESSAGE_TYPES.GET_CONVERSATIONS,
            payload: {
                newArr,
                result: res.data.result
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

export const getMessages = ({ authentication, id, page = 1 }) => async (dispatch) => {
    try {
        const res = await getAPIs(`message/${id}?limit=${page * 9}`, authentication.token)

        const newData = {
            ...res.data,
            messages: res.data.messages.reverse()
        }
        // console.log(res)

        dispatch({
            type: MESSAGE_TYPES.GET_MESSAGES,
            payload: {
                ...newData,
                _id: id,
                page
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

export const loadMoreMessages = ({ authentication, id, page = 1 }) => async (dispatch) => {
    try {
        const res = await getAPIs(`message/${id}?limit=${page * 9}`, authentication.token)

        const newData = {
            ...res.data,
            messages: res.data.messages.reverse()
        }
        // console.log(res)

        dispatch({
            type: MESSAGE_TYPES.UPDATE_MESSAGES,
            payload: {
                ...newData,
                _id: id,
                page
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

export const deleteMessage = ({ msg, newDataMessage, authentication, socket }) => async (dispatch) => {
    // console.log({ msg, newDataMessage })
    try {
        const res = await deleteAPIs(`message/${msg._id}`, authentication.token)

        // console.log(res.data)

        const newData = deleteData(newDataMessage, res.data.message._id)

        dispatch({
            type: MESSAGE_TYPES.DELETE_MESSAGE,
            payload: { newData, _id: res.data.message.recipent }
        })

        const packageSocket = {
            newData,
            _id: res.data.message.sender,
            target_id: res.data.message.recipent
        }

        socket.emit('deleteMessage', packageSocket)

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const deleteConversation = ({ authentication, id }) => async (dispatch) => {
    try {
        dispatch({
            type: MESSAGE_TYPES.DELETE_CONVERSATION,
            payload: id
        })

        await deleteAPIs(`conversation/${id}`, authentication.token)
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}