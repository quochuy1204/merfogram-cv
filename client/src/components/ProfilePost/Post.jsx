import React, { useState, useEffect } from 'react';
import PostThumbnail from './PostThumbnail/PostThumbnail';
import LoadingGif from '../../GIF/heart-loading.gif'
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton'
import { getAPIs } from '../../utils/fetchAPIs'
import { TYPES } from '../../redux/actions/profileAction'

function Post({ authentication, profile, id, dispatch }) {
    const [posts, setPosts] = useState([])

    const [postsLength, setPostLength] = useState(9)

    const [load, setLoad] = useState(false)

    const [page, setPage] = useState(0)

    const [userBlocked, setUserBlocked] = useState(0)

    useEffect(() => {
        profile.user_posts.forEach(item => {
            if (item._id === id) {
                if (item.isBlocked === 1) {
                    setUserBlocked(1)
                }
                else {
                    setUserBlocked(0)

                    setPosts(item.posts)

                    setPostLength(item.result)

                    setPage(item.page)
                }

            }
        })
    }, [id, profile.user_posts])

    const handleLoadMore = async () => {
        setLoad(true)

        const res = await getAPIs(`user_posts/${id}?limit=${page * 6}`, authentication.token)

        console.log(res)

        const newData = {
            posts: [...res.data.posts],
            _id: id,
            page: page + 1,
            result: res.data.result
        }

        dispatch({
            type: TYPES.UPDATE_USER_POSTS,
            payload: newData
        })

        setLoad(false)
    }

    return (
        <div>
            {
                userBlocked === 0
                    ?
                    <PostThumbnail posts={posts} postsLength={postsLength} />
                    :
                    ''
            }

            {
                load && <img src={LoadingGif} alt="loading" className="d-block mx-auto my-4" />
            }

            {
                userBlocked === 0
                    ?
                    postsLength > 0 &&
                    <LoadMoreButton result={postsLength} page={page} load={load} handleLoadMore={handleLoadMore} />
                    : ''
            }

        </div>
    );
}

export default Post;