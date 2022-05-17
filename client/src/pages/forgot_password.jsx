import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Import CSS
import '../styles/forgot_password.css'

// Import action
import { forgotPassword } from '../redux/actions/authenticationAction'

function ForgotPassword() {
    useEffect(() => {
        document.title = "Forgot Password • Merfogram"
    }, [])

    const [email, setEmail] = useState('')

    const dispatch = useDispatch()

    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    const handleSubmitForm = (event) => {
        event.preventDefault()

        if (email.length === 0) {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Please enter your email address."
                }
            })
        }
        dispatch(forgotPassword({ email }))
    }

    return (
        <div className='forgotpassword-page'>
            <div className="forgotpassword-container">
                <div className="container-header">
                    <img className='merfogram-logo' src='https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1651221700/logo/Logo_hcvlt2.svg' alt='logo' />
                </div>

                <div className="container-body">
                    <div className="body-top">
                        <form onSubmit={handleSubmitForm} action="">
                            <div className="row">
                                <div className="col-lg-6">
                                    <input className='input-email' type="email" id='email' name='email' value={email} placeholder='Email' required onChange={handleChangeEmail} />
                                </div>

                                <div className="col-lg-6">
                                    <button type='submit'>Submit</button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <p className='hint-text'>Enter your email to reset your password.</p>
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
        </div >
    )
}

export default ForgotPassword