import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Avarta from '../../../Avarta/Avarta'
import moment from 'moment';
import './commentcard.css'
import LikeButton from '../../../HomePage/Posts/components/LikeButton/LikeButton'
import CommentMenu from '../CommentMenu/CommentMenu';
import { updateComment, likeComment, unlikeComment } from '../../../../redux/actions/commentAction'
import FormComment from '../../FormComment/FormComment';

function CommentCard({ children, post, comment, commentId }) {

    const [content, setContent] = useState('')

    const [loadLike, setLoadLike] = useState(false)

    const { authentication, socket } = useSelector(state => state)

    const [liked, setLiked] = useState(false)

    const [onEdit, setOnEdit] = useState(false)

    const [readMore, setReadMore] = useState(false)

    const [onReply, setOnReply] = useState(false)

    const dispatch = useDispatch()

    const styleAwait = {
        opacity: comment._id ? '1' : '0.5',
        pointerEvents: comment._id ? 'inherit' : 'none'
    }

    // hàm like comment
    const handleLike = async () => {
        if (loadLike) {
            return
        }
        setLiked(true)

        await dispatch(likeComment({ post, comment, authentication, socket }))
        setLoadLike(false)
    }

    // Hàm unlike comment
    const handleUnlike = async () => {
        if (loadLike) {
            return
        }
        setLiked(false)

        await dispatch(unlikeComment({ post, comment, authentication, socket }))
        setLoadLike(false)
    }

    // Hàm update comment
    const handleUpdateComment = async () => {
        if (comment.content !== content) {
            let err = '';
            if (content.trim().length === 0) {
                err = "Add your comment."
            }

            if (err) {
                return dispatch({
                    type: 'ALERT',
                    payload: {
                        error: err
                    }
                })
            }

            await dispatch(updateComment({ post, comment, content, authentication }))

            setOnEdit(false)
        } else {
            setContent(comment.content)
            setOnEdit(false)
        }
    }

    // Hàm on Change content của update comment ( khi người dùng nhập bất cứ gì vào textarea )
    const handleOnChangeContent = (event) => {
        setContent(event.target.value)
    }

    // Hàm cancel Update comment
    const handleCalcelUpdate = () => {
        setContent(comment.content)
        setOnEdit(false)
    }

    // Hàm xử lý khi người dùng nhấn vào nút Reply
    const handleOnReply = () => {
        // Nếu trước đó người dùng đã nhấn vào nút Reply rồi thì return
        if (onReply) {
            return;
        }

        // Nếu trước đó người dùng chưa nhấn vào nút Reply thì 
        // Gán tất cả thông tin của comment được nhấn nút reply vào onReply state kèm theo commentId
        setOnReply({ ...comment, commentId })
    }

    useEffect(() => {
        // setOnReply(false)
        setLiked(false)
        if (comment.likes.find(like => like._id === authentication.user._id)) {
            setLiked(true)
        }
    }, [comment, authentication.user])

    // Mỗi khi update comment được gọi thì set content của comment muốn update bằng chính content của nó
    useEffect(() => {
        setContent(comment.content)
    }, [comment])

    // console.log({ onReply })
    return (
        <div className="new-div">
            <div className="comment-card-container" style={styleAwait}>

                <div className="comment-card-left">
                    <div className="comment-card-avarta">
                        {
                            comment.user.isBlocked === 0
                                ?
                                <Link to={`/profile/${comment.user._id}`}>
                                    <Avarta src={comment.user.photo} size="smaller-avarta" />
                                </Link>
                                :
                                <Link to={`/profile/${comment.user._id}`}>
                                    <Avarta className="avarta" src="https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1635304905/psnap/user_ciin3x.png" size="smaller-avarta" />
                                </Link>
                        }
                    </div>

                    <div className="comment-card-body">
                        <div className="comment-card-body-username">
                            {
                                comment.user.isBlocked === 0
                                    ?
                                    <Link className="username-link" to={`/profile/${comment.user._id}`} >
                                        <h1 className="username">{comment.user.user_name}</h1>
                                    </Link>
                                    :
                                    <Link className="username-link" to={`/profile/${comment.user._id}`} >
                                        <h1 className="username">Merfogram user</h1>
                                    </Link>
                            }
                            <div>
                                {
                                    comment.user.isBlocked === 0
                                        ?
                                        comment.user.isVerified === 1 &&
                                        <span style={{ color: '#3797F0', marginLeft: '4px', fontSize: '14px' }} className="material-icons">
                                            verified
                                        </span>
                                        :
                                        ''
                                }
                            </div>
                        </div>

                        <div className="comment-card-body-content">
                            {
                                onEdit === true
                                    ?
                                    <textarea style={{ height: `${content.length > 200 ? '100px' : '45px'}` }} className="edit-content-textarea" value={content} onChange={handleOnChangeContent} />
                                    :
                                    <div>
                                        {
                                            comment.tag && comment.tag._id !== comment.user._id &&
                                            <Link style={{ textDecoration: 'none', marginRight: '6px', color: '#00376b' }} to={`/profile/${comment.tag._id}`}>
                                                {`@${comment.tag.user_name}`}
                                            </Link>
                                        }
                                        <span className="content">
                                            {
                                                content.length < 60 ? content : readMore ? content : content.slice(0, 60) + '...'
                                            }
                                            {
                                                content.length > 60 &&
                                                <span className="read-more-button" onClick={() => setReadMore(true)} >
                                                    {
                                                        readMore ? '' : ' more'
                                                    }
                                                </span>
                                            }
                                        </span>
                                    </div>
                            }
                        </div>

                        <div className="comment-card-body-reaction">
                            {
                                onEdit === true
                                    ?
                                    <>
                                        <span role="button" onClick={handleUpdateComment} className="update-button">Update</span>
                                        <span role="button" onClick={handleCalcelUpdate} className="cancel-button">Cancel</span>
                                    </>
                                    :
                                    <>
                                        <span className="comment-created-time">
                                            {moment(comment.createdAt).fromNow(true)}
                                        </span>

                                        <span className="comment-likes">
                                            {comment.likes.length} likes
                                        </span>

                                        <span onClick={handleOnReply} role="button" className="comment-reply-button">
                                            Reply
                                        </span>

                                        <span className="comment-menu">
                                            <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
                                        </span>
                                    </>
                            }
                        </div>
                        {
                            onReply &&
                            <>
                                <div className="comment-card-body-reply">
                                    <div className="replier-avarta">
                                        <Avarta src={authentication.user.photo} size="smaller-avarta" />
                                    </div>
                                    <div className="form-reply">
                                        <FormComment post={post} onReply={onReply} setOnReply={setOnReply} >
                                            <span className="reply-to-span">Reply to @{comment.user.user_name}</span>
                                        </FormComment>
                                        <span style={{ fontSize: '12px', color: '#8E8E8E', marginLeft: '16px' }} className="esc-span">Press <b>ESC</b> to cancel</span>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>

                <div className="comment-card-footer">
                    <div className="like-comment-button">
                        <LikeButton liked={liked} handleLike={handleLike} handleUnlike={handleUnlike} />
                    </div>
                </div>


            </div>
            {
                children
            }
        </div>
    );
}

export default CommentCard;