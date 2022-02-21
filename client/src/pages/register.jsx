import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { register } from '../redux/actions/authenticationAction'
import '../styles/register.css'

import Footer from '../components/Footer/Footer'

import LOGO from '../images/Logo.svg'
import HPNY from '../images/HPNY.png'
import TIGER from '../images/tiger.png'
import TIGER1 from '../images/tiger1.png'
import TIGER2 from '../images/tiger2.png'

const Register = () => {
    useEffect(() => {
        document.title = 'Sign Up • Merfogram'
    }, [])

    // Lấy về state authentication đang có trong store
    const { authentication, alert } = useSelector(state => state)

    // Khởi tạo ra local state ban đầu
    const initialState = {
        full_name: '',
        user_name: '',
        email: '',
        password: ''
    }

    // Khởi tạo state newAccount và hàm setState setNewAccount
    const [newAccount, setNewAccount] = useState(initialState)

    // Lấy ra các giá trị tương ứng trong state newAccount để dễ sử dụng
    const { full_name, user_name, email, password } = newAccount

    // Hook useHistory và useDispatch
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        // Kiểm tra xem trong state authentication có tồn tại accesstoken không
        // Nếu có chứng tỏ người dùng đã đăng nhập thì trả về trang home
        if (authentication.token) history.push('/')
    }, [authentication.token, history])

    const handleOnChange = (event) => {
        const { name, value } = event.target

        setNewAccount({ ...newAccount, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        dispatch(register(newAccount))
    }

    return (
        <div className="auth-page">
            <div className='register-section'>
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

                <form className='form-register' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input placeholder='Email' type="email" className="form-input" id="email" name="email" value={email} required onChange={handleOnChange} />
                        <small id="emailHelp" className="form-text" style={{ color: `${alert.email ? '#DC3545' : ''}` }}>{alert.email ? alert.email : "We'll never share your email with anyone else."}</small>
                    </div>

                    <div className="form-group">
                        <input placeholder='Name' type="text" className="form-input" id="fullNameInput" name="full_name" value={full_name} required onChange={handleOnChange} />
                        <small id="fullNameAlert" className="form-text" style={{ color: `${alert.full_name ? '#DC3545' : ''}` }}>{alert.full_name ? alert.full_name : ""}</small>
                    </div>

                    <div className="form-group">
                        <input placeholder='Username' type="text" className="form-input" id="userNameInput" name="user_name" value={user_name.toLowerCase().replace(/ /g, '')} required onChange={handleOnChange} />
                        <small id="userNameAlert" className="form-text" style={{ color: `${alert.user_name ? '#DC3545' : ''}` }}>{alert.user_name ? alert.user_name : ""}</small>
                    </div>

                    <div className="form-group">
                        <input placeholder='Password' type="password" className="form-input" id="password" name="password" value={password} required onChange={handleOnChange} />
                        <small id="passwordAlert" className="form-text" style={{ color: `${alert.password ? '#DC3545' : ''}` }}>{alert.password ? alert.password : ""}</small>
                    </div>

                    <button type="submit" className="button-register" disabled={full_name && user_name && email && password ? false : true} >Sign up</button>


                </form>
                <div className='login-option'>
                    <p className="my-2">
                        Have an account? <Link style={{ textDecoration: "none", fontSize: '14px', fontWeight: '500' }} to="/">Log in</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Register