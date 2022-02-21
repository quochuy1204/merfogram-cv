import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import Avatar from '../../../Avarta/Avarta';

import { ADMIN_TYPES } from '../../../../redux/actions/adminAction'
import { blockUser, unblockUser } from '../../../../redux/actions/adminAction'
import { getAPIs } from '../../../../utils/fetchAPIs'

import './manageusermodal.css'
import moment from 'moment';

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function ManageUserModal(props) {
    // Khởi tạo state để chứa dữ liệu của user được chọn
    const [user, setUser] = useState({})

    // Khởi tạo state để chứa post
    const [posts, setPosts] = useState([])

    const [followers, setFollowers] = useState(0)

    const [following, setFollowing] = useState(0)

    const dispatch = useDispatch()

    const { authentication, administrator } = useSelector(state => state)

    // Hàm xử lí mỗi khi component được render
    useEffect(() => {
        if (administrator.manage_user) {
            setUser({ ...administrator.manage_user })

            setFollowers(administrator.manage_user.followers.length)

            setFollowing(administrator.manage_user.following.length)

            const getPosts = async () => {
                await getAPIs(`admin/getposts/${administrator.manage_user._id}`, authentication.token)
                    .then((res) => {
                        setPosts(res.data.posts)
                    })
                    .catch((error) => {
                        dispatch({
                            type: 'ALERT',
                            payload: {
                                error: error.response.data.message
                            }
                        })
                    })
            }

            getPosts()
        }
    }, [administrator.manage_user, dispatch, authentication])

    // Hàm xử lí khi người dùng nhấn button close modal
    const handleCloseModal = () => {
        dispatch({
            type: ADMIN_TYPES.CHOOSE_USER,
            payload: {
                open: false,
                user: {}
            }
        })
    }

    // Hàm xử lí khi admin nhấn vào nút block user
    const handleBlockUser = () => {
        if (user) {
            confirmAlert({
                title: 'Block account',
                message: 'Are you want to block this account?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await dispatch(blockUser({ authentication, user }))
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

        }

    }

    // Hàm xử lí khi admin nhấn vào nút unblock user
    const handleUnblockUser = async () => {
        if (user) {
            confirmAlert({
                title: 'Unblock account',
                message: 'Are you want to unblock this account?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await dispatch(unblockUser({ authentication, user }))
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
                    <Avatar src={user.photo} size="mediumer-avarta" />

                    <span style={{ fontSize: '24px', fontWeight: '100', color: '#262626', marginBottom: '16px', marginTop: '6px' }}>
                        {
                            user.user_name
                        }

                        {
                            user.isVerified === 1 &&
                            <span style={{ color: '#3797F0', fontSize: '18px', marginLeft: '6px' }} className="material-icons">
                                verified
                            </span>
                        }
                    </span>

                    <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', width: 'fit-content' }}>{posts.length} posts</span>

                        <span style={{ fontSize: '14px', fontWeight: '500', width: 'fit-content' }}>{followers} followers</span>

                        <span style={{ fontSize: '14px', fontWeight: '500', width: 'fit-content' }}>{following} following</span>
                    </div>
                </div>

                <div className='section_2'>
                    <div className='user_information'>
                        <div className='user_information_left'>
                            <div className='information_line'>
                                <label htmlFor='user_name'>Name: </label>
                                <span style={{ fontSize: '14px', color: '#262626', fontWeight: '500' }} id='user_name'>{user.full_name}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='email'>Email: </label>
                                <span style={{ fontSize: '14px', color: '#262626', fontStyle: 'italic' }} id='email'>{user.email}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='gender'>Gender: </label>
                                <span style={{ fontSize: '14px', color: '#262626', textTransform: 'capitalize' }} id='gender'>{user.gender}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='mobile'>Mobile: </label>
                                <span style={{ fontSize: '14px', color: '#262626' }} id='mobile'>{user.mobile}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='address'>Address: </label>
                                <span style={{ fontSize: '14px', color: '#262626' }} id='address'>{user.address}</span>
                            </div>
                        </div>


                        <div className='user_information_right'>
                            <div className='information_line'>
                                <label htmlFor='story'>Story: </label>
                                <span style={{ fontSize: '14px', color: '#262626' }} id='story'>{user.story}</span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='website'>Website: </label>
                                <span id='website'>
                                    <a style={{ fontSize: '14px', textDecoration: 'none', fontWeight: '500' }} href={user.website} target='_blank' rel='noreferrer'>
                                        {
                                            user.website
                                        }
                                    </a>
                                </span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='createdAt'>Created Date: </label>
                                <span style={{ fontSize: '14px', color: '#262626', fontStyle: 'italic' }} id='createdAt'>
                                    {moment(user.createdAt).format('ll')}
                                </span>
                            </div>

                            <div className='information_line'>
                                <label htmlFor='role'>Role: </label>
                                <span id='role'>
                                    {
                                        user.role === 0
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
                                        user.isBlocked === 0
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
                            }} to={`/profile/${user._id}`} target="_blank">
                                Go to profile
                            </Link>

                        </button>
                        {
                            user.isVerified === 0
                                ?
                                <button>Verify Account</button>
                                :
                                <button>Unverified Account</button>
                        }

                        {
                            user.isBlocked === 0
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