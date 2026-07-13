// Client-side auth utilities for ReStock
// This is a lightweight client that communicates with the better-auth backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

interface AuthResponse {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  session?: {
    token: string;
    expiresAt?: number;
  };
  error?: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  name?: string;
}

interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

// Store session in localStorage for client-side access
const SESSION_KEY = "better-auth-session";

interface EmailOtpType {
  sendVerificationOtp: (payload: {
    email: string;
    type: string;
  }) => Promise<{ error?: { message: string } }>;
  checkVerificationOtp: (payload: {
    email: string;
    otp: string;
    type: string;
  }) => Promise<{ error?: { message: string } }>;
  resetPassword: (payload: {
    email: string;
    otp: string;
    password: string;
  }) => Promise<{ error?: { message: string } }>;
}

interface AuthClientType {
  signIn: (payload: SignInPayload) => Promise<AuthResponse>;
  signUp: (payload: SignUpPayload) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  getSession: () => Session | null;
  verifySession: () => Promise<Session | null>;
  getToken: () => string | null;
  isAuthenticated: () => boolean;
  emailOtp: EmailOtpType;
}

// Email OTP Plugin methods (defined before authClient)
const emailOtpMethods = {
  // Send verification OTP
  async sendVerificationOtp(payload: {
    email: string;
    type: string;
  }): Promise<{ error?: { message: string } }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/email-otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.error || data.message || "Failed to send OTP",
          },
        };
      }

      return { error: undefined };
    } catch (error) {
      return { error: { message: "Network error while sending OTP" } };
    }
  },

  // Check verification OTP
  async checkVerificationOtp(payload: {
    email: string;
    otp: string;
    type: string;
  }): Promise<{ error?: { message: string } }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/email-otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.error || data.message || "Invalid or expired OTP",
          },
        };
      }

      return { error: undefined };
    } catch (error) {
      return { error: { message: "Network error while verifying OTP" } };
    }
  },

  // Reset password with OTP
  async resetPassword(payload: {
    email: string;
    otp: string;
    password: string;
  }): Promise<{ error?: { message: string } }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.error || data.message || "Failed to reset password",
          },
        };
      }

      return { error: undefined };
    } catch (error) {
      return { error: { message: "Network error while resetting password" } };
    }
  },
};

export const authClient: AuthClientType = {
  // Sign in with email and password
  async signIn(payload: SignInPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Include cookies
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        return { error: data.error || "Sign in failed" };
      }

      // Store session in localStorage
      if (data.session && data.user) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            user: data.user,
            token: data.session.token,
          }),
        );
      }

      return data;
    } catch (error) {
      return { error: "Network error during sign in" };
    }
  },

  // Sign up with email and password
  async signUp(payload: SignUpPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        return { error: data.error || "Sign up failed" };
      }

      // Store session in localStorage
      if (data.session && data.user) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            user: data.user,
            token: data.session.token,
          }),
        );
      }

      return data;
    } catch (error) {
      return { error: "Network error during sign up" };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      // Clear session from localStorage
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // Get current session
  getSession(): Session | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      return null;
    }
  },

  // Verify session with backend
  async verifySession(): Promise<Session | null> {
    try {
      const response = await fetch(`${API_URL}/api/auth/session`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      const data = await response.json();
      if (data.user && data.token) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            user: data.user,
            token: data.token,
          }),
        );
        return data;
      }

      return null;
    } catch (error) {
      return null;
    }
  },

  // Get auth token
  getToken(): string | null {
    const session = this.getSession();
    return session?.token || null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getSession();
  },

  // Email OTP methods
  emailOtp: emailOtpMethods,
};

// Export for Next.js useContext compatibility
export const { signIn, signUp, signOut } = authClient;

// Hook-like helper to get session (can be called from components)
export function useSession(): Session | null {
  if (typeof window === "undefined") return null;
  return authClient.getSession();
}
