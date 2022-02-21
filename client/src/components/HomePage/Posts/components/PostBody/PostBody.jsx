import React, { useState, useEffect } from 'react';
import Carousel from '../../../../Carousel/Carousel'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './postbody.css'
import LikeButton from '../LikeButton/LikeButton';
import { likePost, unlikePost } from '../../../../../redux/actions/postAction'
import { BASE_URL } from '../../../../../utils/config'

import BANPICTURE from '../../../../../images/stop.png'

function PostBody({ post }) {
    // Khởi tạo state liked, dùng để xác định xem user đã like post hay chưa
    const [liked, setLiked] = useState(false)

    const [loadLike, setloadLike] = useState(false)

    // Khởi tạo state readMore để xác định người dùng có ấn vào nút more hay chưa
    const [readMore, setReadMore] = useState(false)

    const { authentication, socket } = useSelector(state => state)

    // Mỗi lần component được render thì kiểm tra xem trong array likes của post có _id của user hay chưa
    // nếu có thì setLiked = true
    useEffect(() => {
        if (post.likes.find(like => like._id === authentication.user._id)) {
            setLiked(true)
        }
    }, [authentication.user, post])

    const dispatch = useDispatch()

    // Hàm xử lý khi người dùng ấn vào nút like
    const handleLike = async () => {
        if (loadLike) {
            return
        }
        setLiked(true)
        setloadLike(true)

        await dispatch(likePost({ authentication, post, socket }))

        setloadLike(false)
    }

    // Hàm xử lý khi người dùng nhấn vào nút unlike
    const handleUnlike = async () => {
        if (loadLike) {
            return
        }
        setLiked(false)
        setloadLike(true)

        await dispatch(unlikePost({ authentication, post, socket }))

        setloadLike(false)
    }

    //Hàm xử lý khi người dùng nhấn vào nút share post
    const handleSharePostButton = () => {
        // Gửi action SHARE_POST lên store để cập nhật state sharePost
        // cập nhật state openModal === true để show modal share post
        // và kèm theo url để sử dụng cho các button share post API
        dispatch({
            type: 'SHARE_POST',
            payload: {
                openModal: true,
                url: `${BASE_URL}/post/${post._id}`
            }
        })
    }

    return (
        <div className="post-body-card">
            <div className="post-body-images">
                {
                    post.isHidden === true || post.isDeleted === true
                        ?
                        <div className='banned-container'>
                            {
                                authentication.user._id === post.user._id ?
                                    <span className='banned-title'>Your post has been removed for some reason.</span>
                                    :
                                    <span className='banned-title'>This post has been removed for some reason.</span>
                            }
                            <img className='banned-image' src={BANPICTURE} alt="ban" />
                            {
                                authentication.user._id === post.user._id ?
                                    <p className='banned-reason'>It looks like something you posted doesn't follow our Community Standards.
                                        We remove posts that attack people based on their race, ethnicity,
                                        national origin, religious affiliation, sexual orientation, gender or disability.
                                    </p>
                                    :
                                    ''
                            }
                        </div>
                        :
                        post.images.length > 0 && < Carousel images={post.images} id={post._id} />
                }
            </div>

            {
                post.isHidden === true || post.isDeleted === true
                    ?
                    ''
                    :
                    <div className="post-body-reaction">
                        <div className="like-button">
                            <LikeButton liked={liked} handleLike={handleLike} handleUnlike={handleUnlike} />
                        </div>

                        <div className="comment-button">
                            <Link className="comment-button-link" to={`/post/${post._id}`} >
                                <i className="far fa-comment"></i>
                            </Link>
                        </div>

                        <div className="share-button" onClick={handleSharePostButton}>
                            <i className="far fa-paper-plane"></i>
                        </div>

                        <div className="bookmark-button">
                            <i className="far fa-bookmark"></i>
                        </div>
                    </div>

            }

            {
                post.isHidden === true || post.isDeleted === true
                    ?
                    ''
                    :
                    <div className="post-body-like-comment">
                        <div className="post-body-like-number">
                            <span className="like-number-span">{post.likes.length} likes</span>
                        </div>

                        <div className="post-body-comment-number">
                            <span className="comment-number-span">{post.comments.length} comments</span>
                        </div>
                    </div>
            }

            {
                post.isHidden === true || post.isDeleted === true
                    ?
                    ''
                    :
                    <div className="post-body-caption">
                        <p className="caption">
                            <b> <Link className="user-name" to={`/profile/${post.user._id}`}> {post.user.user_name} </Link> </b>
                            {
                                post.caption.length < 50 ? post.caption : readMore ? post.caption : post.caption.slice(0, 50) + "..."
                            }
                            {
                                post.caption.length > 50 &&
                                <span className="read-more-button" role="button" onClick={() => setReadMore(true)}>
                                    {
                                        readMore ? "" : " more"
                                    }
                                </span>
                            }
                        </p>

                    </div>
            }

        </div >
    );
}

export default PostBody;