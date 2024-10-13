import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../../types/article';
import styles from './styles.module.css';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className={styles.card}>
      <Link to={`/articles/${article.documentId}`} className={styles.cardTitle}>
      <img src={article.cover_image_url} alt={article.title} className={styles.cardImage} />
      <div className={styles.cardContent}>
          <h2>{article.title}</h2>
        <p className={styles.cardCategory}>{article.category?.name || 'Uncategorized'}</p>
        <p className={styles.cardDescription}>{article.description.slice(0, 100)}...</p>
      </div>
    </Link>
    </div>
  );
};

export default ArticleCard;