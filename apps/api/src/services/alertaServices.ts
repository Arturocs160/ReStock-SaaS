import {
  createAlertaIfNotOpenModel,
  ensureTipoAlertaStockBajoModel,
  getAlertasModel,
  getAlertasPendientesModel,
  getProductosBajoMinimoModel,
  resolveAlertaModel,
} from "../models/alertaModel";
import { userRepository } from "../repositories/user.repository";
import { getNegocioByIdModel } from "../models/negocioModel";
import { sendLowStockAlertsEmail } from "./mailService";
import logger from "../utils/logger";

export async function detectarYCrearAlertasService(id_negocio: string) {
  const productosBajoMinimo = await getProductosBajoMinimoModel(id_negocio);

  if (productosBajoMinimo.length === 0) {
    return [];
  }

  const id_tipo_alerta = await ensureTipoAlertaStockBajoModel();
  const nuevasAlertas: any[] = [];

  for (const producto of productosBajoMinimo) {
    const creada = await createAlertaIfNotOpenModel(producto.id_producto, id_tipo_alerta);
    if (creada) {
      nuevasAlertas.push({
        id_alerta: creada.id_alerta,
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        stock_actual: Number(producto.stock_actual),
        stock_minimo_sugerido: Number(producto.stock_minimo_sugerido),
      });
    }
  }

  if (nuevasAlertas.length > 0) {
    await notificarAlertasPorEmailService(id_negocio, nuevasAlertas);
  }

  return nuevasAlertas;
}

async function notificarAlertasPorEmailService(id_negocio: string, alertas: any[]) {
  try {
    const negocio = await getNegocioByIdModel(id_negocio);
    const users = await userRepository.findUsersByTenantId(id_negocio);
    const admins = users.filter((u) => u.role === "admin");

    const destinatarios = new Set<string>();
    for (const admin of admins) {
      if (admin.email) destinatarios.add(admin.email);
    }
    if (negocio?.email_comercial) destinatarios.add(negocio.email_comercial);

    if (destinatarios.size === 0) return;

    await sendLowStockAlertsEmail({
      to: Array.from(destinatarios),
      negocioNombre: negocio?.nombre || "Tu negocio",
      productos: alertas.map((a) => ({
        nombre: a.nombre,
        stock_actual: a.stock_actual,
        stock_minimo_sugerido: a.stock_minimo_sugerido,
      })),
    });
  } catch (error) {
    logger.error({ err: error }, "Error al enviar notificación de stock bajo");
  }
}

export async function getAlertasService(id_negocio: string) {
  const alertas = await getAlertasModel(id_negocio);

  return alertas.map((a) => ({
    id_alerta: a.id_alerta,
    id_producto: a.id_producto,
    id_tipo_alerta: a.id_tipo_alerta,
    fecha_emision: a.fecha_emision,
    resuelta: a.resuelta,
    tipo_alerta: a.tipo_alerta,
    tipo_alerta_descripcion: a.tipo_alerta_descripcion,
    producto: {
      id_producto: a.id_producto,
      nombre: a.producto_nombre,
      codigo_barras: a.codigo_barras,
      stock_actual: Number(a.stock_actual),
      stock_minimo_sugerido: Number(a.stock_minimo_sugerido),
    },
  }));
}

export async function getAlertasPendientesService(id_negocio: string) {
  const alertas = await getAlertasPendientesModel(id_negocio);

  return alertas.map((a) => ({
    id_alerta: a.id_alerta,
    id_producto: a.id_producto,
    id_tipo_alerta: a.id_tipo_alerta,
    fecha_emision: a.fecha_emision,
    resuelta: a.resuelta,
    tipo_alerta: a.tipo_alerta,
    tipo_alerta_descripcion: a.tipo_alerta_descripcion,
    producto: {
      id_producto: a.id_producto,
      nombre: a.producto_nombre,
      codigo_barras: a.codigo_barras,
      stock_actual: Number(a.stock_actual),
      stock_minimo_sugerido: Number(a.stock_minimo_sugerido),
    },
  }));
}

export async function resolveAlertaService(id_alerta: string, id_negocio: string) {
  const alerta = await resolveAlertaModel(id_alerta, id_negocio);

  if (!alerta) {
    const error = new Error("Alerta no encontrada o no pertenece a tu negocio.");
    (error as any).statusCode = 404;
    throw error;
  }

  return alerta;
}
