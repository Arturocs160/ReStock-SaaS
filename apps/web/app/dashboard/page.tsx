'use client';

import { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  ChevronDown, 
  X, 
  CheckCircle, 
  Clock, 
  SlidersHorizontal, 
  Info, 
  ArrowLeft,
  LayoutDashboard,
  Layers,
  Settings,
  BarChart3,
  TrendingDown,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string; // CB
  price: number;
  suggestedStock: number;
}

export interface Lote {
  id: string;
  productId: string;
  code: string;
  fechaIngreso: string; // YYYY-MM-DD
  fechaCaducidad: string; // YYYY-MM-DD
  cantidadInicial: number;
  cantidadActual: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

// Simulated Reference Date
const REFERENCE_DATE = '2026-06-14';

// Mock Constants Matching Image Exactly
const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Coca-Cola Original 600ml', category: 'Bebidas', barcode: '7501055300075', price: 18.00, suggestedStock: 25 },
  { id: 'p2', name: 'Leche Entera Lala 1L', category: 'Lácteos', barcode: '7501020512103', price: 26.50, suggestedStock: 15 },
  { id: 'p3', name: 'Pan Blanco Bimbo Grande', category: 'Panadería', barcode: '7501000111206', price: 45.00, suggestedStock: 12 },
  { id: 'p4', name: 'Huevos San Juan 30 pzas', category: 'Abarrotes', barcode: '7501032900014', price: 85.00, suggestedStock: 8 },
  { id: 'p5', name: 'Detergente Líquido Ariel 1L', category: 'Limpieza', barcode: '7501006579307', price: 39.00, suggestedStock: 10 },
  { id: 'p6', name: 'Atún Herdez en Agua 130g', category: 'Abarrotes', barcode: '7501003579307', price: 21.00, suggestedStock: 20 },
];

const INITIAL_LOTES: Lote[] = [
  { id: 'l1', productId: 'p1', code: 'L-COKE-01', fechaIngreso: '2026-05-10', fechaCaducidad: '2026-10-15', cantidadInicial: 25, cantidadActual: 25 },
  { id: 'l2', productId: 'p1', code: 'L-COKE-02', fechaIngreso: '2026-06-01', fechaCaducidad: '2026-06-18', cantidadInicial: 10, cantidadActual: 5 },
  { id: 'l3', productId: 'p2', code: 'L-LALA-01', fechaIngreso: '2026-06-01', fechaCaducidad: '2026-06-28', cantidadInicial: 15, cantidadActual: 15 },
  { id: 'l4', productId: 'p3', code: 'L-BIMBO-01', fechaIngreso: '2026-06-05', fechaCaducidad: '2026-06-22', cantidadInicial: 12, cantidadActual: 8 },
  { id: 'l5', productId: 'p4', code: 'L-HUEV-01', fechaIngreso: '2026-06-08', fechaCaducidad: '2026-06-25', cantidadInicial: 8, cantidadActual: 6 },
  { id: 'l6', productId: 'p5', code: 'L-ARIEL-01', fechaIngreso: '2026-06-10', fechaCaducidad: '2026-07-10', cantidadInicial: 15, cantidadActual: 15 },
  { id: 'l7', productId: 'p6', code: 'L-HERD-01', fechaIngreso: '2026-06-02', fechaCaducidad: '2026-08-02', cantidadInicial: 34, cantidadActual: 34 },
];

