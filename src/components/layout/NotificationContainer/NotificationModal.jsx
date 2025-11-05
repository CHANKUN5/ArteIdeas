import { X, Clock, CheckCircle, Eye, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { notificationService } from '@services/notificationService';

const NotificationModal = ({ notification, isOpen, onClose, onMarkAsRead, onDelete }) => {
  const [isMarking, setIsMarking] = useState(false);

  // Marcar automáticamente como leída al abrir el modal
  useEffect(() => {
    if (isOpen && notification && !notification.read) {
      onMarkAsRead(notification.id);
    }
  }, [isOpen, notification, onMarkAsRead]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleMarkAsRead = async () => {
    if (isMarking || notification.isRead) return;
    
    setIsMarking(true);
    try {
      await notificationService.markAsRead(notification.id);
      onMarkAsRead(notification.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      client: 'Cliente',
      order: 'Pedido',
      inventory: 'Inventario',
      reminder: 'Recordatorio',
      production: 'Producción',
      contract: 'Contrato',
      system: 'Sistema'
    };
    return categories[category] || 'General';
  };

  const getActionLabel = (action) => {
    const actions = {
      create: 'Creación',
      update: 'Actualización',
      delete: 'Eliminación',
      complete: 'Completado',
      stock_alert: 'Alerta de Stock'
    };
    return actions[action] || 'Acción';
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{notification.icon || '📢'}</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {notification.title}
              </h2>
              <p className="text-sm text-gray-500">
                {formatDate(notification.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Status and Category */}
          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeStyles(notification.type)}`}>
              {notification.type === 'success' ? 'Éxito' : 
               notification.type === 'error' ? 'Error' : 
               notification.type === 'warning' ? 'Advertencia' : 'Información'}
            </span>
            
            {notification.category && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {getCategoryLabel(notification.category)}
              </span>
            )}
            
            {notification.action && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {getActionLabel(notification.action)}
              </span>
            )}

            {!notification.read && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>No leída</span>
              </span>
            )}
          </div>

          {/* Message */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Mensaje:</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {notification.message}
            </p>
          </div>

          {/* Description */}
          {notification.description && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Descripción:</h3>
              <p className="text-gray-700 leading-relaxed">
                {notification.description}
              </p>
            </div>
          )}

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Detalles adicionales:</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Date for reminders */}
          {notification.dueDate && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Fecha programada:</h3>
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-4 h-4" />
                <span>{formatDate(notification.dueDate)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Recibida {formatDate(notification.timestamp)}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {!notification.read && (
              <button
                onClick={handleMarkAsRead}
                disabled={isMarking}
                className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 hover:scale-105 shadow-md hover:shadow-lg"
                title={isMarking ? 'Marcando como leída...' : 'Marcar como leída'}
              >
                {isMarking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
            
            {notification.read && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Leída</span>
              </div>
            )}
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;