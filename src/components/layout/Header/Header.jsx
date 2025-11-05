import { Bell, Settings, User, X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useApp } from '@context/AppContext';
import NotificationModal from '@/components/layout/NotificationContainer/NotificationModal';

const Header = ({ onToggleSidebar, onSectionChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    persistentNotifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    removePersistentNotification,
    clearAllNotifications
  } = useApp();

  const notifications = persistentNotifications || [];
  const unreadNotifications = unreadCount;

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    setShowNotifications(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); // Evitar que se abra el modal
    removePersistentNotification(notificationId);
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between pr-6 pl-3 md:pl-4 lg:pl-0 shadow-sm">
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="h-0.5 w-6 bg-gray-600"></div>
            <div className="h-0.5 w-6 bg-gray-600"></div>
            <div className="h-0.5 w-6 bg-gray-600"></div>
          </div>
        </button>
        
        {/* Eliminada toda la sección de búsqueda */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Botón de notificaciones con dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            )}
          </button>
          
          {/* Dropdown de notificaciones */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                  <div className="flex items-center space-x-2">
                    {unreadNotifications > 0 && (
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {unreadNotifications} nuevas
                      </span>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAllNotifications}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar todas las notificaciones"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">{notification.icon || '📢'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium text-sm ${
                              !notification.read ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar notificación"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
          
        {user?.role === 'admin' && (
          <button 
            onClick={() => onSectionChange("configuracion")}
            className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={() => onSectionChange && onSectionChange('perfil')}
          className="flex items-center space-x-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Elberc149'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Administrador'}</p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
            <img 
              src={user?.profileImage || '/src/assets/elberc149-profile.jpg'} 
              alt={user?.name || 'Usuario'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback si la imagen no carga */}
            <div className="w-full h-full hidden items-center justify-center bg-primary">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de notificaciones */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={showModal}
        onClose={handleModalClose}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
      />
    </header>
  );
};

export default Header;