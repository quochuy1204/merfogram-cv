import React, { useEffect } from 'react';
import LeftSide from '../../components/Message/LeftSide/LeftSide';
import './message.css'

function Message(props) {
    useEffect(() => {
        document.title = 'Inbox Chat • Merfogram'
    }, [])
    return (
        <div className='message d-flex'>
            <div style={{ borderRight: '1px solid #DDDDDD' }} className='col-md-4 px-0'>
                <LeftSide />
            </div>

            <div className='col-md-8 px-0'>
                <div className='d-flex justify-content-center align-items-center flex-column h-100'>
                    <i className='fas fa-inbox' style={{ fontSize: '3rem' }} />
                    <h5>Send message to your friend.</h5>
                </div>
            </div>
        </div>
    );
}

export default Message;