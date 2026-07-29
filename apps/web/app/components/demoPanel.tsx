"use client";

import { ReactNode } from "react";

interface DemoPanelProps {
  title?: string;
  subtitle?: ReactNode;
  email?: string;
  password?: string;
  sectionTitle?: string;
  features?: string[];
}

export function DemoPanel({
  title = "Demo",
  subtitle = "Usa estas credenciales para probar la demo rápidamente.",
  email = "admin@demo.com",
  password = "Demo123@",
  sectionTitle = "Dashboard",
  features = [
    "Inventario de ejemplo con 8 productos.",
    "Productos con precios, fechas de vencimiento por lote y stock.",
    "Registro de nuevos productos.",
    "Edición y eliminación de productos.",
  ],
}: DemoPanelProps) {
  return (
    <div className="bg-linear-to-b from-white/80 to-gray-50 dark:from-black/60 dark:to-black/40 border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">Vista previa</span>
      </div>

      <p className="mt-3 text-sm text-gray-600">{subtitle}</p>

      <div className="mt-4 bg-white/80 dark:bg-black/50 border border-gray-100 rounded-lg p-4">
        <dl className="text-sm text-gray-700">
          <div className="flex justify-between py-2">
            <dt className="font-medium">Email</dt>
            <dd>{email}</dd>
          </div>

          <div className="flex justify-between py-2">
            <dt className="font-medium">Contraseña</dt>
            <dd>{password}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-lg bg-white/80 dark:bg-black/50 border border-gray-100 p-3">
        <p className="text-sm text-gray-700">
          <strong>{sectionTitle}:</strong>
        </p>

        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            const detail = { email, password };

            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("fill-demo", { detail }));
            }
          }}
          className="inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Rellenar formulario
        </button>
      </div>
    </div>
  );
}
