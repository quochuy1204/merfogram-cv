let users = []

const SocketServer = (socket) => {
    // Connect and Disconnect 
    socket.on('joinUser', id => {

        users.push({
            id,
            socketId: socket.id
        })
    })

    socket.on('disconnect', () => {
        users = users.filter(item => item.socketId !== socket.id)
    })

    // Likes and unlikes post
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]

        // Lấy ra các user là follower của chủ post và hiện đang online(hay đang kết nối với socket)
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]

        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })

    // Comments
    socket.on('createComment', newPost2 => {
        const ids = [...newPost2.user.followers, newPost2.user._id]

        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost2)
            })
        }
    })

    socket.on('deleteComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]

        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    // Follow and Unfollow
    socket.on('followUser', newUser => {
        let user = users.find(user => user.id === newUser._id)
        if (user) {
            socket.to(`${user.socketId}`).emit('followUserToClient', newUser)
        }
    })

    socket.on('unfollowUser', newUser => {
        let user = users.find(user => user.id === newUser._id)
        if (user) {
            socket.to(`${user.socketId}`).emit('unfollowUserToClient', newUser)
        }
    })

    // Notify
    socket.on('createNotify', msg => {
        const clients = users.filter(user => msg.recipents.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
            })
        }
    })

    socket.on('deleteNotify', msg => {
        const clients = users.filter(user => msg.recipents.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteNotifyToClient', msg)
            })
        }
    })

    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipent)

        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

    socket.on('deleteMessage', packageSocket => {
        const user = users.find(user => user.id === packageSocket.target_id)

        user && socket.to(`${user.socketId}`).emit('deleteMessageToClient', packageSocket)
    })
}

module.exports = SocketServer