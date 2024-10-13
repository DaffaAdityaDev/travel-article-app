import { useState, useEffect, useCallback } from 'react';
import { useGetArticlesQuery } from '../services/articleApi';
import { Article } from '../types/article';

export const useArticles = (categoryId: number | null = null) => {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const { data, isLoading, isError, error, isFetching } = useGetArticlesQuery({ 
    page, 
    pageSize,
    categoryId: categoryId
  });

  useEffect(() => {
    // Reset articles when category changes
    setAllArticles([]);
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    if (data?.data) {
      setAllArticles(prevArticles => {
        const newArticles = data.data.filter(
          newArticle => !prevArticles.some(
            existingArticle => existingArticle.id === newArticle.id
          )
        );
        return [...prevArticles, ...newArticles];
      });
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!isFetching && data?.meta?.pagination?.page && data?.meta?.pagination?.pageCount) {
      if (data.meta.pagination.page < data.meta.pagination.pageCount) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [isFetching, data]);

  return {
    articles: allArticles,
    pagination: data?.meta.pagination,
    isLoading,
    isError,
    error,
    loadMore,
    hasMore: data ? page < data.meta.pagination.pageCount : false,
    isFetching
  };
};
