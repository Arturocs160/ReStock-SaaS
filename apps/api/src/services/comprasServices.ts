import PDFDocument from "pdfkit";
import {
  getStockConsolidadoPorProductoModel,
  getProductosReabastecimientoPorIdsModel,
} from "../models/comprasModel";
import { getNegocioByIdModel } from "../models/negocioModel";
import { ItemOrdenCompraInput } from "../schemas/comprasSchema";

const MULTIPLO_REABASTECIMIENTO = 5;

export async function getSugerenciasReabastecimientoService(id_negocio: string) {
  const productos = await getStockConsolidadoPorProductoModel(id_negocio);

  return productos
    .filter((producto: any) => producto.stock_actual < producto.stock_minimo_sugerido)
    .map((producto: any) => {
      const deficit = producto.stock_minimo_sugerido - producto.stock_actual;
      const baseReabastecimiento = Math.max(deficit, producto.ventas_ultimos_7_dias);
      return {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        stock_actual: producto.stock_actual,
        stock_minimo_sugerido: producto.stock_minimo_sugerido,
        ventas_ultimos_7_dias: producto.ventas_ultimos_7_dias,
        deficit,
        cantidad_sugerida:
          Math.ceil(baseReabastecimiento / MULTIPLO_REABASTECIMIENTO) * MULTIPLO_REABASTECIMIENTO,
      };
    });
}

interface FilaReabastecimiento {
  nombre: string;
  stock_actual: number;
  stock_minimo_sugerido: number;
  ventas_ultimos_7_dias: number;
  deficit: number;
  cantidad_ordenar: number;
}

export async function generarListaReabastecimientoPdfService(
  id_negocio: string,
  items: ItemOrdenCompraInput[]
): Promise<Buffer> {
  const ids_producto = [...new Set(items.map((item) => item.id_producto))];
  const productos = await getProductosReabastecimientoPorIdsModel(id_negocio, ids_producto);

  // Control multi-tenant: si falta algún producto solicitado, no pertenece al negocio (o está inactivo)
  if (productos.length !== ids_producto.length) {
    const error = new Error(
      "Uno o más productos no existen, están inactivos o no pertenecen a tu negocio."
    );
    (error as any).statusCode = 404;
    throw error;
  }

  const negocio = await getNegocioByIdModel(id_negocio);
  const cantidadPorProducto = new Map(items.map((item) => [item.id_producto, item.cantidad]));

  const filas: FilaReabastecimiento[] = productos.map((producto: any) => ({
    nombre: producto.nombre,
    stock_actual: producto.stock_actual,
    stock_minimo_sugerido: producto.stock_minimo_sugerido,
    ventas_ultimos_7_dias: producto.ventas_ultimos_7_dias,
    deficit: producto.stock_minimo_sugerido - producto.stock_actual,
    cantidad_ordenar: cantidadPorProducto.get(producto.id_producto) as number,
  }));

  return construirPdfListaReabastecimiento(negocio?.nombre ?? "Negocio", filas);
}

function construirPdfListaReabastecimiento(
  nombreNegocio: string,
  filas: FilaReabastecimiento[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 40 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Encabezado
    doc.fontSize(18).font("Helvetica-Bold").text("Lista de Reabastecimiento", { align: "center" });
    doc.fontSize(12).font("Helvetica").text(nombreNegocio, { align: "center" });
    doc
      .fontSize(10)
      .text(`Fecha de emisión: ${new Date().toLocaleDateString("es-MX")}`, { align: "center" });
    doc.moveDown(2);

    // Configuración de la tabla
    const columnas = [
      { titulo: "Producto", ancho: 240, alinear: "left" as const },
      { titulo: "Stock actual", ancho: 90, alinear: "right" as const },
      { titulo: "Stock mínimo", ancho: 90, alinear: "right" as const },
      { titulo: "Ventas 7 días", ancho: 95, alinear: "right" as const },
      { titulo: "Déficit", ancho: 80, alinear: "right" as const },
      { titulo: "Cantidad a ordenar", ancho: 120, alinear: "right" as const },
    ];
    const anchoTabla = columnas.reduce((total, col) => total + col.ancho, 0);
    const inicioX = (doc.page.width - anchoTabla) / 2;
    const altoFila = 24;
    let y = doc.y;

    const dibujarEncabezadoTabla = () => {
      let x = inicioX;
      doc.font("Helvetica-Bold").fontSize(10);
      for (const col of columnas) {
        doc.text(col.titulo, x, y, { width: col.ancho - 8, align: col.alinear });
        x += col.ancho;
      }
      y += 6;
      doc
        .moveTo(inicioX, y)
        .lineTo(inicioX + anchoTabla, y)
        .lineWidth(1.5)
        .stroke();
      y += 12;
    };

    dibujarEncabezadoTabla();
    doc.font("Helvetica").fontSize(10);

    for (const fila of filas) {
      // Salto de página si la fila no cabe
      if (y + altoFila > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.page.margins.top;
        dibujarEncabezadoTabla();
        doc.font("Helvetica").fontSize(10);
      }

      const valores = [
        fila.nombre,
        String(fila.stock_actual),
        String(fila.stock_minimo_sugerido),
        String(fila.ventas_ultimos_7_dias),
        String(fila.deficit),
        String(fila.cantidad_ordenar),
      ];

      let x = inicioX;
      columnas.forEach((col, indice) => {
        doc.text(valores[indice], x, y, { width: col.ancho - 8, align: col.alinear });
        x += col.ancho;
      });

      y += 6;
      doc
        .moveTo(inicioX, y)
        .lineTo(inicioX + anchoTabla, y)
        .lineWidth(0.5)
        .stroke();
      y += 12;
    }

    // Pie de página
    doc.fontSize(9).text(`Total de productos a reabastecer: ${filas.length}`, inicioX, y + 10, {
      width: anchoTabla,
      align: "left",
    });

    doc.end();
  });
}
