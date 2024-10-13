import { useState, useEffect, useCallback } from 'react';
import { useArticles } from '../../hooks/useArticles';
import { useGetCategoriesQuery } from '../../services/categoryApi';
import { Link } from 'react-router-dom';
import ArticleCard from '../../components/Article/ArticleCard';
import styles from './styles.module.css';

function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = useGetCategoriesQuery();
  const { 
    articles, 
    isLoading, 
    isError, 
    error, 
    loadMore, 
    hasMore, 
    isFetching 
  } = useArticles(selectedCategory);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    loadMore();
  }, [isFetching, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isLoading && articles.length === 0) return <div className={styles.loading}>Loading...</div>;
  if (isError) return <div className={styles.error}>Error: {error?.toString() || 'An unknown error occurred'}</div>;

  return (
    <div className={styles.articlesContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Articles</h1>
        <Link to="/articles/manage" className={styles.manageLink}>Manage Articles</Link>
      </div>
      
      <div className={styles.filterContainer}>
        <select 
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          className={styles.categoryFilter}
        >
          <option value="">All Categories</option>
          {categories?.data.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    
      <div className={styles.articlesGrid}>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
      
      {isFetching && <div className={styles.loading}>Loading more articles...</div>}
      {!hasMore && <div className={styles.noMoreArticles}>No more articles to load</div>}
    </div>
  );
}

export default Articles;
