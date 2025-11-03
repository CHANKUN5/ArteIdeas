import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MetricsPanel = ({ recentActivities = [], upcomingEvents = [] }) => {
  const navigate = useNavigate();
  const ActivityItem = ({ activity }) => {
    const iconMap = {
      pedido: CheckCircle,
      cita: Calendar,
      produccion: Clock,
      alerta: AlertCircle
    };
    
    const colorMap = {
      pedido: 'text-green-600',
      cita: 'text-blue-600',
      produccion: 'text-yellow-600',
      alerta: 'text-red-600'
    };

    const Icon = iconMap[activity.type] || CheckCircle;

    const handleClick = () => {
      switch (activity.type) {
        case 'pedido':
          navigate('/pedidos');
          break;
        case 'cita':
          navigate('/agenda');
          break;
        case 'produccion':
          navigate('/produccion');
          break;
        case 'alerta':
          navigate('/inventario');
          break;
        default:
          break;
      }
    };

    return (
      <div 
        onClick={handleClick}
        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
      >
        <div className={`p-1 rounded-full ${colorMap[activity.type]} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${colorMap[activity.type]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  const EventItem = ({ event }) => {
    const handleClick = () => {
      navigate('/agenda');
    };

    return (
      <div 
        onClick={handleClick}
        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
      >
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {event.title}
          </p>
          <p className="text-xs text-gray-500">{event.client}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{event.time}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${event.priority === 'alta' ? 'bg-red-100 text-red-800' : 
              event.priority === 'media' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'}
          `}>
            {event.priority}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-sm text-gray-500 mt-1">Últimas actualizaciones del sistema</p>
        </div>
        <div className="p-3 max-h-80 overflow-y-auto">
          {recentActivities.length > 0 ? (
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No hay actividades recientes</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Próximas Citas</h3>
          <p className="text-sm text-gray-500 mt-1">Eventos programados para hoy y mañana</p>
        </div>
        <div className="p-3 max-h-80 overflow-y-auto">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-1">
              {upcomingEvents.map((event, index) => (
                <EventItem key={index} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No hay citas programadas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;