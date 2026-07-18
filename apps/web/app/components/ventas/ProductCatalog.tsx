'use client';

import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Producto, LoteInventario } from '../../types/inventario';

// Extended mock to include category just for UI demonstration
interface MockProducto extends Producto {
  categoria: string;
}

const MOCK_PRODUCTS: MockProducto[] = [
  { id_producto: 'p1', id_negocio: 'n1', codigo_barras: '7501055300075', nombre: 'Coca-Cola Original 600ml', precio_actual: 18.00, stock_minimo_sugerido: 10, categoria: 'Bebidas' },
  { id_producto: 'p2', id_negocio: 'n1', codigo_barras: '7501020512102', nombre: 'Leche Entera Lala 1L', precio_actual: 28.50, stock_minimo_sugerido: 15, categoria: 'Lácteos' },
  { id_producto: 'p3', id_negocio: 'n1', codigo_barras: '7501000111204', nombre: 'Pan Blanco Bimbo Grande', precio_actual: 45.00, stock_minimo_sugerido: 5, categoria: 'Panadería' },
  { id_producto: 'p4', id_negocio: 'n1', codigo_barras: '7501032900014', nombre: 'Huevos San Juan 30 pzas', precio_actual: 85.00, stock_minimo_sugerido: 10, categoria: 'Abarrotes' },
  { id_producto: 'p5', id_negocio: 'n1', codigo_barras: '750100579307', nombre: 'Detergente Líquido Ariel 1L', precio_actual: 110.00, stock_minimo_sugerido: 5, categoria: 'Limpieza' },
  { id_producto: 'p6', id_negocio: 'n1', codigo_barras: '7501003301055', nombre: 'Atún Herdez en Agua 130g', precio_actual: 22.50, stock_minimo_sugerido: 20, categoria: 'Enlatados' },
];

const MOCK_LOTES: LoteInventario[] = [
  { id_lote: 'l1', id_producto: 'p1', codigo_lote: 'L-COKE-01', fecha_ingreso: '2023-10-01', fecha_caducidad: '2025-10-01', cantidad_inicial: 50, cantidad_actual: 25 },
  { id_lote: 'l2', id_producto: 'p1', codigo_lote: 'L-COKE-02', fecha_ingreso: '2023-10-15', fecha_caducidad: '2023-11-15', cantidad_inicial: 50, cantidad_actual: 5 },
  { id_lote: 'l3', id_producto: 'p2', codigo_lote: 'L-LALA-01', fecha_ingreso: '2023-10-01', fecha_caducidad: '2023-10-10', cantidad_inicial: 20, cantidad_actual: 3 },
  { id_lote: 'l4', id_producto: 'p2', codigo_lote: 'L-LALA-02', fecha_ingreso: '2023-10-05', fecha_caducidad: '2023-12-01', cantidad_inicial: 20, cantidad_actual: 12 },
  { id_lote: 'l5', id_producto: 'p3', codigo_lote: 'L-BIMBO-01', fecha_ingreso: '2023-10-01', fecha_caducidad: '2023-10-25', cantidad_inicial: 10, cantidad_actual: 8 },
  { id_lote: 'l6', id_producto: 'p4', codigo_lote: 'L-HUEV-01', fecha_ingreso: '2023-10-01', fecha_caducidad: '2023-11-20', cantidad_inicial: 15, cantidad_actual: 6 },
  { id_lote: 'l7', id_producto: 'p5', codigo_lote: 'L-ARIEL-01', fecha_ingreso: '2023-10-01', fecha_caducidad: undefined, cantidad_inicial: 20, cantidad_actual: 15 },
  { id_lote: 'l8', id_producto: 'p6', codigo_lote: 'L-ATUN-01', fecha_ingreso: '2023-10-01', fecha_caducidad: '2026-10-01', cantidad_inicial: 40, cantidad_actual: 34 },
];

export function ProductCatalog() {
  const { addLote, items } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<{title: string, visible: boolean} | null>(null);

  const handleAdd = (lote: LoteInventario, producto: MockProducto) => {
    addLote(lote, producto);
    setToastMsg({ title: `Añadido al carrito: ${producto.nombre} (${lote.codigo_lote})`, visible: true });
    setTimeout(() => {
      setToastMsg(prev => prev ? { ...prev, visible: false } : null);
    }, 3000);
  };

  const getLotsForProduct = (productId: string) => {
    return MOCK_LOTES.filter(l => l.id_producto === productId);
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.codigo_barras && p.codigo_barras.includes(searchTerm))
  );

  return (
    <div className="flex-1 overflow-y-auto pb-20 relative">
      {/* Toast Notification */}
      {toastMsg && toastMsg.visible && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span className="font-medium text-sm">{toastMsg.title}</span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-600 hover:text-emerald-800 ml-2">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Generar Venta</h1>
        <p className="text-slate-500 text-sm">Busca el producto y selecciona el lote específico del cual quieres descontar stock para realizar la venta.</p>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-all"
          placeholder="Busca por nombre de producto o escanea código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.map((producto) => {
          const productLots = getLotsForProduct(producto.id_producto);
          const totalStock = productLots.reduce((acc, l) => acc + l.cantidad_actual, 0);

          return (
            <div key={producto.id_producto} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{producto.categoria}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Stock total: {totalStock}</span>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg">{producto.nombre}</h3>
              <p className="text-xs text-slate-400 mb-4">Código: {producto.codigo_barras || 'N/A'}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">Precio unitario:</span>
                <span className="font-bold text-slate-800 text-lg">${producto.precio_actual.toFixed(2)}</span>
              </div>
              
              <div className="mt-auto">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Lotes Disponibles:</h4>
                <div className="space-y-3">
                  {productLots.map(lote => {
                    const cartItem = items.find(i => i.loteId === lote.id_lote);
                    const isMaxReached = cartItem ? cartItem.cantidad >= lote.cantidad_actual : false;
                    
                    // Lógica simple para color del tag basado en caducidad (mock)
                    let tagColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                    let tagText = "Vigente";
                    if (lote.fecha_caducidad === '2023-11-15') { tagColor = "text-orange-700 bg-orange-50 border-orange-200"; tagText = "Caduca en 4d"; }
                    if (lote.fecha_caducidad === '2023-10-10') { tagColor = "text-red-700 bg-red-50 border-red-200"; tagText = "Caducado hace 2d"; }
                    if (lote.fecha_caducidad === '2023-10-25') { tagColor = "text-orange-700 bg-orange-50 border-orange-200"; tagText = "Caduca en 11d"; }
                    if (lote.fecha_caducidad === '2023-11-20') { tagColor = "text-orange-700 bg-orange-50 border-orange-200"; tagText = "Caduca en 35d"; }

                    return (
                      <div key={lote.id_lote} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{lote.codigo_lote} <span className="text-slate-400 font-normal">({lote.cantidad_actual} uds)</span></p>
                          {lote.fecha_caducidad ? (
                            <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${tagColor}`}>
                              {tagText}
                            </span>
                          ) : (
                            <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border text-slate-600 bg-slate-50 border-slate-200">
                              Sin caducidad
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAdd(lote, producto)}
                          disabled={lote.cantidad_actual === 0 || isMaxReached}
                          className={`px-4 py-1.5 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            lote.cantidad_actual === 0 || isMaxReached
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                          }`}
                        >
                          <Plus size={14} className="mr-1" />
                          {isMaxReached ? 'Límite' : 'Agregar'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
