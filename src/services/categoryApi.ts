import { apiSlice } from "../Api/apiSlice";
import { Category, CategoriesResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../types/category";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => '/categories',
    }),
    getCategory: builder.query<Category, string>({
      query: (documentId) => `/categories/${documentId}`,
    }),
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
    }),
    updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: { data },
      }),
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;