import { MESSAGE_TYPES } from '../actions/messageAction'
import { editData, deleteData } from '../../utils/globalTypes'

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.ADD_CHAT:
            if (state.users.every(item => item._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.users]
                };
            }
            return state;
        case MESSAGE_TYPES.ADD_MESSAGE:
            return {
                ...state,

                data: state.data.map(item =>
                    item._id === action.payload.recipent || item._id === action.payload.sender
                        ?
                        {
                            ...item,
                            messages: [...item.messages, action.payload],
                            result: item.result + 1
                        }
                        : item
                ),

                users: state.users.map(user =>
                    user._id === action.payload.recipent || user._id === action.payload.sender
                        ?
                        {
                            ...user,
                            textMessage: action.payload.textMessage,
                            media: action.payload.media
                        }
                        :
                        user
                )
            }
        case MESSAGE_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                users: action.payload.newArr,
                resultUsers: action.payload.result,
                firstLoad: true
            }
        case MESSAGE_TYPES.GET_MESSAGES:
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        case MESSAGE_TYPES.UPDATE_MESSAGES:
            // console.log(action.payload)
            return {
                ...state,
                data: editData(state.data, action.payload._id, action.payload)
            }
        case MESSAGE_TYPES.DELETE_MESSAGE:
            // console.log(action.payload)
            return {
                ...state,
                data: state.data.map(item =>
                    item._id === action.payload._id
                        ?
                        { ...item, messages: action.payload.newData }
                        : item
                )
            }
        case MESSAGE_TYPES.DELETE_CONVERSATION:
            // console.log(action.payload)
            return {
                ...state,
                users: deleteData(state.users, action.payload),
                data: deleteData(state.data, action.payload)
            }
        default:
            return state;
    }
}

export default messageReducer