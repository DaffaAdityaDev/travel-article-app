import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../../Api/apiSlice";
import authReducer from "../../features/authSlice";
import articleReducer from "../../features/articleSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        article: articleReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
