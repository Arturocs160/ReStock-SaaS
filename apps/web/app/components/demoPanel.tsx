"use client";

export function DemoPanel() {
  return (
    <div className="bg-linear-to-b from-white/80 to-gray-50 dark:from-black/60 dark:to-black/40 border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Demo</h2>
        <span className="text-sm text-gray-500">Vista previa</span>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        Usa estas credenciales para probar la demo rápidamente.
      </p>

      <div className="mt-4 bg-white/80 dark:bg-black/50 border border-gray-100 rounded-lg p-4">
        <dl className="text-sm text-gray-700">
          <div className="flex justify-between py-2">
            <dt className="font-medium">Email</dt>
            <dd>admin@demo.com</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="font-medium">Contraseña</dt>
            <dd>Demo123@</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-white/80 dark:bg-black/50 border border-gray-100 p-3">
          <p className="text-sm text-gray-700">
            <strong>Dashboard:</strong>
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
            <li>Inventario de ejemplo con 8 productos.</li>
            <li>
              Productos con precios, fechas de vencimiento por lote y stock.
            </li>
            <li>Registro de nuevos productos.</li>
            <li>Edición y eliminación de productos.</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            const detail = { email: "admin@demo.com", password: "Demo123@" };
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
