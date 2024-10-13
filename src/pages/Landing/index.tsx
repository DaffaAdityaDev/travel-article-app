import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const Landing: React.FC = () => {
  return (
    <div className={styles.landingContainer}>
      <header className={styles.header}>
        <h1>Travel Article App</h1>
        <nav>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/register" className={styles.navLink}>Register</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
            <div className={styles.heroFilter}></div>
            <div className={styles.heroContent}>
                <h2>Explore the World Through Stories</h2>
                <p>Discover fascinating travel destinations and share your own adventures.</p>
                <Link to="/register" className={styles.ctaButton}>Get Started</Link>
            </div>
        </section>

        <section className={styles.featuredArticles}>
          <h3>Featured Articles</h3>
          <div className={styles.articleGrid}>
            {/* Replace these with actual featured articles */}
            <div className={styles.articleCard}>
              <img src="/Tips-Wisata-Bali.webp" alt="Article 1" />
              <h4>Exploring the Hidden Gems of Bali</h4>
            </div>
            <div className={styles.articleCard}>
              <img src="/bandung-food.jpg" alt="Article 2" />
              <h4>A Foodie's Guide to Bandung</h4>
            </div>
            <div className={styles.articleCard}>
              <img src="/hiking.jpg" alt="Article 3" />
              <h4>Hiking the Inca Trail: A Personal Journey</h4>
            </div>
          </div>
        </section>

        <section className={styles.about}>
          <h3>About Travel Article App</h3>
          <p>Join our community of passionate travelers, share your experiences, and get inspired for your next adventure.</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Travel Article App. All rights reserved.</p>
        <p><a href="https://github.com/DaffaAdityaDev">github.com/DaffaAdityaDev</a></p>
      </footer>
    </div>
  );
};

export default Landing;