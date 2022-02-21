import React from 'react';

function Toast({ message, handleClose, bgColor }) {
    return (
        <div className={`toast show position-fixed text-light ${bgColor}`} style={{ top: '15px', right: '15px', maxWidth: '200px', zIndex: 50 }}>
            <div className={`toast-header text-light ${bgColor}`}>
                <strong className="mr-auto text-light">{message.title}</strong>
                <button className="btn btn-default" data-dismiss="toast show" style={{ outline: 'none', position: 'fixed', right: '20px', color: '#FFFFFF' }} onClick={handleClose}>&times;</button>
            </div>
            <div className="toast-body">
                {message.body}
            </div>
        </div>
    );
}

export default Toast;