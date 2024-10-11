import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import { useLoginMutation } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    console.log(isAuthenticated, localStorage.getItem('authToken'));
    if (isAuthenticated || localStorage.getItem('authToken')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg('');

    try {
      const userData = await login({ identifier, password }).unwrap();
      dispatch(setCredentials(userData));
      setIdentifier('');
      setPassword('');
      navigate('/dashboard');
    } catch (err: any) {
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'identifier') setIdentifier(value);
    else if (name === 'password') setPassword(value);
  };

  return (
    <section className='login'>
      <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="identifier">Email:</label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          value={identifier}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </section>
  );
}

export default Login;