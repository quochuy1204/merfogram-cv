import React from 'react';
import UserCard from '../UserCard/UserCard'
import FollowButton from '../FollowButton/FollowButton';
import { useSelector } from 'react-redux'
import './listfollowers.css'

function ListFollowers({ users, setShowFollowers }) {
    const { authentication } = useSelector(state => state)
    return (
        <div className="follow-page">
            <div className="follow-box">
                <div className="follow-box-header">
                    <h1>Followers</h1>
                    <div className="close-button" onClick={() => setShowFollowers(false)}>&times;</div>
                </div>

                <div className="user-card-box">
                    {
                        users.map(user => (
                            <UserCard user={user} key={user._id} setShowFollowers={setShowFollowers} >
                                {
                                    authentication.user._id !== user._id && <FollowButton user={user} customStyle="btn_edit_profile" />
                                }
                            </ UserCard>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default ListFollowers;