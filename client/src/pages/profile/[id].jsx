import React, { useEffect, useState } from 'react';

import Post from '../../components/ProfilePost/Post';
import UserInformation from '../../components/UserInformation/UserInformation';
import Footer from '../../components/Footer/Footer'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/actions/profileAction'

function Profile(props) {
    const { authentication, profile } = useSelector(state => state)

    const [title, setTitle] = useState('')

    const dispatch = useDispatch()

    const { id } = useParams()

    useEffect(() => {
        if (profile.ids.every(item => item !== id)) {
            dispatch(getUserProfile({ users: profile.users, id, authentication }))
        }
    }, [dispatch, profile, id, authentication])

    useEffect(() => {
        const user = profile.users.find(item => item._id === id)

        if (user) {
            setTitle(user.user_name)
        }
    }, [id, profile.users])

    useEffect(() => {
        document.title = `@${title} • Merfogram`
    }, [title])

    return (
        <div className="profile">
            <UserInformation authentication={authentication} profile={profile} dispatch={dispatch} id={id} />

            <div style={{
                width: '100%',
                height: '2px',
                borderTop: '1px solid rgba(var(--b38,219,219,219),1)',
                marginTop: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center'
            }} className='hr'>
                <div
                    style={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'space-around'
                    }} className='button-change-section'>

                    <button style={{
                        border: 'none',
                        outline: 'none',
                        color: '#262626',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        borderTop: '1px solid #262626',
                        borderRadius: '0'
                    }} className='post-section'><i className="fas fa-th"></i> POSTS </button>

                    <button style={{
                        border: 'none',
                        outline: 'none',
                        color: '#262626',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        borderTop: '1px solid #262626',
                        borderRadius: '0'
                    }} className='post-section'><i className="far fa-play-circle"></i> VIDEOS </button>

                    <button style={{
                        border: 'none',
                        outline: 'none',
                        color: '#262626',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        borderTop: '1px solid #262626',
                        borderRadius: '0'
                    }} className='post-section'><i className="fas fa-bookmark"></i> SAVED </button>
                </div>
            </div>

            <Post authentication={authentication} profile={profile} dispatch={dispatch} id={id} />

            <div className='footer'>
                <Footer />
            </div>
        </div>
    );
}

export default Profile;