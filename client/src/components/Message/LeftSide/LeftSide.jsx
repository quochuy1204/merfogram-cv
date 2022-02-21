import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import UserCard from '../../UserCard/UserCard'
import './leftside.css'
import { getAPIs } from '../../../utils/fetchAPIs'
import { getConversations } from '../../../redux/actions/messageAction'

import { MESSAGE_TYPES } from '../../../redux/actions/messageAction'

function LeftSide(props) {
    const history = useHistory()

    // Lấy giá trị id từ params
    const { id } = useParams()

    // State dùng để xử lí giá trị ở thanh search, khi người dùng search user để add vào chat box
    const [search, setSearch] = useState('')

    // State dùng để chứa những users được lấy lên từ database mỗi khi người dùng search user
    const [users, setUsers] = useState([])

    const dispatch = useDispatch()

    const { authentication, message } = useSelector(state => state)

    const pageEnd = useRef()

    const [page, setPage] = useState(0)

    const handleOnChangeSearch = (event) => {
        setSearch(event.target.value)
    }

    // Hàm xử lí mỗi khi component được tải lên, hoặc khi người dùng thêm mới một user vào chat box
    useEffect(() => {
        // Kiểm tra xem có phải là lần đầu load component không
        // Nếu không phải lần đầu load component thì return 
        if (message.firstLoad) return;
        dispatch(getConversations({ authentication }))
    }, [dispatch, authentication, message.firstLoad])

    // Hàm xử lí khi người dùng chọn vào một chat box thì trả về giá trị active vào className
    // để đổi background cho thẻ userCard của người được chọn
    const isActive = (user) => {
        if (id === user._id) {
            return 'active'
        }
        return ''
    }

    // Hàm xử lí mỗi khi có sự thay đổi ở thanh search user
    useEffect(() => {
        if (search) {
            getAPIs(`search?user_name=${search}`, authentication.token)
                .then((res) => {
                    setUsers(res.data.users)
                })
                .catch(error => {
                    dispatch({
                        type: 'ALERT',
                        payload: {
                            error: error.response.data.message
                        }
                    })
                })
        }
        else {
            setUsers([])
        }


    }, [search, authentication.token, dispatch])

    // Hàm xử lí khi người dùng nhấn chọn vào một người dùng để add họ vào chat box
    const handleAddChat = (user) => {
        setSearch('')

        setUsers([])

        dispatch({
            type: MESSAGE_TYPES.ADD_CHAT,
            payload: {
                ...user,
                textMessage: '',
                media: []
            }
        })

        return history.push(`/message/${user._id}`)
    }

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setPage])

    useEffect(() => {
        if (message.resultUsers >= (page - 1) * 9 && page > 1) {
            dispatch(getConversations({ authentication, page }))
        }
    }, [message.resultUsers, authentication, page, dispatch])

    return (
        <>
            <form className='message_header'>
                <div className='d-flex'>
                    <span style={{ display: 'flex', alignItems: 'center', color: '#262626', fontWeight: '500', fontSize: '14px' }}>To: </span>
                    <input className='input-search-message' type="text" value={search} placeholder='search' onChange={handleOnChangeSearch} />
                </div>
            </form>

            <div className='message_chat_list'>
                {
                    users.length !== 0
                        ?
                        <>
                            {
                                users.map((user, index) => (
                                    <div key={index} className={`message_user ${isActive(user)}`} onClick={() => handleAddChat(user)}>
                                        <UserCard user={user} />
                                    </div>
                                ))
                            }
                        </>
                        :
                        <>
                            {
                                message.users.map((user, index) => (
                                    <div key={index} className={`message_user ${isActive(user)}`} onClick={() => handleAddChat(user)}>
                                        {/* <UserCard user={user} /> */}

                                        <UserCard user={user} >
                                            {/* <i className='fas fa-circle active' /> */}
                                        </UserCard>
                                    </div>
                                ))
                            }
                        </>
                }

                <button ref={pageEnd} style={{ opacity: '0' }}>+</button>
            </div>
        </>
    );
}

export default LeftSide;