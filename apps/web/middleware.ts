import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/'];
const PROTECTED_ROUTES = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener la cookie de sesión (buscar múltiples nombres posibles)
  const session = request.cookies.get('auth.session') || request.cookies.get('session') || request.cookies.get('__session');

  // Si es ruta protegida y no hay sesión, redirigir a login
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si es ruta pública (login/register) y hay sesión, redirigir a dashboard
  if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
