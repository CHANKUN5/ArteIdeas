import jsPDF from 'jspdf';
// CORRECTO ✅
import { Calendar, ChevronDown, Clock, DollarSign, Download, Edit, Eye, FileText, Filter, Plus, Save, Search, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '@components/ui/Button/Button.jsx';
import Card from '@components/ui/Card/Card.jsx';
import Modal from '@components/ui/Modal/Modal.jsx';

const Contratos = () => {
  // Datos iniciales por defecto
  const defaultContracts = [
    {
      id: 'CTR001',
      cliente: 'I.E. San Martín de Porres',
      servicio: 'Promoción Escolar 2025',
      tipo: 'Anual',
      fechaInicio: '2025-03-01',
      fechaFin: '2025-12-31',
      valor: 25000.00,
      pagado: 7500.00,
      estado: 'Activo',
      porcentajePagado: 30,
      estudiantes: 180,
      observaciones: 'Incluye fotografía individual, grupal y eventos especiales',
      clausulas: [
        'Sesiones fotográficas durante todo el año escolar',
        'Entrega de fotografías individuales y grupales',
        'Cobertura de eventos especiales (graduación, actuaciones)',
        'Entrega final en diciembre 2025'
      ],
      fechaCreacion: '2025-02-15',
      responsable: 'Carlos Mendoza'
    },
    {
      id: 'CTR002',
      cliente: 'Colegio Particular Santa Rosa',
      servicio: 'Fotografía Institucional',
      tipo: 'Semestral',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-12-31',
      valor: 15000.00,
      pagado: 15000.00,
      estado: 'Pagado',
      porcentajePagado: 100,
      estudiantes: 120,
      observaciones: 'Contrato completamente pagado al inicio',
      clausulas: [
        'Fotografía de promoción 2025',
        'Sesiones individuales y grupales',
        'Material de marketing institucional',
        'Entrega digital y física'
      ],
      fechaCreacion: '2025-05-20',
      responsable: 'Ana Torres'
    },
    {
      id: 'CTR003',
      cliente: 'Empresa TechSolutions SAC',
      servicio: 'Eventos Corporativos 2025',
      tipo: 'Anual',
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      valor: 18000.00,
      pagado: 9000.00,
      estado: 'Activo',
      porcentajePagado: 50,
      estudiantes: 0,
      observaciones: 'Cobertura de eventos corporativos mensuales',
      clausulas: [
        'Cobertura fotográfica de eventos mensuales',
        'Fotografías para redes sociales y marketing',
        'Entrega en formato digital',
        'Sesiones adicionales con costo extra'
      ],
      fechaCreacion: '2024-12-15',
      responsable: 'Luis García'
    },
    {
      id: 'CTR004',
      cliente: 'I.E. José Carlos Mariátegui',
      servicio: 'Promoción Escolar 2025',
      tipo: 'Anual',
      fechaInicio: '2025-04-01',
      fechaFin: '2025-12-31',
      valor: 22000.00,
      pagado: 4400.00,
      estado: 'Pendiente',
      porcentajePagado: 20,
      estudiantes: 160,
      observaciones: 'Pendiente de pago inicial, trabajo iniciará con adelanto',
      clausulas: [
        'Promoción escolar completa',
        'Fotografía individual de 160 estudiantes',
        'Sesiones grupales por aulas',
        'Evento de graduación incluido'
      ],
      fechaCreacion: '2025-03-10',
      responsable: 'Juan Pérez'
    }
  ];

  // Función para cargar contratos desde localStorage
  const loadContractsFromStorage = () => {
    try {
      const savedContracts = localStorage.getItem('arteIdeas_contracts');
      if (savedContracts) {
        return JSON.parse(savedContracts);
      }
    } catch (error) {
      console.error('Error al cargar contratos desde localStorage:', error);
    }
    return defaultContracts;
  };

  // Función para guardar contratos en localStorage
  const saveContractsToStorage = (contractsToSave) => {
    try {
      localStorage.setItem('arteIdeas_contracts', JSON.stringify(contractsToSave));
    } catch (error) {
      console.error('Error al guardar contratos en localStorage:', error);
    }
  };

  // Estado inicial con datos desde localStorage
  const [contracts, setContracts] = useState(loadContractsFromStorage);

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const savedContracts = loadContractsFromStorage();
    setContracts(savedContracts);
  }, []);

  // useEffect para guardar automáticamente cuando cambien los contratos
  useEffect(() => {
    if (contracts.length > 0) {
      saveContractsToStorage(contracts);
    }
  }, [contracts]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showEditContractModal, setShowEditContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [newContract, setNewContract] = useState({
    cliente: '',
    servicio: '',
    tipo: 'Anual',
    fechaInicio: '',
    fechaFin: '',
    valor: '',
    pagado: '',
    saldo: '',
    estado: 'Pendiente',
    estudiantes: '',
    observaciones: '',
    clausulas: [''],
    responsable: ''
  });
  const [editContract, setEditContract] = useState({
    cliente: '',
    servicio: '',
    tipo: 'Anual',
    fechaInicio: '',
    fechaFin: '',
    valor: '',
    pagado: '',
    saldo: '',
    estado: 'Pendiente',
    estudiantes: '',
    observaciones: '',
    clausulas: [''],
    responsable: ''
  });
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // <-- estado para la página actual

  const statusConfig = {
    'Borrador': { color: 'bg-gray-100 text-gray-800', textColor: 'text-gray-600' },
    'Activo': { color: 'bg-green-100 text-green-800', textColor: 'text-green-600' },
    'Firmado': { color: 'bg-emerald-100 text-emerald-800', textColor: 'text-emerald-600' },
    'En ejecución': { color: 'bg-indigo-100 text-indigo-800', textColor: 'text-indigo-600' },
    'Finalizado': { color: 'bg-slate-100 text-slate-800', textColor: 'text-slate-600' },
    'Entregado': { color: 'bg-slate-100 text-slate-800', textColor: 'text-slate-600' },
    'Pagado': { color: 'bg-blue-100 text-blue-800', textColor: 'text-blue-600' },
    'Cerrado': { color: 'bg-blue-100 text-blue-800', textColor: 'text-blue-600' },
    'Pendiente': { color: 'bg-yellow-100 text-yellow-800', textColor: 'text-yellow-600' },
    'Vencido': { color: 'bg-red-100 text-red-800', textColor: 'text-red-600' },
    'Completado': { color: 'bg-gray-100 text-gray-800', textColor: 'text-gray-600' }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.servicio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || contract.estado === statusFilter;
    const matchesType = typeFilter === 'todos' || contract.tipo === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const ContractDetail = ({ selectedContract, onClose, onEdit }) => {
    const [activeTab, setActiveTab] = useState('Resumen');
    const [associatedOrders, setAssociatedOrders] = useState([]);

    const tabs = ['Resumen', 'Pagos', 'Agenda', 'Pedidos', 'Producción', 'Documentos'];

    const saldoPendiente = (selectedContract.valor || 0) - (selectedContract.pagado || 0);

    // Cargar pedidos asociados cuando cambia el contrato seleccionado
    useEffect(() => {
      const loadAssociatedOrders = () => {
        try {
          const storedOrders = localStorage.getItem('orders');
          if (storedOrders) {
            const orders = JSON.parse(storedOrders);
            console.log('Buscando pedidos para contrato:', selectedContract.id);
            console.log('Todos los pedidos:', orders);
            
            // Filtrar pedidos que tengan el contratoId del contrato actual
            const filteredOrders = orders.filter(order => 
              order.contratoId === selectedContract.id
            );
            console.log('Pedidos asociados encontrados:', filteredOrders);
            setAssociatedOrders(filteredOrders);
          }
        } catch (error) {
          console.error('Error loading associated orders:', error);
        }
      };

      loadAssociatedOrders();
      
      // Escuchar el evento personalizado de actualización de pedidos
      const handleOrdersUpdated = () => {
        console.log('Evento ordersUpdated detectado, recargando pedidos asociados');
        loadAssociatedOrders();
      };
      
      window.addEventListener('ordersUpdated', handleOrdersUpdated);
      
      // También verificar cada segundo para asegurar sincronización
      const intervalId = setInterval(loadAssociatedOrders, 1000);
      
      return () => {
        window.removeEventListener('ordersUpdated', handleOrdersUpdated);
        clearInterval(intervalId);
      };
    }, [selectedContract.id]);

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedContract.cliente}</h3>
            <p className="text-gray-500">{selectedContract.servicio}</p>
            {selectedContract.estado && statusConfig[selectedContract.estado] && (
              <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedContract.estado].color}`}>
                {selectedContract.estado}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2 overflow-x-auto border-b border-gray-200 pb-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === t ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Resumen' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
                <p className="text-gray-900">{selectedContract.tipo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <p className="text-gray-900">{selectedContract.responsable}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                <p className="text-gray-900">{selectedContract.fechaInicio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                <p className="text-gray-900">{selectedContract.fechaFin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                <p className="text-gray-900 font-semibold">S/ {Number(selectedContract.valor || 0).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Pagado</label>
                <p className="text-green-600 font-semibold">S/ {Number(selectedContract.pagado || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resumen Financiero</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">S/ {Number(selectedContract.valor || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Valor Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">S/ {Number(selectedContract.pagado || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Pagado ({selectedContract.porcentajePagado || 0}%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">S/ {Number(saldoPendiente).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Saldo Pendiente</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cláusulas del Contrato</label>
              <div className="space-y-2">
                {(selectedContract.clausulas || []).map((clausula, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}.</div>
                    <p className="text-gray-700 text-sm flex-1">{clausula}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedContract.observaciones && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedContract.observaciones}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Pedidos' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-4">Pedidos Asociados</h4>
            
            {associatedOrders.length === 0 ? (
              <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600">
                No hay pedidos asociados a este contrato.
              </div>
            ) : (
              <div className="space-y-3">
                {associatedOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900">{order.cliente}</h5>
                        <p className="text-sm text-gray-500">Pedido: {order.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                        order.estado === 'En proceso' ? 'bg-blue-100 text-blue-800' :
                        order.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.estado}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Producto:</span>
                        <p className="font-medium">{order.tipoProducto}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Fecha:</span>
                        <p className="font-medium">{order.fechaPedido}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Valor:</span>
                        <p className="font-medium text-green-600">S/ {Number(order.precioVenta || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Entrega:</span>
                        <p className="font-medium">{order.fechaEntrega || 'Sin definir'}</p>
                      </div>
                    </div>
                    
                    {order.observaciones && (
                      <div className="mt-2">
                        <span className="text-gray-600 text-sm">Observaciones:</span>
                        <p className="text-sm text-gray-700">{order.observaciones}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'Resumen' && activeTab !== 'Pedidos' && (
          <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600">
            Sin datos en "{activeTab}" por ahora.
          </div>
        )}

        <Modal.Footer>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button 
            variant="ghost"
            icon={<Download className="w-4 h-4" />}
            onClick={() => generatePDF(selectedContract)}
          >
            Descargar PDF
          </Button>
          <Button 
            variant="secondary"
            icon={<Edit className="w-4 h-4" />}
            onClick={onEdit}
          >
            Editar
          </Button>
        </Modal.Footer>
      </div>
    );
  };

  // Función para generar ID único
  const generateContractId = () => {
    const lastId = contracts.length > 0 ? 
      Math.max(...contracts.map(c => parseInt(c.id.replace('CTR', '')))) : 0;
    return `CTR${String(lastId + 1).padStart(3, '0')}`;
  };

  // Función para resetear datos a valores por defecto (útil para testing)
  const resetToDefaultData = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear todos los contratos a los datos por defecto? Esta acción no se puede deshacer.')) {
      setContracts(defaultContracts);
      saveContractsToStorage(defaultContracts);
    }
  };

  // Función para validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!newContract.cliente.trim()) newErrors.cliente = 'El cliente es requerido';
    if (!newContract.servicio.trim()) newErrors.servicio = 'El servicio es requerido';
    if (!newContract.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida';
    if (!newContract.fechaFin) newErrors.fechaFin = 'La fecha de fin es requerida';
    if (!newContract.valor || newContract.valor <= 0) newErrors.valor = 'El valor debe ser mayor a 0';
    if (!newContract.responsable.trim()) newErrors.responsable = 'El responsable es requerido';
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (newContract.fechaInicio && newContract.fechaFin) {
      if (new Date(newContract.fechaFin) <= new Date(newContract.fechaInicio)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
    
    // Validar que el monto pagado no sea mayor al valor total
    if (newContract.valor && newContract.pagado) {
      if (parseFloat(newContract.pagado) > parseFloat(newContract.valor)) {
        newErrors.pagado = 'El monto pagado no puede ser mayor al valor total';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmitNewContract = () => {
    if (!validateForm()) return;
    
    const valor = parseFloat(newContract.valor);
    const pagado = parseFloat(newContract.pagado) || 0;
    const saldo = valor - pagado;
    
    const contractToAdd = {
      ...newContract,
      id: generateContractId(),
      valor: valor,
      pagado: pagado,
      saldo: saldo,
      estudiantes: parseInt(newContract.estudiantes) || 0,
      porcentajePagado: valor > 0 ? 
        Math.round((pagado / valor) * 100) : 0,
      fechaCreacion: new Date().toISOString().split('T')[0],
      clausulas: newContract.clausulas.filter(c => c.trim() !== '')
    };
    
    setContracts([...contracts, contractToAdd]);
    
    // Resetear formulario
    setNewContract({
      cliente: '',
      servicio: '',
      tipo: 'Anual',
      fechaInicio: '',
      fechaFin: '',
      valor: '',
      pagado: '',
      estado: 'Pendiente',
      estudiantes: '',
      observaciones: '',
      clausulas: [''],
      responsable: ''
    });
    setErrors({});
    setShowNewContractModal(false);
  };

  // Función para agregar nueva cláusula
  const addClausula = () => {
    setNewContract({
      ...newContract,
      clausulas: [...newContract.clausulas, '']
    });
  };

  // Función para eliminar cláusula
  const removeClausula = (index) => {
    const newClausulas = newContract.clausulas.filter((_, i) => i !== index);
    setNewContract({
      ...newContract,
      clausulas: newClausulas.length > 0 ? newClausulas : ['']
    });
  };

  // Función para actualizar cláusula
  const updateClausula = (index, value) => {
    const newClausulas = [...newContract.clausulas];
    newClausulas[index] = value;
    setNewContract({
      ...newContract,
      clausulas: newClausulas
    });
  };

  // Función para abrir modal de edición
  const openEditModal = (contract) => {
    setEditingContract(contract);
    const saldo = contract.valor - contract.pagado;
    setEditContract({
      cliente: contract.cliente,
      servicio: contract.servicio,
      tipo: contract.tipo,
      fechaInicio: contract.fechaInicio,
      fechaFin: contract.fechaFin,
      valor: contract.valor.toString(),
      pagado: contract.pagado.toString(),
      saldo: saldo.toString(),
      estado: contract.estado,
      estudiantes: contract.estudiantes.toString(),
      observaciones: contract.observaciones || '',
      clausulas: contract.clausulas.length > 0 ? contract.clausulas : [''],
      responsable: contract.responsable
    });
    setEditErrors({});
    setShowEditContractModal(true);
  };

  // Función para validar formulario de edición
  const validateEditForm = () => {
    const newErrors = {};
    
    if (!editContract.cliente.trim()) newErrors.cliente = 'El cliente es requerido';
    if (!editContract.servicio.trim()) newErrors.servicio = 'El servicio es requerido';
    if (!editContract.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida';
    if (!editContract.fechaFin) newErrors.fechaFin = 'La fecha de fin es requerida';
    if (!editContract.valor || editContract.valor <= 0) newErrors.valor = 'El valor debe ser mayor a 0';
    if (!editContract.responsable.trim()) newErrors.responsable = 'El responsable es requerido';
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (editContract.fechaInicio && editContract.fechaFin) {
      if (new Date(editContract.fechaFin) <= new Date(editContract.fechaInicio)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
    
    // Validar que el monto pagado no sea mayor al valor total
    if (editContract.valor && editContract.pagado) {
      if (parseFloat(editContract.pagado) > parseFloat(editContract.valor)) {
        newErrors.pagado = 'El monto pagado no puede ser mayor al valor total';
      }
    }
    
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para guardar cambios de edición
  const handleSaveEdit = () => {
    if (!validateEditForm()) return;
    
    const valor = parseFloat(editContract.valor);
    const pagado = parseFloat(editContract.pagado) || 0;
    const saldo = valor - pagado;
    
    const updatedContract = {
      ...editingContract,
      cliente: editContract.cliente,
      servicio: editContract.servicio,
      tipo: editContract.tipo,
      fechaInicio: editContract.fechaInicio,
      fechaFin: editContract.fechaFin,
      valor: valor,
      pagado: pagado,
      saldo: saldo,
      estado: editContract.estado,
      estudiantes: parseInt(editContract.estudiantes) || 0,
      observaciones: editContract.observaciones,
      clausulas: editContract.clausulas.filter(c => c.trim() !== ''),
      responsable: editContract.responsable,
      porcentajePagado: valor > 0 ? Math.round((pagado / valor) * 100) : 0
    };
    
    setContracts(contracts.map(c => c.id === editingContract.id ? updatedContract : c));
    setShowEditContractModal(false);
    setEditingContract(null);
    setEditErrors({});
  };

  // Funciones para editar cláusulas
  const addEditClausula = () => {
    setEditContract({
      ...editContract,
      clausulas: [...editContract.clausulas, '']
    });
  };

  const removeEditClausula = (index) => {
    const newClausulas = editContract.clausulas.filter((_, i) => i !== index);
    setEditContract({
      ...editContract,
      clausulas: newClausulas.length > 0 ? newClausulas : ['']
    });
  };

  const updateEditClausula = (index, value) => {
    const newClausulas = [...editContract.clausulas];
    newClausulas[index] = value;
    setEditContract({
      ...editContract,
      clausulas: newClausulas
    });
  };

  // Función para generar PDF
  const generatePDF = (contract) => {
    const doc = new jsPDF();
    
    // Configuración de colores
    const primaryColor = [59, 130, 246]; // blue-500
    const grayColor = [107, 114, 128]; // gray-500
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO DE SERVICIOS', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Número: ${contract.id}`, 105, 22, { align: 'center' });
    
    // Información del contrato
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CONTRATO', 20, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 55;
    const lineHeight = 7;
    
    // Datos básicos
    const contractData = [
      ['Cliente:', contract.cliente],
      ['Servicio:', contract.servicio],
      ['Tipo:', contract.tipo],
      ['Responsable:', contract.responsable],
      ['Fecha de Inicio:', contract.fechaInicio],
      ['Fecha de Fin:', contract.fechaFin],
      ['Estado:', contract.estado]
    ];
    
    contractData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, yPosition);
      yPosition += lineHeight;
    });
    
    // Información financiera
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('INFORMACIÓN FINANCIERA', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const financialData = [
      ['Valor Total:', `S/ ${contract.valor.toLocaleString()}`],
      ['Total Pagado:', `S/ ${contract.pagado.toLocaleString()}`],
      ['Saldo Pendiente:', `S/ ${(contract.valor - contract.pagado).toLocaleString()}`],
      ['Progreso:', `${contract.porcentajePagado}%`]
    ];
    
    financialData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, yPosition);
      yPosition += lineHeight;
    });
    
    // Número de estudiantes si aplica
    if (contract.estudiantes > 0) {
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Número de Estudiantes:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(contract.estudiantes.toString(), 60, yPosition);
      yPosition += lineHeight;
    }
    
    // Cláusulas
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CLÁUSULAS DEL CONTRATO', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    contract.clausulas.forEach((clausula, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}.`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      
      // Dividir texto largo en múltiples líneas
      const maxWidth = 160;
      const lines = doc.splitTextToSize(clausula, maxWidth);
      doc.text(lines, 30, yPosition);
      yPosition += lines.length * lineHeight + 3;
    });
    
    // Observaciones si existen
    if (contract.observaciones) {
      yPosition += 10;
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('OBSERVACIONES', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const obsLines = doc.splitTextToSize(contract.observaciones, 170);
      doc.text(obsLines, 20, yPosition);
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
      doc.text(`Generado el ${new Date().toLocaleDateString()}`, 105, 295, { align: 'center' });
    }
    
    // Descargar PDF
    doc.save(`contrato_${contract.id}_${contract.cliente.replace(/\s+/g, '_')}.pdf`);
  };

  const ContractCard = ({ contract }) => {
    // Estado para controlar si el acordeón está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);
    
    // Tus cálculos existentes
    const saldoPendiente = contract.valor - contract.pagado;
    const diasRestantes = Math.ceil((new Date(contract.fechaFin) - new Date()) / (1000 * 60 * 60 * 24));

    return (
      // La Card principal no cambia
      <Card className="hover:shadow-lg transition-all duration-200">
        
        {/* ================================== */}
        {/* 1. HEADER DEL ACORDEÓN (Clickeable) */}
        {/* ================================== */}
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0"> {/* 👈 clave */}
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0"> {/* 👈 obliga al texto a truncar */}
              <h3 className="font-semibold text-gray-900 truncate">
                {contract.cliente}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                #{contract.id} - {contract.tipo}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[contract.estado].color}`}>
              {contract.estado}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>

        {/* ================================= */}
        {/* 2. BODY DEL ACORDEÓN (Contenido desplegable) */}
        {/* ================================= */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {/* Este div agrega un espacio y línea superior cuando está abierto */}
          <div className="pt-4 mt-4 border-t border-gray-100">

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-1">{contract.servicio}</h4>
              {contract.estudiantes > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{contract.estudiantes} estudiantes</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Valor Total:</span>
                <p className="font-semibold text-gray-900">S/ {contract.valor.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Pagado:</span>
                <p className="font-semibold text-green-600">S/ {contract.pagado.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Saldo:</span>
                <p className={`font-semibold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  S/ {saldoPendiente.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Vencimiento:</span>
                <p className={`font-medium ${diasRestantes < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                  {diasRestantes > 0 ? `${diasRestantes} días` : 'Vencido'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Progreso de Pago</span>
                <span className="font-medium">{contract.porcentajePagado}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    contract.porcentajePagado === 100 ? 'bg-green-500' : 
                    contract.porcentajePagado >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${contract.porcentajePagado}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{contract.fechaInicio} - {contract.fechaFin}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedContract(contract);
                      setShowContractModal(true);
                    }}
                >
                    Ver Detalles
                </Button>
              
                <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => generatePDF(contract)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => openEditModal(contract)}
                    />
                </div>
            </div>
          </div>
        </div>
      </Card>
    );
};

  const totalContratos = contracts.length;
  const contratosActivos = contracts.filter(c => c.estado === 'Activo').length;
  const valorTotal = contracts.reduce((sum, c) => sum + c.valor, 0);
  const totalPagado = contracts.reduce((sum, c) => sum + c.pagado, 0);

  // ===================================
  // LÓGICA DE PAGINACIÓN - AÑADIR ESTO
  // ===================================
  const ITEMS_PER_PAGE = 21;
  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);

  // Calcular los contratos a mostrar en la página actual
  const contractsOnCurrentPage = filteredContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  // ===================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Contract Detail Component (inline) */}
      {false && <ContractDetail />}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-600">Gestiona tus contratos y cotizaciones</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewContractModal(true)}
          >
            Nuevo Contrato
          </Button>
          
          {/* Botón para resetear datos (solo para desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <Button 
              variant="outline"
              onClick={resetToDefaultData}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Reset Datos
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">{totalContratos}</h3>
          <p className="text-sm text-gray-500">Total Contratos</p>
        </Card>
        
        <Card className="text-center">
          <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-600">{contratosActivos}</h3>
          <p className="text-sm text-gray-500">Activos</p>
        </Card>
        
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-blue-600">S/ {valorTotal.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Valor Total</p>
        </Card>
        
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-600">S/ {totalPagado.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Total Pagado</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="todos">Todos los estados</option>
              <option value="Borrador">Borrador</option>
              <option value="Firmado">Firmado</option>
              <option value="Activo">Activo</option>
              <option value="En ejecución">En ejecución</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Entregado">Entregado</option>
              <option value="Pagado">Pagado</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="Vencido">Vencido</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Anual">Anual</option>
              <option value="Semestral">Semestral</option>
              <option value="Mensual">Mensual</option>
              <option value="Por Proyecto">Por Proyecto</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
        {contractsOnCurrentPage.map((contract) => ( // <-- CAMBIAR AQUÍ
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
      
      {/* ===================================== */}
      {/* CONTROLES DE PAGINACIÓN - AÑADIR ESTO */}
      {/* ===================================== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Anterior
          </Button>
          <span className="text-gray-700 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Siguiente
          </Button>
        </div>
      )}
      
      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contratos</h3>
          <p className="text-gray-500 mb-4">Ajusta los filtros o crea un nuevo contrato</p>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewContractModal(true)}
          >
            Nuevo Contrato
          </Button>
        </div>
      )}

      {/* Contract Detail Modal (Tabbed) */}
      <Modal
        isOpen={showContractModal}
        onClose={() => {
          setShowContractModal(false);
          setSelectedContract(null);
        }}
        title={`Contrato ${selectedContract?.id}`}
        size="xl"
      >
        {selectedContract && (
          <ContractDetail selectedContract={selectedContract} onClose={() => setShowContractModal(false)} onEdit={() => { setShowContractModal(false); openEditModal(selectedContract); }} />
        )}
      </Modal>

      {/* New Contract Modal */}
      <Modal
        isOpen={showNewContractModal}
        onClose={() => {
          setShowNewContractModal(false);
          setErrors({});
        }}
        title="Nuevo Contrato"
        size="xl"
      >
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Información Básica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContract.cliente}
                  onChange={(e) => setNewContract({...newContract, cliente: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.cliente ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del cliente"
                />
                {errors.cliente && <p className="text-red-500 text-sm mt-1">{errors.cliente}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContract.servicio}
                  onChange={(e) => setNewContract({...newContract, servicio: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.servicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción del servicio"
                />
                {errors.servicio && <p className="text-red-500 text-sm mt-1">{errors.servicio}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Contrato
                </label>
                <select
                  value={newContract.tipo}
                  onChange={(e) => setNewContract({...newContract, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="Anual">Anual</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Por Proyecto">Por Proyecto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContract.responsable}
                  onChange={(e) => setNewContract({...newContract, responsable: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.responsable ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del responsable"
                />
                {errors.responsable && <p className="text-red-500 text-sm mt-1">{errors.responsable}</p>}
              </div>
            </div>
          </div>

          {/* Fechas y Duración */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Fechas y Duración
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newContract.fechaInicio}
                  onChange={(e) => setNewContract({...newContract, fechaInicio: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaInicio && <p className="text-red-500 text-sm mt-1">{errors.fechaInicio}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newContract.fechaFin}
                  onChange={(e) => setNewContract({...newContract, fechaFin: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.fechaFin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin}</p>}
              </div>
            </div>
          </div>

          {/* Información Financiera */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Información Financiera
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newContract.valor}
                  onChange={(e) => setNewContract({...newContract, valor: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.valor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Pagado
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newContract.pagado}
                  onChange={(e) => {
                    const pagado = parseFloat(e.target.value) || 0;
                    const valor = parseFloat(newContract.valor) || 0;
                    const saldo = valor - pagado;
                    setNewContract({
                      ...newContract, 
                      pagado: e.target.value,
                      saldo: saldo.toFixed(2)
                    });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors.pagado ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.pagado && <p className="text-red-500 text-sm mt-1">{errors.pagado}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saldo
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newContract.saldo}
                  onChange={(e) => {
                    const saldo = parseFloat(e.target.value) || 0;
                    const valor = parseFloat(newContract.valor) || 0;
                    const pagado = valor - saldo;
                    setNewContract({
                      ...newContract, 
                      saldo: e.target.value,
                      pagado: pagado >= 0 ? pagado.toFixed(2) : '0.00'
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={newContract.estado}
                  onChange={(e) => setNewContract({...newContract, estado: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Activo">Activo</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Información Adicional
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Estudiantes
                </label>
                <input
                  type="number"
                  min="0"
                  value={newContract.estudiantes}
                  onChange={(e) => setNewContract({...newContract, estudiantes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={newContract.observaciones}
                  onChange={(e) => setNewContract({...newContract, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </div>

          {/* Cláusulas del Contrato */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Cláusulas del Contrato
              </h4>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={addClausula}
              >
                Agregar Cláusula
              </Button>
            </div>
            
            <div className="space-y-3">
              {newContract.clausulas.map((clausula, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={clausula}
                      onChange={(e) => updateClausula(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder={`Cláusula ${index + 1}`}
                    />
                  </div>
                  {newContract.clausulas.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => removeClausula(index)}
                      className="text-red-600 hover:bg-red-50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowNewContractModal(false);
              setErrors({});
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSubmitNewContract}
          >
            Guardar Contrato
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Contract Modal */}
      <Modal
        isOpen={showEditContractModal}
        onClose={() => {
          setShowEditContractModal(false);
          setEditErrors({});
          setEditingContract(null);
        }}
        title={`Editar Contrato ${editingContract?.id}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Información Básica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editContract.cliente}
                  onChange={(e) => setEditContract({...editContract, cliente: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.cliente ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del cliente"
                />
                {editErrors.cliente && <p className="text-red-500 text-sm mt-1">{editErrors.cliente}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editContract.servicio}
                  onChange={(e) => setEditContract({...editContract, servicio: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.servicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción del servicio"
                />
                {editErrors.servicio && <p className="text-red-500 text-sm mt-1">{editErrors.servicio}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Contrato
                </label>
                <select
                  value={editContract.tipo}
                  onChange={(e) => setEditContract({...editContract, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="Anual">Anual</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Por Proyecto">Por Proyecto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editContract.responsable}
                  onChange={(e) => setEditContract({...editContract, responsable: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.responsable ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del responsable"
                />
                {editErrors.responsable && <p className="text-red-500 text-sm mt-1">{editErrors.responsable}</p>}
              </div>
            </div>
          </div>

          {/* Fechas y Duración */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Fechas y Duración
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editContract.fechaInicio}
                  onChange={(e) => setEditContract({...editContract, fechaInicio: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {editErrors.fechaInicio && <p className="text-red-500 text-sm mt-1">{editErrors.fechaInicio}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editContract.fechaFin}
                  onChange={(e) => setEditContract({...editContract, fechaFin: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.fechaFin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {editErrors.fechaFin && <p className="text-red-500 text-sm mt-1">{editErrors.fechaFin}</p>}
              </div>
            </div>
          </div>

          {/* Información Financiera */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Información Financiera
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editContract.valor}
                  onChange={(e) => setEditContract({...editContract, valor: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.valor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {editErrors.valor && <p className="text-red-500 text-sm mt-1">{editErrors.valor}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Pagado
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editContract.pagado}
                  onChange={(e) => {
                    const pagado = parseFloat(e.target.value) || 0;
                    const valor = parseFloat(editContract.valor) || 0;
                    const saldo = valor - pagado;
                    setEditContract({
                      ...editContract, 
                      pagado: e.target.value,
                      saldo: saldo.toFixed(2)
                    });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    editErrors.pagado ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {editErrors.pagado && <p className="text-red-500 text-sm mt-1">{editErrors.pagado}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saldo
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editContract.saldo}
                  onChange={(e) => {
                    const saldo = parseFloat(e.target.value) || 0;
                    const valor = parseFloat(editContract.valor) || 0;
                    const pagado = valor - saldo;
                    setEditContract({
                      ...editContract, 
                      saldo: e.target.value,
                      pagado: pagado >= 0 ? pagado.toFixed(2) : '0.00'
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={editContract.estado}
                  onChange={(e) => setEditContract({...editContract, estado: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Activo">Activo</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Información Adicional
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Estudiantes
                </label>
                <input
                  type="number"
                  min="0"
                  value={editContract.estudiantes}
                  onChange={(e) => setEditContract({...editContract, estudiantes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={editContract.observaciones}
                  onChange={(e) => setEditContract({...editContract, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </div>

          {/* Cláusulas del Contrato */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Cláusulas del Contrato
              </h4>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={addEditClausula}
              >
                Agregar Cláusula
              </Button>
            </div>
            
            <div className="space-y-3">
              {editContract.clausulas.map((clausula, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={clausula}
                      onChange={(e) => updateEditClausula(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder={`Cláusula ${index + 1}`}
                    />
                  </div>
                  {editContract.clausulas.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => removeEditClausula(index)}
                      className="text-red-600 hover:bg-red-50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowEditContractModal(false);
              setEditErrors({});
              setEditingContract(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSaveEdit}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contratos;