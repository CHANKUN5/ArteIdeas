import React from 'react';
import { Building, MapPin, Phone, Mail, FileText, DollarSign } from 'lucide-react';

const BusinessConfig = ({ config, onChange, onSave, loading }) => {
  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleSaveConfig = () => {
    if (onSave) {
      onSave();
    }
  };

  const configFields = [
    {
      key: 'companyName',
      label: 'Nombre de la Empresa',
      icon: Building,
      type: 'text',
      placeholder: 'Ingresa el nombre de tu empresa'
    },
    {
      key: 'address',
      label: 'Dirección',
      icon: MapPin,
      type: 'text',
      placeholder: 'Dirección completa de la empresa'
    },
    {
      key: 'phone',
      label: 'Teléfono',
      icon: Phone,
      type: 'tel',
      placeholder: '+51 999 999 999'
    },
    {
      key: 'email',
      label: 'Email Corporativo',
      icon: Mail,
      type: 'email',
      placeholder: 'contacto@empresa.com'
    },
    {
      key: 'ruc',
      label: 'RUC',
      icon: FileText,
      type: 'text',
      placeholder: '20123456789'
    },
    {
      key: 'currency',
      label: 'Moneda',
      icon: DollarSign,
      type: 'select',
      options: [
        { value: 'PEN', label: 'Soles (S/)' },
        { value: 'USD', label: 'Dólares ($)' },
        { value: 'EUR', label: 'Euros (€)' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configFields.map((field) => {
          const IconComponent = field.icon;
          
          return (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <IconComponent className="w-4 h-4" />
                <span>{field.label}</span>
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={config[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={config[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Sección de Información Importante eliminada según requerimiento */}

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveConfig}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </div>
          ) : (
            'Guardar Configuración'
          )}
        </button>
      </div>
    </div>
  );
};

export default BusinessConfig;