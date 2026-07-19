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

  
  const hasAccess = user?.role === 'owner' || user?.role === 'admin';

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
            <div className="p-8 bg-white rounded-[20px] shadow-sm border border-slate-100/80 max-w-xl">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  Datos de la Empresa (NEGOCIO)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Esta información se almacena en la tabla relacional de negocios.
                </p>
              </div>
              
              {feedback && (
                <div className={`p-4 mb-5 rounded-md text-sm font-medium ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Campo ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    ID del Negocio (UUID)
                  </label>
                  <input
                    type="text"
                    value="n1"
                    readOnly
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-400 focus:outline-none cursor-not-allowed text-sm"
                  />
                </div>

                {/* Campo Nombre */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Nombre Comercial *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all text-sm font-medium"
                  />
                  {errors.name && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name.message}</p>}
                </div>

                {/* Campo Subdominio */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Subdominio *
                  </label>
                  <div className="flex items-center w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
                    <input
                      type="text"
                      {...register('subdomain')}
                      className="flex-1 text-slate-800 focus:outline-none bg-transparent text-sm font-semibold"
                      placeholder="mi-tienda"
                    />
                    <span className="text-slate-400 text-sm select-none font-medium">
                      .restocksaas.com
                    </span>
                  </div>
                  {errors.subdomain && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.subdomain.message}</p>}
                </div>

                {/* Campo Estado */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100/60">
                  <div className="flex flex-col pr-4">
                    <span className="text-sm font-bold text-slate-800">
                      Estado del Negocio
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
                      Define si el subdominio y el dashboard están activos en producción.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      {...register('status')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00a86b] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                {errors.status && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.status.message}</p>}

                {/* Botón Guardar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#00a86b] hover:bg-[#00965e] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 text-sm cursor-pointer"
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