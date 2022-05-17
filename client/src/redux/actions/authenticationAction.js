import { postAPIs, getAPIs } from '../../utils/fetchAPIs'

import valid from '../../utils/valid'

export const TYPES = {
    AUTH: 'AUTH'
}

export const login = (data) => async (dispatch) => {
    try {
        // Gửi lên store một action type: NOTIFY 
        // Và trả về payload: loading
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        // Gửi lên server post request với dữ liệu là username và password của người dùng
        const result = await postAPIs('login', data)

        // Gửi lên store một action với type là AUTH và trả về payload là 
        // accesstoken của người dùng cũng như thông tin của user
        dispatch({
            type: 'AUTH',
            payload: {
                token: result.data.accessToken,
                user: result.data.user,
                role: result.data.user.role
            }
        })

        // Lưu một dữ liệu có tên là fristLogin tại local storage của web browser của client
        localStorage.setItem('firstLogin', true)

        // Gửi về store một action type là NOTIFY một thông báo success
        // dispatch({
        //     type: 'ALERT',
        //     payload: {
        //         success: result.data.message
        //     }
        // })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        // let role = result.data.user.role

        // if (role === 1) {
        //     dispatch({
        //         type: ADMIN_TYPES.SET_ADMIN,
        //         payload: true
        //     })
        // }

    } catch (error) {
        // Nếu có bất kì error nào thì gửi lên store một action có type là NOTIFY
        // Gửi theo payload lỗi đó 
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

// Action này nhằm generate lại accesstoken cho người dùng khi hết hạn
// Cũng như nhằm giúp cho người dùng ko cần phải đăng nhập lại mỗi khi vào lại trang
// Trừ khi refreshtoken được lưu lại ở cookie hết hạn sau 30days
export const refreshToken = () => async (dispatch) => {
    // Kiểm tra xem người dùng đã login hay chưa
    const firstLogin = localStorage.getItem('firstLogin')

    // Nếu người dùng đã login thì tiến hành generate lại accesstoken 
    if (firstLogin) {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })
        try {
            // Gửi post request lên server với đường dẫn /api/refreshtoken
            const result = await postAPIs('refreshtoken')

            // Gửi một action với type: AUTH lên store nhằm cập nhật lại state.authentication
            // Lưu lại accesstoken và thông tin người dùng vào store với state.authentication
            dispatch({
                type: 'AUTH',
                payload: {
                    token: result.data.accesstoken,
                    user: result.data.user,
                    role: result.data.user.role
                }
            })

            dispatch({
                type: 'ALERT',
                payload: {}
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

export const register = (data) => async (dispatch) => {
    try {
        const check = valid(data)
        if (check.errLength > 0)
            return dispatch({
                type: 'ALERT',
                payload: check.errMsg
            })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await postAPIs('register', data)

        dispatch({
            type: 'AUTH',
            payload: {
                token: res.data.accessToken,
                user: res.data.user,
                role: res.data.user.role
            }
        })

        localStorage.setItem("firstLogin", true)

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

// Quoc Huy - Created date 04/05/2022
export const registerEmail = (data) => async (dispatch) => {
    try {
        const check = valid(data)
        if (check.errLength > 0)
            return dispatch({
                type: 'ALERT',
                payload: check.errMsg
            })

        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await postAPIs('register', data)

        dispatch({
            type: 'ALERT',
            payload: {
                loading: false
            }
        })

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.msg
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

export const activationEmail = (activationToken) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await postAPIs('activation_email', activationToken)

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
                error: error.response.data.message
            }
        })
    }
}

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await postAPIs('forgot_password', email)

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
                error: error.response.data.message
            }
        })
    }
}

export const resetPassword = ({ password, accessToken }) => async (dispatch) => {
    try {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        })

        const res = await postAPIs('reset_password', { password }, accessToken)

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
        return dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

// Quoc Huy - End created date 04/05/2022

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin')

        await postAPIs('logout')

        window.location.href = "/"
    } catch (error) {
        dispatch({
            type: 'ALERT',
            payload: {
                error: error.response.data.message
            }
        })
    }
}

export const checkIsBlockedUser = (token) => async (dispatch) => {
    try {
        const res = await getAPIs('checkisblockeduser', token)


        if (res.data.isBlocked === true) {
            localStorage.removeItem('firstLogin')

            await postAPIs('logout')

            dispatch({
                type: 'ALERT',
                payload: {
                    error: "Your account has been blocked. Please contact us via merfogram@gmail.com for more information."
                }
            })

            window.location.href = "/"

            dispatch({
                type: 'ALERT',
                payload: {
                    error: "Your account has been blocked. Please contact us via merfogram@gmail.com for more information."
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

export const changePassword = (authentication, password) => async (dispatch) => {
    if (!password.old_password) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: 'Please enter your current password.'
            }
        })
    } else if (password.old_password.length < 8) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please check your current password again. The password must be more than 8 characters."
            }
        })
    }

    if (!password.new_password) {
        return dispatch({
            type: "ALERT",
            payload: {
                error: "Please enter your new password."
            }
        })
    } else if (password.new_password.length < 8) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Enter new password with at least 8 characters."
            }
        })
    }

    if (!password.confirm_password) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "Please confirm your new password."
            }
        })
    } else if (password.confirm_password !== password.new_password) {
        return dispatch({
            type: 'ALERT',
            payload: {
                error: "New passwords do not match."
            }
        })
    }
    try {
        dispatch({
            type: 'ALERT',
            payload: {

            }
        })

        const res = await postAPIs('user/changepassword', password, authentication.token)

        dispatch({
            type: 'ALERT',
            payload: {
                success: res.data.success
            }
        })

        dispatch({
            type: 'CHANGE_PASSWORD_MODAL',
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