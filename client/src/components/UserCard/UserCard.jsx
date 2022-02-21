import React from 'react';
import Avarta from '../Avarta/Avarta'
import { Link } from 'react-router-dom'
import './usercard.css'

function UserCard({ children, user, handleCloseSearch, setShowFollowers, setShowFollowing }) {
    const handleCloseAll = () => {
        if (handleCloseSearch) {
            handleCloseSearch()
        }
        if (setShowFollowers) {
            setShowFollowers(false)
        }
        if (setShowFollowing) {
            setShowFollowing(false)
        }
    }

    return (

        <div className="profile-information">
            <div>
                <Link className="user-link" onClick={handleCloseAll} to={`/profile/${user._id}`}>
                    {
                        user.isBlocked === 0
                            ?
                            <Avarta src={user.photo} size="medium-avarta" />
                            :
                            <Avarta className="avarta"
                                src="https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1635304905/psnap/user_ciin3x.png"
                                size="medium-avarta" />
                    }

                    <div className="profile-name">
                        <span className="username d-flex align-items-center">
                            {
                                user.isBlocked === 0
                                    ?
                                    user.user_name
                                    :
                                    "Merfogram user"
                            }
                            {
                                user.isBlocked === 0
                                    ?
                                    user.isVerified === 1 &&
                                    <span style={{ color: '#3797F0', marginLeft: '4px', fontSize: '14px' }} className="material-icons">
                                        verified
                                    </span>
                                    :
                                    ''
                            }
                        </span>
                        <small className="fullname">
                            {
                                user.textMessage || user.media
                                    ?
                                    <>
                                        <div>
                                            {
                                                user.textMessage.length > 30
                                                    ?
                                                    <div>
                                                        {
                                                            user.textMessage.slice(0, 30) + '...'
                                                        }
                                                    </div>

                                                    :
                                                    <div>
                                                        {user.textMessage}
                                                    </div>
                                            }</div>
                                        {
                                            user.media.length > 0 && !user.textMessage &&
                                            <div>
                                                <i className="far fa-image"></i>
                                            </div>
                                        }
                                    </>
                                    :
                                    user.isBlocked === 0
                                        ?
                                        user.full_name
                                        : ''

                            }
                        </small>
                    </div>
                </Link >
            </div>

            <div className="children">
                {
                    children
                }
            </div>
        </div>

    );
}

export default UserCard;