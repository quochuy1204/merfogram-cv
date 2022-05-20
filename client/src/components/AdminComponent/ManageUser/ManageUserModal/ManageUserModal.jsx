import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import Avatar from '../../../Avarta/Avarta';

import { ADMIN_TYPES } from '../../../../redux/actions/adminAction'
import { blockUser, unblockUser } from '../../../../redux/actions/adminAction'

import './manageusermodal.css'
import moment from 'moment';

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function ManageUserModal(props) {
    // Get the user_detail state from store
    const user_detail = useSelector(state => state.administrator.manage_user.user_detail)

    // Get the token state from store
    const token = useSelector(state => state.authentication.token)

    // Khởi tạo state để chứa dữ liệu của user được chọn
    const [userDetail, setUserDetail] = useState({})

    const [followersLength, setFollowersLength] = useState(0)

    const [followingLength, setFollowingLength] = useState(0)

    const dispatch = useDispatch()

    // Function to set value for userDetail state everytime the component rendered
    useEffect(() => {
        if (user_detail._id) {
            setUserDetail(user_detail)

            if (user_detail.followers.length > 0) {
                setFollowersLength(user_detail.followers.length)
            }

            if (user_detail.following.length > 0) {
                setFollowingLength(user_detail.following.length)
            }


        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Something wrong! Please close the modal and choose another user account!"
                }
            })
        }
    }, [user_detail, dispatch])

    // Hàm xử lí khi người dùng nhấn button close modal
    const handleCloseModal = () => {
        dispatch({
            type: ADMIN_TYPES.MANAGE_USER,
            payload: {
                open_modal: false,
                user_detail: {}
            }
        })
    }

    // Hàm xử lí khi admin nhấn vào nút block user
    const handleBlockUser = () => {
        // Check if the isBlocked value = 0 or not (it mean that the user does not block yet)
        // if isBlocked = 1 (it mean that the user already blocked) so return the dispatch alert error
        if (userDetail.isBlocked === 0) {
            confirmAlert({
                title: 'Block account',
                message: 'Are you want to block this account?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await dispatch(blockUser({ token: token, user: userDetail }))
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {
                            return
                        }
                    }
                ]
            })

        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "This user already blocked!"
                }
            })
        }

    }

    // Hàm xử lí khi admin nhấn vào nút unblock user
    const handleUnblockUser = async () => {
        // Check if the isBlocked = 1 or not
        // If isBlocked = 0 then return the alert
        if (userDetail.isBlocked === 1) {
            confirmAlert({
                title: 'Unblock account',
                message: 'Are you want to unblock this account?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await dispatch(unblockUser({ token: token, user: userDetail }))
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {
                            return
                        }
                    }
                ]
            })

        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "This user already unblock!"
                }
            })
        }

    }

    return (
        <div className='manage_user_modal'>
            <span onClick={handleCloseModal} role="button" style={{
                position: 'absolute', top: 0, right: 0,
                zIndex: 10, color: '#FFFFFF', fontSize: '44px',
                transform: 'translate(-50%, 50%)'
            }}>
                &times;
            </span>

            <div className='manage_user_detail'>
                <div className='section_1'>
                    <Avatar src={userDetail.photo} size="mediumer-avarta" />

                    <span style={{ fontSize: '24px', fontWeight: '100', color: '#262626', marginBottom: '16px', marginTop: '6px' }}>
                        {
                            userDetail.user_name
                        }

                        {
                            userDetail.isVerified === 1 &&
                            <span style={{ color: '#3797F0', fontSize: '18px', marginLeft: '6px' }} className="material-icons">
                                verified
                            </span>
                        }
                    </span>

                    <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', width: 'fit-content' }}>{userDetail.postsLength} posts</span>

                        <span style={{ fontSize: '14px', fontWeight: '500', width: 'fit-content' }}>{followersLength} followers</span>

                        <span style={{ fontSize: '14px', fontWeight: '500', width: 'fit-content' }}>{followingLength} following</span>
                    </div>
                </div>

                <div className='section_2'>
                    <div className='user_information'>
                        <div className='user_information_left'>
                            <div className='information_line'>
                                <label htmlFor='user_name'>Name: </label>
                                <span style={{ fontSize: '14px', color: '#262626', fontWeight: '500' }} id='user_name'>{userDetail.full_name}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='email'>Email: </label>
                                <span style={{ fontSize: '14px', color: '#262626', fontStyle: 'italic' }} id='email'>{userDetail.email}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='gender'>Gender: </label>
                                <span style={{ fontSize: '14px', color: '#262626', textTransform: 'capitalize' }} id='gender'>{userDetail.gender}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='mobile'>Mobile: </label>
                                <span style={{ fontSize: '14px', color: '#262626' }} id='mobile'>{userDetail.mobile}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='address'>Address: </label>
                                <span style={{ fontSize: '14px', color: '#262626' }} id='address'>{userDetail.address}</span>
                            </div>
                        </div>


                        <div className='user_information_right'>
                            <div className='information_line'>
                                <label htmlFor='story'>Story: </label>
                                <span style={{ fontSize: '14px', color: '#262626' }} id='story'>{userDetail.story}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='website'>Website: </label>
                                <span id='website'>
                                    <a style={{ fontSize: '14px', textDecoration: 'none', fontWeight: '500' }} href={userDetail.website} target='_blank' rel='noreferrer'>
                                        {
                                            userDetail.website
                                        }
                                    </a>
                                </span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='createdAt'>Created Date: </label>
                                <span style={{ fontSize: '14px', color: '#262626', fontStyle: 'italic' }} id='createdAt'>
                                    {moment(userDetail.createdAt).format('ll')}
                                </span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='role'>Role: </label>
                                <span id='role'>
                                    {
                                        userDetail.role === 0
                                            ?
                                            <>
                                                <span style={{ fontSize: '14px', color: '#262626', fontWeight: '500' }}> User </span>
                                                <i className="fas fa-user text-success"></i>

                                            </>
                                            :
                                            <>
                                                <span style={{ fontSize: '14px', color: '#262626', fontWeight: '500' }}> Administrator </span>
                                                <i className="fas fa-user-shield text-danger"></i>
                                            </>
                                    }
                                </span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='status'>Status: </label>
                                <span id='status'>
                                    {
                                        userDetail.isBlocked === 0
                                            ?
                                            <>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Active </span>
                                                <i className="text-success fas fa-check-circle"></i>
                                            </>
                                            :
                                            <>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Blocked </span>
                                                <i className="text-danger fas fa-user-lock"></i>
                                            </>

                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='action'>
                        <button>
                            <Link style={{
                                textDecoration: 'none',
                                color: '#262626'
                            }} to={`/profile/${userDetail._id}`} target="_blank">
                                Go to profile
                            </Link>

                        </button>
                        {
                            userDetail.isVerified === 0
                                ?
                                <button>Verify Account</button>
                                :
                                <button>Unverified Account</button>
                        }

                        {
                            userDetail.isBlocked === 0
                                ?
                                <button onClick={handleBlockUser}>Block Account</button>
                                :
                                <button onClick={handleUnblockUser}>Unblock Account</button>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ManageUserModal;