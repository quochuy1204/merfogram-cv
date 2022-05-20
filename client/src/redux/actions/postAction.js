import { imageUpload } from '../../utils/validAvartaUpload'
import { postAPIs, getAPIs, patchAPIs, deleteAPIs } from '../../utils/fetchAPIs'
import { createNotify, deleteNotify } from '../actions/notifyAction'

export const TYPES = {
    CREATE_POST: 'CREATE_POST',
    GET_POSTS: 'GET_POSTS',
    EDIT_POST: 'EDIT_POST',
    RELOAD_POST: 'RELOAD_POST',
    OPEN_EDIT_MODAL: 'OPEN_EDIT_MODAL',
    GET_POST_BY_ID: 'GET_POST_BY_ID',
    RELOAD_LOAD_MORE_POSTS: 'RELOAD_LOAD_MORE_POSTS',
    DELETE_POST: 'DELETE_POST',
    SHARE_POST: 'SHARE_POST',
    OPEN_REPORT_MODAL: 'OPEN_REPORT_MODAL'
}

// Hàm tạo post mới 
export const createPost = ({ caption, images, authentication, socket }) => async dispatch => {
    let imagesUpload = []

    try {
        // Kiểm tra xem array images có hình ảnh nào hay không
        if (images.length > 0) {
            dispatch({
                type: 'ALERT',
                payload: {
                    loading: true
                }
            })
            // Gọi tới hàm imageUpload để upload image lên server của cloudinary 
            // và trả về array gồm có các public_id và url của mỗi hình ảnh được gửi lên server của cloudinary
            imagesUpload = await imageUpload(images)
        }

        // Gửi post request lên server để lưu lại post xuống database
        const res = await postAPIs('post', { caption, images: imagesUpload }, authentication.token)

        // Gửi action CREATE_POST lên Reducer để cập nhật lại state homepagePost
        dispatch({
            type: 'CREATE_POST',
            payload: res.data.newPost
        })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        // Tạo một notify khi người dùng share một post mới
        // const msg = {
        //     post_id: res.data.newPost._id,
        //     recipents: res.data.newPost.user.followers,
        //     text: 'shared a new post.',
        //     url: `/post/${res.data.newPost._id}`,
        //     caption,
        //     image: imagesUpload[0].url
        // }

        // dispatch(createNotify({ authentication, msg, socket }))

    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }


}

// Hàm load posts lên home page
export const getPosts = (token) => async (dispatch) => {
    try {
        // Kiểm tra xem có token ko ( tức kiểm tra xem người dùng đã đăng nhập chưa)
        if (token) {
            dispatch({
                type: 'ALERT',
                payload: {
                    loading: true
                }
            })

            dispatch({
                type: 'LOADING_POST',
                payload: true
            })

            // Gửi get request về server 
            const res = await getAPIs('post', token)

            // Gửi action GET_POST lên store để cập nhật lại state homepagePost
            dispatch({
                type: 'GET_POSTS',
                payload: res.data
            })

            dispatch({
                type: 'LOADING_POST',
                payload: false
            })

            dispatch({
                type: 'ALERT',
                payload: {
                    loading: false
                }
            })
        }
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

// Hàm update post
export const updatePost = ({ caption, images, homepagePost, authentication }) => async (dispatch) => {
    try {
        // Kiểm tra xem người dùng có đăng tải ảnh lên không
        // nếu không thì show lên alert
        if (images.length === 0) {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Choose your photo."
                }
            })
        }

        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Gửi patch request thèm theo 2 giá trị của post là caption và images về server
        const res = await patchAPIs(`post/${homepagePost.editPost._id}`, { caption, images }, authentication.token)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        // Gửi action RELOAD_POST lên store để cập nhật lại state homepagePost.posts
        dispatch({
            type: 'RELOAD_POST',
            payload: res.data.newPost
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.message
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

// Hàm like post
export const likePost = ({ authentication, post, socket }) => async (dispatch) => {
    // Khởi tạo biến newPost - gán vào tất cả giá trị của post cũ và thay đổi giá trị array likes (thêm vào _id của user)
    const newPost = { ...post, likes: [...post.likes, authentication.user] }

    // Gửi action RELOAD_POST lên store để update lại thông tin của post đó trên state homepagePost.posts
    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    // Gửi data socket về server khi người dùng nhấn vào nút like post
    socket.emit('likePost', newPost)

    try {
        // Gửi patch request lên server để thêm _id của user vào array likes của post đó
        await patchAPIs(`post/${post._id}/like`, null, authentication.token)

        // Tạo mới một notify message khi người dùng like post của một người khác
        const msg = {
            recognize_id: authentication.user._id,
            type: 'likePost',
            text: ' liked your post.',
            recipents: [post.user._id],
            url: `/post/${post._id}`,
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

// Hàm unlike post
export const unlikePost = ({ authentication, post, socket }) => async (dispatch) => {
    // Khởi tạo biến newPost chứa toàn bộ thông tin của post cũ chỉ thay đổi array likes(lấy ra _id của user)
    const newPost = { ...post, likes: [...post.likes.filter(like => like._id !== authentication.user._id)] }

    // Gửi action RELOAD_POST lên store để cập nhật lại thông tin cho post
    dispatch({
        type: 'RELOAD_POST',
        payload: newPost
    })

    // Gửi data socket về server khi người dùng unlike post
    socket.emit('unLikePost', newPost)

    try {
        // Gửi patch request về server để xóa _id của user ra khỏi array likes của post dưới database
        await patchAPIs(`post/${post._id}/unlike`, null, authentication.token)

        // Xóa đi notify khi người dùng unlike một post
        const msg = {
            recognize_id: authentication.user._id,
            type: 'likePost',
            text: 'liked your post.',
            recipents: [post.user._id],
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

export const getPostById = ({ authentication, id, detailPosts }) => async (dispatch) => {
    if (detailPosts.every(item => item._id !== id)) {
        try {
            dispatch({
                type: 'ALERT',
                payload: {
                    loading: true
                }
            })

            const res = await getAPIs(`post/${id}`, authentication.token)

            const newPost = await res.data.post

            console.log(newPost)

            dispatch({
                type: 'GET_POST_BY_ID',
                payload: newPost
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
}

export const deletePost = ({ post, authentication, socket }) => async (dispatch) => {

    dispatch({
        type: 'DELETE_POST',
        payload: post
    })

    try {
        // eslint-disable-next-line no-unused-vars
        const res = await deleteAPIs(`post/${post._id}`, authentication.token)

        //Sau khi người dùng xóa post thì xóa luôn notify tương ứng với post đó 
        // const msg = {
        //     post_id: res.data.newPost._id,
        //     recipents: res.data.newPost.user.followers,
        //     url: `/post/${res.data.newPost._id}`
        // }

        // dispatch(deleteNotify({ authentication, socket, msg }))
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

// Quoc Huy Update Action Date 05/05/2022
export const reportPost = ({ authentication, postDetail, report_content }) => async (dispatch) => {
    try {
        let report = {
            reporter_id: authentication.user._id,
            target_id: postDetail._id,
            category: "post",
            report_content,
            target_images: postDetail.images
        }

        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await postAPIs('report_post', report, authentication.token)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'OPEN_REPORT_MODAL',
            payload: {
                open: false,
                data: {}
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.success
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
// End Work for Date 05/05/2022
