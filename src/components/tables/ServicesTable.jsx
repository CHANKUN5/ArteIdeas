import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ServicesTable = ({ services, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg font-medium">No hay servicios registrados</p>
        <p className="text-sm">Agrega el primer servicio para comenzar</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status === 'Activo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const formatPrice = (price) => {
    return `S/${price.toFixed(2)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-700">SERVICIO</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">PRECIO BASE</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">ESTADO</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2 font-medium text-gray-900">{service.name}</td>
              <td className="py-3 px-2 text-gray-600">{formatPrice(service.basePrice)}</td>
              <td className="py-3 px-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(service)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Editar servicio"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(service)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar servicio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;