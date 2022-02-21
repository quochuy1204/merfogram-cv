import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/actions/authenticationAction'
import '../styles/login.css'

import Footer from '../components/Footer/Footer'

import LOGO from '../images/Logo.svg'
import HPNY from '../images/HPNY.png'
import TIGER from '../images/tiger.png'
import TIGER1 from '../images/tiger1.png'
import TIGER2 from '../images/tiger2.png'

const Login = () => {
    useEffect(() => {
        document.title = 'Login • Merfogram'
    }, [])

    const { authentication } = useSelector(state => state)

    // Tạo Object state khởi tạo
    const initialState = {
        email: '',
        password: ''
    }

    // Khởi tạo state và hàm setState cho component
    const [account, setAccount] = useState(initialState)

    // Lấy ra 2 giá trị trong state đễ dễ handle
    const { email, password } = account

    // Sử dụng useDispatch hooks
    const dispatch = useDispatch()

    const history = useHistory()

    useEffect(() => {
        if (authentication.token) history.push('/')
    }, [authentication.token, history])

    // Hàm handleChangeInput sẽ chạy mỗi lần người dùng nhập vào input mới
    const handleChangeInput = (event) => {
        // Lấy ra 2 giá trị name và value trong object event.target
        const { name, value } = event.target

        // Dùng hàm setState set lại giá trị cho các attribute trong object state account
        setAccount({ ...account, [name]: value })
    }

    // Hàm handleSubmit sẽ chạy mỗi khi form được submit
    const handleSubmit = (event) => {
        // Hàm preventDefault sẽ ngăn không cho form submit lên một cách mặc định
        // Mà sẽ submit form theo cách của mình code
        event.preventDefault()

        // Dùng dispatch hook gửi action lên server
        dispatch(login(account))
    }

    return (
        <div className="auth-page">
            <div className='login-section'>
                <div className='deco-image-left'>
                    <img src={HPNY} alt='decorationpic' />
                </div>

                <div className='deco-image-right'>
                    <img src={TIGER} alt='decorationpic' />
                </div>

                <div className='deco-image-bot-left'>
                    <img src={TIGER1} alt='decorationpic' />
                </div>

                <div className='deco-image-bot-right'>
                    <img src={TIGER2} alt='decorationpic' />
                </div>

                <div className='merfogram-logo'>
                    <img className='logo' src={LOGO} alt='merfogram' />
                </div>

                <form className='form-login' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="email" className="form-input" placeholder='Email' name="email" value={email} onChange={handleChangeInput} />
                        <small id="emailHelp" className="">We'll never share your email with anyone else.</small>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-input" placeholder='Password' name="password" value={password} onChange={handleChangeInput} />
                    </div>

                    <button style={{
                        opacity: email && password ? '1' : '0.5'
                    }} type="submit" className='button-login' disabled={email && password ? false : true} >Log In</button>

                </form>

                <div className='sign-up-option'>
                    <p className="my-2">
                        Don't have an account? <Link style={{ textDecoration: "none", fontSize: '14px', fontWeight: '500' }} to="/register">Sign up</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Login