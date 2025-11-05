import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Building, Wrench, FileText, Hash, AlertCircle } from 'lucide-react';
import Button from '@components/ui/Button/Button.jsx';

const MantenimientoForm = ({ mantenimiento = null, activos = [], repuestos = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    activoId: mantenimiento?.activoId || '',
    tipo: mantenimiento?.tipo || 'Preventivo',
    fechaMantenimiento: mantenimiento?.fechaMantenimiento || '',
    costo: mantenimiento?.costo || '',
    proveedor: mantenimiento?.proveedor || '',
    descripcion: mantenimiento?.descripcion || '',
    proximoMantenimiento: mantenimiento?.proximoMantenimiento || '',
    estadoMantenimiento: mantenimiento?.estado || 'Programado',
    estado: mantenimiento?.estado === 'Completado' ? 'Activo' : 'Mantenimiento',
    repuestosInsumos: mantenimiento?.repuestosInsumos || []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto-calcular próximo mantenimiento (6 meses después de la fecha de mantenimiento)
  useEffect(() => {
    if (formData.fechaMantenimiento) {
      const fecha = new Date(formData.fechaMantenimiento);
      const proximaFecha = new Date(fecha);
      proximaFecha.setMonth(proximaFecha.getMonth() + 6);
      setFormData(prev => ({
        ...prev,
        proximoMantenimiento: proximaFecha.toISOString().split('T')[0]
      }));
    }
  }, [formData.fechaMantenimiento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRepuestoToggle = (repuesto) => {
    const repuestoNombre = `${repuesto.nombre} (${repuesto.codigo})`;
    setFormData(prev => ({
      ...prev,
      repuestosInsumos: prev.repuestosInsumos.includes(repuestoNombre)
        ? prev.repuestosInsumos.filter(r => r !== repuestoNombre)
        : [...prev.repuestosInsumos, repuestoNombre]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.activoId) {
      newErrors.activoId = 'Debe seleccionar un activo';
    }
    
    if (!formData.fechaMantenimiento) {
      newErrors.fechaMantenimiento = 'La fecha de mantenimiento es requerida';
    }
    
    if (!formData.costo || parseFloat(formData.costo) < 0) {
      newErrors.costo = 'El costo debe ser mayor o igual a 0';
    }
    
    if (!formData.proveedor.trim()) {
      newErrors.proveedor = 'El proveedor es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    const submitData = {
      activoId: parseInt(formData.activoId),
      tipo: formData.tipo,
      fechaMantenimiento: formData.fechaMantenimiento,
      costo: parseFloat(formData.costo),
      proveedor: formData.proveedor,
      descripcion: formData.descripcion,
      proximoMantenimiento: formData.proximoMantenimiento,
      estadoMantenimiento: formData.estadoMantenimiento,
      estado: formData.estado,
      repuestosInsumos: formData.repuestosInsumos
    };
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(submitData);
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="activoId"
              value={formData.activoId}
              onChange={handleChange}
              disabled={!!mantenimiento}
              className={`pl-10 w-full h-11 rounded-md border ${errors.activoId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent ${mantenimiento ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione un activo</option>
              {activos.map(activo => (
                <option key={activo.id} value={activo.id}>
                  {activo.nombre} - {activo.categoria}
                </option>
              ))}
            </select>
          </div>
          {errors.activoId && <p className="mt-1 text-sm text-red-600">{errors.activoId}</p>}
          {mantenimiento && (
            <p className="mt-1 text-xs text-gray-500">No se puede cambiar el activo al editar</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Mantenimiento <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.tipo ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
            </select>
          </div>
          {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Mantenimiento <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              name="fechaMantenimiento"
              value={formData.fechaMantenimiento}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.fechaMantenimiento ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
          </div>
          {errors.fechaMantenimiento && <p className="mt-1 text-sm text-red-600">{errors.fechaMantenimiento}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Costo (S/) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="costo"
              min="0"
              step="0.01"
              value={formData.costo}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.costo ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="0.00"
            />
          </div>
          {errors.costo && <p className="mt-1 text-sm text-red-600">{errors.costo}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proveedor <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.proveedor ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Ej: Servicio Técnico Especializado"
            />
          </div>
          {errors.proveedor && <p className="mt-1 text-sm text-red-600">{errors.proveedor}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado del Mantenimiento
          </label>
          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="estadoMantenimiento"
              value={formData.estadoMantenimiento}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.estadoMantenimiento ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="Programado">Programado</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          {errors.estadoMantenimiento && <p className="mt-1 text-sm text-red-600">{errors.estadoMantenimiento}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado del Activo
          </label>
          <div className="relative">
            <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.estado ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="Activo">Activo</option>
              <option value="Mantenimiento">En Mantenimiento</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Próximo Mantenimiento
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              name="proximoMantenimiento"
              value={formData.proximoMantenimiento}
              readOnly
              className="pl-10 w-full h-11 rounded-md border border-gray-300 bg-gray-100 text-gray-700"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Calculado automáticamente (6 meses después)</p>
        </div>
        
        <div className="form-group md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              name="descripcion"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}
              className={`pl-10 w-full rounded-md border ${errors.descripcion ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Describa el mantenimiento realizado o a realizar..."
            />
          </div>
          {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
        </div>
        
        {repuestos && repuestos.length > 0 && (
          <div className="form-group md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repuestos/Insumos Asociados
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {repuestos.map((repuesto) => {
                  const repuestoNombre = `${repuesto.nombre} (${repuesto.codigo})`;
                  return (
                    <label 
                      key={repuesto.id} 
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.repuestosInsumos.includes(repuestoNombre)}
                        onChange={() => handleRepuestoToggle(repuesto)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-gray-900">{repuestoNombre}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Seleccione los repuestos o insumos utilizados en este mantenimiento
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {mantenimiento ? 'Actualizar Mantenimiento' : 'Guardar Mantenimiento'}
        </Button>
      </div>
    </form>
  );
};

export default MantenimientoForm;
