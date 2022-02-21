import React, { useEffect } from 'react';
import LeftSide from '../../components/Message/LeftSide/LeftSide';
import RightSide from '../../components/Message/RightSide/RightSide';
import './message.css'

function Conversation(props) {
    useEffect(() => {
        document.title = 'Inbox Chat • Merfogram'
    }, [])

    return (
        <div className='message d-flex'>
            <div style={{ borderRight: '1px solid #DDDDDD' }} className='col-md-4 px-0'>
                <LeftSide />
            </div>

            <div className='col-md-8 px-0'>
                <RightSide />
            </div>
        </div>
    );
}

export default Conversation;