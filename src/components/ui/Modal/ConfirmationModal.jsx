import React from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "default", // default, success, warning, danger
  itemCount = 0,
  currentState = "",
  nextState = "",
  showStateTransition = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          headerBg: 'bg-green-50',
          headerText: 'text-green-800',
          confirmBtn: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
          headerBg: 'bg-yellow-50',
          headerText: 'text-yellow-800',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'danger':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          headerBg: 'bg-red-50',
          headerText: 'text-red-800',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      default:
        return {
          icon: <CheckCircle className="w-12 h-12 text-blue-500" />,
          headerBg: 'bg-blue-50',
          headerText: 'text-blue-800',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all w-full max-w-md">
          {/* Header */}
          <div className={`${styles.headerBg} px-6 py-4 border-b border-gray-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {styles.icon}
                <h3 className={`text-lg font-semibold ${styles.headerText}`}>
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="text-center">
              <p className="text-gray-700 text-base mb-4">
                {message}
              </p>

              {itemCount > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">{itemCount}</span> elemento{itemCount > 1 ? 's' : ''} seleccionado{itemCount > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {showStateTransition && currentState && nextState && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                      {currentState}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm font-medium">
                      {nextState}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;