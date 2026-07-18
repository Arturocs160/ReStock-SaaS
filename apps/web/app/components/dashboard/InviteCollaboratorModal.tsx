import { useState } from "react";
import { z } from "zod";
import { X, Check, Loader2 } from "lucide-react";

export type Role = "Gerente" | "Empleado" | "Cajero";

export interface InvitationData {
  email: string;
  role: Role;
  date: string;
}

const inviteSchema = z.object({
  email: z.string().email({ message: "El formato de correo no es válido" }),
  role: z.string().min(1, { message: "Debes seleccionar un rol válido" }),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: InvitationData) => void;
}

export function InviteCollaboratorModal({ isOpen, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationResult = inviteSchema.safeParse({ email, role });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message || "Error de validación");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setShowSuccess(true);

    const newInvitation: InvitationData = {
      email,
      role: role as Role,
      date: new Date().toISOString(),
    };

    setTimeout(() => {
      onSuccess(newInvitation);
      setShowSuccess(false);
      setEmail("");
      setRole("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
      <div className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h2 className="text-[1.35rem] font-bold text-gray-900 leading-tight">Invitar Colaborador</h2>
            <p className="text-gray-500 text-[13px] mt-1">Registra una invitación en la tabla INVITACION del negocio.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="text-green-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">¡Invitación enviada!</h3>
              <p className="text-gray-500">Se ha enviado un correo a {email} con las instrucciones de acceso.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  placeholder="colaborador@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07B474] focus:border-[#07B474] transition-colors outline-none text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Role field */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Rol asignado
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07B474] focus:border-[#07B474] transition-colors appearance-none bg-white text-gray-900 outline-none disabled:bg-gray-50 text-sm font-medium"
                    disabled={isLoading}
                  >
                    <option value="" disabled>Selecciona un rol</option>
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

              {/* Security info box */}
              <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
                <p className="text-[13px] font-bold text-gray-800 mb-1">Detalles de Seguridad:</p>
                <ul className="text-[13px] text-gray-600 space-y-0.5">
                  <li>• Se generará un token de seguridad único aleatorio.</li>
                  <li>• La fecha de expiración se establecerá en 7 días a partir de hoy.</li>
                </ul>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-2.5 border border-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-[14px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-[#07B474] text-white rounded-xl font-semibold hover:bg-[#069b63] transition-colors disabled:opacity-70 cursor-pointer text-[14px] flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Invitación"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
