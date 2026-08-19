import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../config/axios';

/**
 * Role mapping:
 * - HR: Full administrative authority
 * - EMPLOYEE: Self-service portal
 */
const mapBackendRole = (backendRole) => {
  if (backendRole === 'HR' || backendRole === 'MANAGER' || backendRole === 'ADMIN') {
    return 'HR';
  }
  return 'EMPLOYEE';
};

const demoUsers = {
  'hr@nexushr.com': {
    email: 'hr@nexushr.com',
    firstName: 'HR',
    lastName: 'Manager',
    role: 'HR',
    department: 'Human Resources',
    designation: 'HR Manager',
  },
  'employee@nexushr.com': {
    email: 'employee@nexushr.com',
    firstName: 'Employee',
    lastName: 'User',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Software Engineer',
  },
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
        const normalizedEmail = email?.trim().toLowerCase();

        try {
          // Attempt backend login with 12s fast timeout
          const response = await api.post('/auth/login', { email: normalizedEmail, password }, { timeout: 12000 });
          const data = response.data.data;

          // Handle MFA required flow
          if (data.mfaRequired) {
            return { mfaRequired: true, mfaToken: data.token, email: data.email };
          }

          const mappedRole = mapBackendRole(data.role);
          const user = {
            id: data.email,
            email: data.email,
            firstName: data.name?.split(' ')[0] || 'User',
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
        } catch (err) {
          // If backend is sleeping/cold-starting or unreachable, gracefully fallback for demo accounts
          const demoUser = demoUsers[normalizedEmail];
          if (demoUser && (password === 'nexus123' || !password)) {
            console.warn('Backend cold start / timeout. Logging in via instant demo fallback mode.');
            const user = {
              id: demoUser.email,
              email: demoUser.email,
              firstName: demoUser.firstName,
              lastName: demoUser.lastName,
              role: demoUser.role,
              avatar: null,
              department: demoUser.department,
              designation: demoUser.designation,
            };

            set({
              user,
              role: demoUser.role,
              isAuthenticated: true,
              token: 'demo-jwt-token-' + Date.now(),
              refreshToken: 'demo-refresh-token-' + Date.now(),
            });

            return user;
          }

          throw err;
        }
      },

      /**
       * Instant Demo Login (Zero Latency)
       */
      instantDemoLogin: (accountEmail) => {
        const normalized = accountEmail.trim().toLowerCase();
        const demoUser = demoUsers[normalized] || demoUsers['admin@nexushr.com'];

        const user = {
          id: demoUser.email,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role,
          avatar: null,
          department: demoUser.department,
          designation: demoUser.designation,
        };

        set({
          user,
          role: demoUser.role,
          isAuthenticated: true,
          token: 'demo-jwt-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now(),
        });

        // Trigger background wake-up ping to Render backend without awaiting
        api.post('/auth/login', { email: demoUser.email, password: 'nexus123' }).catch(() => {});

        return user;
      },

      /**
       * Verify MFA TOTP code after login
       */
      verifyMfa: async ({ email, code, mfaToken }) => {
        try {
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
        } catch (err) {
          // Demo MFA bypass if 123456
          if (code === '123456') {
            const demoUser = demoUsers[email?.toLowerCase()] || demoUsers['admin@nexushr.com'];
            const user = {
              id: demoUser.email,
              email: demoUser.email,
              firstName: demoUser.firstName,
              lastName: demoUser.lastName,
              role: demoUser.role,
              avatar: null,
              department: demoUser.department,
              designation: demoUser.designation,
            };
            set({
              user,
              role: demoUser.role,
              isAuthenticated: true,
              token: 'demo-jwt-token-' + Date.now(),
              refreshToken: 'demo-refresh-token-' + Date.now(),
            });
            return user;
          }
          throw err;
        }
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
          if (token && !token.startsWith('demo-')) {
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
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
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
