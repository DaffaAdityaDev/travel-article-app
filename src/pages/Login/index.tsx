import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import { useLoginMutation } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem('authToken')) {
      navigate('/articles');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login({ identifier, password }).unwrap();
      dispatch(setCredentials(userData));
      setIdentifier('');
      setPassword('');
      navigate('/articles');
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      if (err && typeof err === 'object') {
        const errorData = err as { message?: string };
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'identifier') setIdentifier(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <div className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="identifier" className={styles.formLabel}>Email:</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <Link to="/register" className={styles.registerLink}>
          Don't have an account? Register here
        </Link>
      </div>
    </div>
  );
}

export default Login;