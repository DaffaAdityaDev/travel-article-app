import { apiSlice } from "../Api/apiSlice";
import { Comment, CommentsResponse, CreateCommentRequest, UpdateCommentRequest } from "../types/comment";

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<CommentsResponse, { articleId: string; page?: number; pageSize?: number }>({
      query: ({ articleId, page = 1, pageSize = 10 }) => 
        `/comments?filters[article][documentId][$eq]=${articleId}&populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    }),
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (commentData) => ({
        url: '/comments',
        method: 'POST',
        body: commentData,
      }),
    }),
    updateComment: builder.mutation<Comment, UpdateCommentRequest>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { data },
      }),
    }),
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
    }),
    getUserComments: builder.query<CommentsResponse, { userId: string; page?: number; pageSize?: number }>({
      query: ({ userId, page = 1, pageSize = 10 }) => 
        `/comments?filters[user][id][$eq]=${userId}&populate[article]=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetUserCommentsQuery,
} = commentApi;