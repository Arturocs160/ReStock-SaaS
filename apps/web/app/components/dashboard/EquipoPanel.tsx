'use client';

import { useState } from "react";
import { Plus, Edit3, Trash2, User } from "lucide-react";
import { UsuarioTeam, InvitacionTeam } from "../../types/team";

interface EquipoPanelProps {
  teamUsers: UsuarioTeam[];
  invitaciones: InvitacionTeam[];
  handleDeleteInvite: (id_invitacion: string) => void;
  handleRemoveMember: (id: string) => void;
  setShowInviteModal: (show: boolean) => void;
  openEditMemberModal: (member: UsuarioTeam) => void;
}

export default function EquipoPanel({
  teamUsers,
  invitaciones,
  handleDeleteInvite,
  handleRemoveMember,
  setShowInviteModal,
  openEditMemberModal
}: EquipoPanelProps) {
  const [activeTab, setActiveTab] = useState<"miembros" | "invitaciones">("miembros");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Equipo</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Administra los roles del equipo de tu negocio e invita a nuevos colaboradores.
        </p>
      </div>

      {/* Botones de navegación interna para Equipo */}
      <div className="flex border-b border-gray-150 dark:border-gray-800 gap-6">
        <button
          onClick={() => setActiveTab("miembros")}
          className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
            activeTab === "miembros"
              ? "border-[#00a365] text-[#00a365]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Miembros ({teamUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("invitaciones")}
          className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
            activeTab === "invitaciones"
              ? "border-[#00a365] text-[#00a365]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Invitaciones Enviadas ({invitaciones.length})
        </button>
      </div>

      {/* CONTENIDO TAB 1: MIEMBROS */}
      {activeTab === "miembros" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl p-4 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Usuarios del Negocio</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Colaboradores registrados que tienen acceso a tu negocio.
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-[#00a365] hover:bg-[#008c54] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Invitar Colaborador
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm text-gray-500">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold uppercase text-gray-400 border-b border-gray-100 dark:border-gray-900">
                  <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Rol en Tienda</th>
                    <th className="px-6 py-4">Creado el</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                  {teamUsers.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
                          {member.name ? member.name.charAt(0) : "U"}
                        </span>
                        <div>
                          <p>{member.name || "Usuario Sin Nombre"}</p>
                          <p className="text-[10px] text-gray-450 dark:text-gray-550 font-normal">ID: {member.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          member.role === "Admin"
                            ? "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                            : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-850 dark:text-gray-300 dark:border-gray-700"
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-455 dark:text-gray-550 whitespace-nowrap">
                        {new Date(member.createdAt).toLocaleDateString("es-MX", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openEditMemberModal(member)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition inline-block cursor-pointer"
                          title="Editar rol"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-350 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition inline-block cursor-pointer"
                          title="Remover de la empresa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 2: INVITACIONES */}
      {activeTab === "invitaciones" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl p-4 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Invitaciones Pendientes</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Invitaciones enviadas a futuros colaboradores. Los enlaces de acceso expiran en 7 días.
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-[#00a365] hover:bg-[#008c54] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Enviar Invitación
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm text-gray-500">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold uppercase text-gray-400 border-b border-gray-100 dark:border-gray-900">
                  <tr>
                    <th className="px-6 py-4">Correo Invitado</th>
                    <th className="px-6 py-4">Rol Asignado</th>
                    <th className="px-6 py-4">Token de Seguridad</th>
                    <th className="px-6 py-4">Expira el</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-right">Cancelar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                  {invitaciones.length > 0 ? (
                    invitaciones.map(invite => {
                      const isExpired = new Date(invite.expiresAt).getTime() < Date.now();
                      return (
                        <tr key={invite.id_invitacion} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition">
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {invite.email_invitado}
                          </td>
                          <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-600 dark:text-gray-300">
                            {invite.role_asignado}
                          </td>
                          <td className="px-6 py-4 text-gray-455 dark:text-gray-550 whitespace-nowrap font-mono text-xs">
                            {invite.token_seguridad}
                          </td>
                          <td className="px-6 py-4 text-gray-455 dark:text-gray-550 whitespace-nowrap">
                            {new Date(invite.expiresAt).toLocaleDateString("es-MX", {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isExpired
                                ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
                                : "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30"
                            }`}>
                              {isExpired ? "Expirada" : "Pendiente"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteInvite(invite.id_invitacion)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-350 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition inline-block cursor-pointer"
                              title="Cancelar invitación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        <User className="w-10 h-10 text-gray-200 dark:text-gray-800 mx-auto mb-2" />
                        <p className="font-semibold text-sm">No hay invitaciones enviadas</p>
                        <p className="text-xs">Los colaboradores externos que invites aparecerán en este apartado.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
