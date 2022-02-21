import React, { useEffect, useState } from 'react';
import Avarta from '../Avarta/Avarta'
import './userinformation.css'
import EditInformation from '../EditInformation/EditInformation';
import FollowButton from '../FollowButton/FollowButton';
import ListFollowers from '../ListFollowers/ListFollowers'
import ListFollowing from '../ListFollowing/ListFollowing'

function UserInformation({ id, profile, authentication, dispatch }) {
    // Lấy id từ request params

    // Lấy state authentication và profile trên store về 
    const [postLength, setPostLength] = useState(0)

    const [userInfor, setUserInfor] = useState([])

    // Tạo state edit để quản lý trạng thái của nút Edit Profile
    // Nếu edit = true thì show form edit cho người dùng và người lại
    const [edit, setEdit] = useState(false)

    const [showFollowers, setShowFollowers] = useState(false)

    const [showFollowing, setShowFollowing] = useState(false)

    useEffect(() => {
        // Mỗi khi component được load kiểm trả xem id params và id của chủ tài khoản có trùng nhau không
        // Nếu trùng thì set state userInfor chính bằng thông tin của chủ tài khoản
        if (id === authentication.user._id) {
            setUserInfor([authentication.user])
        }
        // Nếu không trùng thì gọi action getUserProfile
        else {
            // Action này sẽ kiểm tra trong list users trong state profile có người dùng nào trùng id với id params hay không
            // Nếu không thì thêm người dùng đó vào list users
            // dispatch(getUserProfile({ users: profile.users, id, authentication }))

            // Sau khi thông tin của người dùng có id = id params đã được thêm vào list users
            // thì dùng hàm filter lấy ra thông tin của người dùng đó và gán vào userInfor2
            const userInfor2 = profile.users.filter(user => user._id === id)

            // Set state userInfor = userInfor2
            setUserInfor(userInfor2)

        }

        profile.user_posts.forEach(item => {
            if (item._id === id) {
                setPostLength(item.result)
            }
        })

    }, [id, authentication, profile.users, profile.user_posts])

    return (
        <div className="infor">
            {
                userInfor.map(user => (
                    < div className="infor_container" key={user._id} >
                        <div className="user-avarta">
                            {
                                user.isBlocked === 0
                                    ?
                                    <Avarta className="avarta" src={user.photo} size="large-avarta" />
                                    :
                                    <Avarta className="avarta" src="https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1635304905/psnap/user_ciin3x.png" size="large-avarta" />
                            }

                        </div>

                        <div className="infor_content">
                            <div className="infor_content_title">
                                <h2 className="user_name">
                                    {
                                        user.isBlocked === 0
                                            ?
                                            user.user_name
                                            :
                                            "Merfogram user"
                                    }
                                </h2>

                                {
                                    user.isBlocked === 0
                                        ?
                                        user.isVerified === 1 &&
                                        <span style={{ color: '#3797F0', marginRight: '6px', fontSize: '18px' }} className="material-icons">
                                            verified
                                        </span>
                                        :
                                        ''
                                }

                                {
                                    user.isBlocked === 0
                                        ?
                                        user._id === authentication.user._id ? <button onClick={() => setEdit(true)} className="btn_edit_profile">Edit Profile</button>
                                            : <FollowButton user={user} customStyle="btn_edit_profile" />
                                        :
                                        ''
                                }
                            </div>

                            <div className="follow_btn">
                                {
                                    user.isBlocked === 0
                                        ?
                                        <>
                                            <span><b>{postLength}</b> posts </span>

                                            <span role="button" onClick={() => setShowFollowers(true)} ><b>{user.followers.length}</b> followers </span>

                                            <span role="button" onClick={() => setShowFollowing(true)} ><b>{user.following.length}</b> following </span>
                                        </>
                                        : ''
                                }

                            </div>

                            <div className="infor_content_bio">
                                {
                                    user.isBlocked === 0
                                        ?
                                        <>
                                            <h1 className="full_name"> {user.full_name} </h1>

                                            <span style={{ width: '500px' }} className="bio"> {user.story} </span>

                                            <a className="website" href={user.website} target="_blank" rel="noreferrer" > {user.website} </a>
                                        </>
                                        : ''
                                }

                            </div>

                        </div>
                        {
                            edit ? <EditInformation user={user} setEdit={setEdit} /> : ''
                        }

                        {
                            showFollowers && <ListFollowers users={user.followers} setShowFollowers={setShowFollowers} />
                        }

                        {
                            showFollowing && <ListFollowing users={user.following} setShowFollowing={setShowFollowing} />
                        }
                    </div>
                ))
            }
        </div >
    )
}

export default UserInformation;