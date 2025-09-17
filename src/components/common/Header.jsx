import { Bell, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggleSidebar, onSectionChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Datos de ejemplo para notificaciones
  const notifications = [
    {
      id: 1,
      title: 'Nuevo pedido recibido',
      message: 'Juan Pérez ha realizado un nuevo pedido de impresión',
      time: 'Hace 5 minutos',
      read: false,
      type: 'pedido'
    },
    {
      id: 2,
      title: 'Stock bajo',
      message: 'Moldura Clásica Negra tiene solo 5 unidades en stock',
      time: 'Hace 2 horas',
      read: false,
      type: 'inventario'
    },
    {
      id: 3,
      title: 'Cita programada',
      message: 'Tienes una cita con María López mañana a las 10:00 AM',
      time: 'Hace 1 día',
      read: true,
      type: 'agenda'
    }
  ];

  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  const handleNotificationClick = (notification) => {
    // Redirigir según el tipo de notificación
    switch (notification.type) {
      case 'pedido':
        navigate('/pedidos');
        break;
      case 'inventario':
        navigate('/inventario');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      default:
        break;
    }
    setShowNotifications(false);
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
                  {unreadNotifications > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotifications} nuevas
                    </span>
                  )}
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
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.read ? 'bg-primary' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  Marcar todas como leídas
                </button>
              </div>
            </div>
          )}
        </div>
          
        <button 
          onClick={() => onSectionChange("configuracion")}
          className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </button>

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
    </header>
  );
};

export default Header;