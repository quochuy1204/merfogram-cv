import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'

import { getAPIs } from '../../utils/fetchAPIs'

import './admincomponent.css'

import ManagePost from './ManagePost/ManagePost';
import ManageUser from './ManageUser/ManageUser';

function AdminComponent(props) {
    const { authentication } = useSelector(state => state)

    const [changeModal, setChangeModal] = useState('user')

    const [postLength, setPostLength] = useState(0)

    const [userLength, setUserLength] = useState(0)

    useEffect(() => {
        getAPIs('admin/getallusers', authentication.token)
            .then(res => setUserLength(res.data.result))

        getAPIs('admin/getallposts', authentication.token)
            .then(res => setPostLength(res.data.result))
    }, [authentication.token])

    return (
        <div className='admin_page_container'>

            <div className='admin_component'>

                <div className='admin_header'>

                    <span className='span_header'><i style={{ marginRight: '6px' }} className="fas fa-user-shield"></i>Administrator Dashboard</span>

                    <div className='firgure_display'>
                        <button onClick={() => setChangeModal('chart')} className='manage_button'>
                            Charts
                            <i style={{ marginLeft: '6px', fontSize: '34px', color: '#0392cf' }} className="far fa-chart-bar"></i>
                        </button>

                        <button onClick={() => setChangeModal('user')} className='manage_button'>
                            Total {userLength} Users
                            <i style={{ marginLeft: '6px', fontSize: '34px', color: '#fdf498' }} className="fas fa-users"></i>
                        </button>

                        <button onClick={() => setChangeModal('post')} className='manage_button'>
                            Total {postLength} Posts

                            <i style={{ marginLeft: '6px', fontSize: '34px', color: '#96ceb4' }} className="fas fa-portrait"></i>
                        </button>

                        <button onClick={() => setChangeModal('report')} className='manage_button'>
                            1000 Reports

                            <i style={{ marginLeft: '6px', fontSize: '34px', color: '#ff7f50' }} className="fas fa-flag"></i>
                        </button>

                    </div>

                </div>

                <div className='admin_body'>
                    {
                        changeModal === 'user' &&
                        <ManageUser />
                    }

                    {
                        changeModal === 'post' &&
                        <ManagePost />
                    }
                </div>

            </div>
        </div>
    );
}

export default AdminComponent; 