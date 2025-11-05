import React from 'react';
import { AlertTriangle, Package, ChevronDown } from 'lucide-react';

const AlertsSection = ({ showAlerts, setShowAlerts, stats, filteredProducts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-lg font-semibold text-gray-900">Alertas Generales de Inventarios</span>
            {stats.lowStock > 0 && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                {stats.lowStock} alertas activas
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showAlerts ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {showAlerts && (
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">¿Qué son las Alertas de Stock?</h4>
            <p className="text-blue-800 text-sm">
              Las alertas de stock te notifican cuando un producto tiene una cantidad igual o menor al stock mínimo configurado. 
              Esto te ayuda a mantener un inventario adecuado y evitar quedarte sin productos importantes.
            </p>
          </div>
          
          {stats.lowStock > 0 ? (
            <div className="space-y-2">
              {filteredProducts
                .filter(product => {
                  const stock = parseInt(product.stock || product.quantity || 0);
                  const minStock = parseInt(product.minStock || 5);
                  return stock <= minStock;
                })
                .map(product => (
                  <div key={product.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-900">{product.name}</p>
                        <p className="text-sm text-orange-700">
                          Stock actual: {product.stock || product.quantity || 0} | 
                          Stock mínimo: {product.minStock || 5}
                        </p>
                      </div>
                      <div className="text-orange-600">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-600">No hay alertas de stock en este momento</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsSection;