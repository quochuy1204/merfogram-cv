import { NOTIFY_TYPES } from '../actions/notifyAction'
import { editData, deleteData } from '../../utils/globalTypes'

const initialState = {
    data: [],
    loading: false
}

const notifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFY_TYPES.GET_NOTIFIES:
            return {
                ...state,
                data: action.payload
            };
        case NOTIFY_TYPES.CREATE_NOTIFY:
            return {
                ...state,
                data: [action.payload, ...state.data]
            };
        case NOTIFY_TYPES.DELETE_NOTIFY:
            return {
                ...state,
                data: deleteData(state.data, action.payload._id)
            };
        case NOTIFY_TYPES.UPDATE_NOTIFY:
            return {
                ...state,
                data: editData(state.data, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default notifyReducer;