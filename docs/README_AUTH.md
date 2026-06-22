# Autenticación en ReStock-SaaS Frontend

Este documento explica cómo usar el sistema de autenticación implementado en el frontend de ReStock-SaaS usando React Context y mejor-auth del backend.

## Arquitectura

La autenticación está basada en:

- **React Context** (`AuthContext`) para manejo de estado global
- **Cookies HTTP-Only** enviadas por el backend (seguras y no accesibles desde JavaScript)
- **Zod** para validación de formularios
- **Middleware Next.js** para protección de rutas

## Instalación y Configuración

### Dependencias

```bash
cd apps/web
pnpm add better-auth
pnpm add -D @types/better-auth
```

### Variables de entorno

Crear `.env.local` en `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3010
```

## Uso del Hook de Autenticación

### Hook `useAuth()`

Importa el hook en cualquier componente cliente:

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout, error } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <div>Bienvenido, {user?.email}</div>;
  }

  return <div>No autenticado</div>;
}
```

### Propiedades del contexto

```typescript
interface AuthContextType {
  user: User | null;           // Usuario autenticado o null
  isLoading: boolean;          // Indica si se está procesando una solicitud
  error: string | null;        // Mensaje de error si ocurre uno
  isAuthenticated: boolean;    // true si el usuario está autenticado
  login: (email, password) => Promise<void>;                    // Método para iniciar sesión
  register: (name, email, password, businessName) => Promise<void>; // Método para registrarse
  logout: () => Promise<void>; // Método para cerrar sesión
  checkSession: () => Promise<void>; // Método para verificar sesión
}
```

## Flujo de Autenticación

### 1. Login

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      // Error se muestra en el estado del contexto
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="tu@email.com"
      />
      <input 
        type="password" 
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="••••••"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

### 2. Register

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { registerSchema } from '@/lib/validationsAuth';
import { ZodError } from 'zod';

export function RegisterForm() {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      registerSchema.parse(formData);
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.businessName
      );
      // Redirigir a dashboard
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors = {};
        err.errors.forEach(error => {
          newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      {errors.email && <p className="text-red-600">{errors.email}</p>}
    </form>
  );
}
```

### 3. Logout

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
```

## Protección de Rutas

### Middleware (`middleware.ts`)

El middleware protege automáticamente las rutas:

- **Rutas protegidas** (`/dashboard`, etc.): Solo accesibles si el usuario está autenticado
- **Rutas públicas** (`/login`, `/register`): Solo accesibles si el usuario NO está autenticado
- **Redirecciones automáticas**:
  - No autenticado → `/login`
  - Autenticado en `/login` → `/dashboard`

### Componentes protegidos

Si necesitas proteger un componente específico:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function ProtectedComponent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) return null;

  return <div>Contenido protegido</div>;
}
```

## Validación de Formularios

### Esquemas disponibles

```typescript
import { loginSchema, registerSchema } from '@/lib/validationsAuth';

// Login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

// Register
const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúscula')
    .regex(/[0-9]/, 'Debe contener número'),
  businessName: z.string().min(2, 'Mínimo 2 caracteres'),
});
```

### Uso

```typescript
import { loginSchema, type LoginFormData } from '@/lib/validationsAuth';
import { ZodError } from 'zod';

try {
  loginSchema.parse(formData);
  // Validación exitosa
} catch (err) {
  if (err instanceof ZodError) {
    err.errors.forEach(error => {
      console.log(error.path[0], error.message);
    });
  }
}
```

## Persistencia de Sesión

La sesión se persiste automáticamente a través de cookies HTTP-Only:

1. **Backend** envía la cookie después de login/registro
2. **Cliente** almacena en cookies (no es accesible desde JS, es seguro)
3. **Middleware** verifica la cookie en cada petición
4. **AuthContext** verifica sesión al montar con `checkSession()`

### Sincronización manual de sesión

```typescript
const { checkSession } = useAuth();

useEffect(() => {
  // Verificar sesión cuando la ventana vuelve a tomar foco
  window.addEventListener('focus', checkSession);
  return () => window.removeEventListener('focus', checkSession);
}, [checkSession]);
```

## Estructura de carpetas

```
apps/web/
├── app/
│   ├── context/
│   │   └── AuthContext.tsx       # Proveedor y hook de autenticación
│   ├── lib/
│   │   └── validationsAuth.ts    # Esquemas de validación (Zod)
│   ├── types/
│   │   └── auth.ts               # Tipos de autenticación
│   ├── login/
│   │   └── page.tsx              # Página de login
│   ├── register/
│   │   └── page.tsx              # Página de registro
│   ├── dashboard/
│   │   └── page.tsx              # Página protegida
│   ├── components/
│   │   └── navbar.tsx            # Navbar con opciones de auth
│   ├── layout.tsx                # Layout con AuthProvider
│   └── middleware.ts             # Middleware de protección
├── .env.local                    # Variables de entorno
```

## Manejo de Errores

Los errores se manejan en múltiples niveles:

1. **Validación**: Zod valida datos localmente antes de enviar
2. **Solicitud**: AuthContext captura errores de la API
3. **Usuario**: Errores se muestran en el componente

```typescript
const { error } = useAuth();

return (
  <div>
    {error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        {error}
      </div>
    )}
  </div>
);
```

## Buenas prácticas

1. **Siempre usa `useAuth()` en componentes cliente**: Marca componentes con `'use client'`
2. **Maneja `isLoading`**: Muestra estados de carga apropiados
3. **Valida antes de enviar**: Usa Zod para validación local
4. **Limpiar listeners**: En `useEffect`, limpia event listeners
5. **No guardes tokens en localStorage**: Las cookies HTTP-Only son más seguras
6. **Protege rutas sensibles**: Usa middleware o componentes protegidos

## Integración con el Backend

El backend debe proporcionar estos endpoints:

```
POST /auth/login           # Inicia sesión
POST /auth/register        # Registra usuario
POST /auth/logout          # Cierra sesión
GET  /auth/me              # Obtiene usuario actual
```

Cada respuesta de login/register debe incluir:

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "businessName": "Business"
  }
}
```

Y establecer una cookie segura:

```
Set-Cookie: auth.session=...; HttpOnly; SameSite=Strict; Secure
```

## Troubleshooting

### "useAuth debe ser usado dentro de AuthProvider"

**Problema**: Componente no tiene acceso al contexto
**Solución**: Asegúrate de que `AuthProvider` envuelve el componente en `layout.tsx`

### Las cookies no se envían

**Problema**: `credentials: 'include'` no se usa
**Solución**: Verifica que en `AuthContext.tsx` todas las requests usan `credentials: 'include'`

### Sesión se pierde al recargar

**Problema**: `checkSession()` no se llama
**Solución**: `useEffect` en `AuthContext` ya lo hace automáticamente

---

**Versión**: 1.0  
**Última actualización**: 2024-06-15
