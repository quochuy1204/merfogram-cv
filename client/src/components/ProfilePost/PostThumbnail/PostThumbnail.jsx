import React from 'react';
import { Link } from 'react-router-dom'
import './postthumbnail.css'

function PostThumbnail({ posts, postsLength }) {
    // if (postsLength === 0) {
    //     return <h1 className="no-post">No post yet</h1>
    // }

    return (
        <div>
            {
                postsLength === 0 && <h1 style={{
                    textAlign: 'center',
                    color: '#8E8E8E',
                    fontSize: '18px',
                    fontWeight: '500'
                }} className="no-post">No Posts</h1>
            }
            <div className="post-thumb">
                {
                    posts.map(post => (
                        <Link key={post._id} to={`/post/${post._id}`}>
                            <div className="post-thumb-display">
                                <img src={post.images[0].url} alt={post.images[0].public_id} ></img>

                                <div className="post-thumb-menu">
                                    <i className="fas fa-heart text-danger"> <span>{post.likes.length}</span> </i>
                                    <i className="fas fa-comment"> <span>{post.comments.length}</span> </i>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

export default PostThumbnail;