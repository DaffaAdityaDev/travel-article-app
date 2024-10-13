/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/authSlice';
import { RootState } from '../redux/store/store';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const vercelEnv = import.meta.env.VITE_VERCEL_ENV

console.log(`API Base URL: ${apiBaseUrl}`)
console.log(`Vercel Environment: ${vercelEnv}`)

const baseQuery = fetchBaseQuery({ 
    baseUrl: apiBaseUrl ,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token || localStorage.getItem('authToken');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
        if (result.error.status === 401) {
            // Handle unauthorized access
            api.dispatch(logout());
        }
        // You can add more specific error handling here
        return { error: { status: result.error.status, data: result.error.data } };
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithErrorHandling,
    endpoints: () => ({}),
});