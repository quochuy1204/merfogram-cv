import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import 'bootstrap/dist/js/bootstrap.min'
import './commentmenu.css'
import { deleteComment } from '../../../../redux/actions/commentAction'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function CommentMenu({ post, comment, setOnEdit }) {
    const { authentication, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    // Hàm xử lý khi người dùng nhấp vào nút delete comment
    const handleDeleteComment = () => {
        confirmAlert({
            title: 'Delete comment',
            message: 'Are you want to delete this comment?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        if (post.user._id === authentication.user._id || comment.user._id === authentication.user._id) {
                            // Nếu đúng với 2 điều kiện trên thì cho phép người dùng delete comment
                            dispatch(deleteComment({ post, comment, authentication, socket }))
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return;
                    }
                }
            ]
        })

        // Kiểm tra xem người dùng có phải là người đăng post không (vì người đăng post có quyền delete comment trong post mình đăng),
        // hoặc người dùng có phải là người comment không

    }
    return (
        <div className="comment-menu-container">
            {
                (post.user._id === authentication.user._id || comment.user._id === authentication.user._id) &&
                <div className="dropdown">
                    <span role="button" className="material-icons" id="comment-menu-link" data-bs-toggle="dropdown">
                        more_horiz
                    </span>

                    <div className="dropdown-menu">
                        {
                            post.user._id === authentication.user._id
                                ? comment.user._id === authentication.user._id
                                    ?
                                    <>
                                        <div className="dropdown-item" onClick={() => setOnEdit(true)}>
                                            <span className="material-icons">create</span><span>Edit</span>
                                        </div>
                                        <div className="dropdown-item" onClick={handleDeleteComment}>
                                            <span className="material-icons text-danger">delete_outline</span><span className="text-danger">Delete</span>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="dropdown-item" onClick={handleDeleteComment}>
                                            <span className="material-icons text-danger">delete_outline</span><span className="text-danger">Delete</span>
                                        </div>
                                    </>
                                : comment.user._id === authentication.user._id
                                    ?
                                    <>
                                        <div className="dropdown-item" onClick={() => setOnEdit(true)}>
                                            <span className="material-icons">create</span><span>Edit</span>
                                        </div>
                                        <div className="dropdown-item" onClick={handleDeleteComment}>
                                            <span className="material-icons text-danger">delete_outline</span><span className="text-danger">Delete</span>
                                        </div>
                                    </>
                                    :
                                    <div className="dropdown-item">
                                        <span className="material-icons">flag</span><span>Report</span>
                                    </div>

                        }
                    </div>
                </div>
            }
        </div>

    );
}

export default CommentMenu;