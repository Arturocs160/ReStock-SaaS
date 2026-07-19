import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOTPArgs {
  email: string;
  otp: string;
  type: string;
}

function getEmailWrapper(title: string, bodyContentHtml: string): string {
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);">
          <!-- Header (Branding) -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: left;">
              <table border="0" cellpadding="0" cellspacing="0" style="display: inline-block;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <span style="display: inline-block; width: 36px; height: 36px; background-color: #00a365; border-radius: 50%; text-align: center; line-height: 36px; color: #ffffff; font-weight: bold; font-size: 20px;">
                      R
                    </span>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">ReStock</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              ${bodyContentHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Este correo fue enviado de forma automática por <strong>ReStock</strong>.
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">
                &copy; ${currentYear} ReStock. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendVerificationOTP({ email, otp, type }: SendOTPArgs): Promise<void> {
  let subject = "Código de verificación - ReStock";
  let text = `Tu código de verificación es: ${otp}`;
  let html = "";

  if (type === "forget-password") {
    subject = "Restablecer tu contraseña - ReStock";
    text = `Usa este código para restablecer tu contraseña: ${otp}`;
    html = getEmailWrapper(
      "Restablecer tu contraseña",
      `
      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Recuperación de contraseña</h2>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
        Hemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente código de verificación de un solo uso (OTP) para proceder:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 18px 24px; background-color: #f1f5f9; color: #00a365; border-radius: 12px; display: inline-block; border: 1px solid #e2e8f0; font-family: monospace;">
          ${otp}
        </div>
      </div>
      <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
        Si no solicitaste este cambio, puedes ignorar este correo de forma segura y tu contraseña seguirá siendo la misma.
      </p>
      `
    );
  } else {
    subject = "Código de verificación - ReStock";
    text = `Tu código de verificación es: ${otp}`;
    html = getEmailWrapper(
      "Verifica tu correo electrónico",
      `
      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Verifica tu correo electrónico</h2>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
        Gracias por registrarte en <strong>ReStock</strong>. Usa el siguiente código de verificación de un solo uso (OTP) para validar tu cuenta:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 18px 24px; background-color: #f1f5f9; color: #00a365; border-radius: 12px; display: inline-block; border: 1px solid #e2e8f0; font-family: monospace;">
          ${otp}
        </div>
      </div>
      <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
        Este código vencerá pronto. Si no has intentado registrarte en ReStock, puedes ignorar este correo sin problemas.
      </p>
      `
    );
  }

  await resend.emails.send({
    from: "ReStock <notifications@restock.website>",
    to: email,
    subject: subject,
    text: text,
    html: html,
  });
}

export async function sendInvitationEmail({ email, invitationLink }: { email: string; invitationLink: string }): Promise<void> {
  const subject = "Te han invitado a unirte a un negocio en ReStock";
  const html = getEmailWrapper(
    "Invitación a ReStock",
    `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">¡Hola!</h2>
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
      Te han invitado a unirte a un negocio en la plataforma de gestión de inventarios <strong>ReStock</strong>.
    </p>
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
      Haz clic en el siguiente botón para aceptar la invitación y completar tu registro:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invitationLink}" style="background-color: #00a365; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 163, 101, 0.2);">
        Aceptar Invitación
      </a>
    </div>
    <p style="margin: 24px 0 8px 0; font-size: 12px; line-height: 1.5; color: #64748b;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:
    </p>
    <p style="margin: 0; font-size: 12px; color: #00a365; word-break: break-all; font-family: monospace; background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px dashed #cbd5e1;">
      ${invitationLink}
    </p>
    `
  );

  await resend.emails.send({
    from: "ReStock <notifications@restock.website>",
    to: email,
    subject: subject,
    text: `Te han invitado a unirte a un negocio en ReStock. Acepta la invitación usando este enlace: ${invitationLink}`,
    html: html,
  });
}

