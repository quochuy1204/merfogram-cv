import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import PostHeader from './components/PostHeader/PostHeader'
import PostBody from './components/PostBody/PostBody'
import PostFooter from './components/PostFooter/PostFooter'
import './post.css'
import LoadingGif from '../../../GIF/heart-loading.gif'
import LoadMoreButton from '../../LoadMoreButton/LoadMoreButton'
import { getAPIs } from '../../../utils/fetchAPIs'
import { TYPES } from '../../../redux/actions/postAction'

function Post(props) {
    const { homepagePost, authentication } = useSelector(state => state)

    const [load, setLoad] = useState(false)

    const [page, setPage] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        setPage(homepagePost.page)
    }, [homepagePost.page])

    const handleLoadMore = async () => {
        setLoad(true)

        const res = await getAPIs(`post?limit=${homepagePost.page * 3}`, authentication.token)

        dispatch({
            type: TYPES.RELOAD_LOAD_MORE_POSTS,
            payload: {
                posts: res.data.posts,
                result: res.data.result,
                page: homepagePost.page + 1
            }
        })

        setLoad(false)
    }
    return (
        <div className="posts-container">
            {
                homepagePost.posts.map(post => (
                    <div key={post._id} className="post-card">
                        <PostHeader post={post} />
                        <PostBody post={post} />
                        <PostFooter post={post} />
                    </div>
                ))
            }

            {
                load && <img src={LoadingGif} alt="loading" className="d-block mx-auto my-4" />
            }

            <LoadMoreButton result={homepagePost.result} page={page} handleLoadMore={handleLoadMore} load={load} />
        </div>
    );
}

export default Post;