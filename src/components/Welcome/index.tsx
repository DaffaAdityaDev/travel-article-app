import React from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken, logout } from '../../features/authSlice';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
function Welcome() {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    const welcome = user ? `Welcome ${user.username}` : 'Welcome';
    const tokenAbbr = token ? `${token.slice(0, 9)}...` : 'No token';

    return (
        <section className='welcome'>
            <h1>{welcome}</h1>
            <p><strong>Token:</strong> {tokenAbbr}</p>
            <p><Link to="/dashboard">View Dashboard</Link></p>
            <button onClick={() => dispatch(logout())}>Logout</button>
        </section>
    )
}

export default Welcome