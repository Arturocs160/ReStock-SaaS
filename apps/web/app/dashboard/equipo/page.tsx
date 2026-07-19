'use client';

import { useState, useEffect } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { InviteCollaboratorModal, InvitationData } from "../../components/dashboard/InviteCollaboratorModal";
import { EditMemberModal } from "../../components/dashboard/EditMemberModal";
import { ConfirmDeleteModal } from "../../components/dashboard/ConfirmDeleteModal";
import EquipoPanel from "../../components/dashboard/EquipoPanel";
import { UsuarioTeam, InvitacionTeam, mapBackendRoleToFrontend, mapFrontendRoleToBackend } from "../../types/team";
import { useAuthStore } from "../../store/authStore";
import { teamApi } from "../../lib/api";
import { Loader2 } from "lucide-react";

export default function EquipoPage() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UsuarioTeam | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<UsuarioTeam | null>(null);

  const [teamUsers, setTeamUsers] = useState<UsuarioTeam[]>([]);
  const [invitaciones, setInvitaciones] = useState<InvitacionTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamData = async () => {
    if (!user?.id_negocio) return;
    try {
      setLoading(true);
      setError(null);
      
      const members = await teamApi.getMembers(user.id_negocio);
      const mappedMembers: UsuarioTeam[] = members.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: mapBackendRoleToFrontend(m.role),
        createdAt: m.createdAt,
      }));
      setTeamUsers(mappedMembers);

      const invites = await teamApi.getInvitations();
      const mappedInvites: InvitacionTeam[] = invites.map((i: any) => ({
        id_invitacion: i.id_invitacion,
        email_invitado: i.email_invitado,
        role_asignado: mapBackendRoleToFrontend(i.role_asignado),
        token_seguridad: i.token_seguridad,
        expiresAt: i.expiresat,
      }));
      setInvitaciones(mappedInvites);
    } catch (err: any) {
      console.error("Error al cargar datos del equipo:", err);
      setError(err.message || "Error al cargar los datos del equipo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id_negocio) {
      fetchTeamData();
    } else {
      setLoading(false);
    }
  }, [user?.id_negocio]);

  const handleDeleteInvite = async (id_invitacion: string) => {
    try {
      await teamApi.deleteInvitation(id_invitacion);
      setInvitaciones(prev => prev.filter(inv => inv.id_invitacion !== id_invitacion));
    } catch (err: any) {
      console.error("Error al eliminar la invitación:", err);
      alert(err.message || "No se pudo cancelar la invitación.");
    }
  };

  const handleRemoveMemberClick = (id: string) => {
    const member = teamUsers.find(m => m.id === id);
    if (member) {
      setMemberToDelete(member);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user?.id_negocio || !memberToDelete) return;
    await teamApi.removeMember(user.id_negocio, memberToDelete.id);
    fetchTeamData();
  };

  const handleSuccess = (newInvitation: InvitationData) => {
    // Recargar invitaciones del servidor para asegurar que se muestre el token y la fecha real
    fetchTeamData();
  };

  const openEditMemberModal = (member: UsuarioTeam) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMemberRole = async (id: string, newRole: string) => {
    if (!user?.id_negocio) return;
    try {
      const backendRole = mapFrontendRoleToBackend(newRole);
      await teamApi.updateMemberRole(user.id_negocio, id, backendRole);
      fetchTeamData();
    } catch (err: any) {
      console.error("Error al actualizar el rol:", err);
      alert(err.message || "No se pudo actualizar el rol.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#030303] text-gray-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
              <Loader2 className="w-10 h-10 text-[#00a365] animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando gestión de equipo...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 text-center max-w-lg mx-auto mt-12">
              <h3 className="text-red-800 dark:text-red-400 font-bold text-lg mb-2">Error al cargar el panel</h3>
              <p className="text-red-600 dark:text-red-300 text-sm mb-4">{error}</p>
              <button
                onClick={fetchTeamData}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <EquipoPanel
              teamUsers={teamUsers}
              invitaciones={invitaciones}
              handleDeleteInvite={handleDeleteInvite}
              handleRemoveMember={handleRemoveMemberClick}
              setShowInviteModal={setIsModalOpen}
              openEditMemberModal={openEditMemberModal}
            />
          )}
        </main>
      </div>

      <InviteCollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={selectedMember}
        onSave={handleUpdateMemberRole}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        memberName={memberToDelete?.name || "Usuario Sin Nombre"}
        memberEmail={memberToDelete?.email || ""}
      />
    </div>
  );
}
