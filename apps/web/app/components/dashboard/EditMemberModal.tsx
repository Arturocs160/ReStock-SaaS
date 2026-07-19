'use client';

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { UsuarioTeam } from "../../types/team";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: UsuarioTeam | null;
  onSave: (id: string, newRole: string) => void;
}

export function EditMemberModal({ isOpen, onClose, member, onSave }: EditMemberModalProps) {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (member) {
      setRole(member.role);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    onSave(member.id, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-[20px] w-full max-w-md overflow-hidden relative shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h2 className="text-[1.35rem] font-bold text-gray-900 dark:text-white leading-tight">Editar Rol de Colaborador</h2>
            <p className="text-gray-500 text-[13px] mt-1">Modifica el rol de acceso del usuario en tu negocio.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
          {/* Informacion del Usuario (Read Only) */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-900/50 space-y-2">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Nombre</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{member.name || "Usuario Sin Nombre"}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Correo Electrónico</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{member.email}</span>
            </div>
          </div>

          {/* Selector de Rol */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Rol asignado
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-[#00a365] focus:border-[#00a365] transition-colors appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none text-sm font-medium"
              >
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
                <option value="Gerente">Gerente</option>
                <option value="Empleado">Empleado</option>
                <option value="Cajero">Cajero</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="pt-2 flex justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer text-[14px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white rounded-xl font-semibold transition-colors cursor-pointer text-[14px]"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
