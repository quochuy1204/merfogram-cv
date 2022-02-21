import React from 'react';
import './likebutton.css'

function LikeButton({ liked, handleLike, handleUnlike }) {
    return (
        <>
            {
                liked ? <i onClick={handleUnlike} className="fas fa-heart text-danger"></i> : <i onClick={handleLike} className="far fa-heart"></i>
            }
        </>
    );
}

export default LikeButton;