import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import { useRegisterMutation } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem('authToken')) {
      navigate('/articles');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await register({ username, email, password }).unwrap();
      dispatch(setCredentials(userData));
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/articles');
      toast.success('Registration successful!', {
        position: "top-right",
        autoClose: 3000,
      });
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
      console.error('Registration error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  return (
    <div className={styles.registerContainer}>
      <ToastContainer />
      <div className={styles.registerForm}>
        <h1 className={styles.registerTitle}>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <Link to="/login" className={styles.loginLink}>
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
}

export default Register;
