import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken } from '../../features/authSlice';
import { Link } from 'react-router-dom';

function Welcome() {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    
    const welcome = user ? `Welcome ${user.username}` : 'Welcome';
    const tokenAbbr = token ? `${token.slice(0, 9)}...` : 'No token';
    console.log('User:', welcome);

    return (
        <section className='welcome'>
            <h1>{welcome}</h1>
            <p><strong>Token:</strong> {tokenAbbr}</p>
            <p><Link to="/dashboard">View Dashboard</Link></p>
        </section>
    )
}

export default Welcome