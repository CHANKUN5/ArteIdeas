import React, { useEffect, useMemo, useState } from 'react';
import {
  DollarSign,
  Search,
  Users,
  Zap,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import Card from '@components/ui/Card/Card.jsx';
import Button from '@components/ui/Button/Button.jsx';
import Modal from '@components/ui/Modal/Modal.jsx';
import GastosForm from '@features/expenses/components/GastosForm.jsx';

// Vista de Gastos Operativos
const Gastos = () => {
  // Estado de pestañas
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'servicios'

  // Buscar
  const [searchPersonal, setSearchPersonal] = useState('');
  const [searchServicios, setSearchServicios] = useState('');

  // Paginación
  const pageSize = 5;
  const [personalPage, setPersonalPage] = useState(1);
  const [serviciosPage, setServiciosPage] = useState(1);

  // Datos de ejemplo (puedes conectar a API más adelante)
  const [personal, setPersonal] = useState([
    { codigo: 'EMP001', nombre: 'María Pérez', cargo: 'Fotógrafa', salarioBase: 2200, bonificaciones: 200, descuentos: 50, fechaPago: '2025-01-30', estado: 'Pendiente' },
    { codigo: 'EMP002', nombre: 'Juan Torres', cargo: 'Diseñador', salarioBase: 2000, bonificaciones: 150, descuentos: 0, fechaPago: '-', estado: 'Pendiente' },
    { codigo: 'EMP003', nombre: 'Ana López', cargo: 'Administración', salarioBase: 1800, bonificaciones: 0, descuentos: 0, fechaPago: '2025-01-25', estado: 'Pagado' }
  ]);

  const [servicios, setServicios] = useState([
    { codigo: 'SRV001', tipo: 'Alquiler', proveedor: 'Inmobiliaria del Centro', monto: 2500, fechaVenc: '2025-02-01', fechaPago: '2025-01-28', estado: 'Pagado', periodo: 'Enero 2025' },
    { codigo: 'SRV002', tipo: 'Luz', proveedor: 'Luz del Sur', monto: 450, fechaVenc: '2025-02-10', fechaPago: '-', estado: 'Pendiente', periodo: 'Enero 2025' },
    { codigo: 'SRV003', tipo: 'Agua', proveedor: 'Sedapal', monto: 180, fechaVenc: '2025-02-08', fechaPago: '-', estado: 'Pendiente', periodo: 'Enero 2025' },
    { codigo: 'SRV004', tipo: 'Internet', proveedor: 'Movistar Empresas', monto: 350, fechaVenc: '2025-02-05', fechaPago: '-', estado: 'Pendiente', periodo: 'Enero 2025' },
    { codigo: 'SRV005', tipo: 'Teléfono', proveedor: 'Claro Empresas', monto: 220, fechaVenc: '2025-02-25', fechaPago: '-', estado: 'Vencido', periodo: 'Enero 2025' },
    { codigo: 'SRV006', tipo: 'Gas', proveedor: 'Lima Gas', monto: 120, fechaVenc: '2025-02-12', fechaPago: '-', estado: 'Pendiente', periodo: 'Enero 2025' }
  ]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editType, setEditType] = useState('personal'); // 'personal' | 'servicios'
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, item: null });

  // KPIs
  const nominaPendiente = useMemo(() => {
    return personal
      .filter(p => p.estado !== 'Pagado')
      .reduce((acc, p) => acc + (p.salarioBase + p.bonificaciones - p.descuentos), 0);
  }, [personal]);

  const serviciosPendientes = useMemo(() => {
    return servicios
      .filter(s => s.estado === 'Pendiente')
      .reduce((acc, s) => acc + s.monto, 0);
  }, [servicios]);

  const serviciosVencidos = useMemo(() => servicios.filter(s => s.estado === 'Vencido').length, [servicios]);

  // Filtrados
  const filteredPersonal = useMemo(() => {
    const term = searchPersonal.toLowerCase();
    return personal.filter(p =>
      p.codigo.toLowerCase().includes(term) ||
      p.nombre.toLowerCase().includes(term) ||
      p.cargo.toLowerCase().includes(term)
    );
  }, [personal, searchPersonal]);

  const filteredServicios = useMemo(() => {
    const term = searchServicios.toLowerCase();
    return servicios.filter(s =>
      s.codigo.toLowerCase().includes(term) ||
      s.tipo.toLowerCase().includes(term) ||
      s.proveedor.toLowerCase().includes(term)
    );
  }, [servicios, searchServicios]);

  // Reset de página al cambiar filtros/búsqueda
  useEffect(() => { setPersonalPage(1); }, [searchPersonal, personal]);
  useEffect(() => { setServiciosPage(1); }, [searchServicios, servicios]);

  // Slicing por página
  const totalPersonalPages = Math.max(1, Math.ceil(filteredPersonal.length / pageSize));
  const totalServiciosPages = Math.max(1, Math.ceil(filteredServicios.length / pageSize));
  const pagedPersonal = filteredPersonal.slice((personalPage - 1) * pageSize, personalPage * pageSize);
  const pagedServicios = filteredServicios.slice((serviciosPage - 1) * pageSize, serviciosPage * pageSize);

  // Manejo de formulario
  const handleCreate = (data) => {
    if (editType === 'personal') {
      setPersonal(prev => [...prev, data]);
    } else {
      setServicios(prev => [...prev, data]);
    }
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleEdit = (data) => {
    if (editType === 'personal') {
      setPersonal(prev => prev.map(p => (p.codigo === selectedItem.codigo ? data : p)));
    } else {
      setServicios(prev => prev.map(s => (s.codigo === selectedItem.codigo ? data : s)));
    }
    setShowModal(false);
    setSelectedItem(null);
  };

  const openNew = (type) => {
    setEditType(type);
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEdit = (type, item) => {
    setEditType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const askRemoveItem = (type, item) => {
    setDeleteTarget({ type, item });
    setShowDeleteModal(true);
  };

  const confirmRemove = () => {
    if (deleteTarget.type === 'personal') setPersonal(prev => prev.filter(p => p.codigo !== deleteTarget.item.codigo));
    if (deleteTarget.type === 'servicios') setServicios(prev => prev.filter(s => s.codigo !== deleteTarget.item.codigo));
    setShowDeleteModal(false);
    setDeleteTarget({ type: null, item: null });
  };

  return (
    <div className="responsive-mobile">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gastos Operativos</h1>
            <p className="text-sm text-gray-500">Gestiona  nómina, servicios y gastos del negocio</p>
          </div>
        </div>
      </div>

      {/* Cards superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 text-center flex flex-col items-center justify-center">
          <Users className="w-8 h-8 text-primary mb-2" />
          <p className="text-sm text-gray-500">Nómina Pendiente</p>
          <p className="text-2xl font-bold text-gray-900">S/ {nominaPendiente.toFixed(2)}</p>
        </Card>
        <Card className="p-5 text-center flex flex-col items-center justify-center">
          <Zap className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-sm text-gray-500">Servicios Pendientes</p>
          <p className="text-2xl font-bold text-gray-900">S/ {serviciosPendientes.toFixed(2)}</p>
        </Card>
        <Card className="p-5 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-500">Servicios Vencidos</p>
          <p className="text-2xl font-bold text-red-600">{serviciosVencidos}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="mb-4">
        <div className="flex items-center">
          <button
            className={`px-4 py-3 font-medium border-b-2 ${activeTab === 'personal' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </button>
          <button
            className={`px-4 py-3 font-medium border-b-2 ${activeTab === 'servicios' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
            onClick={() => setActiveTab('servicios')}
          >
            Servicios y Suministros
          </button>
        </div>
      </Card>

      {/* Contenido de pestañas */}
      {activeTab === 'personal' ? (
        <Card>
          {/* Buscador + botón */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchPersonal}
                onChange={(e) => setSearchPersonal(e.target.value)}
                placeholder="buscar servicio"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <Button
              icon={<Plus className="w-4 h-4" />}
              className="bg-primary text-white"
              onClick={() => openNew('personal')}
            >
              Agregar Empleado
            </Button>
          </div>

          {/* Tabla Personal */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-primary/10">
                  <th className="text-left py-3 px-3 font-medium text-gray-800">CODIGO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">NOMBRE COMPLETO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">CARGO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">SALARIO BASE</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">BONIFICACIONES</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">DESCUENTOS</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">SALARIO NETO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">FECHA DE PAGO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">ESTADO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {pagedPersonal.map((p, idx) => {
                  const neto = (p.salarioBase + p.bonificaciones - p.descuentos) || 0;
                  return (
                    <tr key={p.codigo} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                      <td className="py-3 px-3 text-sm text-gray-700">{p.codigo}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{p.nombre}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{p.cargo}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {p.salarioBase.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-lime-600 font-medium">S/ {p.bonificaciones.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-red-600 font-medium">S/ {p.descuentos.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">S/ {neto.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-gray-700">{p.fechaPago}</td>
                      <td className="py-3 px-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.estado === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex space-x-2">
                          <button className="p-1 hover:bg-primary/10 rounded text-primary" onClick={() => { setDetailType('personal'); setSelectedItem(p); setShowDetailModal(true); }}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-primary/10 rounded text-[#FF9912]" onClick={() => openEdit('personal', p)}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-red-100 rounded text-red-500" onClick={() => askRemoveItem('personal', p)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Controles de paginación - Personal */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Página {personalPage} de {totalPersonalPages}</p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setPersonalPage(p => Math.max(1, p - 1))} disabled={personalPage === 1}>Anterior</Button>
              <Button variant="outline" onClick={() => setPersonalPage(p => Math.min(totalPersonalPages, p + 1))} disabled={personalPage === totalPersonalPages}>Siguiente</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          {/* Buscador + botón */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchServicios}
                onChange={(e) => setSearchServicios(e.target.value)}
                placeholder="buscar servicio"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <Button
              icon={<Plus className="w-4 h-4" />}
              className="bg-primary text-white"
              onClick={() => openNew('servicios')}
            >
              Agregar Servicio
            </Button>
          </div>

          {/* Tabla Servicios */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-primary/10">
                  <th className="text-left py-3 px-3 font-medium text-gray-800">CODIGO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">TIPO DE SERVICIO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">PROVEEDOR</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">MONTO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">FECHA DE VENCIMIENTO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">FECHA DE PAGO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">ESTADO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">PERIODO</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {pagedServicios.map((s, idx) => (
                  <tr key={s.codigo} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                    <td className="py-3 px-3 text-sm text-gray-700">{s.codigo}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">{s.tipo}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">{s.proveedor}</td>
                    <td className="py-3 px-3 text-sm text-gray-900 font-semibold">S/ {s.monto.toFixed(2)}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">{s.fechaVenc}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">{s.fechaPago}</td>
                    <td className="py-3 px-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.estado === 'Pagado' ? 'bg-green-100 text-green-700' : s.estado === 'Vencido' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700">{s.periodo}</td>
                    <td className="py-3 px-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-primary/10 rounded text-primary" onClick={() => { setDetailType('servicios'); setSelectedItem(s); setShowDetailModal(true); }}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-primary/10 rounded text-[#FF9912]" onClick={() => openEdit('servicios', s)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded text-red-500" onClick={() => askRemoveItem('servicios', s)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Controles de paginación - Servicios */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Página {serviciosPage} de {totalServiciosPages}</p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setServiciosPage(p => Math.max(1, p - 1))} disabled={serviciosPage === 1}>Anterior</Button>
              <Button variant="outline" onClick={() => setServiciosPage(p => Math.min(totalServiciosPages, p + 1))} disabled={serviciosPage === totalServiciosPages}>Siguiente</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedItem(null); }}
        title={selectedItem ? (editType === 'personal' ? 'Editar Empleado' : 'Editar Servicio') : (editType === 'personal' ? 'Agregar Empleado' : 'Agregar Servicio')}
        size="xl"
      >
        <GastosForm
          type={editType}
          data={selectedItem}
          onCancel={() => { setShowModal(false); setSelectedItem(null); }}
          onSubmit={selectedItem ? handleEdit : handleCreate}
        />
      </Modal>

      {/* Modal de Detalles */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedItem(null); }}
        title={detailType === 'personal' ? 'Detalle de Empleado' : 'Detalle de Servicio'}
        size="lg"
      >
        {showDetailModal && selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {detailType === 'personal' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <p className="text-gray-900">{selectedItem.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="text-gray-900">{selectedItem.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <p className="text-gray-900">{selectedItem.cargo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salario Base</label>
                    <p className="text-gray-900">S/ {Number(selectedItem.salarioBase ?? 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bonificaciones</label>
                    <p className="text-lime-600 font-medium">S/ {Number(selectedItem.bonificaciones ?? 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descuentos</label>
                    <p className="text-red-600 font-medium">S/ {Number(selectedItem.descuentos ?? 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salario Neto</label>
                    <p className="text-gray-900 font-semibold">S/ {(
                      Number(selectedItem.salarioBase ?? 0) +
                      Number(selectedItem.bonificaciones ?? 0) -
                      Number(selectedItem.descuentos ?? 0)
                    ).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
                    <p className="text-gray-900">{selectedItem.fechaPago}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedItem.estado === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedItem.estado}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <p className="text-gray-900">{selectedItem.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                    <p className="text-gray-900">{selectedItem.tipo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <p className="text-gray-900">{selectedItem.proveedor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                    <p className="text-gray-900 font-semibold">S/ {Number(selectedItem.monto ?? 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                    <p className="text-gray-900">{selectedItem.fechaVenc}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
                    <p className="text-gray-900">{selectedItem.fechaPago}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedItem.estado === 'Pagado' ? 'bg-green-100 text-green-700' : selectedItem.estado === 'Vencido' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedItem.estado}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                    <p className="text-gray-900">{selectedItem.periodo}</p>
                  </div>
                </>
              )}
            </div>
            <Modal.Footer>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      {/* Modal Confirmación Eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteTarget({ type: null, item: null }); }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">¿Eliminar este registro?</h3>
              <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => { setShowDeleteModal(false); setDeleteTarget({ type: null, item: null }); }}>Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmRemove}>Eliminar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Gastos;

