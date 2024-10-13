import { useState, useEffect, useCallback } from 'react';
import { useGetArticlesQuery } from '../services/articleApi';
import { Article } from '../types/article';

export const useArticles = (categoryId: number | null = null) => {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [uniqueIds, setUniqueIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, error, isFetching } = useGetArticlesQuery({ 
    page, 
    pageSize,
    categoryId: categoryId
  });

  useEffect(() => {
    // Reset articles and uniqueIds when category changes
    setAllArticles([]);
    setUniqueIds(new Set());
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    if (data?.data) {
      const newUniqueArticles = data.data.filter(article => !uniqueIds.has(article.documentId));
      if (newUniqueArticles.length > 0) {
        setAllArticles(prevArticles => [...prevArticles, ...newUniqueArticles]);
        setUniqueIds(prevIds => {
          const newIds = new Set(prevIds);
          newUniqueArticles.forEach(article => newIds.add(article.documentId));
          return newIds;
        });
      }
    }
  }, [data, uniqueIds]);

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
