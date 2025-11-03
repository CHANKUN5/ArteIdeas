import { Calendar, DollarSign, FileText, Package, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import Button from '@components/ui/Button/Button.jsx';

const OrderForm = ({ order = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cliente: order?.cliente || '',
    servicio: order?.servicio || 'Impresión Digital',
    cantidad: order?.cantidad || 1,
    fechaPedido: order?.fechaPedido || new Date().toISOString().split('T')[0],
    fechaEntrega: order?.fechaEntrega || '',
    precio: order?.precio || '',
    adelanto: order?.adelanto || '',
    estado: order?.estado || 'Pendiente',
    especificaciones: order?.especificaciones || '',
    observaciones: order?.observaciones || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const servicios = [
    'Impresión Digital',
    'Fotografía Escolar',
    'Promoción Escolar',
    'Enmarcado',
    'Retoque Fotográfico',
    'Recordatorios',
    'Ampliaciones',
    'Fotografía de Eventos',
    'Sesión Familiar'
  ];

  const estados = [
    'Pendiente',
    'En Proceso',
    'Listo para Entrega',
    'Entregado',
    'Cancelado'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cliente.trim()) {
      newErrors.cliente = 'El cliente es requerido';
    }
    
    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega es requerida';
    }
    
    if (formData.fechaPedido && formData.fechaEntrega && formData.fechaPedido > formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega debe ser posterior a la fecha del pedido';
    }
    
    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    
    if (formData.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0';
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

  const calcularSaldo = () => {
    const precio = parseFloat(formData.precio) || 0;
    const adelanto = parseFloat(formData.adelanto) || 0;
    return precio - adelanto;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.cliente ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Nombre del cliente"
            />
          </div>
          {errors.cliente && (
            <p className="mt-1 text-sm text-red-600">{errors.cliente}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicio
          </label>
          <div className="relative">
            <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
            >
              {servicios.map((servicio) => (
                <option key={servicio} value={servicio}>{servicio}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad *
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.cantidad ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="1"
              min="1"
            />
          </div>
          {errors.cantidad && (
            <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>
          )}
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
            {estados.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha del Pedido
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="fechaPedido"
              value={formData.fechaPedido}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Entrega *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.fechaEntrega ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.fechaEntrega && (
            <p className="mt-1 text-sm text-red-600">{errors.fechaEntrega}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Total *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adelanto
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="adelanto"
              value={formData.adelanto}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0.00"
              step="0.01"
              min="0"
              max={formData.precio || undefined}
            />
          </div>
          {formData.precio && formData.adelanto && (
            <p className="mt-1 text-xs text-gray-500">
              Saldo pendiente: S/ {calcularSaldo().toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Especificaciones Técnicas
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            name="especificaciones"
            value={formData.especificaciones}
            onChange={handleChange}
            rows="3"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder="Tamaño, material, acabados, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones
        </label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
          placeholder="Notas adicionales..."
        />
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
          {order ? 'Actualizar Pedido' : 'Crear Pedido'}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;