import { getAPIs, patchAPIs } from '../../utils/fetchAPIs'
import { imageUpload } from '../../utils/validAvartaUpload'
import { createNotify, deleteNotify } from '../actions/notifyAction'

export const TYPES = {
    LOADING: 'LOADING',
    GET_USER: 'GET_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_USER_ID: 'GET_USER_ID',
    GET_USER_POSTS: 'GET_USER_POSTS',
    UPDATE_USER_POSTS: 'UPDATE_USER_POSTS',
    CHANGE_PASSWORD_MODAL: 'CHANGE_PASSWORD_MODAL'
}

// Hàm getUserProfile sẽ lấy thông tin người dùng có id trùng với id params 
// Khi chủ tài khoản tìm kiếm một tài khoản khác
export const getUserProfile = ({ users, id, authentication }) => async (dispatch) => {
    // Cập nhật mới ngày 27/11/2021
    dispatch({
        type: 'GET_USER_ID',
        payload: id
    })

    try {
        const res = getAPIs(`/user/${id}`, authentication.token)

        const res1 = getAPIs(`user_posts/${id}`, authentication.token)

        const users = await res;

        const posts = await res1;

        // Sau đó gửi action GET_USER lên Store kèm theo thông tin về người dùng vừa lấy thông tin
        dispatch({
            type: 'GET_USER',
            payload: users.data
        })

        dispatch({
            type: 'GET_USER_POSTS',
            payload: {
                _id: id,
                isBlocked: users.data.user.isBlocked,
                ...posts.data,
                page: 4
            }
        })
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.message
            }
        })
    }

    // // Kiểm tra xem trong list users trong state profile có người dùng nào trùng với id params hay không
    // if (users.every(user => user._id !== id)) {
    //     // Nếu không có người dùng nào trùng id với id params thì gửi request về server 
    //     // lấy lên thông tin của người dùng có id = id params
    //     try {
    //         const res = await getAPIs(`/user/${id}`, authentication.token)

    //         // Sau đó gửi action GET_USER lên Store kèm theo thông tin về người dùng vừa lấy thông tin
    //         dispatch({
    //             type: 'GET_USER',
    //             payload: res.data
    //         })

    //     } catch (error) {
    //         dispatch({
    //             type: 'ALERT',
    //             payload: {
    //                 error: error.message
    //             }
    //         })
    //     }
    // }
}

// Hàm này sẽ xử lý các validation của form edit user profile và gửi patch request về server để xử lý thông tin database
export const updateUserProfile = ({ userInformation, avarta, authentication, setEdit }) => async (dispatch) => {

    // Kiểm tra xem trường full_name có giá trị hay không
    // Nếu không thì gửi về ALERT
    if (!userInformation.full_name) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Enter your name."
            }
        })
    }


    // Kiểm tra xem trường full_name có độ dài có lớn hơn 30 kí tự hay không
    // Nếu có thì gửi về ALERT
    if (userInformation.full_name.length > 30) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please enter your name with less than 30 characters."
            }
        })
    }

    // Kiểm tra xem trường story có độ dài có lớn hơn 200 kí tự hay không
    // Nếu có thì gửi về ALERT
    if (userInformation.story.length > 200) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please enter your bio with less than 200 words."
            }
        })
    }

    try {
        // Khởi tạo biến media
        let media;

        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Nếu trường avarta có giá trị thì gán biến media = giá trị trả về của hàm imageUpload
        if (avarta) {
            media = await imageUpload([avarta])
        }

        // Gửi patch request về server 
        const res = await patchAPIs('/user', {
            ...userInformation,
            photo: avarta ? media[0].url : authentication.user.photo
        }, authentication.token)

        // Gửi action AUTH lên store để cập nhật lại state
        // payload gửi theo sẽ clone lại tất cả các giá trị của state authentication,
        // state user = các giá trị trong state authentication.user không bị thay đổi, 
        // và các giá trị trong state userInformation mới,
        // giá trị photo cũng được thay đổi mới
        dispatch({
            type: 'AUTH',
            payload: {
                ...authentication,
                user: {
                    ...authentication.user,
                    ...userInformation,
                    photo: avarta ? media[0].url : authentication.user.photo
                }
            }
        })

        setEdit(false)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
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
                error: error.message
            }
        })
    }
}

