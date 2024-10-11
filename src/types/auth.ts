export type AuthState = {
    user: User | null;
    token: string | null;
};

export type User = {
    id: string;
    username: string;
    email: string;
};

export interface LoginCredentials {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    jwt: string;
    user: User;
}
