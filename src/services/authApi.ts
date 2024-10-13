/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../Api/apiSlice";
import { LoginResponse, LoginCredentials, RegisterCredentials, User } from "../types/auth";


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/local',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response: { status: number, data: any }) => {
        return {
          status: response.status,
          message: response.data?.error?.message || 'An unexpected error occurred',
        };
      },
    }),
    register: builder.mutation<LoginResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/auth/local/register',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response: { status: number, data: any }) => {
        return {
          status: response.status,
          message: response.data?.error?.message || 'An unexpected error occurred',
        };
      },
    }),
    getMe: builder.query<User, void>({
      query: () => '/users/me',
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useRegisterMutation } = authApi;
