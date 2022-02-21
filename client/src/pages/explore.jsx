import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getPostsDiscover } from '../redux/actions/discoverAction'

import PostThumnnail from '../components/ProfilePost/PostThumbnail/PostThumbnail'
import LoadingGIF from '../GIF/heart-loading.gif'
import LoadMoreButton from '../components/LoadMoreButton/LoadMoreButton';
import Footer from '../components/Footer/Footer'

import { getAPIs } from '../utils/fetchAPIs'

function Explore(props) {
    useEffect(() => {
        document.title = 'Explore • Merfogram'
    }, [])

    const { authentication, discover } = useSelector(state => state)

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!discover.firstLoad) {
            dispatch(getPostsDiscover(authentication.token))
        }

    }, [dispatch, authentication.token, discover.firstLoad, discover.result])

    const handleLoadMore = async () => {
        setLoading(true)

        const res = await getAPIs(`posts_discover?limit=${discover.page * 6}`, authentication.token)

        dispatch({
            type: 'UPDATE_POSTS_DISCOVER',
            payload: res.data
        })

        console.log(res)

        setLoading(false)
    }
    return (
        <div>
            {
                discover.loading
                    ? <img src={LoadingGIF} alt="loading" className="d-block mx-auto my-4" />
                    : <PostThumnnail posts={discover.posts} postsLength={discover.result} />
            }
            {
                loading && <img src={LoadingGIF} alt="loading" className="d-block mx-auto my-4" />
            }

            {
                !discover.loading &&
                <LoadMoreButton result={discover.result} page={discover.page} load={loading} handleLoadMore={handleLoadMore} />
            }
            <div className='footer'>
                <Footer />
            </div>
        </div >
    );
}

export default Explore;