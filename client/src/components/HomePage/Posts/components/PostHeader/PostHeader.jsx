import React from 'react';
import Avatar from '../../../../Avarta/Avarta';
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import 'bootstrap/dist/js/bootstrap.min'
import './postheader.css'

import { deletePost } from '../../../../../redux/actions/postAction'
import { blockPostAdmin, unblockPostAdmin } from '../../../../../redux/actions/adminAction'
import { BASE_URL } from '../../../../../utils/config'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function PostHeader({ post }) {
    const { authentication, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    const history = useHistory()

    // Khi người dùng chọn vào button Edit Post thì
    // gửi action EDIT_POST lên store để cập nhật lại state homepagePost.onEdit
    // truyền vào state homepagePost.onEdit các giá trị của post muốn edit và set onEdit = true để mở modal Edit Post lên
    const handleOnEditPost = () => {
        dispatch({
            type: 'EDIT_POST',
            payload: { ...post }
        })

        dispatch({
            type: 'OPEN_EDIT_MODAL',
            payload: true
        })
    }

    const handleDeletePost = () => {
        confirmAlert({
            title: 'Delete post',
            message: 'Are you want to delete this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(deletePost({ post, authentication, socket }))
                        return history.push("/")
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

    const handleCopyLink = async () => {
        navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)

        dispatch({
            type: 'ALERT',
            payload: {
                success: "Copied post's link to clipboard."
            }
        })

    }

    const handleBlockPostAdmin = async () => {
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

    const handleUnblockPostAdmin = () => {
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
        <div className="post-header">
            <div className="user-card">
                {
                    post.user.isBlocked === 0
                        ?
                        <Avatar src={post.user.photo} size="small2-avarta" />
                        :
                        <Avatar className="avarta" src="https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1635304905/psnap/user_ciin3x.png" size="small2-avarta" />
                }


                <div className="user-name">
                    <h1>
                        {
                            post.user.isBlocked === 0
                                ?
                                <Link to={`/profile/${post.user._id}`} className="user-name-link">
                                    {
                                        post.user.user_name
                                    }
                                </Link>
                                :
                                "Merfogram user"
                        }

                    </h1>
                </div>
                {
                    post.user.isBlocked === 0
                        ?
                        post.user.isVerified === 1 &&
                        <span style={{ color: '#3797F0', marginLeft: '4px', fontSize: '14px' }} className="material-icons">
                            verified
                        </span>
                        :
                        ''
                }
            </div>


            <div className="dropdown">
                <span role="button" className="material-icons" id="moreLink" data-bs-toggle="dropdown">
                    more_horiz
                </span>

                <div className="dropdown-menu">
                    {
                        authentication.user._id === post.user._id &&

                        <>
                            {
                                post.isHidden === true || post.isDeleted === true ?
                                    ''
                                    :
                                    <>
                                        <div className="dropdown-item" onClick={handleOnEditPost}>
                                            <span className="material-icons">create</span><span>Edit</span>
                                        </div>

                                        <div className="dropdown-item" onClick={handleDeletePost}>
                                            <span className="material-icons text-danger">delete_outline</span><span className="text-danger">Delete</span>
                                        </div>
                                    </>
                            }

                        </>
                    }

                    <div className="dropdown-item" onClick={handleCopyLink}>
                        <span className="material-icons">content_copy</span>    Copy Link
                    </div>

                    {
                        authentication.role === 1
                            ?
                            <>
                                {
                                    post.isDeleted === false
                                        ?
                                        <div className="dropdown-item" onClick={handleBlockPostAdmin}>
                                            <span className="material-icons text-danger">block</span>

                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }} className="text-danger"> Block post </span>
                                        </div>
                                        :
                                        <div className="dropdown-item" onClick={handleUnblockPostAdmin}>
                                            <span className="material-icons text-danger">block</span>

                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }} className="text-danger"> Unblock post </span>
                                        </div>
                                }
                            </>

                            :
                            ''
                    }
                </div>
            </div>
        </div>
    );
}

export default PostHeader;