import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Import thunk action
import { activationEmail } from '../../redux/actions/authenticationAction'

// Import CSS
import './activation.css'

const Activation = () => {
    const { id } = useParams()

    const dispatch = useDispatch()

    const { alert } = useSelector(state => state)

    console.log(alert)

    const activationToken = id

    useEffect(() => {
        document.title = "Activation Email • Merfogram"

        if (activationToken) {
            dispatch(activationEmail({ activationToken }))
        }
    }, [activationToken, dispatch])

    return (
        <div className='activation-page'>
            {
                alert.success ?
                    <div className='activation-container'>
                        <div className='header-container'>
                            <img className='merfogram-logo' src='https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1651221700/logo/Logo_hcvlt2.svg' alt='logo' />
                        </div>

                        <div className='body-container'>
                            <div className='top-body'>
                                <h4 className='heading'>Welcome to our social network - Merfogram <img className='color-icon' src='https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1651567500/icons/satisfaction_vgzlj0.png' alt='cute-icon' /> </h4>
                            </div>

                            <div className='middle-body'>
                                <p className='text'>Hi newbie! <img className='color-icon' src='https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1651567338/icons/smile_xmfsla.png' alt='smile-icon' /> </p>
                                <p className='text'>You are just verified your account!</p>
                                <p className='text'>Thank you to join our network!</p>
                                <p className='text'>Please sign in to use our awesome service. </p>
                            </div>

                            <div className='bottom-body'>
                                <Link className='button-redirect-to-login' to='/' >Sign in now <i className="fa-solid fa-right-to-bracket"></i> </Link>
                            </div>
                        </div>
                    </div>
                    :
                    alert.error &&
                    <div>Something wrong! Please sign up again!</div>
            }
        </div>
    )
}

export default Activation