'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessFormSchema, BusinessFormValues } from '../../lib/businessValidation';
import { useAuthStore } from '../../store/authStore'; 
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";

export default function ConfiguracionPage() {
  
  const { user } = useAuthStore() as { user: { role: string } | null }; 
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  
  const hasAccess = user?.role === 'Owner' || user?.role === 'Admin';

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      subdomain: '',
      status: true
    }
  });

  
  useEffect(() => {
    if (hasAccess) {
      setTimeout(() => {
        reset({
          name: "Mi Tienda Inventario",
          subdomain: "mitienda",
          status: true
        });
        setLoadingData(false);
      }, 500);
    } else {
      setLoadingData(false);
    }
  }, [hasAccess, reset]);

  const onSubmit = async (data: BusinessFormValues) => {
    setFeedback(null);
    try {
      
      const response = await fetch('http://localhost:3010/api/business/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        
        if (result.details && Array.isArray(result.details)) {
          const errorMessage = result.details.map((issue: any) => issue.message).join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(result.message || 'El subdominio ya no está disponible.');
      }

      
      setFeedback({ type: 'success', message: result.message || '¡Identidad del negocio actualizada con éxito!' });
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Ocurrió un error al guardar.' });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Configuración
            </h1>
            <p className="text-gray-500 mt-2">
              Administra la identidad de tu tienda en el sistema.
            </p>
          </div>

          {loadingData ? (
            <div className="p-4 text-sm text-slate-500 bg-white border rounded-md shadow-sm">
              Cargando perfil del negocio...
            </div>
          ) : !hasAccess ? (
            /* Criterio de Aceptación: Validación y renderizado condicional de rol */
            <div className="p-6 bg-red-50 text-red-600 rounded-md border border-red-200">
              <h2 className="text-lg font-semibold mb-1">Acceso Denegado</h2>
              <p className="text-sm">Solo los usuarios con rol Owner o Admin pueden administrar la identidad de la tienda.</p>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Perfil del Negocio</h2>
              
              {feedback && (
                <div className={`p-4 mb-5 rounded-md text-sm font-medium ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
                {/* Campo Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre de la Tienda
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full p-2.5 border border-slate-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-slate-50/50"
                  />
                  {errors.name && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name.message}</p>}
                </div>

                {/* Campo Subdominio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Subdominio de la Tienda
                  </label>
                  <div className="flex rounded-md shadow-sm border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <input
                      type="text"
                      {...register('subdomain')}
                      className="flex-1 p-2.5 bg-slate-50/50 text-gray-900 focus:outline-none"
                      placeholder="mi-tienda"
                    />
                    <span className="bg-slate-100 px-3 py-2.5 text-sm text-slate-500 border-l border-slate-300 flex items-center select-none font-medium">
                      .restocksaas.com
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Solo minúsculas, números y guiones. Sin espacios ni caracteres especiales.</p>
                  {errors.subdomain && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.subdomain.message}</p>}
                </div>

                {/* Campo Estado */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estado de la Tienda
                  </label>
                  <select
                    {...register('status', { setValueAs: (v) => v === 'true' })}
                    className="w-full p-2.5 border border-slate-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-slate-50/50"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                  {errors.status && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.status.message}</p>}
                </div>

                {/* Botón Guardar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition shadow-sm disabled:opacity-50 text-sm"
                  >
                    {isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}