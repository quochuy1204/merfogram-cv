import React from 'react';
import UserCard from '../UserCard/UserCard'
import FollowButton from '../FollowButton/FollowButton';
import { useSelector } from 'react-redux'
import '../ListFollowers/listfollowers.css'

function ListFollowing({ users, setShowFollowing }) {
    const { authentication } = useSelector(state => state)
    return (
        <div className="follow-page">
            <div className="follow-box">
                <div className="follow-box-header">
                    <h1>Following</h1>
                    <div className="close-button" onClick={() => setShowFollowing(false)}>&times;</div>
                </div>

                <div className='following-list'>
                    {
                        users.map(user => (
                            <UserCard user={user} setShowFollowing={setShowFollowing} key={user._id}>
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

export default ListFollowing;