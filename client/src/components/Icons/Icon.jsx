import React from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js'
import './icon.css'

function Icon({ setContent, content }) {
    const reactions = [
        '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
        '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
        '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵'
    ]
    return (
        <div className="nav-item dropdown">
            <span className="nav-link position-relative" id="navbarDropdown"
                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span>❤️</span>
            </span>

            <div className="dropdown-menu">
                <div className="reactions dropdown-item">
                    {
                        reactions.map(icon => (
                            <span key={icon} onClick={() => setContent(content + icon)}>
                                {icon}
                            </span>
                        ))
                    }
                </div>
            </div>

        </div >
    );
}

export default Icon;