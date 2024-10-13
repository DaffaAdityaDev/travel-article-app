import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../../types/article';
import styles from './styles.module.css';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/articles/${article.documentId}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {article.cover_image_url ? (
        <img 
          src={article.cover_image_url} 
          alt={article.title} 
          className={styles.cardImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/no-image.png';
            e.currentTarget.className = `${styles.cardImage} ${styles.placeholderImage}`;
          }}
        />
      ) : (
        <div className={`${styles.cardImage} ${styles.noImage}`}>No Image Available</div>
      )}
      <div className={styles.cardContent}>
        <h2>{article.title}</h2>
        <p className={styles.cardCategory}>{article.category?.name || 'Uncategorized'}</p>
        <p className={styles.cardDescription}>{article.description.slice(0, 100)}...</p>
      </div>
    </div>
  );
};

export default ArticleCard;
