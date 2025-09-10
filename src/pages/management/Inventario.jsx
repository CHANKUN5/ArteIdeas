import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  Frame,
  Truck,
  GraduationCap,
  Wrench,
  CheckCircle,
  FileText,
  Paintbrush,
  Printer,
  Palette
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Inventario = () => {
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
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('Enmarcado');
  const [activeSubTab, setActiveSubTab] = useState('Pinturas y Acabados');
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Configuración de pestañas principales
  const mainTabs = [
    { id: 'Enmarcado', label: 'Enmarcado', icon: Frame },
    { id: 'Minilab', label: 'Minilab', icon: Truck },
    { id: 'Recordatorios', label: 'Recordatorios', icon: GraduationCap },
    { id: 'Restauración', label: 'Restauración', icon: Wrench },
    { id: 'Óleo', label: 'Óleo', icon: Palette },
    { id: 'Edición', label: 'Edición', icon: FileText }
  ];

  // Configuración de sub-pestañas
  const subTabs = {
    'Enmarcado': [
      { id: 'Molduras', label: 'Molduras' },
      { id: 'Impresión Fotográfica', label: 'Impresión Fotográfica' },
      { id: 'Pinturas y Acabados', label: 'Pinturas y Acabados' }
    ],
    'Minilab': [
      { id: 'Papel', label: 'Papel' },
      { id: 'Químicos', label: 'Químicos' }
    ],
    'Recordatorios': [
      { id: 'Papel', label: 'Papel' },
      { id: 'Insumos', label: 'Insumos' }
    ],
    'Restauración': [
      { id: 'Herramientas', label: 'Herramientas' },
      { id: 'Materiales', label: 'Materiales' }
    ],
    'Óleo': [
      { id: 'Pinturas', label: 'Pinturas' },
      { id: 'Pinceles', label: 'Pinceles' }
    ],
    'Edición': [
      { id: 'Software', label: 'Software' },
      { id: 'Hardware', label: 'Hardware' }
    ]
  };
  
  // Calcular estadísticas
  const totalInsumos = inventory.length;
  const totalStockProductos = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = inventory.filter(item => item.stock <= item.stockMinimo);
  const totalAlertas = lowStockItems.length;

  // Filtrar inventario según pestañas activas
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = item.categoria === activeSubTab;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = (itemId) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo del inventario?')) {
      setInventory(inventory.filter(item => item.id !== itemId));
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
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
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalInsumos}</h3>
          <p className="text-sm text-gray-500">Insumos</p>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Frame className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalStockProductos}</h3>
          <p className="text-sm text-gray-500">Stock de Productos</p>
        </Card>
        
        <Card className="text-center bg-orange-50 border-orange-200">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-orange-600">{totalAlertas}</h3>
          <p className="text-sm text-gray-500">Alertas</p>
        </Card>
      </div>

      {/* Sección de Alertas de Stock */}
      {lowStockItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Stock</h2>
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
        </div>
      )}

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
            {activeMainTab === 'Enmarcado' ? 'Enmarcado de Fotografías' : activeMainTab}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock ({activeSubTab === 'Pinturas y Acabados' ? 'L' : 'Unidades'})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stockMinimo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.unidad}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
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
                        onClick={() => handleDeleteItem(item.id)}
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

        {/* Botón de agregar */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleAddItem}
            icon={<Plus className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Agregar Producto
          </Button>
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      <Modal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre del Producto</label>
              <input 
                defaultValue={selectedItem?.nombre || ''} 
                id="inv_nombre" 
                type="text" 
                className="form-input" 
                placeholder="Nombre del producto" 
              />
            </div>
            <div>
              <label className="form-label">Tipo</label>
              <input 
                defaultValue={selectedItem?.tipo || ''} 
                id="inv_tipo" 
                type="text" 
                className="form-input" 
                placeholder="Tipo de producto" 
              />
            </div>
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
              <label className="form-label">Unidad</label>
              <select defaultValue={selectedItem?.unidad || 'unidades'} id="inv_unidad" className="form-select">
                <option value="unidades">Unidades</option>
                <option value="L">Litros</option>
                <option value="rollos">Rollos</option>
                <option value="kg">Kilogramos</option>
              </select>
            </div>
            <div>
              <label className="form-label">Precio Unitario</label>
              <input 
                defaultValue={selectedItem?.precio || 0} 
                id="inv_precio" 
                type="number" 
                step="0.01" 
                className="form-input" 
              />
            </div>
          </div>

          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowItemModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              const updated = {
                id: selectedItem?.id || `INV${String(inventory.length + 1).padStart(3,'0')}`,
                nombre: document.getElementById('inv_nombre').value,
                categoria: activeSubTab,
                tipo: document.getElementById('inv_tipo').value,
                stock: parseInt(document.getElementById('inv_stock').value || '0', 10),
                stockMinimo: parseInt(document.getElementById('inv_stock_min').value || '0', 10),
                unidad: document.getElementById('inv_unidad').value,
                precio: parseFloat(document.getElementById('inv_precio').value || '0'),
                proveedor: selectedItem?.proveedor || '',
                fechaIngreso: selectedItem?.fechaIngreso || new Date().toISOString().split('T')[0],
                ultimaVenta: selectedItem?.ultimaVenta || ''
              };
              
              if (selectedItem) {
                setInventory(prev => prev.map(i => i.id === selectedItem.id ? updated : i));
              } else {
                setInventory(prev => [updated, ...prev]);
              }
              
              setShowItemModal(false);
              setSelectedItem(null);
            }}>
              {selectedItem ? 'Guardar Cambios' : 'Agregar Producto'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default Inventario;