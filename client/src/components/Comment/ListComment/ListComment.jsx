import React, { useState, useEffect } from 'react';
import CommentDisplay from './CommentDisplay/CommentDisplay';
import './listcomment.css'

function ListComment({ post }) {
    // khởi tạo state để chứa toàn bộ comment của post
    const [comments, setComments] = useState([])

    // Array comments sau khi thu gọn lại
    const [shortomments, setShortComments] = useState([])

    // Khởi tạo state next để show thêm comment cho user
    const [next, setNext] = useState(2)

    const [replyComments, setReplyComments] = useState([])

    //Hàm này dùng để handle mỗi khi người dùng muốn show thêm comment hoặc hide đi tất cả comment
    useEffect(() => {
        // Lấy ra toàn bộ comment của post và gán vào state comments
        const newCm = post.comments.filter(cm => !cm.reply)
        setComments(newCm)

        // Gán cho shortComments một Array comments là 2 comment mới nhất của post
        setShortComments(newCm.slice(newCm.length - next))
    }, [post.comments, next])

    useEffect(() => {
        const newRep = post.comments.filter(cm => cm.reply)
        setReplyComments(newRep)
    }, [post.comments])


    return (
        <div className="comment-container">
            {
                comments.length - next > 0
                    ?
                    <div style={{ color: '#8E8E8E', marginLeft: '16px', marginBottom: '15px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }} onClick={() => setNext(next + 10)}>
                        ---- See comments {`(${comments.length})`}
                    </div>
                    : comments.length > 2
                    &&
                    <div style={{ color: '#8E8E8E', marginLeft: '16px', marginBottom: '15px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }} onClick={() => setNext(2)}>
                        ---- Hide comments
                    </div>
            }

            {

                shortomments.map((comment, index) => (
                    <CommentDisplay key={index} post={post} comment={comment}
                        replyCm={replyComments.filter(item => item.reply === comment._id)}
                    />
                ))
            }
        </div>
    );
}

export default ListComment;