// Hàm này sẽ xử lý khi nhấn vào button follow một user
export const followUser = ({ authentication, user, profile, socket }) => async (dispatch) => {
    // Khởi tạo một biến newUser
    let newUser;

    // Kiểm tra xem trong array users có user nào trùng _id với user được chọn để follow hay không
    // Nếu không có tức là user đó nằm trong list follower của user của người vừa được search,
    // thì lấy thông tin của user đó gán cho newUser 
    // Còn nếu có thì tức là user vừa được search chính là người muốn follow,
    // thì lấy thông tin của người đó gán cho newUser

    // Muốn hiểu rõ thì vào xem phần FollowButton.jsx
    if (profile.users.every(item => item._id !== user._id)) {
        // Trường hợp này newUser mà người chủ tài khoản muốn follow là một tài khoản nằm trong list follower hoặc following của tài khoản được search
        newUser = {
            // clone lại toàn bộ state (thông tin của user muốn follow)
            ...user,
            // Array followers của user mới sẽ có toàn bộ thông tin của array followers cũ,
            // và thêm vào một tài khoản = chủ tài khoản
            followers: [...user.followers, authentication.user]
        }
    } else {
        //Trường hợp này thì người mà chủ tài khoản muốn follow hoặc chính bằng tài khoản được search,
        // hoặc là người đã từng được search và đã nằm trong list profile.users
        profile.users.forEach(item => {
            // Duyệt qua tất cả các phần tử có trong list users nếu có tài khoản nào trùng _id với _id của tài khoản muốn follow,
            // thì newUser sẽ bằng tài khoản đó 
            if (item._id === user._id) {
                newUser = {
                    // clone lại toàn bộ state (thông tin của user có _id trùng với _id của tài khoản mà chủ tài khoản muốn follow)
                    ...item,
                    // Array followers của user mới sẽ có toàn bộ thông tin của array followers cũ,
                    // và thêm vào một tài khoản = chủ tài khoản
                    followers: [...item.followers, authentication.user]
                }
            }
        })
    }

    // Sau khi xác định được thông tin của newUser (user muốn follow),
    // thì gửi action FOLLOW tới Reducer để cập nhật lại state cho ứng dụng 
    dispatch({
        type: 'FOLLOW',
        payload: newUser
    })

    // Sau khi cập nhật lại state cho state profile thành công,
    // thì gửi action AUTH lên Reducer để cập nhật lại state authentication cho người dùng
    // cụ thể là sẽ cập nhật lại list following của chủ tài khoản
    dispatch({
        type: 'AUTH',
        payload: {
            ...authentication,
            user: {
                ...authentication.user,
                following: [...authentication.user.following, newUser]
            }
        }
    })



    // Gửi patch request lên server để cập nhật lại array following của chủ tài khoản,
    // và array followers của người vừa được follow
    try {
        const res = await patchAPIs(`user/${user._id}/follow`, null, authentication.token)

        // Gửi socket data về server socket khi người dùng nhấn vào follow một tài khoản
        socket.emit('followUser', res.data.newUser)

        // Tạo mới một notify message khi người dùng follow một người khác
        const msg = {
            recognize_id: authentication.user._id,
            type: 'followUser',
            text: 'started following you.',
            recipents: [newUser._id],
            url: `/profile/${authentication.user._id}`
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

// Hàm này sẽ xử lý khi chủ tài khoản nhấn vào button Unfollow một tài khoản có trong list Following của chủ tài khoản
export const unfollowUser = ({ authentication, user, profile, socket }) => async (dispatch) => {
    // Khởi tạo biến newUser
    let newUser;

    // Kiểm tra xem trong list users có tài khoản muốn unfollow không,
    // nếu không thì newUser chính bằng user (giá trị được truyền vào button unFollow mỗi lần render)
    if (profile.users.every(item => item._id !== user._id)) {
        newUser = {
            // Clone lại thông tin của user
            ...user,
            // Thay đổi array followers, dùng hàm filter để lấy toàn bộ user còn lại, trừ chủ tài khoản
            followers: [...user.followers.filter(user => user._id !== authentication.user._id)]
        }
    }
    // Nếu có thì duyệt qua list users tìm tài khoản có trùng _id thì lấy chính tài khoản đó gán cho newUser 
    else {
        profile.users.forEach(item => {
            if (item._id === user._id) {
                newUser = {
                    // Clone lại thông tin của user (có trong list users) có trùng _id với tài khoản muốn unfollow 
                    ...item,
                    // Thay đổi list users, dùng hàm filter để lấy toàn bộ user còn lại, trừ chủ tài khoản
                    followers: [...item.followers.filter(user => user._id !== authentication.user._id)]
                }
            }
        })
    }

    // Sau khi xác định được newUser thì gửi action UNFOLLOW tới Reducer để cập nhật lại state profile 
    dispatch({
        type: 'UNFOLLOW',
        payload: newUser
    })

    // Gửi action AUTH tới Reducer để cập nhật lại state authentication,
    // cụ thể là cập nhật lại array following của chủ tài khoản (xóa đi tài khoản vừa unfollow)
    dispatch({
        type: 'AUTH',
        payload: {
            ...authentication,
            user: {
                ...authentication.user,
                following: [...authentication.user.following.filter(user => user._id !== newUser._id)]
            }
        }
    })

    // Gửi patch request lên server để xóa một tài khoản vừa bị unfollow ra khỏi array following của chủ tài khoản,
    // và đồng thời cũng xóa chủ tài khoản khởi array followers của người vừa bị unfollow
    try {
        const res = await patchAPIs(`user/${user._id}/unfollow`, null, authentication.token)

        // Gửi data socket về server socket khi người dùng nhấn nút unfollow một tài khoản
        socket.emit('unfollowUser', res.data.newUser)

        // Tạo mới một notify message khi người dùng unfollow một người khác
        const msg = {
            recognize_id: authentication.user._id,
            type: 'followUser',
            text: 'started following you.',
            recipents: [newUser._id],
            url: `/profile/${authentication.user._id}`
        }

        // const msg = {
        //     recognize_id: authentication.user._id,
        //     type: 'followUser',
        //     text: 'started following you.',
        //     recipents: [newUser._id],
        //     url: `/profile/${authentication.user._id}`
        // }

        // Gọi action deleteNotify để tạo mới một notify dưới database
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