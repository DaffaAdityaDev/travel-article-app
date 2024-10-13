import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../features/authSlice';
import styles from './styles.module.css';

function Navbar({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      {isMobile && (
        <button className={styles.toggleButton} onClick={toggleNavbar}>
          {isOpen ? '×' : '☰'}
        </button>
      )}
      <nav className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.navHeader}>
          <h1>Travel Article App</h1>
        </div>
        {isMobile ? (
          <ul className={styles.navList}>
            <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
            <li><Link to="/articles" onClick={() => setIsOpen(false)}>Articles</Link></li>
            <li><Link to="/category" onClick={() => setIsOpen(false)}>Category</Link></li>
            <li><Link to="/profiles" onClick={() => setIsOpen(false)}>Profiles</Link></li>
          </ul>
        ) : (
          <ul className={styles.navList}>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/category">Category</Link></li>
            <li><Link to="/profiles">Profiles</Link></li>
          </ul>
        )}
        <button className={styles.logoutButton} onClick={() => dispatch(logout())}>Logout</button>
      </nav>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Navbar;
