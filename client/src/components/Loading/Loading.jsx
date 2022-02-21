import React from 'react';
import './loading.css'

function Loading(props) {
    return (
        <div className="position-fixed w-100 h-100 text-center loading" style={{ background: "#0008", color: "white", top: 0, left: 0, zIndex: 50 }}>
            <svg width="300" height="250" viewBox="0 0 50 50">
                <text fill="#fff" x="5" y="10" >Please waiting ...</text>
            </svg>
        </div>
    );
}

export default Loading;