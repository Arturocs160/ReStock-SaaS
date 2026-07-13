'use client';

import { useState } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { InviteCollaboratorModal, InvitationData } from "../../components/dashboard/InviteCollaboratorModal";
import { Pen, Trash2 } from "lucide-react";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("equipo");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for the table based on the screenshot
  const teamMembers = [
    {
      id: "u1",
      name: "Arturo",
      email: "arturo@mitienda.com",
      role: "Owner",
      date: "15 ene 2026",
      roleColor: "text-purple-600 bg-purple-50",
    },
    {
      id: "u2",
      name: "Sofia Méndez",
      email: "sofia@mitienda.com",
      role: "Empleado",
      date: "10 abr 2026",
      roleColor: "text-gray-600 bg-gray-100",
    },
    {
      id: "u3",
      name: "Carlos Pérez",
      email: "carlos@mitienda.com",
      role: "Admin",
      date: "1 may 2026",
      roleColor: "text-blue-600 bg-blue-50",
    },
  ];

  const handleInviteSuccess = (newInvitation: InvitationData) => {
    // En una aplicación real, esto actualizaría las invitaciones pendientes
    console.log("Nueva invitación:", newInvitation);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Configuración del Sistema
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra los parámetros de tu negocio, los roles del equipo e invita nuevos colaboradores.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("perfil")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "perfil"
                  ? "border-b-2 border-[#07B474] text-[#07B474]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Perfil del Negocio
            </button>
            <button
              onClick={() => setActiveTab("equipo")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "equipo"
                  ? "border-b-2 border-[#07B474] text-[#07B474]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Equipo (3)
            </button>
            <button
              onClick={() => setActiveTab("invitaciones")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "invitaciones"
                  ? "border-b-2 border-[#07B474] text-[#07B474]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Invitaciones Enviadas (2)
            </button>
          </div>

          {/* Tab Content: Equipo */}
          {activeTab === "equipo" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100">
                <div>
                  <h2 className="text-[1.05rem] font-bold text-gray-900">Usuarios del Negocio</h2>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Mapeado directo de colaboradores registrados en la tabla USER para tu ID de negocio.
                  </p>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-[#07B474] text-white text-sm font-semibold rounded-lg hover:bg-[#069b63] transition-colors whitespace-nowrap"
                >
                  + Invitar Colaborador
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Usuario</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Rol en Tienda</th>
                      <th className="px-6 py-4 font-bold">Creado El</th>
                      <th className="px-6 py-4 font-bold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm shrink-0">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[14px] text-gray-900">{member.name}</p>
                              <p className="text-[12px] text-gray-400">ID: {member.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {member.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${member.roleColor}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {member.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" aria-label="Editar">
                              <Pen size={16} />
                            </button>
                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" aria-label="Eliminar">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <InviteCollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
}