// Helper calculations
function getDaysRemaining(expiryDateStr: string | undefined | null): number {
  if (!expiryDateStr) return 99999;
  const ref = new Date(REFERENCE_DATE + 'T00:00:00');
  const expiry = new Date(expiryDateStr + 'T00:00:00');
  const diffTime = expiry.getTime() - ref.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('lotes');

  // In-memory data states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [lotes, setLotes] = useState<Lote[]>(INITIAL_LOTES);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // UI interaction states
  const [expandedProductId, setExpandedProductId] = useState<string | null>('p1'); // Coca-Cola open by default as in image
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal control states
  const [activeModal, setActiveModal] = useState<'addProduct' | 'editProduct' | 'deleteProduct' | 'addLote' | 'editLote' | 'deleteLote' | null>(null);
  
  // Selection references
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({ name: '', category: 'Bebidas', barcode: '', price: 0, suggestedStock: 0 });
  const [loteForm, setLoteForm] = useState({ code: '', fechaIngreso: '', fechaCaducidad: '', cantidadInicial: 0, cantidadActual: 0 });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Helper to add toasts
  const addToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Categories list computed from products list
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Actual stock mapped per product
  const productStockTotals = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      const total = lotes.filter(l => l.productId === p.id).reduce((sum, l) => sum + l.cantidadActual, 0);
      map.set(p.id, total);
    });
    return map;
  }, [products, lotes]);

  // Filters and search applied on mocks
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === '' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Open Add Product Modal
  const openAddProduct = () => {
    setProductForm({ name: '', category: 'Bebidas', barcode: '', price: 0, suggestedStock: 0 });
    setFormErrors({});
    setActiveModal('addProduct');
  };

  // Open Edit Product Modal
  const openEditProduct = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(p);
    setProductForm({ name: p.name, category: p.category, barcode: p.barcode, price: p.price, suggestedStock: p.suggestedStock });
    setFormErrors({});
    setActiveModal('editProduct');
  };

  // Open Delete Product Modal
  const openDeleteProduct = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(p);
    setActiveModal('deleteProduct');
  };

  // Open Add Lote Modal
  const openAddLote = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(p);
    
    // Autogenerate batch code suggestion
    const categoryInitials = p.category.substring(0, 3).toUpperCase();
    const randomNum = 10 + (p.name.length % 90);
    
    setLoteForm({
      code: `L-${categoryInitials}-${randomNum}`,
      fechaIngreso: REFERENCE_DATE,
      fechaCaducidad: '',
      cantidadInicial: 10,
      cantidadActual: 10
    });
    setFormErrors({});
    setActiveModal('addLote');
  };

  // Open Edit Lote Modal
  const openEditLote = (lote: Lote, product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedLote(lote);
    setLoteForm({
      code: lote.code,
      fechaIngreso: lote.fechaIngreso,
      fechaCaducidad: lote.fechaCaducidad,
      cantidadInicial: lote.cantidadInicial,
      cantidadActual: lote.cantidadActual
    });
    setFormErrors({});
    setActiveModal('editLote');
  };

  // Open Delete Lote Modal
  const openDeleteLote = (lote: Lote, product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedLote(lote);
    setActiveModal('deleteLote');
  };

  // Validate Product Form
  const validateProduct = () => {
    const errors: Record<string, string> = {};
    if (!productForm.name.trim()) errors.name = 'El nombre del producto es obligatorio';
    if (!productForm.barcode.trim()) errors.barcode = 'El código de barras (CB) es obligatorio';
    if (productForm.price <= 0) errors.price = 'El precio debe ser mayor a 0';
    if (productForm.suggestedStock < 0) errors.suggestedStock = 'El stock sugerido no puede ser negativo';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Lote Form
  const validateLote = () => {
    const errors: Record<string, string> = {};
    if (!loteForm.code.trim()) errors.code = 'El código de lote es obligatorio';
    if (!loteForm.fechaIngreso) errors.fechaIngreso = 'La fecha de ingreso es obligatoria';
    
    if (loteForm.fechaCaducidad) {
      if (loteForm.fechaCaducidad < loteForm.fechaIngreso) {
        errors.fechaCaducidad = 'La fecha de caducidad no puede ser anterior a la de ingreso';
      }
    }
    
    if (loteForm.cantidadInicial <= 0) errors.cantidadInicial = 'La cantidad inicial debe ser mayor a 0';
    if (loteForm.cantidadActual < 0) errors.cantidadActual = 'La cantidad actual no puede ser negativa';
    else if (loteForm.cantidadActual > loteForm.cantidadInicial) {
      errors.cantidadActual = 'La cantidad actual no puede superar la cantidad inicial';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Product
  const handleSaveProduct = () => {
    if (!validateProduct()) return;

    if (activeModal === 'addProduct') {
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        name: productForm.name.trim(),
        category: productForm.category,
        barcode: productForm.barcode.trim(),
        price: Number(productForm.price),
        suggestedStock: Number(productForm.suggestedStock)
      };
      setProducts(prev => [...prev, newProduct]);
      addToast(`Producto ${newProduct.name} registrado correctamente`, 'success');
    } else if (activeModal === 'editProduct' && selectedProduct) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
        ...p,
        name: productForm.name.trim(),
        category: productForm.category,
        barcode: productForm.barcode.trim(),
        price: Number(productForm.price),
        suggestedStock: Number(productForm.suggestedStock)
      } : p));
      addToast(`Producto ${productForm.name} actualizado correctamente`, 'success');
    }
    setActiveModal(null);
    setSelectedProduct(null);
  };

  // Delete Product
  const handleDeleteProductConfirm = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    setLotes(prev => prev.filter(l => l.productId !== selectedProduct.id));
    addToast(`Producto ${selectedProduct.name} eliminado`, 'error');
    setActiveModal(null);
    setSelectedProduct(null);
  };

  // Save Lote
  const handleSaveLote = () => {
    if (!validateLote() || !selectedProduct) return;

    if (activeModal === 'addLote') {
      const newLote: Lote = {
        id: `l-${Date.now()}`,
        productId: selectedProduct.id,
        code: loteForm.code.trim(),
        fechaIngreso: loteForm.fechaIngreso,
        fechaCaducidad: loteForm.fechaCaducidad,
        cantidadInicial: Number(loteForm.cantidadInicial),
        cantidadActual: Number(loteForm.cantidadActual)
      };
      setLotes(prev => [...prev, newLote]);
      addToast(`Lote ${newLote.code} registrado para ${selectedProduct.name}`, 'success');
    } else if (activeModal === 'editLote' && selectedLote) {
      setLotes(prev => prev.map(l => l.id === selectedLote.id ? {
        ...l,
        code: loteForm.code.trim(),
        fechaIngreso: loteForm.fechaIngreso,
        fechaCaducidad: loteForm.fechaCaducidad,
        cantidadInicial: Number(loteForm.cantidadInicial),
        cantidadActual: Number(loteForm.cantidadActual)
      } : l));
      addToast(`Lote ${loteForm.code} actualizado correctamente`, 'success');
    }
    setActiveModal(null);
    setSelectedLote(null);
  };

  // Delete Lote
  const handleDeleteLoteConfirm = () => {
    if (!selectedLote) return;
    setLotes(prev => prev.filter(l => l.id !== selectedLote.id));
    addToast(`Lote ${selectedLote.code} eliminado`, 'error');
    setActiveModal(null);
    setSelectedLote(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 antialiased font-sans">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-150 shrink-0">
        <div className="p-6 border-b border-gray-100 space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-8 h-8 rounded-xl text-white bg-[#00a365] shadow-md shadow-emerald-100">
              <Package className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">ReStock</span>
            <span className="text-[10px] bg-emerald-50 text-[#00a365] border border-emerald-100 rounded px-1.5 py-0.5 font-bold tracking-wider">SaaS</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Inventario Inteligente para tu Negocio</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider px-3 mb-2">MÓDULOS</p>
          
          <a
            onClick={() => addToast('Pestaña en mantenimiento', 'info')}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
          >
            <span className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> Vista general</span>
            <span className="grid place-items-center w-5 h-5 rounded-full bg-red-100 text-red-650 text-xs font-bold">3</span>
          </a>

          <a
            onClick={() => addToast('Pestaña en mantenimiento', 'info')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-505 hover:bg-gray-50 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Generar venta
          </a>

          <a
            onClick={() => setActiveTab('lotes')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === 'lotes' 
                ? 'bg-[#00a365]/10 text-[#00a365]' 
                : 'text-gray-650 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" /> Inventario por lotes
          </a>

          <a
            onClick={() => addToast('Pestaña en mantenimiento', 'info')}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-550 hover:bg-gray-50 transition cursor-pointer"
          >
            <span className="flex items-center gap-3"><Clock className="w-4 h-4" /> Fechas de vencimiento</span>
            <span className="grid place-items-center w-5 h-5 rounded-full bg-red-100 text-red-650 text-xs font-bold">7</span>
          </a>

          <a
            onClick={() => addToast('Pestaña en mantenimiento', 'info')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#f97316] hover:bg-gray-50 transition cursor-pointer"
          >
            <TrendingDown className="w-4 h-4" /> Planificación de compras
          </a>

          <a
            onClick={() => addToast('Pestaña en mantenimiento', 'info')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-555 hover:bg-gray-50 transition cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" /> Historial de ventas
          </a>

          <a
            onClick={() => addToast('Pestaña en mantenimiento', 'info')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-555 hover:bg-gray-55 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" /> Configuración
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-550 transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la Web
          </Link>
        </div>
      </aside>

      {/* MOBILE MENU DRAWEROVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-gray-900/40 backdrop-blur-xs transition">
          <div className="w-64 bg-white h-full flex flex-col shadow-2xl animate-slide-in">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-150">
              <span className="font-bold text-xl text-gray-900">ReStock</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              <a
                onClick={() => { setMobileMenuOpen(false); addToast('En mantenimiento', 'info'); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" /> Vista general
              </a>
              <a
                onClick={() => { setMobileMenuOpen(false); setActiveTab('lotes'); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer ${
                  activeTab === 'lotes' ? 'bg-[#00a365]/10 text-[#00a365]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Layers className="w-4 h-4" /> Inventario por lotes
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-[#fcfdfd]">
        
        {/* HEADER TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-150 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2.5 text-sm text-gray-550">
              <span>Módulo</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-gray-900">Inventario por Lotes</span>
            </div>
          </div>

          {/* Profile Name Match */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-extrabold text-xs text-gray-900">MI Tienda S.A.</p>
              <p className="text-[10px] text-[#00a365] font-bold flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a365]" /> Modo Demo Activo
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-extrabold flex items-center justify-center text-sm border border-gray-200">
              A
            </div>
          </div>
        </header>

        {/* CONTAINER */}
        <div className="flex-1 px-6 sm:px-8 py-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Inventario por Lotes
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Administra tus productos y desglosa sus lotes para gestionar vencimientos e ingresos.
              </p>
            </div>
            <div>
              <button 
                onClick={openAddProduct}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#00a365] hover:bg-[#008c54] text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Registrar Producto
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <section className="bg-white rounded-2xl border border-gray-150 p-4 shadow-2xs flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscador por nombre o código de barras..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a365] focus:border-transparent text-sm transition"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500">
                <Filter className="w-4 h-4" />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  aria-label="Filtrar por Categoría"
                  className="pl-3 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a365] text-xs font-bold text-gray-600 appearance-none transition cursor-pointer"
                >
                  <option value="">Todas</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
              </div>
            </div>
          </section>

          {/* PRODUCTS LIST TABLE */}
          <section className="bg-white rounded-2xl border border-gray-150 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6 w-1/3">PRODUCTO</th>
                    <th className="py-4 px-4 text-center">PRECIO</th>
                    <th className="py-4 px-4 text-center">STOCK SUGERIDO</th>
                    <th className="py-4 px-4 text-center">STOCK ACTUAL</th>
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredProducts.map(product => {
                    const actualStock = productStockTotals.get(product.id) || 0;
                    const isExpanded = expandedProductId === product.id;
                    const stockLow = actualStock < product.suggestedStock;
                    const productLotes = lotes.filter(l => l.productId === product.id);

                    return (
                      <Fragment key={product.id}>
                        {/* Product Row */}
                        <tr 
                          onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                          className="hover:bg-gray-50/50 transition cursor-pointer"
                        >
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3.5">
                              <span className="text-gray-400">
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </span>
                              <div>
                                <h3 className="font-extrabold text-sm text-gray-900 leading-snug">{product.name}</h3>
                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 font-sans">
                                  {product.category} &nbsp; CB: {product.barcode}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center font-bold text-sm text-gray-700">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-5 px-4 text-center text-xs font-bold text-gray-500">
                            {product.suggestedStock} uds.
                          </td>
                          <td className="py-5 px-4 text-center">
                            {stockLow ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-650 border border-red-150">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {actualStock} uds.
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-850 border border-emerald-150">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00a365]" />
                                {actualStock} uds.
                              </span>
                            )}
                          </td>
                          <td className="py-5 px-6 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-3.5">
                              <button
                                onClick={(e) => openAddLote(product, e)}
                                className="inline-flex items-center gap-1 text-[#00a365] hover:text-[#008c54] font-bold text-xs cursor-pointer transition"
                              >
                                <Plus className="w-3.5 h-3.5" /> Lote
                              </button>
                              <button
                                onClick={(e) => openEditProduct(product, e)}
                                className="p-1 hover:bg-blue-50 rounded text-blue-500 hover:text-blue-700 transition cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => openDeleteProduct(product, e)}
                                className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Batches Sub-table section */}
                        {isExpanded && (
                          <tr className="bg-gray-50/40" onClick={e => e.stopPropagation()}>
                            <td colSpan={5} className="py-5 px-10 border-b border-gray-150">
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-amber-900/60 uppercase tracking-wider">
                                  DESGLOSE DE LOTES PARA ESTE PRODUCTO:
                                </h4>
                                
                                {productLotes.length === 0 ? (
                                  <p className="text-xs text-gray-500 italic py-2">
                                    No hay lotes vigentes registrados para este producto. Registra uno arriba.
                                  </p>
                                ) : (
                                  <table className="w-full text-left text-xs bg-white rounded-xl border border-gray-150 overflow-hidden shadow-3xs">
                                    <thead>
                                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-405 uppercase tracking-wider">
                                        <th className="py-3 px-4 font-bold">CÓDIGO LOTE</th>
                                        <th className="py-3 px-3 text-center font-bold">INGRESADO</th>
                                        <th className="py-3 px-3 text-center font-bold">CADUCIDAD</th>
                                        <th className="py-3 px-3 text-left font-bold">CANTIDAD INICIAL</th>
                                        <th className="py-3 px-3 text-left font-bold">STOCK ACTUAL</th>
                                        <th className="py-3 px-4 text-center font-bold">ESTADO</th>
                                        <th className="py-3 px-4 text-center font-bold">ACCIÓN</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {productLotes.map(lote => {
                                        const days = getDaysRemaining(lote.fechaCaducidad);
                                        const isExpired = days < 0;
                                        const isNearExpiry = days >= 0 && days <= 7;

                                        return (
                                          <tr key={lote.id} className="hover:bg-gray-50/20 transition">
                                            <td className="py-3 px-4 font-mono font-bold text-gray-800">
                                              {lote.code}
                                            </td>
                                            <td className="py-3 px-3 text-center text-gray-550 font-medium">
                                              {lote.fechaIngreso}
                                            </td>
                                            <td className="py-3 px-3 text-center text-gray-550 font-medium">
                                              {lote.fechaCaducidad}
                                            </td>
                                            <td className="py-3 px-3 text-left text-gray-500 font-semibold">
                                              {lote.cantidadInicial} uds.
                                            </td>
                                            <td className="py-3 px-3 text-left text-gray-900 font-extrabold">
                                              {lote.cantidadActual} uds.
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              {isExpired ? (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-red-100 border border-red-150 text-[10px] font-extrabold text-red-700">
                                                  Caducado
                                                </span>
                                              ) : isNearExpiry ? (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-extrabold text-amber-700">
                                                  Caduca en {days}d
                                                </span>
                                              ) : (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 border border-emerald-150 text-[10px] font-extrabold text-emerald-800">
                                                  Vigente ({days}d)
                                                </span>
                                              )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              <div className="flex items-center justify-center gap-2.5">
                                                <button
                                                  onClick={(e) => openEditLote(lote, product, e)}
                                                  className="p-1 hover:bg-blue-50 rounded text-blue-500 hover:text-blue-700 transition cursor-pointer"
                                                >
                                                  <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={(e) => openDeleteLote(lote, product, e)}
                                                  className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition cursor-pointer"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-between text-xs text-gray-500">
              <div>
                Mostrando <span className="font-semibold text-gray-700">{filteredProducts.length}</span> de <span className="font-semibold text-gray-700">{products.length}</span> productos
              </div>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Anterior</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Siguiente</button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ==========================================      {/* 1. ADD PRODUCT MODAL */}
      {activeModal === 'addProduct' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Registrar Nuevo Producto</h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">NOMBRE DEL PRODUCTO *</label>
                <input
                  type="text"
                  placeholder="Ej: Sabritas Limón 110g"
                  value={productForm.name}
                  onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.name && <p className="text-[10px] text-red-500 font-bold">{formErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CÓDIGO DE BARRAS</label>
                <input
                  type="text"
                  placeholder="Ej: 7501011115637"
                  value={productForm.barcode}
                  onChange={e => setProductForm(prev => ({ ...prev, barcode: e.target.value }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.barcode ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.barcode && <p className="text-[10px] text-red-500 font-bold">{formErrors.barcode}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CATEGORÍA</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a365] bg-gray-50/30 cursor-pointer"
                  >
                    <option value="Bebidas">Bebidas</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Abarrotes">Abarrotes</option>
                    <option value="Limpieza">Limpieza</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">PRECIO DE VENTA ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="19.50"
                    value={productForm.price || ''}
                    onChange={e => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.price ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                  />
                  {formErrors.price && <p className="text-[10px] text-red-500 font-bold">{formErrors.price}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">STOCK MÍNIMO SUGERIDO *</label>
                <input
                  type="number"
                  placeholder="20"
                  value={productForm.suggestedStock || ''}
                  onChange={e => setProductForm(prev => ({ ...prev, suggestedStock: Number(e.target.value) }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.suggestedStock ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.suggestedStock && <p className="text-[10px] text-red-500 font-bold">{formErrors.suggestedStock}</p>}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end gap-3.5">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-200 text-xs font-semibold text-gray-650 rounded-xl hover:bg-gray-150 transition cursor-pointer">Cancelar</button>
              <button onClick={handleSaveProduct} className="px-5 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">Guardar Producto</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT PRODUCT MODAL */}
      {activeModal === 'editProduct' && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Editar Producto</h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">NOMBRE DEL PRODUCTO *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.name && <p className="text-[10px] text-red-500 font-bold">{formErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CÓDIGO DE BARRAS</label>
                <input
                  type="text"
                  value={productForm.barcode}
                  onChange={e => setProductForm(prev => ({ ...prev, barcode: e.target.value }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.barcode ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.barcode && <p className="text-[10px] text-red-500 font-bold">{formErrors.barcode}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CATEGORÍA</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a365] bg-gray-50/30"
                  >
                    <option value="Bebidas">Bebidas</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Abarrotes">Abarrotes</option>
                    <option value="Limpieza">Limpieza</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">PRECIO DE VENTA ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={e => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.price ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                  />
                  {formErrors.price && <p className="text-[10px] text-red-500 font-bold">{formErrors.price}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">STOCK MÍNIMO SUGERIDO *</label>
                <input
                  type="number"
                  value={productForm.suggestedStock}
                  onChange={e => setProductForm(prev => ({ ...prev, suggestedStock: Number(e.target.value) }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.suggestedStock ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.suggestedStock && <p className="text-[10px] text-red-500 font-bold">{formErrors.suggestedStock}</p>}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end gap-3.5">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:bg-gray-150 transition cursor-pointer">Cancelar</button>
              <button onClick={handleSaveProduct} className="px-5 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">Actualizar Producto</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DELETE PRODUCT MODAL */}
      {activeModal === 'deleteProduct' && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-650 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Trash2 className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-gray-900">¿Eliminar producto?</h3>
              <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">
                Estás a punto de eliminar el producto <span className="font-extrabold text-gray-850">{selectedProduct.name}</span> y todos sus lotes asociados. Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 border border-gray-200 text-xs font-semibold text-gray-650 rounded-xl hover:bg-gray-50 transition">Cancelar</button>
                <button onClick={handleDeleteProductConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition">Confirmar Eliminación</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD LOTE MODAL */}
      {activeModal === 'addLote' && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Registrar Lote de Producto</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Para: {selectedProduct.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CÓDIGO DEL LOTE *</label>
                <input
                  type="text"
                  placeholder="Ej: L-COKE-03"
                  value={loteForm.code}
                  onChange={e => setLoteForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono transition ${formErrors.code ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.code && <p className="text-[10px] text-red-500 font-bold">{formErrors.code}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CANTIDAD INGRESADA *</label>
                <input
                  type="number"
                  value={loteForm.cantidadInicial || ''}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setLoteForm(prev => ({ ...prev, cantidadInicial: val, cantidadActual: val }));
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.cantidadInicial ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.cantidadInicial && <p className="text-[10px] text-red-500 font-bold">{formErrors.cantidadInicial}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">FECHA DE CADUCIDAD</label>
                  <span className="text-gray-400 italic text-[10px] uppercase font-bold">OPCIONAL</span>
                </div>
                <input
                  type="date"
                  value={loteForm.fechaCaducidad}
                  onChange={e => setLoteForm(prev => ({ ...prev, fechaCaducidad: e.target.value }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.fechaCaducidad ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.fechaCaducidad && <p className="text-[10px] text-red-500 font-bold">{formErrors.fechaCaducidad}</p>}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end gap-3.5">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-200 text-xs font-semibold text-gray-655 rounded-xl hover:bg-gray-150 transition cursor-pointer">Cancelar</button>
              <button onClick={handleSaveLote} className="px-5 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">Registrar Lote</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. EDIT LOTE MODAL */}
      {activeModal === 'editLote' && selectedLote && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Editar Lote</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Para: {selectedProduct.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">CÓDIGO DEL LOTE *</label>
                <input
                  type="text"
                  value={loteForm.code}
                  onChange={e => setLoteForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono transition ${formErrors.code ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.code && <p className="text-[10px] text-red-500 font-bold">{formErrors.code}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">STOCK ACTUAL DEL LOTE *</label>
                <input
                  type="number"
                  value={loteForm.cantidadActual}
                  onChange={e => setLoteForm(prev => ({ ...prev, cantidadActual: Number(e.target.value) }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.cantidadActual ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.cantidadActual && <p className="text-[10px] text-red-500 font-bold">{formErrors.cantidadActual}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">FECHA DE CADUCIDAD</label>
                  <span className="text-gray-400 italic text-[10px] uppercase font-bold">OPCIONAL</span>
                </div>
                <input
                  type="date"
                  value={loteForm.fechaCaducidad}
                  onChange={e => setLoteForm(prev => ({ ...prev, fechaCaducidad: e.target.value }))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm transition ${formErrors.fechaCaducidad ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#00a365] bg-gray-50/30'} focus:outline-none focus:ring-2`}
                />
                {formErrors.fechaCaducidad && <p className="text-[10px] text-red-500 font-bold">{formErrors.fechaCaducidad}</p>}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end gap-3.5">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-200 text-xs font-semibold text-gray-655 rounded-xl hover:bg-gray-150 transition cursor-pointer">Cancelar</button>
              <button onClick={handleSaveLote} className="px-5 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">Actualizar Lote</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DELETE LOTE CONFIRMATION MODAL */}
      {activeModal === 'deleteLote' && selectedLote && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-650 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Trash2 className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-gray-900">¿Eliminar lote?</h3>
              <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">
                Estás a punto de eliminar el lote <span className="font-extrabold font-mono text-gray-800">{selectedLote.code}</span> para el producto <span className="font-extrabold text-gray-800">{selectedProduct.name}</span>. Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 border border-gray-200 text-xs font-semibold text-gray-650 rounded-xl hover:bg-gray-50 transition">Cancelar</button>
                <button onClick={handleDeleteLoteConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition">Confirmar Eliminación</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM PORTAL */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`p-4 rounded-xl border shadow-lg flex items-center justify-between gap-3 animate-slide-in-right transition-all duration-300 ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-250' :
              toast.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-250' :
              'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-bold">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-655 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="p-0.5 hover:bg-black/5 rounded text-gray-500 hover:text-gray-800 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
