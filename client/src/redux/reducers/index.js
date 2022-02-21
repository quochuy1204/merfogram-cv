import { combineReducers } from 'redux'
import authenticationReducer from './authenticationReducer'
import alertReducer from './alertReducer'
import profileReducer from './profileReducer'
import statusReducer from './statusReducer'
import postReducer from './postReducer'
import detailPostReducer from './detailPostReducer'
import discoverReducer from './discoverReducer'
import suggestionReducer from './suggestionReducer'
import socketReducer from './socketReducer'
import notifyReducer from './notifyReducer'
import messageReducer from './messageReducer'
import adminReducer from './adminReducer'

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    alert: alertReducer,
    profile: profileReducer,
    status: statusReducer,
    homepagePost: postReducer,
    detailPosts: detailPostReducer,
    discover: discoverReducer,
    suggestion: suggestionReducer,
    socket: socketReducer,
    notify: notifyReducer,
    message: messageReducer,
    administrator: adminReducer
})

export default rootReducer