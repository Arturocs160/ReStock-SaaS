'use client';
import { useState } from 'react';
import { Package, Menu, X } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const sections = [
    { id: "problema", label: "Problema" },
    { id: "solucion", label: "Solución" },
    { id: "beneficios", label: "Beneficios" },
    { id: "cta", label: "Empezar" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 sm:gap-3 font-semibold text-lg sm:text-xl text-gray-900 shrink-0">
          <span className="grid place-items-center w-10 h-10 rounded-full text-white bg-[#00a365]">
            <Package className="w-5 h-5" />
          </span>
          <span className="font-bold tracking-tight">ReStock</span>
        </Link>

        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-[15px] font-medium text-gray-500 flex-1 justify-center">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="hover:text-gray-900 transition whitespace-nowrap"
              >
                {section.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden md:flex items-center shrink-0 gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-full transition shadow-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg transition"
              >
                Inicia sesión
              </Link>
              <Link
                href="/register"
                className="bg-[#00a365] hover:bg-[#008c54] text-white font-medium text-sm px-5 py-2.5 rounded-full transition shadow-sm"
              >
                Pruébalo gratis
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-900" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4">
          {!isAuthenticated && (
            <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="hover:text-gray-900 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          )}
          <div className="pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-600 py-2">{user?.name}</div>
                <Link 
                  href="/dashboard"
                  className="block w-full text-gray-700 hover:text-gray-900 font-medium text-sm px-5 py-2.5 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-full transition shadow-sm text-center"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="block w-full text-gray-700 hover:text-gray-900 font-medium text-sm px-5 py-2.5 rounded-lg transition text-center mb-2"
                  onClick={() => setIsOpen(false)}
                >
                  Inicia sesión
                </Link>
                <Link
                  href="/register"
                  className="block w-full bg-[#00a365] hover:bg-[#008c54] text-white font-medium text-sm px-5 py-2.5 rounded-full transition shadow-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Pruébalo gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}