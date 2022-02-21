import { Route, Redirect } from 'react-router-dom'
// import { useSelector } from 'react-redux'

const PrivateRouter = (props) => {
    // const { authentication } = useSelector(state => state)
    const firstLogin = localStorage.getItem('firstLogin')

    return firstLogin ? <Route {...props} /> : <Redirect to="/" />
}

export default PrivateRouter
