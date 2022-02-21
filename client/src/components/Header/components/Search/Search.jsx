import React, { useState, useEffect } from 'react';
import { getAPIs } from '../../../../utils/fetchAPIs'
import { useSelector, useDispatch } from 'react-redux'
import UserCard from '../../../UserCard/UserCard'
import './search.css'

function Search(props) {
    const [search, setSearch] = useState('')

    const [users, setUsers] = useState([])

    const { authentication } = useSelector(state => state)

    const dispatch = useDispatch()

    const handleOnChane = (event) => {
        const { value } = event.target

        setSearch(value.toLowerCase())
    }

    const handleCloseSearch = () => {
        setSearch('')
        setUsers([])
    }

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


    return (
        <form className="search-form">
            <input autoComplete="nothing" id="search" type="text" name="search" value={search} onChange={handleOnChane} />
            <div className="search-icon" style={{ opacity: search ? 0 : 0.5 }}>
                <span className="material-icons">
                    search
                </span>

                <span>Search</span>
            </div>
            <div onClick={handleCloseSearch} style={{ opacity: search ? 0.5 : 0 }} className="close-search" role="button">&times;</div>

            {
                search ?
                    <div className="search-users">
                        {
                            users.length === 0 ?
                                <div className="no-result">
                                    <span>No results found.</span>
                                </div>
                                :
                                users.map((user) => (
                                    <UserCard key={user._id} user={user} handleCloseSearch={handleCloseSearch} />
                                ))
                        }
                    </div>
                    : ''
            }

        </form>
    );
}

export default Search;