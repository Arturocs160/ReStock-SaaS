'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bienvenido, {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Información de Cuenta</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-600">Nombre</dt>
                <dd className="text-gray-900 font-medium">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Email</dt>
                <dd className="text-gray-900 font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Rol</dt>
                <dd className="text-gray-900 font-medium">{user.role || 'Usuario'}</dd>
              </div>
              {user.businessName && (
                <div>
                  <dt className="text-sm text-gray-600">Negocio</dt>
                  <dd className="text-gray-900 font-medium">{user.businessName}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600 mt-2">Productos en tu inventario</p>
            <button className="mt-4 text-green-600 hover:text-green-700 font-medium">
              Agregar producto →
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Últimas Actualizaciones</h3>
            <p className="text-gray-600">No hay actualizaciones recientes</p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Próximas Funcionalidades</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Gestión completa de inventario
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Predicción de compras con IA
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Alertas de vencimiento de productos
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Reportes y análisis avanzados
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
