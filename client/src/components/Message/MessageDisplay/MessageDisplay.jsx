import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../../Avarta/Avarta';
import './messagedisplay.css'
import moment from 'moment'
import { imageShow, videoShow } from '../../../utils/mediaShow'
import 'bootstrap/dist/js/bootstrap.min'
import { deleteMessage } from '../../../redux/actions/messageAction'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function MessageDisplay({ user, msg, newDataMessage }) {
    const { authentication, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    const handleDeleteMessage = () => {
        confirmAlert({
            title: 'Unsend message',
            message: 'Are you want to unsend this message?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        if (newDataMessage) {
                            dispatch(deleteMessage({ msg, newDataMessage, authentication, socket }))
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return;
                    }
                }
            ]
        })
    }

    return (
        <>
            <div className='chat_title'>
                <Avatar src={user.photo} size='smaller-avarta' />
            </div>

            <div className='you_content'>
                <div>
                    {
                        user._id === authentication.user._id &&
                        <div className='messsage_option'>
                            <div className="dropdown">
                                <span role="button" className="material-icons span_message_option" data-bs-toggle="dropdown">
                                    more_horiz
                                </span>

                                <div className="dropdown-menu">
                                    <div onClick={handleDeleteMessage} className="dropdown-item d-flex justify-content-center">
                                        <i className="fas fa-undo-alt"></i><span>Unsend</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>


                <div>
                    {
                        msg.textMessage &&
                        <div className='chat_text'>
                            {msg.textMessage}
                        </div>
                    }

                    {
                        msg.media.map((item, index) => (
                            <div className='display_image' key={index}>
                                {
                                    item.url.match(/video/i)
                                        ? videoShow(item.url)
                                        : imageShow(item.url)
                                }
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='chat_time'>
                {moment(msg.createdAt).calendar()}
            </div>
        </>
    );
}

export default MessageDisplay;