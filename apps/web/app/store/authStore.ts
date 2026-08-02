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
      const { data, error: sessionError } = await authClient.getSession();

      if (sessionError) {
        set({ user: null, isAuthenticated: false });
      } else if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: (data.user as { role?: string }).role || "user",
            nombre: (data.user as { nombre?: string }).nombre,
            createdAt: data.user.createdAt
              ? new Date(data.user.createdAt).toISOString()
              : undefined,
            id_negocio: (data.user as { id_negocio?: string }).id_negocio,
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
      const { data, error: loginError } = await authClient.signIn.email({
        email,
        password,
      });

      if (loginError) {
        throw new Error(loginError.message || "Error al iniciar sesión");
      }

      if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: (data.user as { role?: string }).role || "user",
            nombre: (data.user as { nombre?: string }).nombre,
            createdAt: data.user.createdAt
              ? new Date(data.user.createdAt).toISOString()
              : undefined,
            id_negocio: (data.user as { id_negocio?: string }).id_negocio,
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
      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        nombre,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (signUpError) {
        throw new Error(signUpError.message || "Error al registrar");
      }

      if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: (data.user as { role?: string }).role || "user",
            nombre: (data.user as { nombre?: string }).nombre,
            createdAt: data.user.createdAt
              ? new Date(data.user.createdAt).toISOString()
              : undefined,
            id_negocio: (data.user as { id_negocio?: string }).id_negocio,
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
