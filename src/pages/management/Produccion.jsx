import {
  Check,
  Clock,
  Edit,
  Eye,
  FileText,
  Frame,
  Package,
  Search,
  Send,
  Settings,
  Trash2,
  Truck,
  Wrench
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ConfirmationModal from '../../components/ConfirmationModal';
import ReclassificationModal from '../../components/ReclassificationModal';
import * as produccionService from '../../services/produccionService';

const Produccion = () => {
  const [activeMainTab, setActiveMainTab] = useState('Recordatorios');
  const [activeSubTab, setActiveSubTab] = useState('Orden de Producción');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [itemToSave, setItemToSave] = useState(null);
  const [saveAction, setSaveAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveChangesDialog, setShowSaveChangesDialog] = useState(false);
  const [itemToSaveChanges, setItemToSaveChanges] = useState(null);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  
  // Estados para el modal personalizado de cambio de estado
  const [showStateChangeModal, setShowStateChangeModal] = useState(false);
  const [isChangingState, setIsChangingState] = useState(false);
  const [stateChangeInfo, setStateChangeInfo] = useState({
    currentState: '',
    nextState: '',
    itemCount: 0,
    type: 'success'
  });

  // Estructura inicial de datos vacía
  const initialData = {
    'Enmarcados': {
      'Orden de Enmarcado': [],
      'En Proceso': [],
      'Terminados': [],
      'Entregados': []
    },
    'Minilab': {
      'Orden de Impresión': [],
      'Mantenimiento': [],
      'En Proceso': [],
      'Completados': []
    },
    'Recordatorios': {
      'Orden de Producción': [],
      'Control de Avance': [],
      'En Proceso': [],
      'Completados': []
    },
    'Corte Láser': {
      'Orden de Corte': [],
      'Registro de Productos': [],
      'Mermas': [],
      'En Proceso': []
    },
    'Accesorios': {
      'Consumo Automático': [],
      'Registro Manual': [],
      'Stock': []
    },
    'Edición Digital': {
      'Órdenes de Edición': [],
      'Archivo Original': [],
      'Archivo Editado': [],
      'Entrega': []
    }
  };

  // Función para cargar órdenes de producción desde el servicio
  const loadProduccionOrders = async () => {
    try {
      const orders = await produccionService.getAll();
      
      // Formatear las órdenes para mostrarlas en la interfaz
      const formattedOrders = orders.map(order => ({
        id: order.id,
        pedido: order.pedidoId,
        cliente: order.cliente,
        colegio: order.colegio,
        promocion: order.promocion,
        fechaCreacion: new Date(order.createdAt).toLocaleDateString(),
        estadoEnvio: order.estado
      }));
      
      // Actualizar los datos de la pestaña Recordatorios > Orden de Producción
      setData(prevData => ({
        ...prevData,
        'Recordatorios': {
          ...prevData['Recordatorios'],
          'Orden de Producción': formattedOrders
        }
      }));
    } catch (error) {
      console.error('Error al cargar órdenes de producción:', error);
    }
  };

  // Definición de los tabs principales
  const mainTabs = [
    { id: 'Enmarcados', label: 'Enmarcados', icon: <Frame size={16} /> },
    { id: 'Minilab', label: 'Minilab', icon: <Settings size={16} /> },
    { id: 'Recordatorios', label: 'Recordatorios', icon: <Clock size={16} /> },
    { id: 'Corte Láser', label: 'Corte Láser', icon: <Wrench size={16} /> },
    { id: 'Accesorios', label: 'Accesorios', icon: <Package size={16} /> },
    { id: 'Edición Digital', label: 'Edición Digital', icon: <Edit size={16} /> }
  ];

  // Definición de los subtabs para cada tab principal
  const subTabs = {
    'Enmarcados': [
      { id: 'Orden de Enmarcado', label: 'Orden de Enmarcado', icon: <FileText size={16} /> },
      { id: 'En Proceso', label: 'En Proceso', icon: <Clock size={16} /> },
      { id: 'Terminados', label: 'Terminados', icon: <Check size={16} /> },
      { id: 'Entregados', label: 'Entregados', icon: <Truck size={16} /> }
    ],
    'Minilab': [
      { id: 'Orden de Impresión', label: 'Orden de Impresión', icon: <FileText size={16} /> },
      { id: 'Mantenimiento', label: 'Mantenimiento', icon: <Wrench size={16} /> },
      { id: 'En Proceso', label: 'En Proceso', icon: <Clock size={16} /> },
      { id: 'Completados', label: 'Completados', icon: <Check size={16} /> }
    ],
    'Recordatorios': [
      { id: 'Orden de Producción', label: 'Orden de Producción', icon: <FileText size={16} /> },
      { id: 'Control de Avance', label: 'Control de Avance', icon: <Eye size={16} /> },
      { id: 'En Proceso', label: 'En Proceso', icon: <Clock size={16} /> },
      { id: 'Completados', label: 'Completados', icon: <Check size={16} /> }
    ],
    'Corte Láser': [
      { id: 'Orden de Corte', label: 'Orden de Corte', icon: <FileText size={16} /> },
      { id: 'Registro de Productos', label: 'Registro de Productos', icon: <Package size={16} /> },
      { id: 'Mermas', label: 'Mermas', icon: <Trash2 size={16} /> },
      { id: 'En Proceso', label: 'En Proceso', icon: <Clock size={16} /> }
    ],
    'Accesorios': [
      { id: 'Consumo Automático', label: 'Consumo Automático', icon: <Settings size={16} /> },
      { id: 'Registro Manual', label: 'Registro Manual', icon: <Edit size={16} /> },
      { id: 'Stock', label: 'Stock', icon: <Package size={16} /> }
    ],
    'Edición Digital': [
      { id: 'Órdenes de Edición', label: 'Órdenes de Edición', icon: <FileText size={16} /> },
      { id: 'Archivo Original', label: 'Archivo Original', icon: <Eye size={16} /> },
      { id: 'Archivo Editado', label: 'Archivo Editado', icon: <Edit size={16} /> },
      { id: 'Entrega', label: 'Entrega', icon: <Send size={16} /> }
    ]
  };

  // Inicializar datos al cargar el componente
  useEffect(() => {
    // Cargar órdenes de producción
    loadProduccionOrders();
    
    // Inicializar datos con estructura vacía
    setData(initialData);
  }, []);

  // Función para manejar el cambio de tab principal
  const handleMainTabChange = (tabId) => {
    setActiveMainTab(tabId);
    if (subTabs[tabId] && subTabs[tabId].length > 0) {
      setActiveSubTab(subTabs[tabId][0].id);
    }
  };

  // Función para manejar el cambio de subtab
  const handleSubTabChange = (tabId) => {
    setActiveSubTab(tabId);
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para filtrar los datos según el término de búsqueda
  const filteredData = data[activeMainTab] && data[activeMainTab][activeSubTab]
    ? data[activeMainTab][activeSubTab].filter(item => {
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  // Función para manejar la selección de items
  const handleItemSelect = (item) => {
    if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Función para abrir el modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
  };

  // Función para confirmar la eliminación
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  // Función para eliminar un item
  const deleteItem = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      // Aquí iría la lógica para eliminar el item del backend
      // await api.deleteItem(itemToDelete.id);
      
      // Actualizar los datos locales
      setData(prevData => {
        const updatedData = { ...prevData };
        updatedData[activeMainTab][activeSubTab] = updatedData[activeMainTab][activeSubTab].filter(
          item => item.id !== itemToDelete.id
        );
        return updatedData;
      });
      
      // Limpiar la selección si el item eliminado estaba seleccionado
      setSelectedItems(selectedItems.filter(item => item.id !== itemToDelete.id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  // Función para confirmar el guardado
  const confirmSave = (item, action) => {
    setItemToSave(item);
    setSaveAction(action);
    setShowSaveDialog(true);
  };

  // Función para guardar un item
  const saveItem = async () => {
    if (!itemToSave) return;
    
    setIsSaving(true);
    try {
      // Aquí iría la lógica para guardar el item en el backend según la acción
      // if (saveAction === 'create') await api.createItem(itemToSave);
      // else if (saveAction === 'update') await api.updateItem(itemToSave.id, itemToSave);
      
      // Actualizar los datos locales
      setData(prevData => {
        const updatedData = { ...prevData };
        if (saveAction === 'create') {
          updatedData[activeMainTab][activeSubTab] = [
            ...updatedData[activeMainTab][activeSubTab],
            { ...itemToSave, id: Date.now() } // ID temporal
          ];
        } else if (saveAction === 'update') {
          updatedData[activeMainTab][activeSubTab] = updatedData[activeMainTab][activeSubTab].map(
            item => item.id === itemToSave.id ? itemToSave : item
          );
        }
        return updatedData;
      });
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
      setShowSaveDialog(false);
      setItemToSave(null);
      setSaveAction('');
    }
  };

  // Función para confirmar el guardado de cambios
  const confirmSaveChanges = (item) => {
    setItemToSaveChanges(item);
    setShowSaveChangesDialog(true);
  };

  // Función para guardar cambios en un item
  const saveChanges = async () => {
    if (!itemToSaveChanges) return;
    
    setIsSavingChanges(true);
    try {
      // Aquí iría la lógica para guardar los cambios en el backend
      // await api.updateItem(itemToSaveChanges.id, itemToSaveChanges);
      
      // Actualizar los datos locales
      setData(prevData => {
        const updatedData = { ...prevData };
        updatedData[activeMainTab][activeSubTab] = updatedData[activeMainTab][activeSubTab].map(
          item => item.id === itemToSaveChanges.id ? itemToSaveChanges : item
        );
        return updatedData;
      });
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    } finally {
      setIsSavingChanges(false);
      setShowSaveChangesDialog(false);
      setItemToSaveChanges(null);
    }
  };

  // Función para abrir el modal de cambio de estado
  const openStateChangeModal = (currentState, nextState, items) => {
    setStateChangeInfo({
      currentState,
      nextState,
      itemCount: items.length,
      type: 'success'
    });
    setShowStateChangeModal(true);
  };

  // Función para cambiar el estado de los items seleccionados
  const changeItemsState = async () => {
    setIsChangingState(true);
    try {
      // Aquí iría la lógica para cambiar el estado de los items en el backend
      // await Promise.all(selectedItems.map(item => api.updateItemState(item.id, stateChangeInfo.nextState)));
      
      // Actualizar los datos locales
      setData(prevData => {
        const updatedData = { ...prevData };
        updatedData[activeMainTab][activeSubTab] = updatedData[activeMainTab][activeSubTab].map(
          item => selectedItems.some(selectedItem => selectedItem.id === item.id)
            ? { ...item, estadoEnvio: stateChangeInfo.nextState }
            : item
        );
        return updatedData;
      });
      
      // Limpiar la selección
      setSelectedItems([]);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setIsChangingState(false);
      setShowStateChangeModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera con tabs principales */}
      <div className="flex border-b">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 ${
              activeMainTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => handleMainTabChange(tab.id)}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Subtabs */}
      {subTabs[activeMainTab] && (
        <div className="flex border-b">
          {subTabs[activeMainTab].map(tab => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 ${
                activeSubTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => handleSubTabChange(tab.id)}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Barra de herramientas */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="flex space-x-2">
          {/* Botones de acción según el contexto */}
          {activeSubTab === 'Orden de Producción' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => openModal('create')}
            >
              Nueva Orden
            </button>
          )}
          {selectedItems.length > 0 && (
            <>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => confirmDelete(selectedItems[0])}
              >
                Eliminar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => openStateChangeModal('Pendiente', 'En Proceso', selectedItems)}
              >
                Cambiar Estado
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-auto p-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-10 px-4 py-2">
                <input
                  type="checkbox"
                  checked={
                    filteredData.length > 0 &&
                    filteredData.every(item =>
                      selectedItems.some(selectedItem => selectedItem.id === item.id)
                    )
                  }
                  onChange={() => {
                    if (
                      filteredData.every(item =>
                        selectedItems.some(selectedItem => selectedItem.id === item.id)
                      )
                    ) {
                      setSelectedItems(
                        selectedItems.filter(
                          item => !filteredData.some(filteredItem => filteredItem.id === item.id)
                        )
                      );
                    } else {
                      setSelectedItems([
                        ...selectedItems,
                        ...filteredData.filter(
                          item => !selectedItems.some(selectedItem => selectedItem.id === item.id)
                        )
                      ]);
                    }
                  }}
                />
              </th>
              {/* Encabezados dinámicos según el tab activo */}
              {filteredData.length > 0 &&
                Object.keys(filteredData[0])
                  .filter(key => key !== 'id')
                  .map(key => (
                    <th key={key} className="px-4 py-2 text-left">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                    onChange={() => handleItemSelect(item)}
                  />
                </td>
                {/* Celdas dinámicas según el tab activo */}
                {Object.keys(item)
                  .filter(key => key !== 'id')
                  .map(key => (
                    <td key={key} className="px-4 py-2">
                      {item[key]}
                    </td>
                  ))}
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-blue-600 hover:text-blue-800"
                      onClick={() => openModal('view', item)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-1 text-green-600 hover:text-green-800"
                      onClick={() => openModal('edit', item)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:text-red-800"
                      onClick={() => confirmDelete(item)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="100%" className="px-4 py-8 text-center text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modales */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'create' && 'Nueva Orden'}
              {modalType === 'edit' && 'Editar Orden'}
              {modalType === 'view' && 'Ver Detalles'}
            </h2>
            {/* Contenido del modal según el tipo */}
            {modalType === 'create' && (
              <div>
                {/* Formulario de creación */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Cliente</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block mb-1">Colegio</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block mb-1">Promoción</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block mb-1">Estado</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>Pendiente</option>
                      <option>En Proceso</option>
                      <option>Completado</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {modalType === 'edit' && selectedItem && (
              <div>
                {/* Formulario de edición */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(selectedItem)
                    .filter(key => key !== 'id')
                    .map(key => (
                      <div key={key}>
                        <label className="block mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        {key === 'estadoEnvio' ? (
                          <select
                            className="w-full border rounded-lg px-3 py-2"
                            defaultValue={selectedItem[key]}
                          >
                            <option>Pendiente</option>
                            <option>En Proceso</option>
                            <option>Completado</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="w-full border rounded-lg px-3 py-2"
                            defaultValue={selectedItem[key]}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {modalType === 'view' && selectedItem && (
              <div>
                {/* Vista de detalles */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(selectedItem)
                    .filter(key => key !== 'id')
                    .map(key => (
                      <div key={key}>
                        <label className="block mb-1 font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <p>{selectedItem[key]}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancelar
              </button>
              {modalType !== 'view' && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    if (modalType === 'create') {
                      // Lógica para crear
                      confirmSave({ /* datos del formulario */ }, 'create');
                    } else if (modalType === 'edit') {
                      // Lógica para editar
                      confirmSave({ /* datos actualizados */ }, 'update');
                    }
                    closeModal();
                  }}
                >
                  {modalType === 'create' ? 'Crear' : 'Guardar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      {showDeleteDialog && (
        <ConfirmationDialog
          title="Confirmar eliminación"
          message={`¿Estás seguro de que deseas eliminar ${
            itemToDelete ? (itemToDelete.nombre || 'este elemento') : 'los elementos seleccionados'
          }?`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          isLoading={isDeleting}
          onConfirm={deleteItem}
          onCancel={() => {
            setShowDeleteDialog(false);
            setItemToDelete(null);
          }}
        />
      )}
      
      {/* Diálogo de confirmación para guardar */}
      {showSaveDialog && (
        <ConfirmationDialog
          title={`Confirmar ${saveAction === 'create' ? 'creación' : 'actualización'}`}
          message={`¿Estás seguro de que deseas ${
            saveAction === 'create' ? 'crear' : 'actualizar'
          } este elemento?`}
          confirmLabel="Guardar"
          cancelLabel="Cancelar"
          isLoading={isSaving}
          onConfirm={saveItem}
          onCancel={() => {
            setShowSaveDialog(false);
            setItemToSave(null);
            setSaveAction('');
          }}
        />
      )}
      
      {/* Diálogo de confirmación para guardar cambios */}
      {showSaveChangesDialog && (
        <ConfirmationDialog
          title="Guardar cambios"
          message="¿Estás seguro de que deseas guardar los cambios realizados?"
          confirmLabel="Guardar"
          cancelLabel="Cancelar"
          isLoading={isSavingChanges}
          onConfirm={saveChanges}
          onCancel={() => {
            setShowSaveChangesDialog(false);
            setItemToSaveChanges(null);
          }}
        />
      )}
      
      {/* Modal de cambio de estado */}
      {showStateChangeModal && (
        <ConfirmationModal
          title="Cambiar Estado"
          message={`¿Estás seguro de que deseas cambiar el estado de ${stateChangeInfo.itemCount} elemento(s) de "${stateChangeInfo.currentState}" a "${stateChangeInfo.nextState}"?`}
          confirmLabel="Cambiar"
          cancelLabel="Cancelar"
          type={stateChangeInfo.type}
          isLoading={isChangingState}
          onConfirm={changeItemsState}
          onCancel={() => setShowStateChangeModal(false)}
        />
      )}
      
      {/* Modal de reclasificación */}
      {modalType === 'reclassify' && showModal && (
        <ReclassificationModal
          onClose={closeModal}
          onConfirm={(newCategory) => {
            // Lógica para reclasificar
            closeModal();
          }}
          categories={['Categoría 1', 'Categoría 2', 'Categoría 3']}
        />
      )}
    </div>
  );
};

export default Produccion;
