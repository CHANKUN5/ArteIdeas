import React from 'react';
import { CheckCircle, ArrowRight, X } from 'lucide-react';

const ReclassificationModal = ({ 
  isOpen, 
  onClose, 
  itemName, 
  fromTab, 
  toTab, 
  newId 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reclasificación Exitosa
              </h3>
              <p className="text-sm text-gray-500">
                El elemento ha sido movido automáticamente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Item Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Detalles del elemento:</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Elemento:</span> {itemName || 'Elemento seleccionado'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nuevo ID:</span> 
                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                  #{newId}
                </span>
              </p>
            </div>

            {/* Movement Visualization */}
            <div className="flex items-center justify-center space-x-3 py-4">
              <div className="text-center">
                <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">
                  {fromTab}
                </div>
                <p className="text-xs text-gray-500 mt-1">Origen</p>
              </div>
              
              <ArrowRight className="h-6 w-6 text-gray-400" />
              
              <div className="text-center">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                  {toTab}
                </div>
                <p className="text-xs text-gray-500 mt-1">Destino</p>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    ¡Reclasificación completada!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    El elemento ha sido movido exitosamente a "{toTab}" con un nuevo ID único.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReclassificationModal;