import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import Avarta from '../../Avarta/Avarta'

// import { getAPIs } from '../../../utils/fetchAPIs'
import { ADMIN_TYPES } from '../../../redux/actions/adminAction'
import { getAllUser, searchUser } from '../../../redux/actions/adminAction'

import './manageuser.css'


function ManageUser(props) {
    const { authentication, administrator } = useSelector(state => state)

    const dispatch = useDispatch()

    // Khởi tạo state để chứa text cho thanh search
    const [search, setSearch] = useState('')

    // Hàm xử lí mỗi khi component được render
    useEffect(() => {
        dispatch(getAllUser({ authentication }))

    }, [authentication, dispatch])

    // Hàm xử lí khi admin search user
    useEffect(() => {
        if (search) {

            dispatch(searchUser({ authentication, search }))
        }
        else {
            setSearch('')
        }
    }, [search, dispatch, authentication])

    // Hàm xử lý khi người dùng nhấn vào 1 user
    const handleChooseUser = (user) => {
        dispatch({
            type: ADMIN_TYPES.CHOOSE_USER,
            payload: {
                open: true,
                user: user
            }
        })
    }

    return (
        <div className='manage_container'>
            <div className='manage_header'>
                <div className='manage_title'>
                    <span className='span_manage'>Manage User
                        <i style={{ marginLeft: '6px', fontSize: '24px', color: '#fdf498' }} className="fas fa-users"></i>
                    </span>
                </div>

                <div className='manage_search'>
                    <form className='form_manage'>
                        <span className='span_manage_search'>Search: </span>

                        <input autoComplete='disable' className='formManageInput' type="text" placeholder='Search user' name='search' value={search} onChange={(e) => setSearch((e.target.value).toLowerCase())} ></input>

                        <button id="button_search_manage" type='submit'><i className="fas fa-search"></i></button>
                    </form>
                </div>
            </div>

            <div className='manage_body'>
                <div className='manage_table'>
                    <table style={{ position: 'relative' }} className="table table-borderless table-hover">
                        <thead style={{ position: 'sticky', top: '0', backgroundColor: '#FFFFFF' }}>
                            <tr >
                                <th scope="col" className='text-center'>Photo</th>
                                <th scope="col" className='text-center'>Username</th>
                                <th scope="col" className='text-center'>Name</th>
                                <th scope="col" className='text-center'>Email</th>
                                <th scope="col" className='text-center'>Created Date</th>
                                <th scope="col" className='text-center'>Status</th>
                                <th scope="col" className='text-center'>Role</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                search.length > 0
                                    ?
                                    administrator.search_users.map(user => (
                                        <tr key={user._id} >
                                            <td className='text-center' >
                                                <Avarta src={user.photo} size="small-avarta" />
                                            </td>

                                            <td className='text-center' >
                                                <span onClick={() => handleChooseUser(user)} role="button">{user.user_name}</span>
                                            </td>

                                            <td style={{ fontSize: '14px', color: '#8E8E8E', fontWeight: '400', overflow: 'hidden' }} className='text-center' >
                                                {user.full_name}
                                            </td>

                                            <td className='text-center' style={{ fontSize: '14px', fontWeight: '500', color: '#262626', overflow: 'hidden' }} >
                                                {user.email}
                                            </td>

                                            <td className='text-center' style={{ fontStyle: 'italic' }} >
                                                {moment(user.createdAt).format("ll")}
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    user.isBlocked === 0
                                                        ?
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Active </span>
                                                            <i className="text-success fas fa-check-circle"></i>
                                                        </>
                                                        :
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Blocked </span>
                                                            <i className="text-danger fas fa-user-lock"></i>
                                                        </>

                                                }
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    user.role === 0
                                                        ?
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> User </span>
                                                            <i className="fas fa-user text-success"></i>

                                                        </>
                                                        :
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Admin </span>
                                                            <i className="fas fa-user-shield text-danger"></i>
                                                        </>
                                                }

                                            </td>
                                        </tr>
                                    ))
                                    :
                                    administrator.all_users.map(user => (
                                        <tr key={user._id} >
                                            <td className='text-center' >
                                                <Avarta src={user.photo} size="small-avarta" />
                                            </td>

                                            <td style={{ fontSize: '14px', color: '#262626', fontWeight: '500', overflow: 'hidden' }} className='text-center' >
                                                <span onClick={() => handleChooseUser(user)} role="button">{user.user_name}</span>
                                            </td>

                                            <td style={{ fontSize: '14px', color: '#8E8E8E', fontWeight: '400', overflow: 'hidden' }} className='text-center' >
                                                {user.full_name}
                                            </td>

                                            <td className='text-center' style={{ fontSize: '14px', fontWeight: '500', color: '#262626', overflow: 'hidden' }} >
                                                {user.email}
                                            </td>

                                            <td className='text-center' style={{ fontStyle: 'italic' }} >
                                                {moment(user.createdAt).format("ll")}
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    user.isBlocked === 0
                                                        ?
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Active </span>
                                                            <i className="text-success fas fa-check-circle"></i>
                                                        </>
                                                        :
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> Blocked </span>
                                                            <i className="text-danger fas fa-user-lock"></i>
                                                        </>

                                                }
                                            </td>

                                            <td className='text-center' >
                                                {
                                                    user.role === 0
                                                        ?
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}> User </span>
                                                            <i className="fas fa-user text-success"></i>

                                                        </>
                                                        :
                                                        <>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>Admin </span>
                                                            <i className="fas fa-user-shield text-danger"></i>
                                                        </>
                                                }

                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

export default ManageUser;