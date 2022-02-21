import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import './changepassword.css'

import { TYPES } from '../../redux/actions/profileAction'

import { changePassword } from '../../redux/actions/authenticationAction'

function ChangePassword(props) {
    const dispatch = useDispatch()

    const { authentication } = useSelector(state => state)

    const initialState = {
        old_password: '',
        new_password: '',
        confirm_password: ''
    }

    const [password, setPassword] = useState(initialState)

    const { old_password, new_password, confirm_password } = password

    const onChangeInput = (event) => {
        const { name, value } = event.target

        setPassword({ ...password, [name]: value })
    }

    const onSubmit = (event) => {
        event.preventDefault()

        dispatch(changePassword(authentication, password))
    }

    const handleCancelChangePassword = () => {
        dispatch({
            type: TYPES.CHANGE_PASSWORD_MODAL,
            payload: false
        })
    }

    return (
        <div className='change-password-modal'>
            <span role="button" onClick={handleCancelChangePassword} id='close-button'>&times;</span>

            <div className='change-password-container'>
                <div className='change-password-header'>
                    <h1>Change Password</h1>
                </div>

                <div className='form-change-password'>
                    <form onSubmit={onSubmit} autoComplete="off" autoCorrect="off" >
                        <div className="form-group">
                            <label htmlFor="old-password">Old Password</label>
                            <div className="position-relative">
                                <input required className="form-control" type="password" name="old_password" value={old_password} id="old-password" onChange={onChangeInput} autoComplete="off" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password">New Password</label>
                            <input required className="form-control" type="password" name="new_password" value={new_password} id="new_password" onChange={onChangeInput} autoComplete="off" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input required className="form-control" type="password" name="confirm_password" value={confirm_password} id="confirm_password" onChange={onChangeInput} autoComplete="off" />
                        </div>

                        <div className="button">
                            <button style={{
                                backgroundColor: '#0095f6',
                                color: '#FFFFFF'
                            }} className='' type="submit">Change Password</button>
                            <button style={{
                                backgroundColor: '#e51616',
                                color: '#FFFFFF'
                            }} className='' onClick={handleCancelChangePassword}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;