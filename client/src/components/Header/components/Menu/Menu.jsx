import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../../redux/actions/authenticationAction'
import Avatar from '../../../Avarta/Avarta';
import '../../../../../node_modules/bootstrap/dist/js/bootstrap.min.js'
import './menu.css'
import NotificationModal from '../../../Notification/NotificationModal';
import { TYPES } from '../../../../redux/actions/profileAction'

function Menu(props) {
    const { pathname } = useLocation()

    const dispatch = useDispatch()

    const { authentication, notify } = useSelector(state => state)

    // Khởi tạo state notRead dùng để chứa những notify chưa đọc
    const [notRead, setNotRead] = useState([])

    useEffect(() => {
        const newNotRead = notify.data.filter(item => item.isRead === false)

        setNotRead(newNotRead)
    }, [notify.data])


    const navLinks = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Message', icon: 'mail', path: '/message' },
        { label: 'Explore', icon: 'explore', path: '/explore' },
        // { label: 'Notification', icon: 'notifications', path: '/notify' }
    ]

    const isIcon = (pathName) => {
        if (pathName === pathname) {
            return 'material-icons'
        } else {
            return 'material-icons-outlined'
        }
    }

    const handleLogout = () => {
        dispatch(logout())
    }

    // Hàm xử lí khi người dùng nhấn vào button change password
    const handleChangePassword = () => {
        if (authentication.token) {
            dispatch({
                type: TYPES.CHANGE_PASSWORD_MODAL,
                payload: true
            })
        }
    }

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                {
                    navLinks.map((link, index) => (
                        <li className="nav-item" key={index}>
                            <Link style={{ textDecoration: 'none' }} className="nav-link menu-items" to={link.path}><span style={{ color: 'black' }} className={`icon ${isIcon(link.path)}`}>{link.icon}</span></Link>
                        </li>
                    ))
                }

                {/* Dropdown menu cho notification */}
                <div className="nav-item dropdown">
                    <span style={{ color: notRead.length > 0 ? 'crimson' : 'black' }} className="nav-link icon material-icons-outlined" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        favorite
                    </span>

                    <div className="dropdown-menu" style={{ minWidth: '500px', minHeight: '365px', overflow: 'auto' }}>
                        <div>
                            <NotificationModal />
                        </div>
                    </div>
                </div>

                {/* Dropdown menu cho profile */}
                <li className="nav-item dropdown">
                    <span className="nav-link " id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Avatar src={authentication.user.photo} size="small-avarta" />
                    </span>

                    <ul className="dropdown-menu" >
                        <li><Link className="dropdown-item" to={`/profile/${authentication.user._id}`}><span className="material-icons-outlined dropdown-icon">account_circle</span>Profile</Link></li>
                        <li><hr className="dropdown-divider"></hr></li>

                        {
                            authentication.role === 1 &&
                            <>
                                <li><Link className="dropdown-item" to="/admin"><span className="material-icons dropdown-icon">admin_panel_settings</span>Admin Dashboard</Link></li>
                                <li><hr className="dropdown-divider"></hr></li>
                            </>
                        }
                        <li>
                            <button onClick={handleChangePassword} className='dropdown-item' >
                                <span className="material-icons dropdown-icon">
                                    key
                                </span>
                                Change Password
                            </button>
                        </li>
                        <li><hr className="dropdown-divider"></hr></li>

                        <li><Link className="dropdown-item" to="/" onClick={handleLogout}><span className="material-icons-outlined dropdown-icon">logout</span>Logout</Link></li>
                    </ul>
                </li>

            </ul>
        </div>
    );
}

export default Menu;