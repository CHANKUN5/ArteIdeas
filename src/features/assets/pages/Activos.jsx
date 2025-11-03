import { DollarSign, Edit, Eye, HardDrive, Plus, Search, Trash2, Wrench, X } from 'lucide-react';
import React, { useState } from 'react';
import Button from '@components/ui/Button/Button.jsx';
import Card from '@components/ui/Card/Card.jsx';
import Modal from '@components/ui/Modal/Modal.jsx';
import ActivoForm from '@features/assets/components/ActivoForm.jsx';
import FinanciamientoForm from '@features/assets/components/FinanciamientoForm.jsx';
import MantenimientoForm from '@features/assets/components/MantenimientoForm.jsx';

const Activos = () => {
  const [activeTab, setActiveTab] = useState('activos');
  const [repuestos, setRepuestos] = useState([
    {
      id: 1,
      codigo: 'REP-001',
      nombre: 'Tóner Negro',
      categoria: 'Insumos Impresora',
      stock: 15,
      stockMinimo: 5,
      costoUnitario: 120.00,
      proveedor: 'Insumos Gráficos SAC',
      ubicacion: 'Almacén A',
    },
    {
      id: 2,
      codigo: 'REP-002',
      nombre: 'Rodillo de Goma',
      categoria: 'Repuestos Impresora',
      stock: 8,
      stockMinimo: 3,
      costoUnitario: 85.50,
      proveedor: 'TecnoParts',
      ubicacion: 'Almacén B',
    },
    {
      id: 3,
      codigo: 'REP-003',
      nombre: 'Fusor',
      categoria: 'Repuestos Impresora',
      stock: 3,
      stockMinimo: 2,
      costoUnitario: 320.00,
      proveedor: 'TecnoParts',
      ubicacion: 'Almacén A',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const [activos, setActivos] = useState([
    {
      id: 1,
      nombre: 'Impresora Canon PIXMA G3110',
      categoria: 'Impresora',
      proveedor: 'Canon Perú',
      fechaCompra: '2024-01-15',
      costoTotal: 450.00,
      tipoPago: 'Contado',
      vidaUtil: 60,
      depreciacion: 7.50,
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Cámara Canon EOS R6 Mark II',
      categoria: 'Equipo_oficina',
      proveedor: 'Canon Perú',
      fechaCompra: '2024-02-20',
      costoTotal: 8500.00,
      tipoPago: 'Financiado',
      vidaUtil: 84,
      depreciacion: 101.19,
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Máquina de Enmarcado Manual',
      categoria: 'Maquinaria',
      proveedor: 'Equipos Fotográficos SAC',
      fechaCompra: '2023-11-10',
      costoTotal: 3200.00,
      tipoPago: 'Contado',
      vidaUtil: 120,
      depreciacion: 26.67,
      estado: 'Mantenimiento'
    },
    {
      id: 4,
      nombre: 'Cortadora de Vidrio Automática',
      categoria: 'Maquinaria',
      proveedor: 'Vidrios del Norte',
      fechaCompra: '2024-03-10',
      costoTotal: 12000.00,
      tipoPago: 'Leasing',
      vidaUtil: 120,
      depreciacion: 100.00,
      estado: 'Activo'
    },
    {
      id: 5,
      nombre: 'Laptop Dell Inspiron 15',
      categoria: 'Equipo_oficina',
      proveedor: 'Dell Perú',
      fechaCompra: '2024-01-25',
      costoTotal: 2800.00,
      tipoPago: 'Financiado',
      vidaUtil: 36,
      depreciacion: 77.78,
      estado: 'Activo'
    },
    {
      id: 6,
      nombre: 'Herramienta de Enmarcado',
      categoria: 'Herramienta',
      proveedor: 'Herramientas Pro',
      fechaCompra: '2023-12-05',
      costoTotal: 150.00,
      tipoPago: 'Contado',
      vidaUtil: 60,
      depreciacion: 2.50,
      estado: 'Mantenimiento'
    },
    {
      id: 7,
      nombre: 'Impresora Epson EcoTank L3150',
      categoria: 'Impresora',
      proveedor: 'Epson Perú',
      fechaCompra: '2024-04-15',
      costoTotal: 650.00,
      tipoPago: 'Contado',
      vidaUtil: 60,
      depreciacion: 10.83,
      estado: 'Activo'
    },
    {
      id: 8,
      nombre: 'Mesa de Trabajo Ajustable',
      categoria: 'Equipo_oficina',
      proveedor: 'Muebles Office',
      fechaCompra: '2023-09-20',
      costoTotal: 800.00,
      tipoPago: 'Financiado',
      vidaUtil: 120,
      depreciacion: 6.67,
      estado: 'Activo'
    },
    {
      id: 9,
      nombre: 'Taladro Eléctrico Bosch',
      categoria: 'Herramienta',
      proveedor: 'Bosch Perú',
      fechaCompra: '2024-02-28',
      costoTotal: 320.00,
      tipoPago: 'Contado',
      vidaUtil: 48,
      depreciacion: 6.67,
      estado: 'Inactivo'
    },
    {
      id: 10,
      nombre: 'Escáner Canon CanoScan 9000F',
      categoria: 'Equipo_oficina',
      proveedor: 'Canon Perú',
      fechaCompra: '2024-05-10',
      costoTotal: 480.00,
      tipoPago: 'Leasing',
      vidaUtil: 60,
      depreciacion: 8.00,
      estado: 'Activo'
    }
  ]);

  const [financiamientos, setFinanciamientos] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [financiamientoData, setFinanciamientoData] = useState({});
  const [mantenimientoData, setMantenimientoData] = useState({});

  const [showActivoModal, setShowActivoModal] = useState(false);
  const [showFinanciamientoModal, setShowFinanciamientoModal] = useState(false);
  const [showMantenimientoModal, setShowMantenimientoModal] = useState(false);
  const [showActivoForm, setShowActivoForm] = useState(false);
  const [showFinanciamientoForm, setShowFinanciamientoForm] = useState(false);
  const [showMantenimientoForm, setShowMantenimientoForm] = useState(false);
  const [showRepuestoForm, setShowRepuestoForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [selectedFinanciamiento, setSelectedFinanciamiento] = useState(null);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [selectedActivoForDetails, setSelectedActivoForDetails] = useState(null);

  const categoriaColors = {
    'Impresora': 'bg-blue-100 text-blue-800',
    'Maquinaria': 'bg-purple-100 text-purple-800',
    'Herramienta': 'bg-green-100 text-green-800',
    'Equipo_oficina': 'bg-orange-100 text-orange-800'
  };

  const estadoColors = {
    'Activo': 'bg-green-100 text-green-800',
    'Mantenimiento': 'bg-yellow-100 text-yellow-800',
    'Inactivo': 'bg-red-100 text-red-800',
    'Pagado': 'bg-green-100 text-green-800',
    'Mora': 'bg-red-100 text-red-800',
    'Programado': 'bg-blue-100 text-blue-800',
    'Completado': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800'
  };

  const tipoPagoColors = {
    'Contado': 'bg-green-100 text-green-800',
    'Financiado': 'bg-blue-100 text-blue-800',
    'Leasing': 'bg-purple-100 text-purple-800'
  };

  const tipoMantenimientoColors = {
    'Preventivo': 'bg-blue-100 text-blue-800',
    'Correctivo': 'bg-orange-100 text-orange-800'
  };

  const getActivoNombre = (activoId) => {
    const activo = activos.find(a => a.id === activoId);
    return activo ? activo.nombre : 'Activo no encontrado';
  };

  const filteredActivos = activos.filter(activo => 
    activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activo.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivosFinanciados = () => {
    return activos.filter(activo => 
      activo.tipoPago === 'Financiado' || activo.tipoPago === 'Leasing'
    ).map(activo => {
      const customData = financiamientoData[activo.id];
      return {
        codigo: activo.id,
        activoId: activo.id,
        entidad: customData?.entidad || (activo.tipoPago === 'Financiado' ? 'Banco de Crédito' : 'Leasing Total'),
        montoFinanciado: customData?.montoFinanciado || activo.costoTotal,
        cuotasTotales: customData?.cuotasTotales || (activo.tipoPago === 'Financiado' ? 24 : 36),
        cuotaMensual: customData?.cuotaMensual || (activo.costoTotal / (activo.tipoPago === 'Financiado' ? 24 : 36)),
        fechaInicio: customData?.fechaInicio || activo.fechaCompra,
        fechaFin: customData?.fechaFin || new Date(new Date(activo.fechaCompra).getTime() + (activo.tipoPago === 'Financiado' ? 24 : 36) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cuotasPagadas: customData?.cuotasPagadas || Math.floor(Math.random() * (activo.tipoPago === 'Financiado' ? 24 : 36)),
        estado: customData?.estado || 'Activo',
        historialPagos: customData?.historialPagos || [
          '2024-02-15: Pago inicial - S/ 425.00',
          '2024-03-15: Cuota mensual - S/ 425.00',
          '2024-04-15: Cuota mensual - S/ 425.00'
        ],
        totalPagado: customData?.historialPagos?.reduce((total, pago) => {
          const monto = parseFloat(pago.split('-')[1]?.replace('S/', '').trim()) || 0;
          return total + monto;
        }, 0) || 0
      };
    });
  };

  const getActivosEnMantenimiento = () => {
    return activos.filter(activo => activo.estado === 'Mantenimiento')
    .map(activo => {
      const customData = mantenimientoData[activo.id];
      return {
        codigo: activo.id,
        activoId: activo.id,
        tipo: customData?.tipo || 'Preventivo',
        fechaMantenimiento: customData?.fechaMantenimiento || new Date().toISOString().split('T')[0],
        costo: customData?.costo || Math.floor(Math.random() * 200) + 50,
        proveedor: customData?.proveedor || 'Servicio Técnico Especializado',
        descripcion: customData?.descripcion || `Mantenimiento preventivo de ${activo.nombre}`,
        proximoMantenimiento: customData?.proximoMantenimiento || new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: customData?.estado || 'Programado',
        repuestosInsumos: customData?.repuestosInsumos || []
      };
    });
  };

  const filteredFinanciamientos = getActivosFinanciados().filter(fin => {
    const activo = activos.find(a => a.id === fin.activoId);
    const matchesSearch = fin.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activo?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fin.estado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivo = !selectedActivoForDetails || fin.activoId === selectedActivoForDetails.id;
    return matchesSearch && matchesActivo;
  });

  const filteredMantenimientos = getActivosEnMantenimiento().filter(mant => {
    const activo = activos.find(a => a.id === mant.activoId);
    const matchesSearch = mant.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mant.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activo?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mant.estado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivo = !selectedActivoForDetails || mant.activoId === selectedActivoForDetails.id;
    return matchesSearch && matchesActivo;
  });

  const filteredRepuestos = repuestos.filter(repuesto => 
    repuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFinanciamientosByActivo = (activoId) => {
    return getActivosFinanciados().filter(fin => fin.activoId === activoId);
  };

  const getMantenimientosByActivo = (activoId) => {
    return getActivosEnMantenimiento().filter(mant => mant.activoId === activoId);
  };

  const handleDelete = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete && deleteType) {
      if (deleteType === 'activo') {
        setActivos(activos.filter(activo => activo.id !== itemToDelete.id));
      } else if (deleteType === 'financiamiento') {
        setActivos(activos.map(activo => 
          activo.id === itemToDelete.activoId 
            ? { ...activo, tipoPago: 'Contado' }
            : activo
        ));
      } else if (deleteType === 'mantenimiento') {
        setActivos(activos.map(activo => 
          activo.id === itemToDelete.activoId 
            ? { ...activo, estado: 'Activo' }
            : activo
        ));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const handleCreateActivo = (activoData) => {
    const newActivo = {
      ...activoData,
      id: Math.max(...activos.map(a => a.id), 0) + 1,
      costoTotal: parseFloat(activoData.costoTotal),
      vidaUtil: parseInt(activoData.vidaUtil),
      depreciacion: parseFloat(activoData.depreciacion)
    };
    setActivos([...activos, newActivo]);
    setShowActivoForm(false);
  };

  const handleEditActivo = (activoData) => {
    setActivos(activos.map(activo => 
      activo.id === selectedActivo.id 
        ? { 
            ...activo, 
            ...activoData,
            costoTotal: parseFloat(activoData.costoTotal),
            vidaUtil: parseInt(activoData.vidaUtil),
            depreciacion: parseFloat(activoData.depreciacion)
          }
        : activo
    ));
    setSelectedActivo(null);
    setShowActivoForm(false);
  };

  const handleCreateFinanciamiento = (financiamientoData) => {
    const activoId = financiamientoData.activoId;
    
    setFinanciamientoData(prev => ({
      ...prev,
      [activoId]: {
        entidad: financiamientoData.entidad,
        montoFinanciado: financiamientoData.montoFinanciado,
        cuotasTotales: financiamientoData.cuotasTotales,
        cuotaMensual: financiamientoData.cuotaMensual,
        fechaInicio: financiamientoData.fechaInicio,
        fechaFin: financiamientoData.fechaFin,
        cuotasPagadas: 0,
        estado: financiamientoData.estado || 'Activo',
        historialPagos: []
      }
    }));

    setActivos(activos.map(activo => 
      activo.id === activoId 
        ? { 
            ...activo, 
            tipoPago: financiamientoData.tipoPago,
            costoTotal: financiamientoData.montoFinanciado
          }
        : activo
    ));
    
    setShowFinanciamientoForm(false);
    setSelectedFinanciamiento(null);
  };

  const handleEditFinanciamiento = (financiamientoData) => {
    const activoId = selectedFinanciamiento.activoId;
    
    setFinanciamientoData(prev => ({
      ...prev,
      [activoId]: {
        ...prev[activoId],
        entidad: financiamientoData.entidad,
        montoFinanciado: financiamientoData.montoFinanciado,
        cuotasTotales: financiamientoData.cuotasTotales,
        cuotaMensual: financiamientoData.cuotaMensual,
        fechaInicio: financiamientoData.fechaInicio,
        fechaFin: financiamientoData.fechaFin,
        estado: financiamientoData.estado,
        historialPagos: financiamientoData.historialPagos || []
      }
    }));

    setActivos(activos.map(activo => 
      activo.id === activoId 
        ? { 
            ...activo, 
            tipoPago: financiamientoData.tipoPago,
            costoTotal: financiamientoData.montoFinanciado
          }
        : activo
    ));
    
    setShowFinanciamientoForm(false);
    setSelectedFinanciamiento(null);
  };

  const handleCreateMantenimiento = (mantenimientoData) => {
    const activoId = mantenimientoData.activoId;
    
    setMantenimientoData(prev => ({
      ...prev,
      [activoId]: {
        tipo: mantenimientoData.tipo,
        fechaMantenimiento: mantenimientoData.fechaMantenimiento,
        costo: mantenimientoData.costo,
        proveedor: mantenimientoData.proveedor,
        descripcion: mantenimientoData.descripcion,
        proximoMantenimiento: mantenimientoData.proximoMantenimiento,
        estado: mantenimientoData.estadoMantenimiento,
        repuestosInsumos: mantenimientoData.repuestosInsumos || []
      }
    }));

    setActivos(activos.map(activo => 
      activo.id === activoId 
        ? { 
            ...activo, 
            estado: mantenimientoData.estado
          }
        : activo
    ));
    
    setShowMantenimientoForm(false);
    setSelectedMantenimiento(null);
  };

  const handleEditMantenimiento = (mantenimientoData) => {
    const activoId = selectedMantenimiento.activoId;
    
    setMantenimientoData(prev => ({
      ...prev,
      [activoId]: {
        ...prev[activoId],
        tipo: mantenimientoData.tipo,
        fechaMantenimiento: mantenimientoData.fechaMantenimiento,
        costo: mantenimientoData.costo,
        proveedor: mantenimientoData.proveedor,
        descripcion: mantenimientoData.descripcion,
        proximoMantenimiento: mantenimientoData.proximoMantenimiento,
        estado: mantenimientoData.estadoMantenimiento,
        repuestosInsumos: mantenimientoData.repuestosInsumos || []
      }
    }));

    setActivos(activos.map(activo => 
      activo.id === activoId 
        ? { 
            ...activo, 
            estado: mantenimientoData.estado
          }
        : activo
    ));
    
    setShowMantenimientoForm(false);
    setSelectedMantenimiento(null);
  };

  const handleSaveRepuesto = (repuestoData) => {
    if (selectedRepuesto) {
      setRepuestos(repuestos.map(repuesto => 
        repuesto.id === selectedRepuesto.id 
          ? { ...repuestoData, id: repuesto.id }
          : repuesto
      ));
    } else {
      const newRepuesto = {
        ...repuestoData,
        id: Math.max(...repuestos.map(r => r.id), 0) + 1,
      };
      setRepuestos([...repuestos, newRepuesto]);
    }
    setShowRepuestoForm(false);
    setSelectedRepuesto(null);
  };

  const handleDeleteRepuesto = (id) => {
    setRepuestos(repuestos.filter(repuesto => repuesto.id !== id));
  };

  return (
    <div className="responsive-mobile">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activos</h1>
            <p className="text-sm text-gray-500">Gestiona tu inventario de activos</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('activos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'activos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => {
              setActiveTab('financiamientos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'financiamientos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Financiamientos
          </button>
          <button
            onClick={() => {
              setActiveTab('mantenimientos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'mantenimientos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mantenimientos
          </button>
          <button
            onClick={() => {
              setActiveTab('repuestos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'repuestos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Repuestos
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        {selectedActivoForDetails && (activeTab === 'financiamientos' || activeTab === 'mantenimientos') && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Filtrando por: <span className="font-semibold">{selectedActivoForDetails.nombre}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedActivoForDetails(null)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Limpiar filtro
              </button>
            </div>
          </div>
        )}
      </div>

      <Card className="border border-primary/10">
        {activeTab === 'activos' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Listado de Activos</h3>
              <Button 
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowActivoForm(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Nuevo Activo
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-primary/10">
                    <th className="text-left py-3 px-3 font-medium text-gray-800">ID</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Nombre</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Categoría</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Proveedor</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Costo Total</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Tipo Pago</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Estado</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivos.map((activo, idx) => (
                    <tr key={activo.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                      <td className="py-3 px-3 text-sm font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{activo.id}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{activo.nombre}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoriaColors[activo.categoria]}`}>
                          {activo.categoria.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{activo.proveedor}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {activo.costoTotal.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tipoPagoColors[activo.tipoPago]}`}>
                          {activo.tipoPago}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[activo.estado]}`}>
                          {activo.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedActivo(activo);
                              setShowActivoModal(true);
                            }}
                            className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedActivo(activo);
                              setShowActivoForm(true);
                            }}
                            className="p-1 hover:bg-secondary/10 rounded text-secondary hover:text-secondary"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(activo, 'activo')}
                            className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'financiamientos' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Listado de Financiamientos</h3>
              <Button 
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setSelectedFinanciamiento(null);
                  setShowFinanciamientoForm(true);
                }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Nuevo Financiamiento
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-primary/10">
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Código</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Activo</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Entidad</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Monto Financiado</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Cuota Mensual</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Cuotas Pagadas</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Próximo Pago</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Estado</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFinanciamientos.map((fin, idx) => (
                    <tr key={fin.codigo} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                      <td className="py-3 px-3 text-sm font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{fin.codigo}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{getActivoNombre(fin.activoId)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{fin.entidad}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {fin.montoFinanciado.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {fin.cuotaMensual.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{fin.cuotasPagadas} / {fin.cuotasTotales}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{new Date(new Date(fin.fechaInicio).getTime() + (fin.cuotasPagadas * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[fin.estado]}`}>
                          {fin.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedFinanciamiento(fin);
                              setShowFinanciamientoModal(true);
                            }}
                            className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFinanciamiento(fin);
                              setShowFinanciamientoForm(true);
                            }}
                            className="p-1 hover:bg-secondary/10 rounded text-secondary hover:text-secondary"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fin, 'financiamiento')}
                            className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'mantenimientos' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Listado de Mantenimientos</h3>
              <Button 
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setSelectedMantenimiento(null);
                  setShowMantenimientoForm(true);
                }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Nuevo Mantenimiento
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-primary/10">
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Código</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Activo</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Tipo</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Fecha</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Costo</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Proveedor</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Estado</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMantenimientos.map((mant, idx) => (
                    <tr key={mant.codigo} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                      <td className="py-3 px-3 text-sm font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{mant.codigo}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{getActivoNombre(mant.activoId)}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tipoMantenimientoColors[mant.tipo]}`}>
                          {mant.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700">{mant.fechaMantenimiento}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {mant.costo.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{mant.proveedor}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[mant.estado]}`}>
                          {mant.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMantenimiento(mant);
                              setShowMantenimientoModal(true);
                            }}
                            className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMantenimiento(mant);
                              setShowMantenimientoForm(true);
                            }}
                            className="p-1 hover:bg-secondary/10 rounded text-secondary hover:text-secondary"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(mant, 'mantenimiento')}
                            className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'repuestos' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Listado de Repuestos</h3>
              <Button 
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setSelectedRepuesto(null);
                  setShowRepuestoForm(true);
                }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Nuevo Repuesto
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-primary/10">
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Código</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Nombre</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Categoría</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Stock</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Mínimo</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Costo Unitario</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Proveedor</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Ubicación</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepuestos.map((repuesto, idx) => (
                    <tr key={repuesto.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                      <td className="py-3 px-3 text-sm font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{repuesto.codigo}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{repuesto.nombre}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{repuesto.categoria}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{repuesto.stock}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{repuesto.stockMinimo}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {repuesto.costoUnitario.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700 break-words">{repuesto.proveedor}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{repuesto.ubicacion}</td>
                      <td className="py-3 px-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRepuesto(repuesto);
                              setShowRepuestoForm(true);
                            }}
                            className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRepuesto(repuesto);
                              setShowRepuestoForm(true);
                            }}
                            className="p-1 hover:bg-secondary/10 rounded text-secondary hover:text-secondary"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRepuesto(repuesto.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={showActivoModal}
        onClose={() => {
          setShowActivoModal(false);
          setSelectedActivo(null);
        }}
        title={selectedActivo?.nombre}
        size="xl"
      >
        {selectedActivo && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <HardDrive className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedActivo.nombre}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoriaColors[selectedActivo.categoria]}`}>
                  {selectedActivo.categoria.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <p className="text-gray-900">{selectedActivo.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Compra</label>
                <p className="text-gray-900">{selectedActivo.fechaCompra}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <p className="text-gray-900">{selectedActivo.proveedor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo Total</label>
                <p className="text-gray-900">S/ {selectedActivo.costoTotal.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tipoPagoColors[selectedActivo.tipoPago]}`}>
                  {selectedActivo.tipoPago}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[selectedActivo.estado]}`}>
                  {selectedActivo.estado}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vida Útil (meses)</label>
                <p className="text-gray-900">{selectedActivo.vidaUtil}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Depreciación Mensual</label>
                <p className="text-gray-900">S/ {selectedActivo.depreciacion.toFixed(2)}</p>
              </div>
            </div>

            {getFinanciamientosByActivo(selectedActivo.id).length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Financiamientos Relacionados
                </h4>
                <div className="space-y-2">
                  {getFinanciamientosByActivo(selectedActivo.id).map((fin) => (
                    <div key={fin.codigo} className="p-3 bg-white rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{fin.entidad}</p>
                          <p className="text-sm text-gray-600">S/ {fin.montoFinanciado.toFixed(2)} - Cuota: S/ {fin.cuotaMensual.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{fin.cuotasPagadas} / {fin.cuotasTotales} cuotas</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[fin.estado]}`}>
                          {fin.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {getMantenimientosByActivo(selectedActivo.id).length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-yellow-600" />
                  Mantenimientos Relacionados
                </h4>
                <div className="space-y-2">
                  {getMantenimientosByActivo(selectedActivo.id).map((mant) => (
                    <div key={mant.codigo} className="p-3 bg-white rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{mant.tipo}</p>
                          <p className="text-sm text-gray-600">{mant.descripcion}</p>
                          <p className="text-sm text-gray-500">{mant.fechaMantenimiento} - S/ {mant.costo.toFixed(2)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[mant.estado]}`}>
                          {mant.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Modal.Footer>
              <Button 
                variant="outline" 
                onClick={() => setShowActivoModal(false)}
              >
                Cerrar
              </Button>
              <Button 
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
                onClick={() => {
                  setShowActivoModal(false);
                  setShowActivoForm(true);
                }}
              >
                Editar
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showFinanciamientoModal}
        onClose={() => {
          setShowFinanciamientoModal(false);
          setSelectedFinanciamiento(null);
        }}
        title="Detalles del Financiamiento"
        size="lg"
      >
        {selectedFinanciamiento && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedFinanciamiento.entidad}</h3>
                <p className="text-gray-600">{getActivoNombre(selectedFinanciamiento.activoId)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <p className="text-gray-900">{selectedFinanciamiento.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Financiado</label>
                <p className="text-gray-900">S/ {selectedFinanciamiento.montoFinanciado.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuota Mensual</label>
                <p className="text-gray-900">S/ {selectedFinanciamiento.cuotaMensual.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas Totales</label>
                <p className="text-gray-900">{selectedFinanciamiento.cuotasTotales}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas Pagadas</label>
                <p className="text-gray-900">{selectedFinanciamiento.cuotasPagadas}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[selectedFinanciamiento.estado]}`}>
                  {selectedFinanciamiento.estado}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <p className="text-gray-900">{selectedFinanciamiento.fechaInicio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <p className="text-gray-900">{selectedFinanciamiento.fechaFin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Próximo Pago</label>
                <p className="text-gray-900">{new Date(new Date(selectedFinanciamiento.fechaInicio).getTime() + (selectedFinanciamiento.cuotasPagadas * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</p>
              </div>
            </div>

            {selectedFinanciamiento.historialPagos && selectedFinanciamiento.historialPagos.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Historial de Pagos
                </h4>
                <div className="space-y-2">
                  {selectedFinanciamiento.historialPagos.map((pago, index) => {
                    const parts = pago.split('-');
                    const fechaDescripcion = parts[0]?.trim() || '';
                    const monto = parts[1]?.trim() || '';
                    const [fecha, descripcion] = fechaDescripcion.split(':');
                    
                    return (
                      <div key={index} className="p-3 bg-white rounded border border-gray-200 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {fecha?.trim() || 'Sin fecha'}
                              </span>
                              <span className="text-sm text-gray-900">
                                {descripcion?.trim() || 'Pago registrado'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-green-600">
                              {monto || 'S/ 0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedFinanciamiento.totalPagado > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Pagado:</span>
                      <span className="text-lg font-bold text-green-600">
                        S/ {selectedFinanciamiento.totalPagado.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Saldo Pendiente:</span>
                      <span className={`font-semibold ${(selectedFinanciamiento.montoFinanciado - selectedFinanciamiento.totalPagado) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        S/ {(selectedFinanciamiento.montoFinanciado - selectedFinanciamiento.totalPagado).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Modal.Footer>
              <Button 
                variant="outline" 
                onClick={() => setShowFinanciamientoModal(false)}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showMantenimientoModal}
        onClose={() => {
          setShowMantenimientoModal(false);
          setSelectedMantenimiento(null);
        }}
        title="Detalles del Mantenimiento"
        size="lg"
      >
        {selectedMantenimiento && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Wrench className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedMantenimiento.tipo}</h3>
                <p className="text-gray-600">{getActivoNombre(selectedMantenimiento.activoId)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <p className="text-gray-900">{selectedMantenimiento.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tipoMantenimientoColors[selectedMantenimiento.tipo]}`}>
                  {selectedMantenimiento.tipo}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <p className="text-gray-900">{selectedMantenimiento.fechaMantenimiento}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                <p className="text-gray-900">S/ {selectedMantenimiento.costo.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <p className="text-gray-900">{selectedMantenimiento.proveedor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[selectedMantenimiento.estado]}`}>
                  {selectedMantenimiento.estado}
                </span>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <p className="text-gray-900">{selectedMantenimiento.descripcion}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Próximo Mantenimiento</label>
                <p className="text-gray-900">{selectedMantenimiento.proximoMantenimiento}</p>
              </div>
            </div>

            {selectedMantenimiento.repuestosInsumos && selectedMantenimiento.repuestosInsumos.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Repuestos/Insumos Asociados</h4>
                <div className="space-y-2">
                  {selectedMantenimiento.repuestosInsumos.map((insumo, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-sm">
                      {insumo}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Modal.Footer>
              <Button 
                variant="outline" 
                onClick={() => setShowMantenimientoModal(false)}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showActivoForm}
        onClose={() => {
          setShowActivoForm(false);
          setSelectedActivo(null);
        }}
        title={selectedActivo ? 'Editar Activo' : 'Nuevo Activo'}
        size="xl"
      >
        <ActivoForm
          activo={selectedActivo}
          onSubmit={selectedActivo ? handleEditActivo : handleCreateActivo}
          onCancel={() => {
            setShowActivoForm(false);
            setSelectedActivo(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showFinanciamientoForm}
        onClose={() => {
          setShowFinanciamientoForm(false);
          setSelectedFinanciamiento(null);
        }}
        title={selectedFinanciamiento ? 'Editar Financiamiento' : 'Nuevo Financiamiento'}
        size="xl"
      >
        <FinanciamientoForm
          financiamiento={selectedFinanciamiento}
          activos={activos}
          onSubmit={selectedFinanciamiento ? handleEditFinanciamiento : handleCreateFinanciamiento}
          onCancel={() => {
            setShowFinanciamientoForm(false);
            setSelectedFinanciamiento(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showMantenimientoForm}
        onClose={() => {
          setShowMantenimientoForm(false);
          setSelectedMantenimiento(null);
        }}
        title={selectedMantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
        size="xl"
      >
        <MantenimientoForm
          mantenimiento={selectedMantenimiento}
          activos={activos}
          repuestos={repuestos}
          onSubmit={selectedMantenimiento ? handleEditMantenimiento : handleCreateMantenimiento}
          onCancel={() => {
            setShowMantenimientoForm(false);
            setSelectedMantenimiento(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRepuestoForm}
        onClose={() => {
          setShowRepuestoForm(false);
          setSelectedRepuesto(null);
        }}
        title={selectedRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
        size="xl"
      >
        <ActivoForm
          mode="repuesto"
          repuesto={selectedRepuesto}
          onSubmit={handleSaveRepuesto}
          onCancel={() => {
            setShowRepuestoForm(false);
            setSelectedRepuesto(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
          setDeleteType('');
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
                ¿Estás seguro de eliminar este {deleteType}?
              </h3>
              <p className="text-sm text-gray-500">
                {deleteType === 'activo' && 'El activo será eliminado permanentemente.'}
                {deleteType === 'financiamiento' && 'El financiamiento será eliminado y el activo cambiará a pago de contado.'}
                {deleteType === 'mantenimiento' && 'El mantenimiento será eliminado y el activo cambiará a estado activo.'}
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
                setDeleteType('');
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
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

    export default Activos;
