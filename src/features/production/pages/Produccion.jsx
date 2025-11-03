import {
  Check,
  Clock,
  Edit,
  Eye,
  ListChecks,
  Package,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import ConfirmationDialog from '@components/forms/ConfirmationDialog/ConfirmationDialog.jsx';

const Produccion = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(null);

  // Configuración de pestañas
  const tabs = [
    { id: 'todos', label: 'Todos', icon: ListChecks },
    { id: 'pendientes', label: 'Pendientes', icon: Clock },
    { id: 'en_proceso', label: 'En Proceso', icon: TrendingUp },
    { id: 'terminados', label: 'Terminados', icon: Check },
    { id: 'entregados', label: 'Entregados', icon: Package }
  ];

  // Datos de muestra iniciales con nueva estructura
  const [ordenesProduccion, setOrdenesProduccion] = useState([
    {
      id: 1,
      numeroOP: 'OP-2024-001',
      pedido: 'PED-001',
      cliente: 'Colegio San José',
      descripcion: 'Fotos escolares promoción 2024',
      tipo: 'Graduación',
      estado: 'Pendiente',
      prioridad: 'Alta',
      operario: 'Juan Pérez',
      fechaEstimada: '2024-12-15'
    },
    {
      id: 2,
      numeroOP: 'OP-2024-002',
      pedido: 'PED-002',
      cliente: 'María García',
      descripcion: 'Marco decorativo 30x40',
      tipo: 'Enmarcado',
      estado: 'En Proceso',
      prioridad: 'Media',
      operario: 'Ana Martínez',
      fechaEstimada: '2024-12-10'
    },
    {
      id: 3,
      numeroOP: 'OP-2024-003',
      pedido: 'PED-003',
      cliente: 'Empresa ABC S.A.C.',
      descripcion: 'Impresión de catálogos',
      tipo: 'Minilab',
      estado: 'Terminado',
      prioridad: 'Normal',
      operario: 'Carlos López',
      fechaEstimada: '2024-12-05'
    },
    {
      id: 4,
      numeroOP: 'OP-2024-004',
      pedido: 'PED-004',
      cliente: 'José Martínez',
      descripcion: 'Letras corporativas corte láser',
      tipo: 'Corte Láser',
      estado: 'Entregado',
      prioridad: 'Baja',
      operario: 'Miguel Torres',
      fechaEstimada: '2024-12-01'
    },
    {
      id: 5,
      numeroOP: 'OP-2024-005',
      pedido: 'PED-005',
      cliente: 'I.E. María Auxiliadora',
      descripcion: 'Anuarios escolares',
      tipo: 'Graduación',
      estado: 'Pendiente',
      prioridad: 'Alta',
      operario: 'Juan Pérez',
      fechaEstimada: '2024-12-20'
    },
    {
      id: 6,
      numeroOP: 'OP-2024-006',
      pedido: 'PED-006',
      cliente: 'Laura Vega',
      descripcion: 'Retoque fotográfico profesional',
      tipo: 'Edición Digital',
      estado: 'En Proceso',
      prioridad: 'Media',
      operario: 'Ana Martínez',
      fechaEstimada: '2024-12-08'
    }
  ]);

  // Filtrar datos según la pestaña activa
  const getFilteredData = () => {
    if (activeTab === 'todos') {
      return ordenesProduccion;
    }
    
    const estadoMap = {
      'pendientes': 'Pendiente',
      'en_proceso': 'En Proceso',
      'terminados': 'Terminado',
      'entregados': 'Entregado'
    };
    
    return ordenesProduccion.filter(orden => orden.estado === estadoMap[activeTab]);
  };

  // Filtrar por búsqueda
  const filteredData = getFilteredData().filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Columnas de la tabla
  const columns = [
    { key: 'numeroOP', label: 'N° OP' },
    { key: 'pedido', label: 'PEDIDO' },
    { key: 'cliente', label: 'CLIENTE' },
    { key: 'descripcion', label: 'DESCRIPCIÓN' },
    { key: 'tipo', label: 'TIPO' },
    { key: 'estado', label: 'ESTADO' },
    { key: 'prioridad', label: 'PRIORIDAD' },
    { key: 'operario', label: 'OPERARIO' },
    { key: 'fechaEstimada', label: 'FECHA ESTIMADA' },
    { key: 'acciones', label: 'ACCIONES' }
  ];

  // Manejadores de eventos
  const handleView = (item) => {
    setSelectedItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      setOrdenesProduccion(prev => prev.filter(orden => orden.id !== itemToDelete.id));
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNew = () => {
    const newOP = {
      id: Math.max(...ordenesProduccion.map(o => o.id), 0) + 1,
      numeroOP: `OP-2024-${String(ordenesProduccion.length + 1).padStart(3, '0')}`,
      pedido: '',
      cliente: '',
      descripcion: '',
      tipo: 'Enmarcado',
      estado: 'Pendiente',
      prioridad: 'Normal',
      operario: '',
      fechaEstimada: new Date().toISOString().split('T')[0]
    };
    setFormData(newOP);
    setShowFormModal(true);
  };

  const handleSaveForm = (data) => {
    if (data.id && ordenesProduccion.find(o => o.id === data.id)) {
      // Editar existente
      setOrdenesProduccion(prev =>
        prev.map(orden => orden.id === data.id ? data : orden)
      );
    } else {
      // Agregar nuevo
      setOrdenesProduccion(prev => [...prev, data]);
    }
    setShowFormModal(false);
    setFormData(null);
  };

  const handleSaveFromModal = (updatedItem) => {
    setOrdenesProduccion(prev =>
      prev.map(orden => orden.id === updatedItem.id ? updatedItem : orden)
    );
    setShowModal(false);
    setSelectedItem(null);
  };

  // Función para obtener color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800';
      case 'Terminado':
        return 'bg-green-100 text-green-800';
      case 'Entregado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color según prioridad
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Media':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-green-100 text-green-800';
      case 'Baja':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="responsive-mobile">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producción</h1>
            <p className="text-sm text-gray-500">Gestiona las órdenes de producción</p>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
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
        {/* Barra de herramientas */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleAddNew}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar OP</span>
            </button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por N° OP, cliente, pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, idx) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4 text-sm">
                      {col.key === 'acciones' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-yellow-600 hover:text-yellow-800 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : col.key === 'estado' ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(item[col.key])}`}>
                          {item[col.key]}
                        </span>
                      ) : col.key === 'prioridad' ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(item[col.key])}`}>
                          {item[col.key]}
                        </span>
                      ) : col.key === 'numeroOP' ? (
                        <span className="font-medium text-gray-900">{item[col.key]}</span>
                      ) : (
                        <span className="text-gray-700">{item[col.key]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje si no hay datos */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? 'No se encontraron resultados' : 'No hay órdenes de producción registradas'}
            </div>
          </div>
        )}

        {/* Paginación */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Mostrando {filteredData.length} {filteredData.length === 1 ? 'orden' : 'órdenes'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal para ver/editar */}
      {showModal && selectedItem && (
        <ViewEditModal
          item={selectedItem}
          modalType={modalType}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveFromModal}
          onSwitchToEdit={() => setModalType('edit')}
        />
      )}

      {/* Modal de formulario para agregar */}
      {showFormModal && formData && (
        <FormModal
          data={formData}
          onClose={() => {
            setShowFormModal(false);
            setFormData(null);
          }}
          onSave={handleSaveForm}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Orden de Producción"
        message={`¿Estás seguro de que deseas eliminar la orden ${itemToDelete?.numeroOP}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

// Componente Modal para Ver/Editar
const ViewEditModal = ({ item, modalType, onClose, onSave, onSwitchToEdit }) => {
  const [formData, setFormData] = useState(item);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const isViewMode = modalType === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isViewMode ? 'Ver Orden de Producción' : 'Editar Orden de Producción'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° OP</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.numeroOP}</div>
              ) : (
                <input
                  type="text"
                  value={formData.numeroOP}
                  onChange={(e) => handleInputChange('numeroOP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pedido</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.pedido}</div>
              ) : (
                <input
                  type="text"
                  value={formData.pedido}
                  onChange={(e) => handleInputChange('pedido', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.cliente}</div>
              ) : (
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => handleInputChange('cliente', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.descripcion}</div>
              ) : (
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.tipo}</div>
              ) : (
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Enmarcado">Enmarcado</option>
                  <option value="Minilab">Minilab</option>
                  <option value="Graduación">Graduación</option>
                  <option value="Corte Láser">Corte Láser</option>
                  <option value="Edición Digital">Edición Digital</option>
                  <option value="Otro">Otro</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.estado}</div>
              ) : (
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Terminado">Terminado</option>
                  <option value="Entregado">Entregado</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.prioridad}</div>
              ) : (
                <select
                  value={formData.prioridad}
                  onChange={(e) => handleInputChange('prioridad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Baja">Baja</option>
                  <option value="Normal">Normal</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operario</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.operario}</div>
              ) : (
                <input
                  type="text"
                  value={formData.operario}
                  onChange={(e) => handleInputChange('operario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Estimada</label>
              {isViewMode ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{formData.fechaEstimada}</div>
              ) : (
                <input
                  type="date"
                  value={formData.fechaEstimada}
                  onChange={(e) => handleInputChange('fechaEstimada', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {isViewMode ? 'Cerrar' : 'Cancelar'}
          </button>
          {isViewMode && (
            <button
              onClick={onSwitchToEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
            >
              Editar
            </button>
          )}
          {!isViewMode && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
            >
              Guardar Cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Formulario para Agregar
const FormModal = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.pedido || !formData.cliente || !formData.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Registrar Nueva Orden de Producción</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° OP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.numeroOP}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pedido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pedido}
                onChange={(e) => handleInputChange('pedido', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: PED-001"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => handleInputChange('cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre del cliente"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                placeholder="Describe el trabajo a realizar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Enmarcado">Enmarcado</option>
                <option value="Minilab">Minilab</option>
                <option value="Graduación">Graduación</option>
                <option value="Corte Láser">Corte Láser</option>
                <option value="Edición Digital">Edición Digital</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Terminado">Terminado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) => handleInputChange('prioridad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Baja">Baja</option>
                <option value="Normal">Normal</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operario</label>
              <input
                type="text"
                value={formData.operario}
                onChange={(e) => handleInputChange('operario', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre del operario"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Estimada</label>
              <input
                type="date"
                value={formData.fechaEstimada}
                onChange={(e) => handleInputChange('fechaEstimada', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
          >
            Registrar OP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produccion;
