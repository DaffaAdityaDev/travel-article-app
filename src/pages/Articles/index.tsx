import { useState, useEffect, useRef } from 'react';
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
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px'
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isFetching, hasMore, loadMore]);

  if (isLoading && articles.length === 0) return <div className={styles.loading}>Loading...</div>;
  if (isError) return <div className={styles.error}>Error: {error?.toString() || 'An unknown error occurred'}</div>;

  return (
    <div className={styles.articlesContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Articles</h1>
        <Link to="/articles/manage" className={styles.manageLink}>Manage Articles +</Link>
      </div>
      
      <div className={styles.filterContainer}>
        <select 
          value={selectedCategory || ''}
          onChange={(e) => {
            const newCategory = e.target.value ? Number(e.target.value) : null;
            setSelectedCategory(newCategory);
          }}
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
    
      {articles.length > 0 ? (
        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noArticles}>No articles available for the selected category.</div>
      )}
      
      <div ref={observerTarget} className={styles.loadingIndicator}>
        {isFetching && (
          <>
            <div className={styles.loadingSpinner}></div>
            <p>Loading more articles...</p>
          </>
        )}
      </div>
      {!isFetching && !hasMore && articles.length > 0 && (
        <div className={styles.noMoreArticles}>No more articles to load</div>
      )}
    </div>
  );
}

export default Articles;