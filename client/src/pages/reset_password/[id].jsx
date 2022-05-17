import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Import CSS
import './reset_password.css'

// Import utils
import { isEmpty, isMatch, minLength8 } from '../../utils/validation'

// Import action
import { resetPassword } from '../../redux/actions/authenticationAction'

const initialState = {
    password: '',
    confirm_password: ''
}

function ResetPassword() {
    useEffect(() => {
        document.title = "Reset Password • Merfogram"
    }, [])

    const [data, setData] = useState(initialState)

    const dispatch = useDispatch()

    const { password, confirm_password } = data

    const { id } = useParams()

    const accessToken = id

    const handleChangeData = (event) => {
        const { name, value } = event.target

        setData({ ...data, [name]: value })
    }

    const handleSubmitForm = (event) => {
        event.preventDefault()

        dispatch({
            type: 'ALERT',
            payload: {}
        })

        if (isEmpty(password) || isEmpty(confirm_password)) {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Please fill all fileds."
                }
            })
        }

        if (minLength8(password)) {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Enter your password with at least 8 characters."
                }
            })
        }

        if (!isMatch(password, confirm_password)) {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Confirm password does not match. Please check it again"
                }
            })
        }

        dispatch(resetPassword({ password, accessToken }))
    }

    return (
        <div className='resetpassword-page'>
            <div className="resetpassword-container">
                <div className="container-header">
                    <img className='merfogram-logo' src='https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1651221700/logo/Logo_hcvlt2.svg' alt='logo' />
                </div>

                <div className="container-body">
                    <div className="body-top">
                        <form onSubmit={handleSubmitForm} action="">
                            <div className="row">
                                <div className="col-lg-6">
                                    <input className='input-password' type="password" name='password' value={password} placeholder='Password' required onChange={handleChangeData} />
                                </div>

                                <div className="col-lg-6">
                                    <input className='input-password' type="password" name='confirm_password' value={confirm_password} placeholder='Confirm Password' required onChange={handleChangeData} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <button className='reset-password-button' type='submit'>Reset password</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="body-middle">
                        <Link className='link' to="/"><i className="fa-solid fa-circle-chevron-left"></i> Back to sign in</Link>
                        <Link className='link' to="/register">Sign up a new account <i className="fa-solid fa-circle-chevron-right"></i></Link>
                    </div>

                    <div className="body-bottom">
                        <p className='text'>If you have any problem. Please contact us via: <span style={{ color: 'blue', textDecoration: 'underline' }}>merfogram@gmail.com</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword