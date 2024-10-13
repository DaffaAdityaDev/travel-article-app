import { apiSlice } from "../Api/apiSlice";
import { Article, ArticleDetails, ArticlesResponse, CreateArticleRequest, UpdateArticleRequest } from "../types/article";

export const articleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<ArticlesResponse, { page?: number; pageSize?: number; userId?: number; categoryId?: number | null }>({
      query: ({ page = 1, pageSize = 10, userId, categoryId }) => {
        let url = `/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        if (userId) {
          url += `&filters[user][id][$eq]=${userId}`;
        }
        if (categoryId !== null && categoryId !== undefined) {
          url += `&filters[category][id][$eq]=${categoryId}`;
        }
        return url;
      },
    }),
    getArticle: builder.query<ArticleDetails, string>({
      query: (documentId) => `/articles/${documentId}`,
    }),
    createArticle: builder.mutation<Article, CreateArticleRequest>({
      query: (articleData) => ({
        url: '/articles',
        method: 'POST',
        body: articleData,
      }),
    }),
    updateArticle: builder.mutation<Article, UpdateArticleRequest>({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        body: { data },
      }),
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;