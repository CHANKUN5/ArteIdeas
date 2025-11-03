import React, { useCallback, memo, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Camera, 
  ChevronDown, 
  MapPin, 
  FileText, 
  Package, 
  Bell, 
  Backpack, 
  Users, 
  Building, 
  Image, 
  GraduationCap 
} from 'lucide-react';
import Card from '@components/ui/Card/Card.jsx';

const EventCard = memo(({ event, onClick }) => {
  // Estado local individual para cada acordeón (como en ContractCard)
  const [isOpen, setIsOpen] = useState(false);

  const sessionTypes = {
    'Sesión Fotográfica': { color: 'bg-blue-500', label: 'Sesión Fotográfica', icon: Camera },
    'Entrega': { color: 'bg-green-500', label: 'Entrega', icon: Package },
    'Recordatorio': { color: 'bg-orange-500', label: 'Recordatorio', icon: Bell },
    escolar: { color: 'bg-yellow-500', label: 'Escolar', icon: Backpack },
    familiar: { color: 'bg-pink-500', label: 'Familiar', icon: Users },
    retrato: { color: 'bg-blue-500', label: 'Retrato individual', icon: User },
    grupal: { color: 'bg-purple-500', label: 'Grupal', icon: Users },
    corporativa: { color: 'bg-indigo-500', label: 'Corporativa', icon: Building },
    oleo: { color: 'bg-orange-500', label: 'Óleo', icon: Image },
    recordatorio: { color: 'bg-teal-500', label: 'Recordatorio escolar', icon: GraduationCap },
    otros: { color: 'bg-gray-500', label: 'Otros', icon: Camera }
  };

  const typeInfo = sessionTypes[event.tipo] || sessionTypes.otros;
  
  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const formatTime = useCallback((timeStr) => {
    if (!timeStr) return '';
    return timeStr.slice(0, 5);
  }, []);

  const handleDetailsClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Details clicked for event ${event.id}`);
    if (onClick) {
      onClick(event);
    }
  }, [onClick, event]);

  return (
    // Usando Card como en ContractCard
    <Card className="hover:shadow-lg transition-all duration-200">
      
      {/* ================================== */}
      {/* 1. HEADER DEL ACORDEÓN (Clickeable) */}
      {/* ================================== */}
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <typeInfo.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {event.cliente || event.title || 'Sin título'}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              #{event.id} - {formatDate(event.fecha)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          <div className="text-xs text-gray-500">
            {event.hora && formatTime(event.hora)}
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* ================================= */}
      {/* 2. BODY DEL ACORDEÓN (Contenido desplegable) */}
      {/* ================================= */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {/* Este div agrega un espacio y línea superior cuando está abierto */}
        <div className="pt-4 mt-4 border-t border-gray-100">

          {/* Descripción */}
          {event.descripcion && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Descripción</span>
              </div>
              <p className="text-sm text-gray-600 pl-6">
                {event.descripcion}
              </p>
            </div>
          )}

          {/* Ubicación */}
          {event.ubicacion && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Ubicación</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-md p-2 ml-6">
                <p className="text-green-800 text-sm font-medium">{event.ubicacion}</p>
              </div>
            </div>
          )}

          {/* Información adicional en grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Fecha:</span>
              <p className="font-medium text-gray-900">{formatDate(event.fecha)}</p>
            </div>
            <div>
              <span className="text-gray-500">Hora:</span>
              <p className="font-medium text-gray-900">{event.hora ? formatTime(event.hora) : 'No especificada'}</p>
            </div>
            <div>
              <span className="text-gray-500">Estado:</span>
              <p className="font-medium text-blue-600">{event.estado || 'Programado'}</p>
            </div>
            <div>
              <span className="text-gray-500">Tipo:</span>
              <p className="font-medium text-gray-900">{typeInfo.label}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <button
              onClick={handleDetailsClick}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;