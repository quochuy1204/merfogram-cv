import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { TYPES } from './redux/actions/postAction'
import { NOTIFY_TYPES } from './redux/actions/notifyAction'
import { MESSAGE_TYPES } from './redux/actions/messageAction'

const spawnNotification = (body, icon, url, title) => {
    let options = {
        body,
        icon
    }

    let n = new Notification(title, options)

    n.onclick = e => {
        e.preventDefault()

        window.open(url, '_blank')
    }
}

function SocketClient(props) {
    const { authentication, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    // Connect and Disconnect 
    useEffect(() => {
        socket.emit('joinUser', authentication.user._id)
    }, [socket, authentication.user._id])

    //Likes and Unline Post
    useEffect(() => {
        socket.on('likeToClient', newPost => {
            dispatch({
                type: TYPES.RELOAD_POST,
                payload: newPost
            })
        })

        return () => socket.off('likeToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('unLikeToClient', newPost => {
            dispatch({
                type: TYPES.RELOAD_POST,
                payload: newPost
            })
        })

        return () => socket.off('unLikeToClient')
    }, [socket, dispatch])

    //Comment
    useEffect(() => {
        socket.on('createCommentToClient', newPost2 => {
            dispatch({
                type: TYPES.RELOAD_POST,
                payload: newPost2
            })
        })
        return () => socket.off('createCommentToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('deleteCommentToClient', newPost => {
            dispatch({
                type: TYPES.RELOAD_POST,
                payload: newPost
            })
        })
    }, [socket, dispatch])

    // Follow and Unfollow
    useEffect(() => {
        socket.on('followUserToClient', newUser => {
            dispatch({
                type: 'AUTH',
                payload: {
                    ...authentication,
                    user: newUser
                }
            })
        })

        return () => socket.off('followUserToClient')
    }, [socket, dispatch, authentication])

    useEffect(() => {
        socket.on('unfollowUserToClient', newUser => {
            dispatch({
                type: 'AUTH',
                payload: {
                    ...authentication,
                    user: newUser
                }
            })
        })

        return () => socket.off('unfollowUserToClient')
    }, [socket, dispatch, authentication])

    // Notification
    useEffect(() => {
        socket.on('createNotifyToClient', msg => {
            console.log(msg)

            dispatch({
                type: NOTIFY_TYPES.CREATE_NOTIFY,
                payload: msg
            })

            spawnNotification(
                msg.user.user_name + ' ' + msg.text,
                msg.user.photo,
                msg.url,
                "Merfogram"
            )
        })

        return () => socket.off('createNotifyToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('deleteNotifyToClient', msg => {
            console.log(msg)

            dispatch({
                type: NOTIFY_TYPES.DELETE_NOTIFY,
                payload: msg
            })
        })

        return () => socket.off('deleteNotifyToClient')
    }, [socket, dispatch])

    // Message
    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            dispatch({
                type: MESSAGE_TYPES.ADD_MESSAGE,
                payload: msg
            })

            dispatch({
                type: MESSAGE_TYPES.ADD_CHAT,
                payload: {
                    ...msg.user,
                    textMessage: msg.textMessage,
                    media: msg.media
                }
            })
        })

        return () => socket.off('addMessageToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('deleteMessageToClient', packageSocket => {
            // console.log(packageSocket)

            dispatch({
                type: MESSAGE_TYPES.DELETE_MESSAGE,
                payload: packageSocket
            })
        })

        return () => socket.off('deleteMessageToClient')
    }, [socket, dispatch])

    return <></>
}

export default SocketClient;