import { apiSlice } from "../Api/apiSlice";
import { LoginResponse, LoginCredentials } from "../types/auth";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/local',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<LoginResponse['user'], void>({
      query: () => '/users/me',
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;