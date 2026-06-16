export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-sm">
            Mi Tienda S.A.
          </p>

          <p className="text-[#07B474] text-sm">
            ● Modo Demo Activo
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
          A
        </div>
      </div>
    </header>
  );
}