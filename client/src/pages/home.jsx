import React, { useEffect } from 'react';
import StatusButton from '../components/HomePage/StatusSection/StatusButton/StatusButton'
import Post from '../components/HomePage/Posts/Post';
import { useSelector } from 'react-redux'
import SuggestionUser from '../components/HomePage/SuggestionUser/SuggestionUser';
import '../styles/homepage.css'

function Home(props) {
    const { homepagePost } = useSelector(state => state)

    useEffect(() => {
        document.title = 'Merfogram'
    }, [])
    return (
        <div className="home-page">
            <StatusButton />

            <div className="home-page-container">
                <div className="left-homepage">
                    {
                        homepagePost.result === 0
                            ?
                            <div className="no-post-div">

                            </div>
                            :
                            <Post />
                    }
                </div>

                <div className="right-homepage">
                    <SuggestionUser />
                </div>
            </div>
        </div>
    );
}

export default Home;