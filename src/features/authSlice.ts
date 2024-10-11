import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginResponse } from '../types/auth';

const loadAuthState = (): AuthState => {
  try {
    const serializedToken = localStorage.getItem('authToken');
    if (serializedToken === null) {
      return { user: null, token: null };
    }
    return { user: null, token: JSON.parse(serializedToken) };
  } catch (err) {
    return { user: null, token: null };
  }
}

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<LoginResponse>) => {
            const { user, jwt } = action.payload;
            state.user = user;
            state.token = jwt;
            localStorage.setItem('authToken', JSON.stringify(jwt));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('authToken');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;