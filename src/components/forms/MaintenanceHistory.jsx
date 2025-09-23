import React, { useState } from 'react';
import { Plus, Calendar, Wrench, DollarSign, User, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useApp } from '../../context/AppContext';

const MaintenanceHistory = ({ maintenance = {}, onUpdateMaintenance, editable = true }) => {
  const { showSuccess, showError } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);
  const [newMaintenance, setNewMaintenance] = useState({
    fecha: '',
    tipo: 'Preventivo',
    descripcion: '',
    costo: '',
    tecnico: '',
    observaciones: ''
  });

  const maintenanceTypes = [
    'Preventivo',
    'Correctivo',
    'Predictivo',
    'Calibración',
    'Limpieza',
    'Reparación',
    'Actualización',
    'Otro'
  ];

  const handleAddMaintenance = () => {
    if (!newMaintenance.fecha || !newMaintenance.descripcion) return;
    
    const maintenanceRecord = {
      id: Date.now().toString(),
      ...newMaintenance,
      costo: parseFloat(newMaintenance.costo) || 0,
      fechaCreacion: new Date().toISOString()
    };
    
    const updatedMaintenance = {
      ...maintenance,
      historial: [...(maintenance.historial || []), maintenanceRecord],
      ultimoMantenimiento: newMaintenance.fecha,
      costoUltimoMantenimiento: parseFloat(newMaintenance.costo) || 0
    };
    
    onUpdateMaintenance(updatedMaintenance);
    setNewMaintenance({
      fecha: '',
      tipo: 'Preventivo',
      descripcion: '',
      costo: '',
      tecnico: '',
      observaciones: ''
    });
    setShowAddModal(false);
    showSuccess('Registro de mantenimiento agregado exitosamente');
  };

  const handleEditMaintenance = (record) => {
    setEditingMaintenance(record);
    setNewMaintenance({
      fecha: record.fecha,
      tipo: record.tipo,
      descripcion: record.descripcion,
      costo: record.costo.toString(),
      tecnico: record.tecnico || '',
      observaciones: record.observaciones || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateMaintenance = () => {
    if (!editingMaintenance || !newMaintenance.fecha || !newMaintenance.descripcion) return;
    
    const updatedHistorial = (maintenance.historial || []).map(record => 
      record.id === editingMaintenance.id 
        ? {
            ...record,
            ...newMaintenance,
            costo: parseFloat(newMaintenance.costo) || 0
          }
        : record
    );
    
    const updatedMaintenance = {
      ...maintenance,
      historial: updatedHistorial,
      ultimoMantenimiento: newMaintenance.fecha,
      costoUltimoMantenimiento: parseFloat(newMaintenance.costo) || 0
    };
    
    onUpdateMaintenance(updatedMaintenance);
    setEditingMaintenance(null);
    setNewMaintenance({
      fecha: '',
      tipo: 'Preventivo',
      descripcion: '',
      costo: '',
      tecnico: '',
      observaciones: ''
    });
    setShowAddModal(false);
    showSuccess('Registro de mantenimiento actualizado exitosamente');
  };

  const handleDeleteMaintenance = (recordId) => {
    const record = (maintenance.historial || []).find(r => r.id === recordId);
    setMaintenanceToDelete(record);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMaintenance = () => {
    if (maintenanceToDelete) {
      const updatedHistorial = (maintenance.historial || []).filter(record => record.id !== maintenanceToDelete.id);
      const updatedMaintenance = {
        ...maintenance,
        historial: updatedHistorial
      };
      
      // Actualizar último mantenimiento si es necesario
      if (updatedHistorial.length > 0) {
        const ultimoRecord = updatedHistorial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        updatedMaintenance.ultimoMantenimiento = ultimoRecord.fecha;
        updatedMaintenance.costoUltimoMantenimiento = ultimoRecord.costo;
      } else {
        updatedMaintenance.ultimoMantenimiento = '';
        updatedMaintenance.costoUltimoMantenimiento = 0;
      }
      
      onUpdateMaintenance(updatedMaintenance);
      showSuccess('Registro de mantenimiento eliminado exitosamente');
      setShowDeleteDialog(false);
      setMaintenanceToDelete(null);
    }
  };

  const getMaintenanceTypeIcon = (tipo) => {
    switch (tipo) {
      case 'Preventivo':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Correctivo':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Calibración':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      default:
        return <Wrench className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMaintenanceTypeColor = (tipo) => {
    switch (tipo) {
      case 'Preventivo':
        return 'bg-green-100 text-green-800';
      case 'Correctivo':
        return 'bg-red-100 text-red-800';
      case 'Calibración':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCost = (maintenance.historial || []).reduce((sum, record) => sum + record.costo, 0);

  return (
    <div className="space-y-4">
      {/* Header con resumen */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Historial de Mantenimiento</h4>
          <p className="text-sm text-gray-500">
            Total gastado: <span className="font-semibold text-red-600">S/ {totalCost.toLocaleString()}</span>
          </p>
          {maintenance.proximoMantenimiento && (
            <p className="text-sm text-gray-500">
              Próximo: <span className="font-medium">{maintenance.proximoMantenimiento}</span>
            </p>
          )}
        </div>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Agregar Mantenimiento
          </Button>
        )}
      </div>

      {/* Lista de mantenimientos */}
      <div className="space-y-3">
        {(maintenance.historial || []).map((record) => (
          <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getMaintenanceTypeIcon(record.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaintenanceTypeColor(record.tipo)}`}>
                      {record.tipo}
                    </span>
                    <span className="font-semibold text-gray-900">
                      S/ {record.costo.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{record.fecha}</span>
                    </div>
                    {record.tecnico && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{record.tecnico}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-1">{record.descripcion}</p>
                  {record.observaciones && (
                    <p className="text-gray-600 text-xs italic">{record.observaciones}</p>
                  )}
                </div>
              </div>
              {editable && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => handleEditMaintenance(record)}
                    className="text-blue-600 hover:bg-blue-50"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteMaintenance(record.id)}
                    className="text-red-600 hover:bg-red-50"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(maintenance.historial || []).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>No hay registros de mantenimiento</p>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
              className="mt-2"
            >
              Agregar Primer Mantenimiento
            </Button>
          )}
        </div>
      )}

      {/* Modal para agregar/editar mantenimiento */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingMaintenance ? 'Editar Mantenimiento' : 'Agregar Mantenimiento'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newMaintenance.fecha}
                  onChange={(e) => setNewMaintenance({...newMaintenance, fecha: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Mantenimiento
                </label>
                <select
                  value={newMaintenance.tipo}
                  onChange={(e) => setNewMaintenance({...newMaintenance, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {maintenanceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newMaintenance.descripcion}
                  onChange={(e) => setNewMaintenance({...newMaintenance, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Describe el trabajo realizado..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newMaintenance.costo}
                  onChange={(e) => setNewMaintenance({...newMaintenance, costo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Técnico/Proveedor
                </label>
                <input
                  type="text"
                  value={newMaintenance.tecnico}
                  onChange={(e) => setNewMaintenance({...newMaintenance, tecnico: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Nombre del técnico o empresa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={newMaintenance.observaciones}
                  onChange={(e) => setNewMaintenance({...newMaintenance, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="2"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMaintenance(null);
                  setNewMaintenance({
                    fecha: '',
                    tipo: 'Preventivo',
                    descripcion: '',
                    costo: '',
                    tecnico: '',
                    observaciones: ''
                  });
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={editingMaintenance ? handleUpdateMaintenance : handleAddMaintenance}
                className="flex-1"
              >
                {editingMaintenance ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setMaintenanceToDelete(null);
        }}
        onConfirm={confirmDeleteMaintenance}
        title="Eliminar Registro de Mantenimiento"
        message={`¿Estás seguro de que quieres eliminar este registro de mantenimiento? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default MaintenanceHistory;
