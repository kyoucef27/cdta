import { fetchClient } from './api';

export const AuthService = {
  login: async (credentials: any) => {
    return fetchClient('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  verifyOtp: async (data: { user_id: string | number, otp: string }) => {
    return fetchClient('/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return fetchClient('/logout', {
      method: 'POST',
    });
  },
  getMe: async () => {
    return fetchClient('/me');
  },
};
