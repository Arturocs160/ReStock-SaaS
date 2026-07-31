'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().checkSession();
  }, []);

  return <>{children}</>;
}
