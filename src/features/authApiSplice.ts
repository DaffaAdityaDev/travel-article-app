import { apiSlice  } from "../Api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/local',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        getMe: builder.query({
            query: () => '/auth/me',
        }),
    }),
});

export const {
    useLoginMutation,
    useGetMeQuery
} = authApiSlice