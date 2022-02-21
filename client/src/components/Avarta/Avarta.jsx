import React from 'react'
import './avarta.css'

const Avatar = ({ src, size }) => {
    return (
        <img src={src} alt="header-avatar" className={size} />
    )
}

export default Avatar