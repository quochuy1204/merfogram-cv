import React from 'react';
import Avarta from '../../../Avarta/Avarta'
import { useSelector, useDispatch } from 'react-redux'
import './statusbutton.css'

function StatusButton(props) {
    const { authentication } = useSelector(state => state)

    const dispacth = useDispatch()

    // Hàm handleOnClickAddStatus dùng để thay đổi state status trên store khi người dùng nhấn vào nút create new post
    const handleOnClickAddStatus = () => {
        dispacth({
            type: 'STATUS',
            payload: true
        })
    }

    return (
        <div className="status-button">
            <div className="avarta">
                <Avarta className="avarta" src={authentication.user.photo} size="small-avarta" />
            </div>

            <span role="button" className="material-icons add-status-button" onClick={handleOnClickAddStatus}>add</span>
        </div>
    );
}

export default StatusButton;