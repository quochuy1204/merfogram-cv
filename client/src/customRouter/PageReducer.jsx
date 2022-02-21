import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import NotFound from '../components/NotFound/NotFound'

import { checkIsBlockedUser } from '../redux/actions/authenticationAction'

const generatePage = (pageName) => {
    const component = () => require(`../pages/${pageName}`).default

    try {
        return React.createElement(component())
    } catch (err) {
        return <NotFound />
    }
}

const PageReducer = () => {
    const { page, id } = useParams()

    const { authentication } = useSelector(state => state)

    const dispatch = useDispatch()

    useEffect(() => {
        if (authentication.token) {
            dispatch(checkIsBlockedUser(authentication.token))
        }

    }, [authentication, dispatch, page, id])

    let pageName = "";
    if (authentication.token) {
        if (id) {
            pageName = `${page}/[id]`;
        } else {
            pageName = `${page}`;

        }
    }
    return generatePage(pageName);
}

export default PageReducer;