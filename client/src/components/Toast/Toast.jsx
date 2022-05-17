import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'

function Toast({ message, handleClose, bgColor }) {
    const dispatch = useDispatch()

    useEffect(() => {
        const handleCloseAlert = () => {
            setTimeout(() => {
                dispatch({
                    type: 'ALERT',
                    payload: {}
                })
            }, 5000)
        }
        handleCloseAlert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={`toast show position-fixed text-light ${bgColor}`} style={{ top: '15px', right: '40%', maxWidth: '300px', zIndex: 50 }}>
            <div className={`toast-header text-light text-center ${bgColor}`}>
                <strong className="mr-auto text-light text-center">{message.title}</strong>
                {/* <button className="btn btn-default" data-dismiss="toast show" style={{ outline: 'none', position: 'absolute', right: '20px', color: '#FFFFFF' }} onClick={handleClose}>&times;</button> */}
            </div>
            <div className="toast-body">
                {message.body}
            </div>
        </div>
    );
}

export default Toast;