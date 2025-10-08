import React, { useState } from 'react';
import { Package, DollarSign, Calendar, Building, Wrench } from 'lucide-react';
import Button from '../common/Button';

const ActivoForm = ({ activo = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: activo?.nombre || '',
    categoria: activo?.categoria || 'Impresora',
    proveedor: activo?.proveedor || '',
    fechaCompra: activo?.fechaCompra || '',
    costoTotal: activo?.costoTotal || '',
    tipoPago: activo?.tipoPago || 'Contado',
    vidaUtil: activo?.vidaUtil || '',
    depreciacion: activo?.depreciacion || '',
    estado: activo?.estado || 'Activo'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'costoTotal' || name === 'vidaUtil') {
      const costo = parseFloat(formData.costoTotal) || 0;
      const vidaUtil = parseFloat(value) || 0;
      if (vidaUtil > 0) {
        setFormData(prev => ({
          ...prev,
          depreciacion: (costo / vidaUtil).toFixed(2)
        }));
      }
    }
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.proveedor.trim()) {
      newErrors.proveedor = 'El proveedor es requerido';
    }
    
    if (!formData.fechaCompra) {
      newErrors.fechaCompra = 'La fecha de compra es requerida';
    }
    
    if (!formData.costoTotal || parseFloat(formData.costoTotal) <= 0) {
      newErrors.costoTotal = 'El costo total debe ser mayor a 0';
    }
    
    if (!formData.vidaUtil || parseInt(formData.vidaUtil) <= 0) {
      newErrors.vidaUtil = 'La vida útil debe ser mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Activo *
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Nombre del activo"
            />
          </div>
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="Impresora">Impresora</option>
            <option value="Maquinaria">Maquinaria</option>
            <option value="Herramienta">Herramienta</option>
            <option value="Equipo_oficina">Equipo de Oficina</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proveedor *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.proveedor ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Nombre del proveedor"
            />
          </div>
          {errors.proveedor && (
            <p className="mt-1 text-sm text-red-600">{errors.proveedor}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Compra *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="fechaCompra"
              value={formData.fechaCompra}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.fechaCompra ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.fechaCompra && (
            <p className="mt-1 text-sm text-red-600">{errors.fechaCompra}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Costo Total *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              step="0.01"
              name="costoTotal"
              value={formData.costoTotal}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.costoTotal ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="0.00"
            />
          </div>
          {errors.costoTotal && (
            <p className="mt-1 text-sm text-red-600">{errors.costoTotal}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Pago
          </label>
          <select
            name="tipoPago"
            value={formData.tipoPago}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="Contado">Contado</option>
            <option value="Financiado">Financiado</option>
            <option value="Leasing">Leasing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vida Útil (meses) *
          </label>
          <input
            type="number"
            name="vidaUtil"
            value={formData.vidaUtil}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
              ${errors.vidaUtil ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            placeholder="60"
          />
          {errors.vidaUtil && (
            <p className="mt-1 text-sm text-red-600">{errors.vidaUtil}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Depreciación Mensual (S/)
          </label>
          <input
            type="number"
            step="0.01"
            name="depreciacion"
            value={formData.depreciacion}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="0.00"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="Activo">Activo</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>


      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="px-8"
        >
          {activo ? 'Actualizar Activo' : 'Crear Activo'}
        </Button>
      </div>
    </form>
  );
};

export default ActivoForm;
