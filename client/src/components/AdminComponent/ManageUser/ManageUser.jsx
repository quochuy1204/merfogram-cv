import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import Avarta from '../../Avarta/Avarta'

// import { getAPIs } from '../../../utils/fetchAPIs'
import { getUserDetail } from '../../../redux/actions/adminAction'
import { getAllUser } from '../../../redux/actions/adminAction'

import './manageuser.css'


function ManageUser(props) {
    const { authentication, administrator } = useSelector(state => state)

    const token = useSelector(state => state.authentication.token)

    const dispatch = useDispatch()

    // Khởi tạo state để chứa text cho thanh search
    const [search, setSearch] = useState('')

    // Create state status to store the status value of user's account
    const [status, setStatus] = useState('')

    // Create state sort to store the sort by createdAt Date value
    const [sort, setSort] = useState('')

    // Create state role to store the sort by role value
    const [role, setRole] = useState('')

    // Hàm xử lí mỗi khi component được render
    useEffect(() => {
        dispatch(getAllUser({ authentication, search, status, role, sort }))

    }, [authentication, dispatch, search, status, role, sort])

    // Function to handle when admin click to the username of the user to choose the particular user to manage
    const handleManageUser = (user) => {
        if (user) {
            dispatch(getUserDetail({ user: user, token: token }))
        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: 'Please choose a user.'
                }
            })
        }
    }

    // Function to handle on change search state
    const handleOnChangeSearch = (event) => {
        setSearch((event.target.value).toLowerCase())
    }

    // Function to handle on change status event listener
    const handleOnChangeStatus = (event) => {
        setStatus(event.target.value)
    }

    // Function to handle on change sort
    const handleOnChangeSort = (event) => {
        setSort(event.target.value)
    }

    // Function to handle on change user role
    const handleOnChangeRole = (event) => {
        setRole(event.target.value)
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
                    <form style={{ width: '350px' }} className='form_manage'>
                        <span className='span_manage_search'>Search: </span>

                        <input autoComplete='disable' className='formManageInput' type="text" placeholder='Search user' name='search' value={search} onChange={handleOnChangeSearch} ></input>

                        <button id="button_search_manage" type='submit'><i className="fas fa-search"></i></button>
                    </form>

                    <select className='sort-status' name='status' value={status} onChange={handleOnChangeStatus}>
                        <option value="">Choose status</option>
                        <option value="isBlocked=0" >Active</option>
                        <option value="isBlocked=1" >Blocked</option>
                    </select>

                    <select className='sort-date' name='sort' value={sort} onChange={handleOnChangeSort}>
                        <option value="">Newest</option>
                        <option value="sort=createdAt" >Oldest</option>
                    </select>


                    <select className='sort-date' name='role' value={role} onChange={handleOnChangeRole}>
                        <option value="">Choose Role</option>
                        <option value="role=0">User</option>
                        <option value="role=1" >Admin</option>
                    </select>
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
                                <th scope="col" className='text-center'>Date</th>
                                <th scope="col" className='text-center'>Status</th>
                                <th scope="col" className='text-center'>Role</th>
                            </tr>
                        </thead>

                        <tbody>

                            {

                                administrator.all_users.map(user => (
                                    <tr key={user._id} >
                                        <td className='text-center' >
                                            <Avarta src={user.photo} size="small-avarta" />
                                        </td>

                                        <td style={{ fontSize: '14px', color: '#262626', fontWeight: '500', overflow: 'hidden' }} className='text-center' >
                                            <span onClick={() => handleManageUser(user)} role="button">{user.user_name}</span>
                                        </td>

                                        <td style={{ fontSize: '14px', color: '#8E8E8E', fontWeight: '400', overflow: 'hidden' }} className='text-center' >
                                            {user.full_name}
                                        </td>

                                        <td className='text-center' style={{ fontSize: '14px', fontWeight: '500', color: '#262626', overflow: 'hidden' }} >
                                            {user.email}
                                        </td>

                                        <td className='text-center' style={{
                                            color: '#262626',
                                            fontSize: '12px'
                                        }} >
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