import { Resend } from "resend";
import "dotenv/config";
import logger from "../utils/logger";

// Initialize Resend with API key from environment, or null if not available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendOTPArgs {
  email: string;
  otp: string;
  type: string;
}

export async function sendVerificationOTP({ email, otp, type }: SendOTPArgs): Promise<void> {
  let subject = "Código de verificación - ReStock";
  let text = `Tu código de verificación es: ${otp}`;
  let html = `<p>Tu código de verificación es: <strong>${otp}</strong></p>`;

  if (type === "forget-password") {
    subject = "Restablecer tu contraseña - ReStock";
    text = `Usa este código para restablecer tu contraseña: ${otp}`;
    html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Recuperación de contraseña</h2>
                <p>Usa el siguiente código de verificación de un solo uso (OTP) para restablecer tu contraseña:</p>
                <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px; background-color: #f4f4f5; border-radius: 8px; display: inline-block; margin: 10px 0;">
                    ${otp}
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
        `;
  }

  // If Resend API key is not configured, log a warning and skip sending
  if (!resend) {
    logger.warn(`Email service not configured. Would have sent email to ${email} with OTP: ${otp}`);
    return;
  }

  await resend.emails.send({
    from: "ReStock <notifications@restock.website>",
    to: email,
    subject: subject,
    text: text,
    html: html,
  });
}
