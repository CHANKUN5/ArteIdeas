import { Calendar, Camera, DollarSign, FileText, User } from 'lucide-react';
import { useState } from 'react';
import Button from '@components/ui/Button/Button.jsx';

const ProjectForm = ({ project = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: project?.nombre || '',
    cliente: project?.cliente || '',
    tipo: project?.tipo || 'Fotografía Escolar',
    fechaInicio: project?.fechaInicio || '',
    fechaEntrega: project?.fechaEntrega || '',
    presupuesto: project?.presupuesto || '',
    descripcion: project?.descripcion || '',
    estado: project?.estado || 'Planificación'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const tiposProyecto = [
    'Fotografía Escolar',
    'Promoción Escolar',
    'Evento Social',
    'Sesión Familiar',
    'Fotografía Comercial',
    'Enmarcado',
    'Impresión Digital',
    'Retoque Fotográfico'
  ];

  const estadosProyecto = [
    'Planificación',
    'En Progreso',
    'Revision',
    'Completado',
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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es requerido';
    }
    
    if (!formData.cliente.trim()) {
      newErrors.cliente = 'El cliente es requerido';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }
    
    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega es requerida';
    }
    
    if (formData.fechaInicio && formData.fechaEntrega && formData.fechaInicio > formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega debe ser posterior a la fecha de inicio';
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
            Nombre del Proyecto *
          </label>
          <div className="relative">
            <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Nombre del proyecto"
            />
          </div>
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

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
            Tipo de Proyecto
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            {tiposProyecto.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
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
            {estadosProyecto.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
                ${errors.fechaInicio ? 'border-red-500 bg-red-50' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.fechaInicio && (
            <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>
          )}
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presupuesto
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="presupuesto"
              value={formData.presupuesto}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del Proyecto
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder="Detalles del proyecto, requerimientos especiales, etc."
          />
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
          {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;