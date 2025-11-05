import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Building, CreditCard, Hash } from 'lucide-react';
import Button from '@components/ui/Button/Button.jsx';

const FinanciamientoForm = ({ financiamiento = null, activos = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    activoId: financiamiento?.activoId || '',
    tipoPago: financiamiento?.tipoPago || 'Financiado',
    entidad: financiamiento?.entidad || '',
    montoFinanciado: financiamiento?.montoFinanciado || '',
    cuotasTotales: financiamiento?.cuotasTotales || '',
    cuotaMensual: financiamiento?.cuotaMensual || '',
    fechaInicio: financiamiento?.fechaInicio || '',
    fechaFin: financiamiento?.fechaFin || '',
    estado: financiamiento?.estado || 'Activo'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto-calcular cuota mensual cuando cambian monto o cuotas
  useEffect(() => {
    if (formData.montoFinanciado && formData.cuotasTotales) {
      const monto = parseFloat(formData.montoFinanciado);
      const cuotas = parseInt(formData.cuotasTotales);
      if (monto > 0 && cuotas > 0) {
        setFormData(prev => ({
          ...prev,
          cuotaMensual: (monto / cuotas).toFixed(2)
        }));
      }
    }
  }, [formData.montoFinanciado, formData.cuotasTotales]);

  // Auto-calcular fecha fin cuando cambian fecha inicio o cuotas
  useEffect(() => {
    if (formData.fechaInicio && formData.cuotasTotales) {
      const fechaInicio = new Date(formData.fechaInicio);
      const cuotas = parseInt(formData.cuotasTotales);
      if (cuotas > 0) {
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + cuotas);
        setFormData(prev => ({
          ...prev,
          fechaFin: fechaFin.toISOString().split('T')[0]
        }));
      }
    }
  }, [formData.fechaInicio, formData.cuotasTotales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.activoId) {
      newErrors.activoId = 'Debe seleccionar un activo';
    }
    
    if (!formData.entidad.trim()) {
      newErrors.entidad = 'La entidad financiera es requerida';
    }
    
    if (!formData.montoFinanciado || parseFloat(formData.montoFinanciado) <= 0) {
      newErrors.montoFinanciado = 'El monto debe ser mayor a 0';
    }
    
    if (!formData.cuotasTotales || parseInt(formData.cuotasTotales) <= 0) {
      newErrors.cuotasTotales = 'Las cuotas deben ser mayor a 0';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
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
      tipoPago: formData.tipoPago,
      entidad: formData.entidad,
      montoFinanciado: parseFloat(formData.montoFinanciado),
      cuotasTotales: parseInt(formData.cuotasTotales),
      cuotaMensual: parseFloat(formData.cuotaMensual),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      estado: formData.estado
    };
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(submitData);
      setLoading(false);
    }, 1000);
  };

  // Filtrar activos que no tienen financiamiento o el activo seleccionado si estamos editando
  const activosDisponibles = activos.filter(activo => 
    activo.tipoPago === 'Contado' || activo.id === financiamiento?.activoId
  );

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
              disabled={!!financiamiento}
              className={`pl-10 w-full h-11 rounded-md border ${errors.activoId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent ${financiamiento ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione un activo</option>
              {activosDisponibles.map(activo => (
                <option key={activo.id} value={activo.id}>
                  {activo.nombre} - S/ {activo.costoTotal.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          {errors.activoId && <p className="mt-1 text-sm text-red-600">{errors.activoId}</p>}
          {financiamiento && (
            <p className="mt-1 text-xs text-gray-500">No se puede cambiar el activo al editar</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Pago <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="tipoPago"
              value={formData.tipoPago}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.tipoPago ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="Financiado">Financiado</option>
              <option value="Leasing">Leasing</option>
            </select>
          </div>
          {errors.tipoPago && <p className="mt-1 text-sm text-red-600">{errors.tipoPago}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entidad Financiera <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="entidad"
              value={formData.entidad}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.entidad ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Ej: Banco de Crédito del Perú"
            />
          </div>
          {errors.entidad && <p className="mt-1 text-sm text-red-600">{errors.entidad}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto Financiado (S/) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="montoFinanciado"
              min="0"
              step="0.01"
              value={formData.montoFinanciado}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.montoFinanciado ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="0.00"
            />
          </div>
          {errors.montoFinanciado && <p className="mt-1 text-sm text-red-600">{errors.montoFinanciado}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuotas Totales <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="cuotasTotales"
              min="1"
              value={formData.cuotasTotales}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.cuotasTotales ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Ej: 24"
            />
          </div>
          {errors.cuotasTotales && <p className="mt-1 text-sm text-red-600">{errors.cuotasTotales}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuota Mensual (S/)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="cuotaMensual"
              value={formData.cuotaMensual || '0.00'}
              readOnly
              className="pl-10 w-full h-11 rounded-md border border-gray-300 bg-gray-100 text-gray-700"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Calculado automáticamente</p>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.fechaInicio ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
          </div>
          {errors.fechaInicio && <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              readOnly
              className="pl-10 w-full h-11 rounded-md border border-gray-300 bg-gray-100 text-gray-700"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Calculado automáticamente</p>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`pl-10 w-full h-11 rounded-md border ${errors.estado ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="Activo">Activo</option>
              <option value="Pagado">Pagado</option>
              <option value="Mora">Mora</option>
            </select>
          </div>
          {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
        </div>
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
          {financiamiento ? 'Actualizar Financiamiento' : 'Guardar Financiamiento'}
        </Button>
      </div>
    </form>
  );
};

export default FinanciamientoForm;
