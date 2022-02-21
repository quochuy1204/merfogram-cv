import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { followUser, unfollowUser } from '../../redux/actions/profileAction'
import './followbutton.css'

function FollowButton({ customStyle, user }) {
    // Khởi tạo state followed cho component FollowButton
    // State followed dùng để kiểm tra xem người dùng đã follow tài khoản được chọn hay chưa
    // Nếu người dùng đã follow tài khoản đã được chọn thì show Button Unfollow và ngược lại
    const [followed, setFollowed] = useState(false)

    const dispatch = useDispatch()

    // Lấy state authentication và profile từ Store về
    const { authentication, profile, socket } = useSelector(state => state)

    const [reload, setReload] = useState(false)

    useEffect(() => {
        // Mỗi lần button follow được render thì kiểm tra xem trong array following của người dùng,
        // có tài khoản nào trùng với tài khoản được render hay không
        // nếu có tức người dùng đã follow tài khoản đó thì setFollowed = true
        if (authentication.user.following.find(item => item._id === user._id)) {
            setFollowed(true)
        }

        return () => setFollowed(false)
    }, [authentication.user.following, user._id])

    const handleFollow = async () => {
        if (reload) {
            return;
        }

        // Sau khi người dùng nhấn nút Follow thì set state followed = true
        setFollowed(true)
        setReload(true)


        // Goi tới action followUser
        await dispatch(followUser({ authentication, user, profile, socket }))
        setReload(false)
    }

    const handleUnfollow = async () => {
        if (reload) {
            return;
        }

        // Sau khi người dùng nhấn nút Unfollow thì set state followed = false
        setFollowed(false)
        setReload(true)


        // Gọi tới action unfollowUser
        await dispatch(unfollowUser({ authentication, user, profile, socket }))
        setReload(false)
    }

    return (
        <div>
            {
                followed ? <button className="unfollow-button" onClick={handleUnfollow} >Following</button> : <button className="follow-button" onClick={handleFollow}>Follow</button>
            }
        </div >
    );
}

export default FollowButton