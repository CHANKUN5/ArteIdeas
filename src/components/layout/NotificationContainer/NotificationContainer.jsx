import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useApp } from '@context/AppContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useApp();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-white border-green-200 text-gray-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            notification-enter-active
            ${getNotificationStyles(notification.type)}
            border rounded-lg shadow-lg p-4 flex items-start space-x-3
            transform transition-all duration-300 ease-out
            hover:shadow-xl hover:scale-105
          `}
        >
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {notification.message}
            </p>
            {notification.description && (
              <p className="text-xs mt-1 opacity-75">
                {notification.description}
              </p>
            )}
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;