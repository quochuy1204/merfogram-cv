import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const Redirect = () => {
    const history = useHistory()

    useEffect(() => {
        history.push('/')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div></div>
    )
}

export default Redirect