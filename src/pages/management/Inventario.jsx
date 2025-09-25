import {
  AlertTriangle,
  Edit,
  FileText,
  Frame,
  GraduationCap,
  Package,
  Palette,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Truck,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';

const Inventario = () => {
  const { 
    showSuccess, 
    showError, 
    notifyNewProduct, 
    notifyProductAction, 
    notifyLowStock 
  } = useApp();
  const [inventory, setInventory] = useState([
    {
      id: 'INV001',
      nombre: 'Moldura Clásica Negra',
      categoria: 'Molduras',
      tipo: 'Moldura',
      stock: 8,
      stockMinimo: 10,
      unidad: 'unidades',
      precio: 15.50,
      proveedor: 'Marco Arte SAC',
      fechaIngreso: '2025-05-15',
      ultimaVenta: '2025-06-05'
    },
    {
      id: 'INV002',
      nombre: 'Papel Fotográfico 10x15',
      categoria: 'Impresión Fotográfica',
      tipo: 'Papel',
      stock: 3,
      stockMinimo: 10,
      unidad: 'rollos',
      precio: 0.45,
      proveedor: 'Kodak Perú',
      fechaIngreso: '2025-06-01',
      ultimaVenta: '2025-06-08'
    },
    {
      id: 'INV003',
      nombre: 'Pintura Acrílica Blanca',
      categoria: 'Pinturas y Acabados',
      tipo: 'Pintura',
      stock: 2,
      stockMinimo: 5,
      unidad: 'L',
      precio: 25.00,
      proveedor: 'Pinturas Lima',
      fechaIngreso: '2025-05-20',
      ultimaVenta: '2025-06-07'
    },
    {
      id: 'INV004',
      nombre: 'Barniz Mate',
      categoria: 'Pinturas y Acabados',
      tipo: 'Barniz',
      stock: 8,
      stockMinimo: 2,
      unidad: 'L',
      precio: 18.50,
      proveedor: 'Acabados Pro',
      fechaIngreso: '2025-05-25',
      ultimaVenta: '2025-06-06'
    },
    {
      id: 'INV005',
      nombre: 'Papel Fotográfico 15x20',
      categoria: 'Papel',
      tipo: 'Papel',
      stock: 25,
      stockMinimo: 10,
      unidad: 'rollos',
      precio: 0.65,
      proveedor: 'Kodak Perú',
      fechaIngreso: '2025-06-10',
      ultimaVenta: '2025-06-12'
    },
    {
      id: 'INV006',
      nombre: 'Revelador C-41',
      categoria: 'Químicos',
      tipo: 'Químico',
      stock: 8,
      stockMinimo: 5,
      unidad: 'L',
      precio: 45.00,
      proveedor: 'Químicos Fotográficos SAC',
      fechaIngreso: '2025-06-08',
      ultimaVenta: '2025-06-15'
    },
    {
      id: 'INV007',
      nombre: 'Fijador Universal',
      categoria: 'Químicos',
      tipo: 'Químico',
      stock: 6,
      stockMinimo: 3,
      unidad: 'L',
      precio: 32.50,
      proveedor: 'Químicos Fotográficos SAC',
      fechaIngreso: '2025-06-08',
      ultimaVenta: '2025-06-15'
    },
    {
      id: 'INV008',
      nombre: 'Papel Fotográfico Blanco/Negro',
      categoria: 'Papel',
      tipo: 'Papel',
      stock: 15,
      stockMinimo: 8,
      unidad: 'rollos',
      precio: 0.55,
      proveedor: 'Ilford Perú',
      fechaIngreso: '2025-06-12',
      ultimaVenta: '2025-06-16'
    },
    {
      id: 'INV009',
      nombre: 'Revelador D-76',
      categoria: 'Químicos',
      tipo: 'Químico',
      stock: 4,
      stockMinimo: 2,
      unidad: 'L',
      precio: 28.00,
      proveedor: 'Químicos Fotográficos SAC',
      fechaIngreso: '2025-06-12',
      ultimaVenta: '2025-06-16'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('Enmarcado');
  const [activeSubTab, setActiveSubTab] = useState('Pinturas y Acabados');
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockTargetItem, setStockTargetItem] = useState(null);
  const [stockOperation, setStockOperation] = useState('increase');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Cargar inventario desde localStorage (si existe)
  useEffect(() => {
    const saved = localStorage.getItem('inventoryData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          setInventory(parsed);
        }
      } catch {}
    }
  }, []);

  // Guardar inventario en localStorage ante cambios
  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
  }, [inventory]);

  // Configuración de pestañas principales
  const mainTabs = [
    { id: 'Enmarcados', label: 'Enmarcados', icon: Frame },
    { id: 'Minilab', label: 'Minilab', icon: Truck },
    { id: 'Recordatorios', label: 'Recordatorios', icon: GraduationCap },
    { id: 'Corte Láser', label: 'Corte Láser', icon: Wrench },
    { id: 'Accesorios', label: 'Accesorios', icon: Package }
  ];

  // Configuración de sub-pestañas
  const subTabs = {
    'Enmarcados': [
      { id: 'Molduras', label: 'Molduras (listones)' },
      { id: 'Molduras Prearmadas', label: 'Molduras Prearmadas' },
      { id: 'Vidrios', label: 'Vidrios' },
      { id: 'Tapas MDF', label: 'Tapas MDF' },
      { id: 'Paspartú', label: 'Paspartú' }
    ],
    'Minilab': [
      { id: 'Papel Fotográfico', label: 'Papel Fotográfico' },
      { id: 'Químicos', label: 'Químicos' },
      { id: 'Repuestos', label: 'Repuestos' }
    ],
    'Recordatorios': [
      { id: 'Cuadros Stock', label: 'Cuadros (stock comprado)' },
      { id: 'Anuarios', label: 'Anuarios' }
    ],
    'Corte Láser': [
      { id: 'Stock MDF', label: 'Stock de MDF' },
      { id: 'Acrílico', label: 'Acrílico' },
      { id: 'Cartón', label: 'Cartón' },
      { id: 'Tela', label: 'Tela' },
      { id: 'Vidrio Color', label: 'Vidrio Color' },
      { id: 'Letras Cortadas', label: 'Letras Cortadas' }
    ],
    'Accesorios': [
      { id: 'Tornillos', label: 'Tornillos' },
      { id: 'Grapas', label: 'Grapas' },
      { id: 'Colgadores', label: 'Colgadores' },
      { id: 'Flexipuntas', label: 'Flexipuntas' },
      { id: 'Regipuntas', label: 'Regipuntas' }
    ]
  };
  
  // Calcular estadísticas
  const totalInsumos = inventory.length;
  const totalStockProductos = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = inventory.filter(item => item.stock <= item.stockMinimo);
  const totalAlertas = lowStockItems.length;

  // Función para obtener headers de tabla según la categoría
  const getTableHeaders = () => {
    const headers = {
      'Molduras': ['Color', 'Ancho (pulgadas)'],
      'Molduras Prearmadas': ['Tamaños Estándar', 'Color', 'Ancho'],
      'Vidrios': [],
      'Tapas MDF': ['Tamaños Estándar', 'Color'],
      'Paspartú': ['Tamaños Personalizados', 'Color'],
      'Papel Fotográfico': ['Tamaño'],
      'Químicos': [],
      'Repuestos': [],
      'Cuadros Stock': ['Modelo', 'Tamaño', 'Nivel'],
      'Anuarios': [],
      'Stock MDF': ['Color'],
      'Acrílico': [],
      'Cartón': [],
      'Tela': [],
      'Vidrio Color': [],
      'Letras Cortadas': [],
      'Tornillos': [],
      'Grapas': [],
      'Colgadores': [],
      'Flexipuntas': [],
      'Regipuntas': []
    };
    return headers[activeSubTab] || [];
  };

  // Función para obtener campos específicos según la categoría
  const getSpecificFields = () => {
    const fields = {
      'Molduras': [
        { key: 'color', label: 'Color', type: 'text', placeholder: 'Ej: Negro, Dorado' },
        { key: 'ancho_pulgadas', label: 'Ancho (pulgadas)', type: 'number', placeholder: 'Ej: 2.5' }
      ],
      'Molduras Prearmadas': [
        { key: 'tamaños_estándar', label: 'Tamaños Estándar', type: 'select', options: [
          { value: '10x15', label: '10x15' },
          { value: '13x18', label: '13x18' },
          { value: '20x30', label: '20x30' },
          { value: '30x40', label: '30x40' }
        ]},
        { key: 'color', label: 'Color', type: 'text', placeholder: 'Ej: Blanco, Negro' },
        { key: 'ancho', label: 'Ancho', type: 'number', placeholder: 'Ancho en cm' }
      ],
      'Vidrios': [],
      'Tapas MDF': [
        { key: 'tamaños_estándar', label: 'Tamaños Estándar', type: 'select', options: [
          { value: '10x15', label: '10x15' },
          { value: '13x18', label: '13x18' },
          { value: '20x30', label: '20x30' },
          { value: '30x40', label: '30x40' }
        ]},
        { key: 'color', label: 'Color', type: 'select', options: [
          { value: 'blanco', label: 'Blanco' },
          { value: 'negro', label: 'Negro' },
          { value: 'plomo', label: 'Plomo' },
          { value: 'crudo', label: 'Crudo' }
        ]}
      ],
      'Paspartú': [
        { key: 'tamaños_personalizados', label: 'Tamaños Personalizados', type: 'text', placeholder: 'Ej: 15x20, 25x35' },
        { key: 'color', label: 'Color', type: 'text', placeholder: 'Ej: Blanco, Negro, Beige' }
      ],
      'Papel Fotográfico': [
        { key: 'tamaño', label: 'Tamaño', type: 'text', placeholder: 'Ej: 10x15, 13x18, 20x30' }
      ],
      'Repuestos': [],
      'Cuadros Stock': [
        { key: 'modelo', label: 'Modelo', type: 'text', placeholder: 'Modelo del cuadro' },
        { key: 'tamaño', label: 'Tamaño', type: 'text', placeholder: 'Ej: 20x30' },
        { key: 'nivel', label: 'Nivel', type: 'select', options: [
          { value: 'inicial', label: 'Inicial' },
          { value: 'primaria', label: 'Primaria' },
          { value: 'secundaria', label: 'Secundaria' },
          { value: 'superior', label: 'Superior' }
        ]}
      ],
      'Stock MDF': [
        { key: 'color', label: 'Color', type: 'select', options: [
          { value: 'blanco', label: 'Blanco' },
          { value: 'negro', label: 'Negro' },
          { value: 'natural', label: 'Natural' }
        ]}
      ]
    };
    return fields[activeSubTab] || [];
  };

  // Filtrar inventario según pestañas activas
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = item.categoria === activeSubTab;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setInventory(inventory.filter(item => item.id !== itemToDelete.id));
      showSuccess('Producto eliminado del inventario');
      
      // Notificación persistente para eliminación
       notifyProductAction('delete', itemToDelete);
      
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const [isAlertMode, setIsAlertMode] = useState(false);

  const handleAddItem = (alertMode = false) => {
    setSelectedItem(null);
    setIsAlertMode(alertMode);
    setShowItemModal(true);
    // Limpiar búsqueda para que el nuevo producto sea visible inmediatamente
    setSearchTerm('');
  };
  
  // Función específica para registrar producto sin modo alerta
  const handleAddProduct = () => {
    setSelectedItem(null);
    setIsAlertMode(false);
    setShowItemModal(true);
    setSearchTerm('');
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  // Abrir modal para registrar/ajustar stock
  const handleOpenStockModal = (item) => {
    setStockTargetItem(item);
    setStockOperation('increase');
    setShowStockModal(true);
  };
  
  // Función específica para abrir el modal de stock sin un item preseleccionado
  const handleRegisterStock = () => {
    setStockTargetItem(null);
    setStockOperation('increase');
    setShowStockModal(true);
  };

  // Aplicar cambio de stock
  const applyStockChange = () => {
    if (!stockTargetItem) {
      showError('Por favor selecciona un producto primero');
      return;
    }
    const qtyInput = document.getElementById('inv_stock_qty');
    const qty = parseInt(qtyInput?.value || '0', 10);
    if (isNaN(qty) || qty < 0) {
      showError('Por favor ingresa una cantidad válida');
      return;
    }
    
    let newStock = stockTargetItem.stock;
    
    // Calcular nuevo stock según la operación
    if (stockOperation === 'increase') {
      newStock += qty;
    } else if (stockOperation === 'decrease') {
      newStock = Math.max(0, newStock - qty);
    } else if (stockOperation === 'set') {
      newStock = qty;
    }
    
    // Actualizar el inventario
    const updatedInventory = inventory.map(item => 
      item.id === stockTargetItem.id 
        ? {...item, stock: newStock, ultimaVenta: new Date().toISOString().split('T')[0]} 
        : item
    );
    
    setInventory(updatedInventory);
    showSuccess(`Stock actualizado: ${stockTargetItem.nombre} - ${newStock} ${stockTargetItem.unidad}`);
    
    // Verificar si el stock está bajo y enviar notificación
     if (newStock <= stockTargetItem.stockMinimo) {
       notifyLowStock({...stockTargetItem, stock: newStock});
     }
    
    setShowStockModal(false);
    setStockTargetItem(null);
  };

  // Función para obtener el color de alerta según el nivel de stock
  const getAlertColor = (stock, stockMinimo) => {
    if (stock <= stockMinimo * 0.5) return 'bg-red-100 text-red-800';
    if (stock <= stockMinimo) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
            <p className="text-sm text-gray-500">Gestiona tus molduras y materiales</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalInsumos}</h3>
          <p className="text-sm text-gray-500">Insumos</p>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Frame className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalStockProductos}</h3>
          <p className="text-sm text-gray-500">Stock de Productos</p>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalAlertas}</h3>
          <p className="text-sm text-gray-500">Alertas de Stock</p>
        </Card>
      </div>

      {/* Sección de Alertas de Stock */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Alertas de Stock</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddItem(true)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Añadir Alerta
          </Button>
        </div>
        
        {lowStockItems.length > 0 ? (
          <div className="space-y-2">
            {lowStockItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-lg ${
                  item.stock <= item.stockMinimo * 0.5 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      item.stock <= item.stockMinimo * 0.5 ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className="font-medium text-gray-900">
                      Stock Bajo: {item.nombre} ({item.stock} {item.unidad})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay alertas de stock actualmente</p>
            <p className="text-sm text-gray-500 mt-1">Añade una alerta para monitorear productos con stock bajo</p>
          </div>
        )}
      </div>

      {/* Pestañas principales */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setActiveSubTab(subTabs[tab.id]?.[0]?.id || '');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeMainTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Título de la sección */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeMainTab} - {activeSubTab}
          </h2>
        </div>

        {/* Sub-pestañas */}
        {subTabs[activeMainTab] && (
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-1">
              {subTabs[activeMainTab].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeSubTab === subTab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Buscar ${activeSubTab.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                {getTableHeaders().map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.tipo}
                    </span>
                  </td>
                  {getTableHeaders().map((header, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item[header.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')] || '-'}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stockMinimo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.cantidad || item.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">S/ {item.costo || item.precio || '0.00'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.proveedor || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenStockModal(item)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span className="ml-1">Stock</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Acciones inferiores */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddProduct}
              icon={<Plus className="w-4 h-4" />}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              Registrar Producto
            </Button>
            <Button
              variant="outline"
              onClick={handleRegisterStock}
              className="border-green-600 text-green-600 hover:bg-green-50 font-medium"
              icon={<TrendingUp className="w-4 h-4" />}
            >
              Registrar Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      <Modal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setSelectedItem(null);
          setIsAlertMode(false);
        }}
        title={selectedItem ? 'Editar Producto' : isAlertMode ? 'Nueva Alerta de Stock' : 'Nuevo Producto'}
        size="lg"
      >
        <div className="space-y-4">
          {isAlertMode ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-gray-900">Configuración de Alerta de Stock</h3>
                </div>
                <p className="text-sm text-gray-600">Configura una alerta para recibir notificaciones cuando el stock de un producto esté por debajo del mínimo establecido.</p>
              </div>
              
              <div>
                <label className="form-label">Producto</label>
                <select id="inv_nombre" className="form-select">
                  {inventory.map(item => (
                    <option key={item.id} value={item.nombre}>{item.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Stock Mínimo para Alerta</label>
                <input 
                  defaultValue={5} 
                  id="inv_stock_min" 
                  type="number" 
                  className="form-input" 
                />
              </div>
              
              <div>
                <label className="form-label">Nivel de Prioridad</label>
                <select id="inv_prioridad" className="form-select">
                  <option value="alta">Alta (Crítico)</option>
                  <option value="media" selected>Media (Advertencia)</option>
                  <option value="baja">Baja (Informativo)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre del Producto</label>
                <input 
                  defaultValue={selectedItem?.nombre || ''} 
                  id="inv_nombre" 
                  type="text" 
                  className="form-input" 
                  placeholder="Nombre del producto" 
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label">Tipo</label>
                {activeSubTab === 'Repuestos' ? (
                  <select 
                    defaultValue={selectedItem?.tipo || ''} 
                    id="inv_tipo" 
                    className="form-select"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Engranajes">Engranajes</option>
                    <option value="Consumibles">Consumibles</option>
                  </select>
                ) : (
                  <input 
                    defaultValue={selectedItem?.tipo || ''} 
                    id="inv_tipo" 
                    type="text" 
                    className="form-input" 
                    placeholder="Tipo de producto" 
                    required
                  />
                )}
              </div>
              
              {/* Campos específicos según categoría */}
              {getSpecificFields().map((field, index) => (
                <div key={index}>
                  <label className="form-label">{field.label}</label>
                  {field.type === 'select' ? (
                    <select 
                      defaultValue={selectedItem?.[field.key] || field.defaultValue || ''} 
                      id={`inv_${field.key}`} 
                      className="form-select"
                    >
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      defaultValue={selectedItem?.[field.key] || field.defaultValue || ''} 
                      id={`inv_${field.key}`} 
                      type={field.type} 
                      className="form-input" 
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
              
              <div>
                <label className="form-label">Stock Actual</label>
                <input 
                  defaultValue={selectedItem?.stock || 0} 
                  id="inv_stock" 
                  type="number" 
                  className="form-input" 
                />
              </div>
              <div>
                <label className="form-label">Stock Mínimo</label>
                <input 
                  defaultValue={selectedItem?.stockMinimo || 0} 
                  id="inv_stock_min" 
                  type="number" 
                  className="form-input" 
                />
              </div>
              <div>
                <label className="form-label">Cantidad</label>
                <input 
                  defaultValue={selectedItem?.cantidad || selectedItem?.stock || 0} 
                  id="inv_cantidad" 
                  type="number" 
                  className="form-input" 
                />
              </div>
              <div>
                <label className="form-label">Costo</label>
                <input 
                  defaultValue={selectedItem?.costo || selectedItem?.precio || 0} 
                  id="inv_costo" 
                  type="number" 
                  step="0.01" 
                  className="form-input" 
                />
              </div>
              <div>
                <label className="form-label">Proveedor (Obligatorio)</label>
                <input 
                  defaultValue={selectedItem?.proveedor || ''} 
                  id="inv_proveedor" 
                  type="text" 
                  className="form-input" 
                  placeholder="Nombre del proveedor"
                  required
                />
              </div>
            </div>
          )}

          <Modal.Footer>
            <Button variant="outline" onClick={() => {
              setShowItemModal(false);
              setIsAlertMode(false);
              setSelectedItem(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (isAlertMode) {
                // Buscar el producto seleccionado en el inventario
                const nombreProducto = document.getElementById('inv_nombre').value;
                const stockMinimo = parseInt(document.getElementById('inv_stock_min').value || '5', 10);
                const productoExistente = inventory.find(item => item.nombre === nombreProducto);
                
                if (productoExistente) {
                  // Actualizar el stock mínimo del producto existente
                  const updated = {
                    ...productoExistente,
                    stockMinimo: stockMinimo
                  };
                  
                  setInventory(prev => prev.map(i => i.id === productoExistente.id ? updated : i));
                }
              } else {
                // Validación básica
                const nombreVal = document.getElementById('inv_nombre').value.trim();
                const tipoVal = document.getElementById('inv_tipo').value.trim();
                const proveedorVal = document.getElementById('inv_proveedor').value.trim();
                
                if (!nombreVal || !tipoVal) {
                  showError('Completa al menos Nombre y Tipo del producto');
                  return;
                }
                
                if (!proveedorVal) {
                  showError('El proveedor es obligatorio para todos los insumos');
                  return;
                }

                // Lógica normal para agregar/editar producto
                const updated = {
                  id: selectedItem?.id || `INV${String(inventory.length + 1).padStart(3,'0')}`,
                  nombre: nombreVal,
                  categoria: activeSubTab,
                  tipo: tipoVal,
                  stock: parseInt(document.getElementById('inv_stock').value || '0', 10),
                  stockMinimo: parseInt(document.getElementById('inv_stock_min').value || '0', 10),
                  cantidad: parseInt(document.getElementById('inv_cantidad').value || '0', 10),
                  costo: parseFloat(document.getElementById('inv_costo').value || '0'),
                  proveedor: document.getElementById('inv_proveedor').value || '',
                  fechaIngreso: selectedItem?.fechaIngreso || new Date().toISOString().split('T')[0],
                  ultimaVenta: selectedItem?.ultimaVenta || '',
                  // Campos específicos según categoría
                  ...getSpecificFields().reduce((acc, field) => {
                    const element = document.getElementById(`inv_${field.key}`);
                    if (element) {
                      acc[field.key] = element.value;
                    }
                    return acc;
                  }, {})
                };
                
                if (selectedItem) {
                  setInventory(prev => prev.map(i => i.id === selectedItem.id ? updated : i));
                  showSuccess('Producto actualizado');
                  
                  // Notificación persistente para edición
                   notifyProductAction('edit', updated);
                } else {
                  setInventory(prev => [updated, ...prev]);
                  showSuccess('Producto registrado');
                  
                  // Notificación persistente para creación
                   notifyNewProduct(updated);
                }
              }
              
              setShowItemModal(false);
              setSelectedItem(null);
              setIsAlertMode(false);
            }}>
              {selectedItem ? 'Guardar Cambios' : isAlertMode ? 'Crear Alerta' : 'Registrar Producto'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Modal para registrar/ajustar stock */}
      <Modal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false);
          setStockTargetItem(null);
        }}
        title={stockTargetItem ? `Registrar Stock: ${stockTargetItem.nombre}` : 'Registrar Stock'}
        size="md"
      >
        <div className="space-y-4">
          {!stockTargetItem && (
            <div>
              <label className="form-label">Seleccionar Producto</label>
              <select 
                className="form-select" 
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const item = inventory.find(item => item.id === selectedId);
                  setStockTargetItem(item);
                }}
                defaultValue=""
              >
                <option value="" disabled>Selecciona un producto</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} - Stock actual: {item.stock}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="form-label">Operación</label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-sm border ${stockOperation === 'increase' ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-700'}`}
                onClick={() => setStockOperation('increase')}
              >
                Aumentar
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm border ${stockOperation === 'decrease' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-700'}`}
                onClick={() => setStockOperation('decrease')}
              >
                Disminuir
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm border ${stockOperation === 'set' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`}
                onClick={() => setStockOperation('set')}
              >
                Establecer
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">Cantidad</label>
            <input id="inv_stock_qty" type="number" min="0" className="form-input" defaultValue={0} />
          </div>

          {stockTargetItem && (
            <div className="text-sm text-gray-600">
              Stock actual: <span className="font-medium text-gray-900">{stockTargetItem.stock}</span>
            </div>
          )}

          <Modal.Footer>
            <Button variant="outline" onClick={() => {
              setShowStockModal(false);
              setStockTargetItem(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={applyStockChange}>
              Guardar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                ¿Estás seguro de eliminar este artículo?
              </h3>
              <p className="text-sm text-gray-500">
                El artículo "{itemToDelete?.nombre}" será eliminado permanentemente del inventario.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteItem}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventario;
