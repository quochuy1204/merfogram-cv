import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './notificationmodal.css'
import Avatar from '../Avarta/Avarta';
import moment from 'moment'
import { isReadNotify, markReadAll } from '../../redux/actions/notifyAction'

function NotificationModal() {
    const { authentication, notify } = useSelector(state => state)

    // Khởi tạo state notRead để chứa các notify chưa đọc
    const [notRead, setNotRead] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        const newNotRead = notify.data.filter(item => item.isRead === false)

        setNotRead(newNotRead)
    }, [notify.data])

    const handleIsReadNotify = (noti) => {
        dispatch(isReadNotify({ noti, authentication }))
    }

    const handleMarkReadAll = () => {
        dispatch(markReadAll({ notRead, authentication, notify }))
    }

    return (
        <div className='notification-section'>
            <div className='mx-2 notification-header d-flex justify-content-between'>
                <span style={{ color: '#262626', fontSize: '16px', fontWeight: '500' }}>Notification</span>
                <span onClick={handleMarkReadAll} role="button" style={{ color: '#8e8e8e', fontSize: '12px', fontWeight: '400' }}>Mark as read all</span>
            </div>
            {
                notify.data.length > 0
                    ?
                    <div className='notification-container'>
                        {
                            notify.data.map((noti, index) => (
                                <div key={index} >
                                    <Link className='notification-link' style={{ textDecoration: 'none', color: '#262626' }} to={noti.url}
                                        onClick={() => handleIsReadNotify(noti)} >
                                        <div className='d-flex align-items-center'>
                                            {/* {
                                                noti.user.isBlocked === 0
                                                    ?
                                                    <Avatar src={noti.user.photo} size="medium-avarta" />
                                                    :
                                                    <Avatar className="avarta" src="https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1635304905/psnap/user_ciin3x.png" size="medium-avarta" />
                                            } */}
                                            <Avatar src={noti.user.photo} size="medium-avarta" />

                                            <div className='notification-content' style={{ maxWidth: '350px', paddingLeft: '16px' }}>
                                                <div>
                                                    <span style={{
                                                        fontSize: '14px', color: '#262626', fontWeight: '500'
                                                    }}>
                                                        {/* {
                                                            noti.user.isBlocked === 0
                                                                ?
                                                                noti.user.user_name
                                                                :
                                                                'Merfogram user'
                                                        } */}
                                                        {
                                                            noti.user.user_name
                                                        }
                                                    </span>

                                                    <span style={{
                                                        color: '#262626',
                                                        fontSize: '14px',
                                                        fontWeight: '400'
                                                    }}>
                                                        {
                                                            ` ${noti.text}`
                                                        }

                                                    </span>

                                                    <span>
                                                        {
                                                            noti.caption
                                                                ?

                                                                noti.caption.length > 100
                                                                    ?
                                                                    `" ${noti.caption.slice(0, 100)} ..."`
                                                                    :
                                                                    `" ${noti.caption} "`
                                                                :
                                                                ''

                                                        }
                                                    </span>
                                                    <span style={{ color: '#8e8e8e', fontSize: '12px' }}> {moment(noti.createdAt).fromNow()} </span>
                                                </div>
                                            </div>

                                        </div>

                                        <div>
                                            {
                                                !noti.isRead && <i style={{ color: '#0095f6', fontSize: '8px', marginRight: '6px' }} className='fas fa-circle' />
                                            }
                                            {
                                                noti.image &&
                                                <img src={noti.image} alt='notification' style={{ width: '40px', height: '40px' }} />
                                            }

                                        </div>

                                    </Link>
                                </div>

                            ))
                        }
                    </div>

                    :
                    <div className='no-notification'>
                        <span>You don't have any news.</span>
                    </div>
            }
        </div>
    );
}

export default NotificationModal;