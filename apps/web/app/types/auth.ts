// Tipos de autenticación
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  nombre?: string;
  createdAt?: string;
  id_negocio?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, businessName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  businessName: string;
}

export interface AuthResponse {
  user?: User;
  error?: string;
  message?: string;
}
