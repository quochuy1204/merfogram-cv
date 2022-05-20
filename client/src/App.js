import { BrowserRouter, Route } from 'react-router-dom';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PageReducer from './customRouter/PageReducer';
import PrivateRouter from './customRouter/PrivateRouter'

import Home from './pages/home'
import Login from './pages/login'
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import RedirectPage from './pages/redirect'

// Modal
import StatusModal from './components/HomePage/StatusSection/StatusModal/StatusModal';
import EditPostModal from './components/HomePage/Posts/EditPostModal/EditPostModal';
import SharePostModal from './components/HomePage/Posts/SharePostModal/SharePostModal';
import NotificationModal from './components/Notification/NotificationModal';
import ManageUserModal from './components/AdminComponent/ManageUser/ManageUserModal/ManageUserModal';
import ChangePassword from './components/ChangePasswordModal/ChangePassword';
import ManageReportModal from './components/AdminComponent/ManageReport/ManageReportModal/ManageReportModal';

import { refreshToken, checkIsBlockedUser } from './redux/actions/authenticationAction'
import { getPosts } from './redux/actions/postAction'
import { getNotifies } from './redux/actions/notifyAction'
import { getUserSuggestion } from './redux/actions/suggestionAction'
import { GLOBALTYPES } from './utils/globalTypes';

import SocketClient from './SocketClient';
import io from 'socket.io-client';
import ReportPostModal from './components/HomePage/Posts/ReportPostModal/ReportPostModal';


function App() {
  // Lấy về state.authentication hiện tại đang có trong store
  const { authentication, status, homepagePost, notify, administrator, profile } = useSelector(state => state)

  const dispatch = useDispatch()

  useEffect(() => {
    if (authentication.token) {
      dispatch(checkIsBlockedUser(authentication.token))
    }

  }, [authentication, dispatch])

  // Hàm useEffect sẽ chạy mỗi khi component được render
  useEffect(() => {

    // Gửi lên store một action refreshToken
    // Action này chủ yếu nhằm kiểm tra xem người dùng đã login hay chưa
    // Nếu người dùng login rồi thì lưu lại thông tin người dùng cũng như accesstoken trong state.authentication
    dispatch(refreshToken())

    // Socket config
    // Mỗi lần người dùng truy cập vào ứng dụng thì sẽ mở một kết nối socket tới server
    const socket = io()

    // Gửi action type SOCKET lên store để cập nhật state socket
    dispatch({
      type: GLOBALTYPES.SOCKET,
      payload: socket
    })

    // Tạm thời ngắt kết nối socket tới server
    return () => socket.close()

  }, [dispatch])

  useEffect(() => {
    // Kiểm tra xem state authentication.token có tồn tại hay không
    // Nếu có thì gọi action getPosts
    if (authentication.token) {
      dispatch(getPosts(authentication.token))
    }
  }, [dispatch, authentication.token, status])

  useEffect(() => {
    // Kiểm tra xem state authentication.token có tồn tại hay không
    // Nếu có thì gọi action getPosts
    if (authentication.token) {

      // Gửi action lên store để lấy những user được suggestion về 
      dispatch(getUserSuggestion(authentication.token))

      // Gửi action get notifies lên store để lấy về notifies
      dispatch(getNotifies(authentication.token))
    }
  }, [dispatch, authentication.token])

  // Hàm xử lí gửi thông báo vào trung tâm kiểm soát của thiết bị người dùng khi có thông báo mới
  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") { }
      });
    }
  }, [])

  return (
    <BrowserRouter>
      <Alert />
      <input type="checkbox" id="dark-mode" />
      <div className="App">
        <div className="main">
          {authentication.token && <Header />}
          {status && <StatusModal />}
          {homepagePost.openEditModal && <EditPostModal />}
          {homepagePost.sharePost.openModal === true && <SharePostModal />}
          {authentication.token && <SocketClient />}
          {notify.open_notification_modal === true && <NotificationModal />}
          {administrator.manage_user.open_modal && <ManageUserModal />}
          {profile.change_password_modal === true && <ChangePassword />}
          {homepagePost.openReportModal.open && <ReportPostModal />}
          {administrator.manage_report.open_modal === true && <ManageReportModal />}

          {/* <Route exact path="/adminpanel" component={authentication.token && authentication.role === 1 && AdminPage} /> */}
          {/* <Route exact path="/register" component={Register} /> */}

          {/* Kiểm tra xem thông tin về người dùng đã login có tồn tại hay không, nếu có thì trả về component Home, nếu không thì trả về component Login*/}
          {/* <Route exact path="/" component={authentication.token ? Home : Login} />
          <Route exact path="/:page/:id" component={authentication.token ? PageReducer : Login} />
          <Route exact path="/:page" component={authentication.token ? PageReducer : Login} /> */}

          <Route exact path="/" component={authentication.token ? Home : Login} />
          <Route exact path="/login" component={RedirectPage} />

          <PrivateRouter exact path="/:page" component={PageReducer} />
          <PrivateRouter exact path="/:page/:id" component={PageReducer} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
