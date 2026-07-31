const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Error del servidor";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export interface RegisterInvitationDTO {
  token: string;
  name: string;
  email: string;
  password: string;
}

export const invitationApi = {
  register: (data: RegisterInvitationDTO) =>
    apiFetch<{ message: string }>("/invitations/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};