import { postAPIs, patchAPIs, deleteAPIs } from '../../utils/fetchAPIs'
import { createNotify, deleteNotify } from '../actions/notifyAction'

export const TYPES = {
    CREATE_POST: 'CREATE_POST'
}

export const createComment = ({ post, authentication, content, onReply, socket }) => async (dispatch) => {
    const newComment = {
        content,
        likes: [],
        user: authentication.user,
        createdAt: new Date().toISOString(),
        reply: onReply && onReply.commentId,
        tag: onReply && onReply.user
    }

    // console.log(onReply)

    const newPost = { ...post, comments: [...post.comments, newComment] }

    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    try {
        const res = await postAPIs('comment', { ...newComment, post_id: post._id, post_user_id: post.user._id }, authentication.token)

        const comment = {
            ...res.data.newComment,
            user: authentication.user
        }

        const newPost2 = { ...post, comments: [...post.comments, comment] }

        await dispatch({
            type: 'RELOAD_POST',
            payload: newPost2
        })

        // Gửi socket data về server socket khi người dùng thêm 1 comment mới
        socket.emit('createComment', newPost2)

        // Tạo mới một notify message khi người dùng like post của một người khác
        const msg = {
            recognize_id: res.data.newComment._id,
            type: 'createComment',
            text: comment.reply ? ' mentioned you: ' : ' commented: ',
            recipents: comment.reply ? [comment.tag._id] : [post.user._id],
            url: `/post/${post._id}`,
            caption: comment.content,
            image: post.images[0].url
        }

        // Gọi action createNotify để tạo mới một notify dưới database
        dispatch(createNotify({ msg, authentication, socket }))

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const updateComment = ({ post, comment, content, authentication }) => async (dispatch) => {
    if (content.length === 0) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Add your comment."
            }
        })
    }

    const newComment = {
        ...comment,
        content: content
    }

    const newPost = {
        ...post,
        comments: [...post.comments.map(comment => comment._id === newComment._id ? newComment : comment)]
    }

    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    try {
        await patchAPIs(`comment/${comment._id}`, { _id: newComment._id, content: newComment.content }, authentication.token)
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const likeComment = ({ post, comment, authentication, socket }) => async (dispatch) => {

    const newComment = {
        ...comment,
        likes: [...comment.likes, authentication.user]
    }

    // console.log(newComment)

    const newPost = {
        ...post,
        comments: [...post.comments.map(comment => comment._id === newComment._id ? newComment : comment)]
    }

    // console.log(newPost)

    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    try {
        await patchAPIs(`comment/${comment._id}/like`, null, authentication.token)

        // Tạo mới một notify message khi người dùng like post của một người khác
        const msg = {
            recognize_id: comment._id,
            type: 'likeComment',
            text: 'liked your comment: ',
            recipents: [comment.user._id],
            url: `/post/${post._id}`,
            caption: comment.content,
            image: post.images[0].url
        }

        // Gọi action createNotify để tạo mới một notify dưới database
        dispatch(createNotify({ msg, authentication, socket }))

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const unlikeComment = ({ post, comment, authentication, socket }) => async (dispatch) => {
    const newComment = {
        ...comment,
        likes: [...comment.likes.filter(like => like._id !== authentication.user._id)]
    }

    const newPost = {
        ...post,
        comments: [...post.comments.map(comment => comment._id === newComment._id ? newComment : comment)]
    }

    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    try {
        await patchAPIs(`comment/${comment._id}/unlike`, null, authentication.token)

        // Xóa đi notify khi người dùng unlike một post
        const msg = {
            recognize_id: comment._id,
            type: 'likeComment',
            text: 'liked your comment.',
            recipents: [comment.user._id],
            url: `/post/${post._id}`,
        }

        // Gọi action createNotify để tạo mới một notify dưới database
        dispatch(deleteNotify({ msg, authentication, socket }))

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}


// Hàm delete comment 
export const deleteComment = ({ post, comment, authentication, socket }) => async (dispatch) => {
    // Khởi tạo một chuỗi các comment cần delete
    // bao gồm comment được chọn để delete và tất cả reply comment của comment được chọn (nếu có)
    const deleteArrayComments = [...post.comments.filter(cm => cm.reply === comment._id), comment]

    // Khởi tạo object newPost gồm tất cả thông tin của post mà chứa comment muốn delete
    // và cập nhật lại array comments cho post đó
    // xóa đi các comment bị delete và chỉ giữ lại các comment còn lại
    const newPost = {
        ...post,
        comments: post.comments.filter(cm => !deleteArrayComments.find(da => da._id === cm._id))
    }

    // Gửi action RELOAD_POST lên reducer để cập lại state homepagePost.posts
    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    // Gửi socket data về server socket khi người dùng nhấn vào nút delete comment
    socket.emit('deleteComment', newPost)

    try {
        // Dùng vòng lặp forEach, với mỗi comment có trong array các comment cần được delete thì 
        // gửi Delete request về server kèm theo params là _id của comment cần được delete
        deleteArrayComments.forEach(item => {
            deleteAPIs(`comment/${item._id}`, authentication.token)

            // Tạo mới một notify message khi người dùng like post của một người khác
            const msg = {
                recognize_id: item._id,
                type: 'createComment',
                text: comment.reply ? 'mentioned you in a comment.' : 'commented on your post.',
                recipents: comment.reply ? [comment.tag._id] : [post.user._id],
                url: `/post/${post._id}`,
            }

            // Gọi action createNotify để tạo mới một notify dưới database
            dispatch(deleteNotify({ msg, authentication, socket }))
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