'use client';
import { Package } from "lucide-react";

export function Navbar() {


  const sections = [
    { id: "problema", label: "Problema" },
    { id: "solucion", label: "Solución" },
    { id: "beneficios", label: "Beneficios" },
    { id: "cta", label: "Empezar" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        
        <a href="#" className="flex items-center gap-3 font-semibold text-xl text-gray-900">
          <span className="grid place-items-center w-10 h-10 rounded-full text-white bg-[#00a365]">
            <Package className="w-5 h-5" />
          </span>
          <span className="font-bold tracking-tight">ReStock</span>
        </a>

        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-gray-500">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="hover:text-gray-900 transition"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <a 
            href="#cta"
            className="bg-[#00a365] hover:bg-[#008c54] text-white font-medium text-sm px-5 py-2.5 rounded-full transition shadow-sm"
          >
            Pruébalo gratis
          </a>
        </div>

      </div>
    </header>
  );
}