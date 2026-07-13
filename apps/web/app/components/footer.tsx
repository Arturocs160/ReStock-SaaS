"use client";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p className="text-center md:text-left">
          © 2026 ReStock — Inventario inteligente para negocios pequeños.
        </p>

        <p className="text-center md:text-right">
          Hecho con cuidado para tenderos, farmacéuticos y comerciantes.
        </p>
      </div>
    </footer>
  );
}
