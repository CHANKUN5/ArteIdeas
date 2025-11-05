import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Calendar, Building, Wrench, Box, Tag, Hash, MapPin, Plus, X } from 'lucide-react';
import Button from '@components/ui/Button/Button.jsx';

const ActivoForm = ({ mode = 'activo', activo = null, repuesto = null, onSubmit, onCancel }) => {
  const isRepuestoMode = mode === 'repuesto';
  
  const [formData, setFormData] = useState({
    // Common fields
    nombre: activo?.nombre || repuesto?.nombre || '',
    categoria: activo?.categoria || repuesto?.categoria || (isRepuestoMode ? 'Insumos Impresora' : 'Impresora'),
    proveedor: activo?.proveedor || repuesto?.proveedor || '',
    
    // Activo specific fields
    fechaCompra: activo?.fechaCompra || '',
    costoTotal: activo?.costoTotal || '',
    tipoPago: activo?.tipoPago || 'Contado',
    vidaUtil: activo?.vidaUtil || '',
    depreciacion: activo?.depreciacion || '',
    estado: activo?.estado || 'Activo',
    
    // Repuesto specific fields
    codigo: repuesto?.codigo || `REP-${Math.floor(1000 + Math.random() * 9000)}`,
    stock: repuesto?.stock || '',
    stockMinimo: repuesto?.stockMinimo || '',
    costoUnitario: repuesto?.costoUnitario || '',
    ubicacion: repuesto?.ubicacion || 'Almacén A',
    descripcion: repuesto?.descripcion || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Auto-calculate depreciación for activos
    if (!isRepuestoMode && (name === 'costoTotal' || name === 'vidaUtil')) {
      const costo = name === 'costoTotal' ? parseFloat(value) || 0 : parseFloat(formData.costoTotal) || 0;
      const vidaUtil = name === 'vidaUtil' ? parseFloat(value) || 0 : parseFloat(formData.vidaUtil) || 0;
      
      if (vidaUtil > 0) {
        setFormData(prev => ({
          ...prev,
          depreciacion: (costo / vidaUtil).toFixed(2)
        }));
      }
    }
    
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
    
    if (isRepuestoMode) {
      // Validate repuesto fields
      if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
      if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
      if (formData.stock === '') newErrors.stock = 'El stock es requerido';
      if (formData.stockMinimo === '') newErrors.stockMinimo = 'El stock mínimo es requerido';
      if (formData.costoUnitario === '') newErrors.costoUnitario = 'El costo unitario es requerido';
      if (!formData.proveedor.trim()) newErrors.proveedor = 'El proveedor es requerido';
      if (!formData.ubicacion) newErrors.ubicacion = 'La ubicación es requerida';
      
      // Validate stock is a valid number
      if (isNaN(parseInt(formData.stock))) newErrors.stock = 'Ingrese un número válido';
      if (isNaN(parseInt(formData.stockMinimo))) newErrors.stockMinimo = 'Ingrese un número válido';
      if (isNaN(parseFloat(formData.costoUnitario))) newErrors.costoUnitario = 'Ingrese un valor numérico válido';
      
      return Object.keys(newErrors).length === 0 ? null : newErrors;
    }
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (formErrors) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    
    // Format data based on mode
    const submitData = isRepuestoMode ? {
      id: repuesto?.id,
      codigo: formData.codigo,
      nombre: formData.nombre,
      categoria: formData.categoria,
      stock: parseInt(formData.stock),
      stockMinimo: parseInt(formData.stockMinimo),
      costoUnitario: parseFloat(formData.costoUnitario),
      proveedor: formData.proveedor,
      ubicacion: formData.ubicacion,
      descripcion: formData.descripcion
    } : {
      ...formData,
      costoTotal: parseFloat(formData.costoTotal),
      vidaUtil: parseInt(formData.vidaUtil),
      depreciacion: parseFloat(formData.depreciacion)
    };
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(submitData);
      setLoading(false);
    }, 1000);
  };

  // Common form fields
  const renderCommonFields = () => (
    <>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre {isRepuestoMode ? 'del Repuesto' : 'del Activo'} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder={isRepuestoMode ? "Ej: Tóner Negro" : "Ej: Impresora Láser"}
          />
        </div>
        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.categoria ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
          >
            {isRepuestoMode ? (
              <>
                <option value="Insumos Impresora">Insumos Impresora</option>
                <option value="Repuestos Impresora">Repuestos Impresora</option>
                <option value="Insumos Cámara">Insumos Cámara</option>
                <option value="Repuestos Cámara">Repuestos Cámara</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Otros">Otros</option>
              </>
            ) : (
              <>
                <option value="Impresora">Impresora</option>
                <option value="Equipo de Oficina">Equipo de Oficina</option>
                <option value="Maquinaria">Maquinaria</option>
                <option value="Herramienta">Herramienta</option>
                <option value="Vehículo">Vehículo</option>
              </>
            )}
          </select>
        </div>
        {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
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
            placeholder="Nombre del proveedor"
          />
        </div>
        {errors.proveedor && <p className="mt-1 text-sm text-red-600">{errors.proveedor}</p>}
      </div>
    </>
  );
  
  // Render repuesto specific fields
  const renderRepuestoFields = () => (
    <>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.codigo ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Ej: REP-001"
          />
        </div>
        {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Actual <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Cantidad en inventario"
          />
        </div>
        {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Mínimo <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            name="stockMinimo"
            min="0"
            value={formData.stockMinimo}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.stockMinimo ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Nivel mínimo de inventario"
          />
        </div>
        {errors.stockMinimo && <p className="mt-1 text-sm text-red-600">{errors.stockMinimo}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Costo Unitario (S/) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            name="costoUnitario"
            min="0"
            step="0.01"
            value={formData.costoUnitario}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.costoUnitario ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="0.00"
          />
        </div>
        {errors.costoUnitario && <p className="mt-1 text-sm text-red-600">{errors.costoUnitario}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ubicación <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
          >
            <option value="Almacén A">Almacén A</option>
            <option value="Almacén B">Almacén B</option>
            <option value="Estantería 1">Estantería 1</option>
            <option value="Estantería 2">Estantería 2</option>
            <option value="Bodega">Bodega</option>
          </select>
        </div>
        {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
      </div>
      
      <div className="form-group md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          rows="3"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Descripción detallada del repuesto..."
        />
      </div>
    </>
  );
  
  // Render activo specific fields
  const renderActivoFields = () => (
    <>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Compra <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            name="fechaCompra"
            value={formData.fechaCompra}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.fechaCompra ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        </div>
        {errors.fechaCompra && <p className="mt-1 text-sm text-red-600">{errors.fechaCompra}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Costo Total (S/) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            name="costoTotal"
            min="0"
            step="0.01"
            value={formData.costoTotal}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.costoTotal ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="0.00"
          />
        </div>
        {errors.costoTotal && <p className="mt-1 text-sm text-red-600">{errors.costoTotal}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Pago <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            name="tipoPago"
            value={formData.tipoPago}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.tipoPago ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
          >
            <option value="Contado">Contado</option>
            <option value="Financiado">Financiado</option>
            <option value="Leasing">Leasing</option>
          </select>
        </div>
        {errors.tipoPago && <p className="mt-1 text-sm text-red-600">{errors.tipoPago}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vida Útil (meses) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            name="vidaUtil"
            min="1"
            value={formData.vidaUtil}
            onChange={handleChange}
            className={`pl-10 w-full h-11 rounded-md border ${errors.vidaUtil ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Ej: 60"
          />
        </div>
        {errors.vidaUtil && <p className="mt-1 text-sm text-red-600">{errors.vidaUtil}</p>}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Depreciación Mensual (S/)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="depreciacion"
            value={formData.depreciacion || '0.00'}
            readOnly
            className="pl-10 w-full h-11 rounded-md border border-gray-300 bg-gray-100 text-gray-700"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado <span className="text-red-500">*</span>
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
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCommonFields()}
        {isRepuestoMode ? renderRepuestoFields() : renderActivoFields()}
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
          {isRepuestoMode 
            ? (repuesto ? 'Actualizar Repuesto' : 'Guardar Repuesto')
            : (activo ? 'Actualizar Activo' : 'Guardar Activo')
          }
        </Button>
      </div>
    </form>
  );
};

export default ActivoForm;
