import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getPostById } from '../../redux/actions/postAction';
import { useParams } from 'react-router-dom'
import PostHeader from '../../components/HomePage/Posts/components/PostHeader/PostHeader';
import PostBody from '../../components/HomePage/Posts/components/PostBody/PostBody';
import PostFooter from '../../components/HomePage/Posts/components/PostFooter/PostFooter';

function Post(props) {
    const [post, setPost] = useState([])

    const { authentication, detailPosts } = useSelector(state => state)

    const { id } = useParams()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPostById({ authentication, id, detailPosts }))

        if (detailPosts.length > 0) {
            setPost(detailPosts.filter(item => item._id === id))
        }

    }, [id, authentication, detailPosts, dispatch])

    useEffect(() => {
        if (detailPosts.length > 0) {
            const post2 = detailPosts.find(item => item._id === id)

            if (post2) {
                document.title = `@${post2.user.user_name} • Merfogram photos`
            }
        }
    })


    return (
        <div className="posts-container" style={{ margin: '0 auto' }}>
            {
                post.map(post => (
                    <div key={post._id} className="post-card">
                        <PostHeader post={post} />
                        <PostBody post={post} />
                        <PostFooter post={post} />
                    </div>
                ))
            }
        </div>
    );
}

export default Post;