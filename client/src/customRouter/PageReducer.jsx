import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

// Import Component
import NotFound from '../components/NotFound/NotFound'

// Import Actions
import { checkIsBlockedUser } from '../redux/actions/authenticationAction'

// Import Utils
import publicPages from '../utils/publicPages';

// Hàm tạo ra Component
const generatePage = (pageName) => {

    const component = () => require(`../pages/${pageName}`).default

    try {
        return React.createElement(component())
    } catch (err) {
        return <NotFound />
    }
}

const PageReducer = () => {
    // Lấy ra 2 giá trị page và id ở url
    const { page, id } = useParams()

    // Lấy ra state authentication
    const { authentication } = useSelector(state => state)

    const dispatch = useDispatch()

    // Nếu người dùng đã đăng nhập - kiểm tra xem người dùng có bị block không
    // nếu người dùng bị block thì không cho người dùng vào ứng dụng
    useEffect(() => {
        if (authentication.token) {
            dispatch(checkIsBlockedUser(authentication.token))
        }

    }, [authentication, dispatch, page, id])

    let pageName = "";

    let firstLogin = localStorage.getItem('firstLogin')

    let pageCheck = publicPages.find(item => item === page)

    if (authentication.token) {
        if (pageCheck) {
            pageName = 'notfound'
        } else {
            if (id) {
                pageName = `${page}/[id]`
            } else {
                pageName = `${page}`
            }
        }

    } else {
        // Trường hợp người dùng chưa đăng 
        if (pageCheck) {
            if (id) {
                pageName = `${pageCheck}/[id]`
            } else {
                pageName = `${pageCheck}`
            }
        } else {
            if (!firstLogin) {
                pageName = 'redirect'
            }
        }
    }

    return generatePage(pageName)

}

export default PageReducer;