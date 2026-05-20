import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../config/axios';

/**
 * Role mapping: Backend uses ADMIN / MANAGER / USER
 * Frontend uses ADMIN / HR / EMPLOYEE
 */
const mapBackendRole = (backendRole) => {
  const roleMap = {
    ADMIN: 'ADMIN',
    MANAGER: 'HR',
    USER: 'EMPLOYEE',
  };
  return roleMap[backendRole] || 'EMPLOYEE';
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,

      login: async (credentials) => {
        const { email, password } = credentials;

        const response = await api.post('/auth/login', { email, password });
        const data = response.data.data;

        // Handle MFA required flow
        if (data.mfaRequired) {
          return { mfaRequired: true, mfaToken: data.token, email: data.email };
        }

        const mappedRole = mapBackendRole(data.role);
        const user = {
          id: data.email,
          email: data.email,
          firstName: data.name?.split(' ')[0] || '',
          lastName: data.name?.split(' ').slice(1).join(' ') || '',
          role: mappedRole,
          avatar: null,
          department: 'General',
          designation: data.role,
        };

        set({
          user,
          role: mappedRole,
          isAuthenticated: true,
          token: data.token,
          refreshToken: data.refreshToken,
        });

        return user;
      },

      /**
       * Verify MFA TOTP code after login
       */
      verifyMfa: async ({ email, code, mfaToken }) => {
        const response = await api.post('/auth/mfa/verify', {
          email,
          code,
          mfaToken,
        });
        const data = response.data.data;

        const mappedRole = mapBackendRole(data.role);
        const user = {
          id: data.email,
          email: data.email,
          firstName: data.name?.split(' ')[0] || '',
          lastName: data.name?.split(' ').slice(1).join(' ') || '',
          role: mappedRole,
          avatar: null,
          department: 'General',
          designation: data.role,
        };

        set({
          user,
          role: mappedRole,
          isAuthenticated: true,
          token: data.token,
          refreshToken: data.refreshToken,
        });

        return user;
      },

      /**
       * Register a new user
       */
      register: async ({ name, email, password, role }) => {
        const response = await api.post('/auth/register', {
          name,
          email,
          password,
          role,
        });
        const data = response.data.data;

        const mappedRole = mapBackendRole(data.role);
        const user = {
          id: data.email,
          email: data.email,
          firstName: data.name?.split(' ')[0] || '',
          lastName: data.name?.split(' ').slice(1).join(' ') || '',
          role: mappedRole,
          avatar: null,
          department: 'General',
          designation: data.role,
        };

        set({
          user,
          role: mappedRole,
          isAuthenticated: true,
          token: data.token,
          refreshToken: data.refreshToken,
        });

        return user;
      },

      /**
       * Refresh the access token
       */
      refreshAccessToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await api.post('/auth/refresh', {
            refreshToken: currentRefreshToken,
          });
          const data = response.data.data;
          set({
            token: data.token,
            refreshToken: data.refreshToken,
          });
        } catch {
          get().logout();
        }
      },

      logout: async () => {
        const token = get().token;
        try {
          if (token) {
            await api.post('/auth/logout', null, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        } catch {
          // ignore logout API errors — clear local state regardless
        }
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
        });
      },

      setRole: (role) => {
        set({ role });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;
