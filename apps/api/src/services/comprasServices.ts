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
  items: ItemOrdenCompraInput[],
  timezone: string = "UTC"
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

  return construirPdfListaReabastecimiento(negocio?.nombre ?? "Negocio", filas, timezone);
}

function construirPdfListaReabastecimiento(
  nombreNegocio: string,
  filas: FilaReabastecimiento[],
  timezone: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 40, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Decoración superior (línea de marca verde ReStock)
    doc.fillColor("#00a365").rect(0, 0, doc.page.width, 8).fill();

    // Logotipo / Encabezado
    // Círculo verde del logo
    doc.fillColor("#00a365").circle(55, 38, 15).fill();

    // Dibujar icono de caja abierta (estilo Lucide Package) en color blanco
    doc.strokeColor("#ffffff").lineWidth(1.2).lineCap("round").lineJoin("round");

    // Contorno del paquete
    doc
      .moveTo(55, 31.5)
      .lineTo(61, 35)
      .lineTo(61, 41)
      .lineTo(55, 44.5)
      .lineTo(49, 41)
      .lineTo(49, 35)
      .closePath()
      .stroke();

    // Línea vertical central
    doc.moveTo(55, 44.5).lineTo(55, 38).stroke();

    // Apertura superior (Y interna)
    doc.moveTo(49.2, 34.7).lineTo(55, 38).lineTo(60.8, 34.7).stroke();

    // Flaps superiores
    doc.moveTo(58.3, 36.8).lineTo(61, 35.3).stroke();
    doc.moveTo(51.7, 36.8).lineTo(49, 35.3).stroke();

    // Texto del logo al lado del isotipo
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(20).text("ReStock", 78, 25);
    doc
      .fillColor("#64748b")
      .font("Helvetica")
      .fontSize(8)
      .text("Gestión Inteligente de Inventarios", 78, 46);

    // Título del reporte (columna izquierda)
    doc
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("Lista de Reabastecimiento", 40, 68);

    const now = new Date();
    const fechaStr = now.toLocaleDateString("es-MX", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaStr = now.toLocaleTimeString("es-MX", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Información de Negocio y Fecha (columna derecha alineada)
    const rightAlignX = doc.page.width - 240;
    doc
      .fillColor("#1e293b")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(nombreNegocio, rightAlignX, 28, { align: "right", width: 200 });
    doc
      .fillColor("#475569")
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("REPORTE DE COMPRAS", rightAlignX, 44, { align: "right", width: 200 });
    doc
      .fillColor("#64748b")
      .font("Helvetica")
      .fontSize(8)
      .text(`Fecha de emisión: ${fechaStr} - ${horaStr}`, rightAlignX, 55, {
        align: "right",
        width: 200,
      });

    // Línea divisoria elegante
    doc
      .strokeColor("#e2e8f0")
      .lineWidth(1)
      .moveTo(40, 85)
      .lineTo(doc.page.width - 40, 85)
      .stroke();

    // Configuración de la tabla
    const columnas = [
      { titulo: "Producto", ancho: 230, alinear: "left" as const },
      { titulo: "Stock actual", ancho: 90, alinear: "right" as const },
      { titulo: "Stock mínimo", ancho: 95, alinear: "right" as const },
      { titulo: "Ventas 7 días", ancho: 95, alinear: "right" as const },
      { titulo: "Déficit", ancho: 80, alinear: "right" as const },
      { titulo: "Cantidad a ordenar", ancho: 125, alinear: "right" as const },
    ];
    const anchoTabla = columnas.reduce((total, col) => total + col.ancho, 0);
    const inicioX = (doc.page.width - anchoTabla) / 2;
    const headerHeight = 26;
    const rowHeight = 22;
    const fontSize = 9;
    let y = 105;

    const dibujarEncabezadoTabla = () => {
      // Fondo azul grisáceo premium para el header de la tabla
      doc.fillColor("#1e293b").rect(inicioX, y, anchoTabla, headerHeight).fill();

      let x = inicioX;
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(fontSize);
      // Centrado vertical de los textos de cabecera
      const textY = y + (headerHeight - fontSize) / 2 - 0.5;
      for (const col of columnas) {
        doc.text(col.titulo, x, textY, { width: col.ancho - 8, align: col.alinear });
        x += col.ancho;
      }
      y += headerHeight;
    };

    dibujarEncabezadoTabla();

    let esPar = false;
    for (const fila of filas) {
      // Salto de página si no cabe la fila + resumen final
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom - 45) {
        doc.addPage();
        // Línea de marca verde también en páginas subsecuentes
        doc.fillColor("#00a365").rect(0, 0, doc.page.width, 8).fill();
        y = doc.page.margins.top + 10;
        dibujarEncabezadoTabla();
      }

      // Dibujar fondo cebra
      if (esPar) {
        doc.fillColor("#f8fafc").rect(inicioX, y, anchoTabla, rowHeight).fill();
      }
      esPar = !esPar;

      const valores = [
        fila.nombre,
        String(fila.stock_actual),
        String(fila.stock_minimo_sugerido),
        String(fila.ventas_ultimos_7_dias),
        String(fila.deficit),
        String(fila.cantidad_ordenar),
      ];

      let x = inicioX;
      doc.fillColor("#334155").font("Helvetica").fontSize(fontSize);
      // Centrado vertical de los textos de la fila
      const textY = y + (rowHeight - fontSize) / 2;
      columnas.forEach((col, indice) => {
        doc.text(valores[indice], x, textY, { width: col.ancho - 8, align: col.alinear });
        x += col.ancho;
      });

      // Línea divisoria muy tenue justo al final de la fila
      const lineY = y + rowHeight;
      doc
        .strokeColor("#e2e8f0")
        .lineWidth(0.5)
        .moveTo(inicioX, lineY)
        .lineTo(inicioX + anchoTabla, lineY)
        .stroke();

      y += rowHeight;
    }

    // Caja de resumen final
    y += 10;
    if (y + 32 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      doc.fillColor("#00a365").rect(0, 0, doc.page.width, 8).fill();
      y = doc.page.margins.top + 10;
    }

    // Fondo gris claro para el cuadro de resumen
    doc.fillColor("#f8fafc").rect(inicioX, y, anchoTabla, 32).fill();
    doc.strokeColor("#e2e8f0").lineWidth(1).rect(inicioX, y, anchoTabla, 32).stroke();

    // Textos de resumen centrados verticalmente
    const summaryTextY = y + (32 - fontSize) / 2;
    doc
      .fillColor("#1e293b")
      .font("Helvetica-Bold")
      .fontSize(fontSize)
      .text(`Total de productos a reabastecer: ${filas.length}`, inicioX + 15, summaryTextY);

    const totalCantidadOrdenar = filas.reduce((sum, f) => sum + f.cantidad_ordenar, 0);
    doc
      .fillColor("#00a365")
      .font("Helvetica-Bold")
      .fontSize(fontSize)
      .text(
        `Total de unidades a ordenar: ${totalCantidadOrdenar}`,
        inicioX + anchoTabla - 230,
        summaryTextY,
        { align: "right", width: 215 }
      );

    // Numeración de páginas
    const paginas = doc.bufferedPageRange();
    for (let i = 0; i < paginas.count; i++) {
      doc.switchToPage(i);

      // Evitar que la escritura en el margen inferior dispare páginas nuevas
      const oldMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      // Footer Izquierdo
      doc
        .fillColor("#94a3b8")
        .font("Helvetica")
        .fontSize(8)
        .text(
          "Generado automáticamente por ReStock - Control de Inventarios Inteligente",
          40,
          doc.page.height - 25
        );

      // Footer Derecho (Paginación)
      doc.text(`Página ${i + 1} de ${paginas.count}`, doc.page.width - 240, doc.page.height - 25, {
        align: "right",
        width: 200,
      });

      doc.page.margins.bottom = oldMargin;
    }

    doc.end();
  });
}
