import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import AdminComponent from '../components/AdminComponent/AdminComponent';

import NotFound from '../components/NotFound/NotFound'

function AdminPage(props) {
    const { authentication } = useSelector(state => state)

    useEffect(() => {
        document.title = 'Administrator Dashboard • Merfogram'
    }, [])

    return (
        <div className='admin_page'>
            {
                authentication.role === 1
                    ?
                    <>
                        <AdminComponent />
                    </>
                    : <NotFound />
            }
        </div>
    );
}

export default AdminPage;