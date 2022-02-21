import React from 'react';
import UserCard from '../../UserCard/UserCard'
import FollowButton from '../../FollowButton/FollowButton';
import { useSelector } from 'react-redux'
import HeartLoading from '../../../GIF/heart-loading.gif'
import './suggestionuser.css'
import FacebookIcon from '../../../images/icon/facebook.png'
import InstagramIcon from '../../../images/icon/instagram.png'
import MerfogramIcon from '../../../images/logo-gradient.png'
import { BASE_URL } from '../../../utils/config'

import moment from 'moment'
function SuggestionUser(props) {
    const { authentication, suggestion } = useSelector(state => state)
    return (
        <div className="suggestion-container">
            <div className="profile-section">
                <UserCard user={authentication.user} />
            </div>

            <div className="suggestion-user-section">
                <div className="header-section">
                    <h1 className="suggestion-title">Suggestions for you</h1>
                </div>

                <div className="body-section">
                    {
                        suggestion.loading
                            ?
                            <img src={HeartLoading} alt="loading" className="d-block m-auto" />
                            :
                            suggestion.users.map(user => (
                                <UserCard user={user} key={user._id}>
                                    <FollowButton user={user} />
                                </UserCard>
                            ))
                    }
                </div>

            </div>

            <div className="introduction-section">
                <span className="copyright-section">&copy; {moment().format('YYYY')} MERFOGRAM FROM HUYANH</span>

                <div className="contact-section">
                    <span>FOR MORE INFORMATION</span>

                    <a href="https://www.facebook.com/HuyNicholas/" target="_blank" rel="noreferrer" >
                        <img src={FacebookIcon} alt="facebook-icon" />
                    </a>

                    <a href="https://www.instagram.com/__qhuy.jsx/" target="_blank" rel="noreferrer" >
                        <img src={InstagramIcon} alt="instagram-icon" />
                    </a>

                    <a href={`${BASE_URL}/profile/61d2b74cd923eff5583f0073`}>
                        <img src={MerfogramIcon} alt="merfogram-icon" style={{ width: '24px', objectFit: 'contain', height: '24px' }} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SuggestionUser;