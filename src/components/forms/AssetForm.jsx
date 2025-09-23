import React, { useState } from 'react';
import { 
  Settings, 
  DollarSign, 
  Calendar, 
  Building, 
  User, 
  MapPin,
  Wrench,
  FileText,
  Save,
  X
} from 'lucide-react';
import Button from '../common/Button';

const AssetForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  submitLabel = "Guardar Activo",
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Equipos Fotográficos',
    proveedor: '',
    fechaCompra: '',
    costo: '',
    vidaUtil: '',
    estado: 'En Uso',
    ubicacion: '',
    responsable: '',
    financiamiento: {
      entidad: 'Contado',
      monto: '',
      cuotas: '',
      cuotaMensual: '',
      estado: 'Pagado',
      fechaInicio: '',
      fechaFin: ''
    },
    mantenimiento: {
      ultimoMantenimiento: '',
      proximoMantenimiento: '',
      costoUltimoMantenimiento: '',
      historial: []
    },
    relacionInventario: [],
    relacionProduccion: [],
    roi: '',
    costoOperativoReal: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const categorias = [
    'Equipos Fotográficos',
    'Equipos Informáticos',
    'Equipos de Impresión',
    'Equipos de Iluminación',
    'Mobiliario',
    'Otros'
  ];

  const estados = [
    'En Uso',
    'Mantenimiento',
    'Fuera de Servicio',
    'Vendido',
    'Obsoleto'
  ];

  const entidadesFinancieras = [
    'Contado',
    'BBVA',
    'BCP',
    'Scotiabank',
    'Interbank',
    'Banco de la Nación',
    'Otro'
  ];

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    if (!formData.proveedor.trim()) newErrors.proveedor = 'El proveedor es requerido';
    if (!formData.fechaCompra) newErrors.fechaCompra = 'La fecha de compra es requerida';
    if (!formData.costo || formData.costo <= 0) newErrors.costo = 'El costo debe ser mayor a 0';
    if (!formData.vidaUtil || formData.vidaUtil <= 0) newErrors.vidaUtil = 'La vida útil debe ser mayor a 0';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es requerida';
    if (!formData.responsable.trim()) newErrors.responsable = 'El responsable es requerido';
    
    // Validaciones de financiamiento
    if (formData.financiamiento.entidad !== 'Contado') {
      if (!formData.financiamiento.monto || formData.financiamiento.monto <= 0) {
        newErrors['financiamiento.monto'] = 'El monto financiado debe ser mayor a 0';
      }
      if (!formData.financiamiento.cuotas || formData.financiamiento.cuotas <= 0) {
        newErrors['financiamiento.cuotas'] = 'El número de cuotas debe ser mayor a 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Calcular depreciación anual
    const depreciacionAnual = parseFloat(formData.costo) / parseInt(formData.vidaUtil);
    
    // Calcular ROI si se proporciona costo operativo
    let roi = 0;
    if (formData.costoOperativoReal && formData.costoOperativoReal > 0) {
      roi = ((parseFloat(formData.costo) - parseFloat(formData.costoOperativoReal)) / parseFloat(formData.costoOperativoReal)) * 100;
    }
    
    const assetData = {
      ...formData,
      costo: parseFloat(formData.costo),
      vidaUtil: parseInt(formData.vidaUtil),
      depreciacion: depreciacionAnual,
      financiamiento: {
        ...formData.financiamiento,
        monto: parseFloat(formData.financiamiento.monto) || 0,
        cuotas: parseInt(formData.financiamiento.cuotas) || 0,
        cuotaMensual: parseFloat(formData.financiamiento.cuotaMensual) || 0
      },
      mantenimiento: {
        ...formData.mantenimiento,
        costoUltimoMantenimiento: parseFloat(formData.mantenimiento.costoUltimoMantenimiento) || 0
      },
      roi: roi,
      costoOperativoReal: parseFloat(formData.costoOperativoReal) || 0
    };
    
    onSubmit && onSubmit(assetData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos Principales */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Datos Principales
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Activo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Cámara Canon EOS R5"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.categoria ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.proveedor}
              onChange={(e) => handleChange('proveedor', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.proveedor ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Canon Perú"
            />
            {errors.proveedor && <p className="text-red-500 text-sm mt-1">{errors.proveedor}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Compra <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fechaCompra}
              onChange={(e) => handleChange('fechaCompra', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.fechaCompra ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fechaCompra && <p className="text-red-500 text-sm mt-1">{errors.fechaCompra}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo de Adquisición <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.costo}
              onChange={(e) => handleChange('costo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.costo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.costo && <p className="text-red-500 text-sm mt-1">{errors.costo}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vida Útil (años) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.vidaUtil}
              onChange={(e) => handleChange('vidaUtil', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.vidaUtil ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="5"
            />
            {errors.vidaUtil && <p className="text-red-500 text-sm mt-1">{errors.vidaUtil}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => handleChange('ubicacion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.ubicacion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Estudio Principal"
            />
            {errors.ubicacion && <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.responsable}
              onChange={(e) => handleChange('responsable', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                errors.responsable ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Carlos Mendoza"
            />
            {errors.responsable && <p className="text-red-500 text-sm mt-1">{errors.responsable}</p>}
          </div>
        </div>
      </div>

      {/* Financiamiento */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Información de Financiamiento
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entidad Financiera
            </label>
            <select
              value={formData.financiamiento.entidad}
              onChange={(e) => handleChange('financiamiento.entidad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              {entidadesFinancieras.map(entidad => (
                <option key={entidad} value={entidad}>{entidad}</option>
              ))}
            </select>
          </div>
          
          {formData.financiamiento.entidad !== 'Contado' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Financiado
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.financiamiento.monto}
                  onChange={(e) => handleChange('financiamiento.monto', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors['financiamiento.monto'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors['financiamiento.monto'] && <p className="text-red-500 text-sm mt-1">{errors['financiamiento.monto']}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Cuotas
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.financiamiento.cuotas}
                  onChange={(e) => handleChange('financiamiento.cuotas', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                    errors['financiamiento.cuotas'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12"
                />
                {errors['financiamiento.cuotas'] && <p className="text-red-500 text-sm mt-1">{errors['financiamiento.cuotas']}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuota Mensual
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.financiamiento.cuotaMensual}
                  onChange={(e) => handleChange('financiamiento.cuotaMensual', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado del Financiamiento
                </label>
                <select
                  value={formData.financiamiento.estado}
                  onChange={(e) => handleChange('financiamiento.estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="Activo">Activo</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Vencido">Vencido</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mantenimiento */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Wrench className="w-5 h-5 mr-2" />
          Información de Mantenimiento
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Último Mantenimiento
            </label>
            <input
              type="date"
              value={formData.mantenimiento.ultimoMantenimiento}
              onChange={(e) => handleChange('mantenimiento.ultimoMantenimiento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Próximo Mantenimiento
            </label>
            <input
              type="date"
              value={formData.mantenimiento.proximoMantenimiento}
              onChange={(e) => handleChange('mantenimiento.proximoMantenimiento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo Último Mantenimiento
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.mantenimiento.costoUltimoMantenimiento}
              onChange={(e) => handleChange('mantenimiento.costoUltimoMantenimiento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Información Adicional
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ROI Esperado (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.roi}
              onChange={(e) => handleChange('roi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0.0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo Operativo Real
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.costoOperativoReal}
              onChange={(e) => handleChange('costoOperativoReal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button 
          variant="primary"
          icon={<Save className="w-4 h-4" />}
          type="submit"
          className="flex-1"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default AssetForm;
