'use client';

import { useState } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { InviteCollaboratorModal, InvitationData } from "../../components/dashboard/InviteCollaboratorModal";
import { UserPlus, Clock, Mail, Shield } from "lucide-react";

export default function EquipoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitations, setInvitations] = useState<InvitationData[]>([
    {
      email: "juan.perez@ejemplo.com",
      role: "Cajero",
      date: "2026-07-04T12:00:00.000Z", // Simulated date
    },
    {
      email: "maria.gomez@ejemplo.com",
      role: "Gerente",
      date: "2026-07-03T12:00:00.000Z", // Simulated date
    }
  ]);

  const handleSuccess = (newInvitation: InvitationData) => {
    setInvitations([newInvitation, ...invitations]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
              <p className="text-gray-500 mt-1">
                Gestiona los accesos y roles de tu personal.
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#07B474] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#069b63] transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus size={18} />
              + Invitar Colaborador
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-gray-800">Invitaciones Pendientes</h2>
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium ml-2">
                {invitations.length}
              </span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {invitations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay invitaciones pendientes.
                </div>
              ) : (
                invitations.map((inv, index) => (
                  <div key={index} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{inv.email}</p>
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                          Enviado el {formatDate(inv.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        <Shield size={14} />
                        {inv.role}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-medium border border-amber-200">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <InviteCollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
