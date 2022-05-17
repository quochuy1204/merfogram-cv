import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../Loading/Loading'
import Toast from '../Toast/Toast';

function Alert() {
    // Lấy về state.alert hiện tại có trong store
    const alert = useSelector(state => state.alert)

    const dispatch = useDispatch()

    return (
        <div>
            {/* Nếu state.alert hiện tại là loading thì show lên Loading component */}
            {alert.loading && <Loading />}

            {/* Nếu state.alert hiện tại là error thì show lên Toast component cũng như show lên error đó là gì */}
            {alert.error && <Toast message={{ title: 'Error', body: alert.error }} handleClose={() => dispatch({
                type: 'ALERT',
                payload: {}
            })} bgColor="bg-danger" />}

            {/* Nếu state.alert hiện tại là success thì show lên Toast component cũng như hiện lên success đó là gì */}
            {alert.success && <Toast message={{ title: 'Success', body: alert.success }} handleClose={() => dispatch({
                type: 'ALERT',
                payload: {}
            })} bgColor="bg-success" />}
        </div>
    );
}

export default Alert;