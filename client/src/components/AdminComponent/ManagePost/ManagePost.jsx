import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

// import Avarta from '../../Avarta/Avarta'

// import { getAPIs } from '../../../utils/fetchAPIs'
// import { ADMIN_TYPES } from '../../../redux/actions/adminAction'
import { getAllPosts, searchByPostOwner, blockPostAdmin, unblockPostAdmin } from '../../../redux/actions/adminAction'

import './managepost.css'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function ManagePost(props) {
    const { authentication, administrator } = useSelector(state => state)

    const dispatch = useDispatch()

    // Khởi tạo state để chứa text cho thanh search owner_username
    const [searchUsername, setSearchUsername] = useState('')

    // Khởi tạo state để chứa text cho thanh search by post_id
    // const [searchById, setSearchById] = useState('')

    // Hàm xử lí mỗi khi component được render
    useEffect(() => {
        dispatch(getAllPosts({ authentication }))

    }, [authentication, dispatch])

    // Hàm xử lí khi admin search user
    useEffect(() => {
        if (searchUsername) {

            dispatch(searchByPostOwner({ authentication, searchUsername }))
        }
        else {
            setSearchUsername('')
        }
    }, [searchUsername, dispatch, authentication])

    const handleBlockPostAdmin = async ({ post }) => {
        console.log({ post })
        confirmAlert({
            title: 'Block post',
            message: 'Are you want to block this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(blockPostAdmin({ post, authentication }))
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

    const handleUnblockPostAdmin = ({ post }) => {
        console.log({ post })
        confirmAlert({
            title: 'Unblock post',
            message: 'Are you want to unblock this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(unblockPostAdmin({ post, authentication }))
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
    return (
        <div className='manage_container'>
            <div className='manage_header'>
                <div className='manage_title'>
                    <span className='span_manage'>Manage Post
                        <i style={{ marginLeft: '6px', fontSize: '24px', color: '#96ceb4' }} className="fas fa-portrait"></i>
                    </span>
                </div>

                <div className='manage_search'>
                    <form className='form_manage'>
                        <span className='span_manage_search'>Search: </span>

                        <input autoComplete='disable' className='formManageInput' type="text" placeholder="Enter post's creator username" name='search' value={searchUsername} onChange={(e) => setSearchUsername((e.target.value))} ></input>

                        <button id="button_search_manage" type='submit'><i className="fas fa-search"></i></button>
                    </form>
                </div>
            </div>

            <div className='manage_body'>
                <div className='manage_table'>
                    <table style={{ position: 'relative' }} className="table table-borderless table-hover">
                        <thead style={{ position: 'sticky', top: '0', backgroundColor: '#FFFFFF', zIndex: '1' }}>
                            <tr >
                                <th scope="col" className='text-center'>ID</th>
                                <th scope="col" className='text-center'>Image</th>
                                <th scope="col" className='text-center'>Caption</th>
                                <th scope="col" className='text-center'>Creator</th>
                                <th scope="col" className='text-center'>Created Date</th>
                                <th scope="col" className='text-center'>Status</th>
                                <th scope="col" className='text-center'>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                searchUsername.length > 0
                                    ?
                                    administrator.search_posts.map(post => (
                                        <tr key={post._id} >

                                            <td style={{
                                                maxWidth: '145px',
                                                overflow: 'hidden'
                                            }} className='text-center' >
                                                <p style={{
                                                    color: '#262626',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                }}>{post._id}</p>
                                            </td>

                                            <td className='text-center' >
                                                <Link to={`/post/${post._id}`}>
                                                    <img style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        objectFit: 'cover'
                                                    }} src={post.images[0].url} alt="post" />
                                                </Link>
                                            </td>

                                            <td className='text-center' style={{
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                color: '#262626',
                                                fontSize: '14px'
                                            }} >
                                                {
                                                    post.caption.length > 200
                                                        ?
                                                        post.caption.slice(0, 200) + ' ...'
                                                        :
                                                        post.caption
                                                }
                                            </td>

                                            <td className='text-center' style={{
                                                maxWidth: '240px',
                                                overflow: 'hidden',
                                                color: '#262626',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }} >
                                                {
                                                    post.user.user_name
                                                }
                                            </td>

                                            <td className='text-center' style={{
                                                color: '#262626',
                                                fontSize: '12px'
                                            }}>
                                                {moment(post.createdAt).format('ll')}
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    post.isDeleted === false
                                                        ?
                                                        <>
                                                            <i className="fas fa-check-circle text-success"></i>
                                                        </>
                                                        :
                                                        <>
                                                            <i className="fas fa-ban text-danger"></i>
                                                        </>
                                                }
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    post.isDeleted === false
                                                        ?
                                                        <button className='btn-danger m-auto' onClick={() => handleBlockPostAdmin({ post })}>Block</button>
                                                        :
                                                        <button className='btn-success m-auto' onClick={() => handleUnblockPostAdmin({ post })}>Unblock</button>
                                                }

                                            </td>
                                        </tr>
                                    ))
                                    :
                                    administrator.all_posts.map(post => (
                                        <tr key={post._id} >

                                            <td style={{
                                                maxWidth: '145px',
                                                overflow: 'hidden'
                                            }} className='text-center' >
                                                <p style={{
                                                    color: '#262626',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                }}>{post._id}</p>
                                            </td>

                                            <td className='text-center' >
                                                <Link to={`/post/${post._id}`}>
                                                    <img style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        objectFit: 'cover'
                                                    }} src={post.images[0].url} alt="post" />
                                                </Link>
                                            </td>

                                            <td className='text-center' style={{
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                color: '#262626',
                                                fontSize: '14px'
                                            }} >
                                                {
                                                    post.caption.length > 200
                                                        ?
                                                        post.caption.slice(0, 200) + ' ...'
                                                        :
                                                        post.caption
                                                }
                                            </td>

                                            <td className='text-center' style={{
                                                maxWidth: '240px',
                                                overflow: 'hidden',
                                                color: '#262626',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }} >
                                                {
                                                    post.user.user_name
                                                }
                                            </td>

                                            <td className='text-center' style={{
                                                color: '#262626',
                                                fontSize: '12px'
                                            }}>
                                                {moment(post.createdAt).format('ll')}
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    post.isDeleted === false
                                                        ?
                                                        <>
                                                            <i className="fas fa-check-circle text-success"></i>
                                                        </>
                                                        :
                                                        <>
                                                            <i className="fas fa-ban text-danger"></i>
                                                        </>
                                                }
                                            </td>

                                            <td className='text-center'>
                                                {
                                                    post.isDeleted === false
                                                        ?
                                                        <button className='btn-danger m-auto' onClick={() => handleBlockPostAdmin({ post })}>Block</button>
                                                        :
                                                        <button className='btn-success m-auto' onClick={() => handleUnblockPostAdmin({ post })}>Unblock</button>
                                                }

                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

export default ManagePost;