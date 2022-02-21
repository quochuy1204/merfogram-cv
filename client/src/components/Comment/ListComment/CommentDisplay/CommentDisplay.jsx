import React, { useState, useEffect } from 'react';
import CommentCard from '../CommentCard/CommentCard';
import './commentdisplay.css'

function CommentDisplay({ post, comment, replyCm }) {
    const [moreReply, setMoreReply] = useState([])

    const [nextReply, setNextReply] = useState(1)

    useEffect(() => {
        setMoreReply(replyCm.slice(replyCm.length - nextReply))
    }, [replyCm, nextReply])

    return (
        <div className="comment-display-container">
            <CommentCard className="comment-card" post={post} comment={comment} commentId={comment._id}>
                <div className="reply-comment-container">
                    {
                        replyCm.length - nextReply > 0
                            ?
                            <div style={{ color: '#8E8E8E', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '10px 0' }} onClick={() => setNextReply(nextReply + 10)}>
                                <span>----   View replies ({`${replyCm.length}`})</span>
                            </div>
                            :
                            replyCm.length > 1 &&
                            <div style={{ color: '#8E8E8E', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '10px 0' }} onClick={() => setNextReply(1)}>
                                <span>----    Hide replies</span>
                            </div>
                    }
                    {
                        moreReply.map((item, index) => (
                            item.reply &&
                            <CommentCard key={index} post={post} comment={item} commentId={comment._id} />
                        ))
                    }
                </div>
            </ CommentCard>
        </div>
    );
}

export default CommentDisplay;