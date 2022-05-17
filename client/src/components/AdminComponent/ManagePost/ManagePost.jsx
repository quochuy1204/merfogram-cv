import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

// import Avarta from '../../Avarta/Avarta'

// import { getAPIs } from '../../../utils/fetchAPIs'
// import { ADMIN_TYPES } from '../../../redux/actions/adminAction'
import { getAllPosts, blockPostAdmin, unblockPostAdmin } from '../../../redux/actions/adminAction'

import './managepost.css'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function ManagePost(props) {
    // Get the authentication and administrator state from store
    const { authentication, administrator } = useSelector(state => state)

    const dispatch = useDispatch()

    // Create state named searchUsername and it own set functional to store the search by creator username value
    const [searchByCreator, setSearchByCreator] = useState('')

    // Create the state named searchById and it own set functional to store the search by post id value
    const [searchById, setSearchById] = useState('')

    // Create state status to store the status value of report
    const [status, setStatus] = useState('')

    // Create state sort to store the sort by createdAt value
    const [sort, setSort] = useState('')


    // Once the component rendered, dispatch the getAllPosts Thunk Action to Reducer to get all of the posts 
    useEffect(() => {
        dispatch(getAllPosts({ authentication, searchByCreator, searchById, status, sort }))
    }, [authentication, dispatch, searchByCreator, searchById, status, sort])

    // Function to handle when admin click on the Block Post Button
    const handleBlockPostAdmin = async ({ post }) => {
        console.log({ post })
        confirmAlert({
            title: 'Block post',
            message: 'Are you want to block this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(blockPostAdmin({ post, authentication }))
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return
                    }
                }
            ]
        })
    }

    // Function to handle when admin click on the Unblock post
    const handleUnblockPostAdmin = ({ post }) => {
        confirmAlert({
            title: 'Unblock post',
            message: 'Are you want to unblock this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(unblockPostAdmin({ post, authentication }))
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return
                    }
                }
            ]
        })
    }

    // Function to handle when admin make changed to searchByCreator
    const handleOnChangeSearchByCreator = (event) => {
        setSearchByCreator(event.target.value)
    }

    // Function to handle when admin make changed to searchById
    const handleOnChangeSearchByID = (event) => {
        setSearchById(event.target.value)
    }

    // Function to handle on change sort
    const handleOnChangeSort = (event) => {
        setSort(event.target.value)
    }

    // Function to handle on change status event listener
    const handleOnChangeStatus = (event) => {
        setStatus(event.target.value)
    }

    useEffect(() => {
        console.log(searchByCreator)
    }, [searchByCreator])

    useEffect(() => {
        console.log(searchById)
    }, [searchById])

    return (
        <div className='manage_container'>
            <div className='manage_header'>
                <div className='manage_title'>
                    <span className='span_manage'>Manage Post
                        <i style={{ marginLeft: '6px', fontSize: '24px', color: '#96ceb4' }} className="fas fa-portrait"></i>
                    </span>
                </div>

                <div className='manage_search'>
                    <form style={{ width: '250px' }} className='form_manage'>

                        <input autoComplete='disable' className='formManageInput' type="text" placeholder="Enter post's creator" name='search' value={searchByCreator} onChange={handleOnChangeSearchByCreator} ></input>

                        <button id="button_search_manage" type='submit'><i className="fas fa-search"></i></button>
                    </form>

                    <form style={{ width: '250px' }} className='form_manage'>

                        <input autoComplete='disable' className='formManageInput' type="text" placeholder="Enter post's ID" name='search' value={searchById} onChange={handleOnChangeSearchByID} ></input>

                        <button id="button_search_manage" type='submit'><i className="fas fa-search"></i></button>
                    </form>

                    <select className='sort-status' name='status' value={status} onChange={handleOnChangeStatus}>
                        <option value="">Choose status</option>
                        <option value="isDeleted=false" >Active</option>
                        <option value="isDeleted=true" >Blocked</option>
                    </select>

                    <select className='sort-date' name='sort' value={sort} onChange={handleOnChangeSort}>
                        <option value="">Newest</option>
                        <option value="sort=oldest" >Oldest</option>
                    </select>
                </div>
            </div>

            <div className='manage_body'>
                <div className='manage_table'>
                    <table style={{ position: 'relative' }} className="table table-borderless table-hover">
                        <thead style={{ position: 'sticky', top: '0', backgroundColor: '#FFFFFF', zIndex: '1' }}>
                            <tr >
                                <th scope="col" className='text-center'>ID</th>
                                <th scope="col" className='text-center'>Image</th>
                                <th scope="col" className='text-center'>Caption</th>
                                <th scope="col" className='text-center'>Creator</th>
                                <th scope="col" className='text-center'>Created Date</th>
                                <th scope="col" className='text-center'>Status</th>
                                <th scope="col" className='text-center'>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                administrator.all_posts.map(post => (
                                    <tr key={post._id} >

                                        <td style={{
                                            maxWidth: '145px',
                                            overflow: 'hidden'
                                        }} className='text-center' >
                                            <p style={{
                                                color: '#262626',
                                                fontSize: '10px',
                                                fontWeight: '500',
                                            }}>{post._id}</p>
                                        </td>

                                        <td className='text-center' >
                                            <Link to={`/post/${post._id}`}>
                                                <img style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'cover'
                                                }} src={post.images[0].url} alt="post" />
                                            </Link>
                                        </td>

                                        <td className='text-center' style={{
                                            maxWidth: '250px',
                                            overflow: 'hidden',
                                            color: '#262626',
                                            fontSize: '14px'
                                        }} >
                                            {
                                                post.caption.length > 200
                                                    ?
                                                    post.caption.slice(0, 200) + ' ...'
                                                    :
                                                    post.caption
                                            }
                                        </td>

                                        <td className='text-center' style={{
                                            maxWidth: '240px',
                                            overflow: 'hidden',
                                            color: '#262626',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }} >
                                            {
                                                post.user.user_name
                                            }
                                        </td>

                                        <td className='text-center' style={{
                                            color: '#262626',
                                            fontSize: '12px'
                                        }}>
                                            {moment(post.createdAt).format('ll')}
                                        </td>

                                        <td className='text-center' >
                                            {
                                                post.isDeleted === false
                                                    ?
                                                    <>
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    </>
                                                    :
                                                    <>
                                                        <i className="fas fa-ban text-danger"></i>
                                                    </>
                                            }
                                        </td>

                                        <td className='text-center'>
                                            {
                                                post.isDeleted === false
                                                    ?
                                                    <button className='btn-danger m-auto' onClick={() => handleBlockPostAdmin({ post })}>Block</button>
                                                    :
                                                    <button className='btn-success m-auto' onClick={() => handleUnblockPostAdmin({ post })}>Unblock</button>
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

export default ManagePost;