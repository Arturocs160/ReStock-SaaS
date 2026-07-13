import { create } from "zustand";
import { User } from "../types/auth";
import { authClient } from "../lib/auth-client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    businessName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  checkSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const session = authClient.getSession();

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: (session.user as { role?: string }).role || "user",
            nombre: (session.user as { nombre?: string }).nombre,
            createdAt: session.user.createdAt
              ? new Date(session.user.createdAt).toISOString()
              : undefined,
          },
          isAuthenticated: true,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.error("Session check error in store:", err);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authClient.signIn({ email, password });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.user) {
        set({
          user: {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: (response.user as { role?: string }).role || "user",
            nombre: (response.user as { nombre?: string }).nombre,
            createdAt: response.user.createdAt
              ? new Date(response.user.createdAt).toISOString()
              : undefined,
          },
          isAuthenticated: true,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, nombre) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authClient.signUp({
        email,
        password,
        name,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.user) {
        set({
          user: {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: (response.user as { role?: string }).role || "user",
            nombre: (response.user as { nombre?: string }).nombre,
            createdAt: response.user.createdAt
              ? new Date(response.user.createdAt).toISOString()
              : undefined,
          },
          isAuthenticated: true,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await authClient.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (err) {
      console.error("Logout error in store:", err);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
