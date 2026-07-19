'use client';

import { useState } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { InviteCollaboratorModal, InvitationData } from "../../components/dashboard/InviteCollaboratorModal";
import { EditMemberModal } from "../../components/dashboard/EditMemberModal";
import EquipoPanel from "../../components/dashboard/EquipoPanel";
import { UsuarioTeam, InvitacionTeam } from "../../types/team";

export default function EquipoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UsuarioTeam | null>(null);

  const [teamUsers, setTeamUsers] = useState<UsuarioTeam[]>([
    {
      id: "usr-01",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@ejemplo.com",
      role: "Owner",
      createdAt: "2026-06-01T08:00:00.000Z",
    },
    {
      id: "usr-02",
      name: "Ana Rodríguez",
      email: "ana.rodriguez@ejemplo.com",
      role: "Admin",
      createdAt: "2026-06-15T10:30:00.000Z",
    },
    {
      id: "usr-03",
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
      role: "Cajero",
      createdAt: "2026-07-01T14:15:00.000Z",
    }
  ]);

  const [invitaciones, setInvitaciones] = useState<InvitacionTeam[]>([
    {
      id_invitacion: "inv-01",
      email_invitado: "maria.gomez@ejemplo.com",
      role_asignado: "Gerente",
      token_seguridad: "REST-9F8A7D",
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_invitacion: "inv-02",
      email_invitado: "pedro.sanchez@ejemplo.com",
      role_asignado: "Empleado",
      token_seguridad: "REST-2B4C6D",
      expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]);

  const handleDeleteInvite = (id_invitacion: string) => {
    setInvitaciones(invitaciones.filter(inv => inv.id_invitacion !== id_invitacion));
  };

  const handleRemoveMember = (id: string) => {
    setTeamUsers(teamUsers.filter(usr => usr.id !== id));
  };

  const handleSuccess = (newInvitation: InvitationData) => {
    const mapped: InvitacionTeam = {
      id_invitacion: `inv-${Math.random().toString(36).substring(2, 9)}`,
      email_invitado: newInvitation.email,
      role_asignado: newInvitation.role,
      token_seguridad: `REST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setInvitaciones([mapped, ...invitaciones]);
  };

  const openEditMemberModal = (member: UsuarioTeam) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMemberRole = (id: string, newRole: string) => {
    setTeamUsers(teamUsers.map(usr => usr.id === id ? { ...usr, role: newRole } : usr));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#030303] text-gray-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          <EquipoPanel
            teamUsers={teamUsers}
            invitaciones={invitaciones}
            handleDeleteInvite={handleDeleteInvite}
            handleRemoveMember={handleRemoveMember}
            setShowInviteModal={setIsModalOpen}
            openEditMemberModal={openEditMemberModal}
          />
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
    </div>
  );
}
