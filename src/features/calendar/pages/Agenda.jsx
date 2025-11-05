import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  Clock,
  User,
  MapPin,
  FileText,
  Camera,
  Package,
  Bell
} from 'lucide-react';
import Button from '@components/ui/Button/Button.jsx';
import FilterSelect from '@/features/calendar/components/FilterSelect.jsx';
import EventCard from '@/features/calendar/components/EventCard.jsx';
import Pagination from '@/features/calendar/components/Pagination.jsx';

const Agenda = () => {
  // Estados principales
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // day, week, month, quarter
  const [activeFilter, setActiveFilter] = useState('todos');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [showEditEventForm, setShowEditEventForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllEventsPanel, setShowAllEventsPanel] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  // Generar datos mock más extensos para todas las vistas
  const generateMockEvents = () => {
    const events = [];
    const today = new Date();
    const tipos = ['Sesión Fotográfica', 'Entrega', 'Recordatorio'];
    const clientes = [
      'I.E. San Martín de Porres - 5to A', 'Colegio Santa Rosa', 'María González Rodríguez',
      'Familia Pérez', 'Empresa TechCorp', 'Universidad Nacional', 'Colegio San José',
      'Ana María López', 'Familia Rodríguez', 'Empresa InnovaTech', 'I.E. Libertador',
      'Carlos Mendoza', 'Familia García', 'Corporación ABC', 'Colegio La Salle',
      'Patricia Vásquez', 'Familia Torres', 'StartUp Digital', 'I.E. Bolognesi',
      'Roberto Silva', 'Familia Morales', 'Empresa Global', 'Colegio Salesiano'
    ];
    const ubicaciones = [
      'Patio principal del colegio', 'Oficina administrativa', 'Estudio fotográfico',
      'Parque central', 'Oficinas del cliente', 'Aula magna', 'Jardín principal',
      'Salón de eventos', 'Plaza de armas', 'Centro comercial', 'Auditorio',
      'Patio de recreo', 'Biblioteca', 'Laboratorio', 'Gimnasio'
    ];

    // Generar eventos para los próximos 3 meses
    for (let i = 0; i < 60; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + Math.floor(Math.random() * 90)); // Próximos 90 días
      
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const cliente = clientes[Math.floor(Math.random() * clientes.length)];
      const ubicacion = ubicaciones[Math.floor(Math.random() * ubicaciones.length)];
      
      const hora = `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`;
      
      events.push({
        id: i + 1,
        cliente,
        tipo,
        descripcion: `${tipo} programada para ${cliente}`,
        fecha: eventDate.toISOString().split('T')[0],
        hora,
        ubicacion,
        estado: Math.random() > 0.3 ? 'confirmada' : 'pendiente'
      });
    }

    return events;
  };

  // Datos mock iniciales
  const mockEvents = generateMockEvents();

  // Estado de eventos con persistencia
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('agenda_events_new');
      return stored ? JSON.parse(stored) : mockEvents;
    } catch (e) {
      console.error('Error loading events from localStorage:', e);
      return mockEvents;
    }
  });

  // Formulario para nuevo evento
  const [newEventForm, setNewEventForm] = useState({
    cliente: '',
    tipo: 'Sesión Fotográfica',
    descripcion: '',
    fecha: '',
    hora: '',
    ubicacion: '',
    estado: 'pendiente'
  });

  const [editEventForm, setEditEventForm] = useState({
    cliente: '',
    tipo: 'Sesión Fotográfica',
    descripcion: '',
    fecha: '',
    hora: '',
    ubicacion: '',
    estado: 'pendiente'
  });

  // Categorías para filtros con colores mejorados
  const categories = [
    { key: 'todos', label: 'Todos', icon: Calendar, color: 'bg-gray-100' },
    { key: 'Sesión Fotográfica', label: 'Sesión Fotográfica', icon: Camera, color: 'bg-blue-100', textColor: 'text-blue-900', borderColor: 'border-blue-300' },
    { key: 'Entrega', label: 'Entrega', icon: Package, color: 'bg-emerald-100', textColor: 'text-emerald-900', borderColor: 'border-emerald-300' },
    { key: 'Recordatorio', label: 'Recordatorio', icon: Bell, color: 'bg-amber-100', textColor: 'text-amber-900', borderColor: 'border-amber-300' }
  ];

  // Función para obtener el color de un evento según su tipo
  const getEventColor = (tipo) => {
    const category = categories.find(cat => cat.key === tipo);
    return category ? {
      bg: category.color,
      text: category.textColor || 'text-gray-800',
      border: category.borderColor || 'border-gray-200'
    } : {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200'
    };
  };

  // Modos de vista del calendario
  const viewModes = [
    { key: 'day', label: 'Día' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
    { key: 'quarter', label: 'Trimestral' }
  ];

  // Persistir eventos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agenda_events_new', JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events to localStorage:', e);
    }
  }, [events]);

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (activeFilter !== 'todos' && event.tipo !== activeFilter) {
        return false;
      }
      return true;
    });
  }, [events, activeFilter]);

  // Eventos próximos (ordenados por fecha)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    return filteredEvents
      .filter(event => {
        const eventDate = new Date(event.fecha);
        eventDate.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [filteredEvents]);

  // Paginación para eventos próximos
  const itemsPerPage = 16;
  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);
  const paginatedEvents = upcomingEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generar calendario según la vista
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    switch (viewMode) {
      case 'day':
        return generateDayView();
      case 'week':
        return generateWeekView();
      case 'month':
        return generateMonthView();
      case 'quarter':
        return generateQuarterView();
      default:
        return generateMonthView();
    }
  };

  // Vista de día
  const generateDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.fecha === dateStr);
    
    return [{
      date: new Date(currentDate),
      dateStr,
      dayEvents,
      isCurrentMonth: true,
      isToday: currentDate.toDateString() === new Date().toDateString()
    }];
  };

  // Vista de semana
  const generateWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek);
      current.setDate(startOfWeek.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.fecha === dateStr);

      days.push({
        date: new Date(current),
        dateStr,
        dayEvents,
        isCurrentMonth: true,
        isToday: current.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  // Vista de mes
  const generateMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Ajustar para que el calendario comience en lunes (1) en lugar de domingo (0)
    let startDay = firstDay.getDay(); // 0 = domingo, 1 = lunes, etc.
    startDay = startDay === 0 ? 6 : startDay - 1; // Convertir: domingo=6, lunes=0, martes=1, etc.
    
    const days = [];
    
    // Agregar días del mes anterior si el mes no comienza en lunes
    if (startDay > 0) {
      const prevMonth = new Date(year, month - 1, 0); // Último día del mes anterior
      const prevMonthLastDay = prevMonth.getDate();
      
      for (let day = prevMonthLastDay - startDay + 1; day <= prevMonthLastDay; day++) {
        const current = new Date(year, month - 1, day);
        const dateStr = current.toISOString().split('T')[0];
        // Filtrar eventos según el filtro activo
        const allDayEvents = events.filter(event => event.fecha === dateStr);
        const dayEvents = activeFilter === 'todos' 
          ? allDayEvents 
          : allDayEvents.filter(event => event.tipo === activeFilter);
        const isToday = current.toDateString() === new Date().toDateString();

        days.push({
          date: new Date(current),
          dateStr,
          dayEvents,
          isCurrentMonth: false,
          isToday
        });
      }
    }
    
    // Agregar los días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const current = new Date(year, month, day);
      const dateStr = current.toISOString().split('T')[0];
      // Filtrar eventos según el filtro activo
      const allDayEvents = events.filter(event => event.fecha === dateStr);
      const dayEvents = activeFilter === 'todos' 
        ? allDayEvents 
        : allDayEvents.filter(event => event.tipo === activeFilter);
      const isToday = current.toDateString() === new Date().toDateString();

      days.push({
        date: new Date(current),
        dateStr,
        dayEvents,
        isCurrentMonth: true,
        isToday
      });
    }

    // Agregar días del mes siguiente para completar la grilla de 6 filas (42 celdas)
    const remainingCells = 35 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const current = new Date(year, month + 1, day);
      const dateStr = current.toISOString().split('T')[0];
      // Filtrar eventos según el filtro activo
      const allDayEvents = events.filter(event => event.fecha === dateStr);
      const dayEvents = activeFilter === 'todos' 
        ? allDayEvents 
        : allDayEvents.filter(event => event.tipo === activeFilter);
      const isToday = current.toDateString() === new Date().toDateString();

      days.push({
        date: new Date(current),
        dateStr,
        dayEvents,
        isCurrentMonth: false,
        isToday
      });
    }

    return days;
  };

  // Vista trimestral
  const generateQuarterView = () => {
    const year = currentDate.getFullYear();
    const quarter = Math.floor(currentDate.getMonth() / 3);
    const startMonth = quarter * 3;
    
    const months = [];
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const monthDate = new Date(year, startMonth + monthOffset, 1);
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.fecha);
        return eventDate.getFullYear() === year && 
               eventDate.getMonth() === startMonth + monthOffset;
      });

      months.push({
        date: monthDate,
        dateStr: monthDate.toISOString().split('T')[0],
        dayEvents: monthEvents,
        isCurrentMonth: true,
        isToday: false,
        monthName: monthDate.toLocaleDateString('es-ES', { month: 'long' }),
        eventCount: monthEvents.length
      });
    }
    return months;
  };

  // Manejar creación de nuevo evento
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventForm.cliente || !newEventForm.fecha || !newEventForm.hora) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const newEvent = {
      id: Date.now(),
      ...newEventForm
    };

    setEvents(prev => [...prev, newEvent]);
    setNewEventForm({
      cliente: '',
      tipo: 'Sesión Fotográfica',
      descripcion: '',
      fecha: '',
      hora: '',
      ubicacion: '',
      estado: 'pendiente'
    });
    setShowNewEventForm(false);
  };

  // Manejar eliminación de evento
  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación de evento
  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      setEvents(prev => prev.filter(event => event.id !== eventToDelete));
      setShowEventPanel(false);
      setSelectedEvent(null);
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  // Cancelar eliminación de evento
  const cancelDeleteEvent = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  // Manejar edición de evento
  const handleEditEvent = (event) => {
    setEditEventForm({
      cliente: event.cliente,
      tipo: event.tipo,
      descripcion: event.descripcion,
      fecha: event.fecha,
      hora: event.hora,
      ubicacion: event.ubicacion,
      estado: event.estado
    });
    setShowEditEventForm(true);
    setShowEventPanel(false);
  };

  // Guardar evento editado
  const handleSaveEditEvent = () => {
    if (selectedEvent && editEventForm.cliente && editEventForm.fecha && editEventForm.hora) {
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...editEventForm }
          : event
      ));
      setShowEditEventForm(false);
      setSelectedEvent(null);
      setEditEventForm({
        cliente: '',
        tipo: 'Sesión Fotográfica',
        descripcion: '',
        fecha: '',
        hora: '',
        ubicacion: '',
        estado: 'pendiente'
      });
    }
  };

  // Cancelar edición de evento
  const handleCancelEditEvent = () => {
    setShowEditEventForm(false);
    setEditEventForm({
      cliente: '',
      tipo: 'Sesión Fotográfica',
      descripcion: '',
      fecha: '',
      hora: '',
      ubicacion: '',
      estado: 'pendiente'
    });
  };

  // Manejar clic en contador de eventos
  const handleCounterClick = (dayEvents, dayDate) => {
    setSelectedDayEvents(dayEvents);
    setSelectedDayDate(dayDate);
    setShowAllEventsPanel(true);
    // Cerrar el panel de detalles del evento si está abierto
    setShowEventPanel(false);
    setSelectedEvent(null);
  };

  // Navegación del calendario
  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(currentDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + direction);
        break;
      case 'quarter':
        newDate.setMonth(currentDate.getMonth() + (direction * 3));
        break;
      default:
        newDate.setMonth(currentDate.getMonth() + direction);
    }
    
    setCurrentDate(newDate);
  };

  // Función para obtener el título del calendario según la vista
  const getCalendarTitle = () => {
    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString('es-ES', { 
          weekday: 'long',
          day: 'numeric',
          month: 'long', 
          year: 'numeric' 
        });
      case 'week':
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(currentDate.getDate() - day);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
      case 'quarter':
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        return `Q${quarter} ${currentDate.getFullYear()}`;
      default:
        return currentDate.toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        });
    }
  };

  // Renderizar calendario según la vista
  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'quarter':
        return renderQuarterView();
      default:
        return renderMonthView();
    }
  };

  // Vista diaria
  const renderDayView = () => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.fecha);
      const matchesDate = eventDate.toDateString() === currentDate.toDateString();
      const matchesFilter = activeFilter === 'todos' || event.tipo === activeFilter;
      return matchesDate && matchesFilter;
    });

    return (
      <div className="p-4">
        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay eventos para este día
            </div>
          ) : (
            dayEvents.map(event => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEventPanel(true);
                  // Cerrar el panel de todos los eventos si está abierto
                  setShowAllEventsPanel(false);
                  setSelectedDayEvents([]);
                  setSelectedDayDate(null);
                }}
                className="p-3 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
              >
                <div className="font-medium">{event.cliente}</div>
                <div className="text-sm opacity-75">{event.hora} - {event.tipo}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Vista semanal
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayEvents = events.filter(event => {
              const eventDate = new Date(event.fecha);
              const matchesDate = eventDate.toDateString() === day.toDateString();
              const matchesFilter = activeFilter === 'todos' || event.tipo === activeFilter;
              return matchesDate && matchesFilter;
            });

            return (
              <div key={index} className="border border-gray-200 rounded-lg p-2 min-h-[120px]">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {day.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventPanel(true);
                        // Cerrar el panel de todos los eventos si está abierto
                        setShowAllEventsPanel(false);
                        setSelectedDayEvents([]);
                        setSelectedDayDate(null);
                      }}
                      className="text-xs p-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      {event.cliente}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 3} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Vista trimestral
  const renderQuarterView = () => {
    const currentMonth = currentDate.getMonth();
    const quarterStart = Math.floor(currentMonth / 3) * 3;
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(currentDate.getFullYear(), quarterStart + i, 1);
      months.push(monthDate);
    }

    return (
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {months.map((month, monthIndex) => {
            const monthEvents = events.filter(event => {
              const eventDate = new Date(event.fecha);
              const matchesMonth = eventDate.getMonth() === month.getMonth() && 
                     eventDate.getFullYear() === month.getFullYear();
              const matchesFilter = activeFilter === 'todos' || event.tipo === activeFilter;
              return matchesMonth && matchesFilter;
            });

            return (
              <div key={monthIndex} className="border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {month.toLocaleDateString('es-ES', { month: 'long' })}
                </h4>
                <div className="space-y-2">
                  {monthEvents.slice(0, 5).map(event => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventPanel(true);
                        // Cerrar el panel de todos los eventos si está abierto
                        setShowAllEventsPanel(false);
                        setSelectedDayEvents([]);
                        setSelectedDayDate(null);
                      }}
                      className="text-xs p-2 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      <div className="font-medium">{event.cliente}</div>
                      <div className="opacity-75">
                        {new Date(event.fecha).getDate()} - {event.tipo}
                      </div>
                    </div>
                  ))}
                  {monthEvents.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{monthEvents.length - 5} eventos más
                    </div>
                  )}
                  {monthEvents.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-4">
                      Sin eventos
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Generar días del calendario
  const calendarDays = generateCalendar();

  // Vista mensual
  const renderMonthView = () => {
    return (
      <div className="p-4 h-full flex flex-col">
        <div 
          className="grid gap-1 flex-1 min-h-0" 
          style={{ 
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(5, minmax(0, 1fr))' 
          }}
        >
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                p-2 border border-gray-100 rounded-lg cursor-pointer
                transition-colors hover:bg-gray-50 flex flex-col
                ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${day.isToday ? 'ring-2 ring-primary ring-opacity-50' : ''}
              `}
              style={{ 
                height: '100%', // Usar 100% de la altura disponible en la grilla
                minHeight: '90px' // Aumentar altura mínima para mejor simetría
              }}
            >
              <div className="flex justify-between items-start mb-1 flex-shrink-0">
                <span className={`text-sm font-medium ${
                  day.isToday ? 'text-primary' : 
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {day.date.getDate()}
                </span>
                {day.dayEvents.length > 0 && (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCounterClick(day.dayEvents, day.date);
                    }}
                    className="text-xs bg-primary text-white rounded-full px-1 cursor-pointer hover:bg-primary/80 transition-colors"
                  >
                    {day.dayEvents.length}
                  </span>
                )}
              </div>
              
              {/* Eventos del día */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {day.dayEvents.slice(0, 2).map(event => {
                  const eventColors = getEventColor(event.tipo);
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setShowEventPanel(true);
                        // Cerrar el panel de todos los eventos si está abierto
                        setShowAllEventsPanel(false);
                        setSelectedDayEvents([]);
                        setSelectedDayDate(null);
                      }}
                      className={`text-xs p-1 rounded truncate transition-colors cursor-pointer border ${eventColors.bg} ${eventColors.text} ${eventColors.border} hover:opacity-80`}
                    >
                      {event.cliente}
                    </div>
                  );
                })}
                {day.dayEvents.length > 2 && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCounterClick(day.dayEvents, day.date);
                    }}
                    className="text-xs text-gray-500 cursor-pointer hover:text-primary transition-colors"
                  >
                    +{day.dayEvents.length - 2} más
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-600">Gestiona tus sesiones y eventos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FilterSelect
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              categories={categories}
            />
            <Button
              onClick={() => setShowNewEventForm(true)}
              className="bg-primary hover:bg-primary/90"
              icon={<Plus className="w-4 h-4" />}
            >
              Nuevo Evento
            </Button>
          </div>
        </div>
      </div>

      <div className={`flex gap-6 ${
        (showEventPanel || showAllEventsPanel) ? 'flex-row' : 'flex-col'
      }`}>
        {/* Calendario principal */}
        <div className={`${
          (showEventPanel || showAllEventsPanel) ? 'flex-1' : 'w-full'
        }`}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[700px] flex flex-col">
            {/* Header del calendario */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateCalendar(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getCalendarTitle()}
                  </h2>
                  
                  <button
                    onClick={() => navigateCalendar(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Botones de vista */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {viewModes.map(mode => (
                    <button
                      key={mode.key}
                      onClick={() => setViewMode(mode.key)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        viewMode === mode.key
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Días de la semana - solo para vista mensual */}
              {viewMode === 'month' && (
                <div className="grid grid-cols-7 gap-1">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contenido del calendario */}
            <div className="flex-1 overflow-hidden">
              {renderCalendarContent()}
            </div>
          </div>
        </div>

        {/* Panel lateral de detalles del evento o todos los eventos */}
        <div className={`overflow-hidden ${
          (showEventPanel || showAllEventsPanel) ? 'w-96' : 'w-0'
        }`} style={{ width: (showEventPanel || showAllEventsPanel) ? '380px' : '0px' }}>
          {showEventPanel && selectedEvent && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[700px] flex flex-col w-full max-w-96 min-w-96 flex-shrink-0" style={{ width: '380px', maxWidth: '380px', minWidth: '380px' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Detalles del Evento</h3>
                <button
                  onClick={() => {
                    setShowEventPanel(false);
                    setSelectedEvent(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                {/* Información del Cliente */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Cliente</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 w-full break-words">{selectedEvent.cliente}</p>
                </div>

                {/* Tipo de Evento */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tipo de Evento</span>
                  </div>
                  <div className="w-full">
                    <span className="inline-flex items-center px-2 py-1 bg-primary text-white rounded text-xs font-medium">
                      {selectedEvent.tipo}
                    </span>
                  </div>
                </div>

                {/* Fecha y Hora */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Fecha y Hora</span>
                  </div>
                  <div className="space-y-1 w-full">
                    <p className="text-sm font-medium text-gray-900 w-full break-words">
                      {new Date(selectedEvent.fecha).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-primary font-semibold text-xs w-full">{selectedEvent.hora}</p>
                  </div>
                </div>

                {/* Ubicación */}
                {selectedEvent.ubicacion && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Ubicación</span>
                    </div>
                    <p className="text-sm text-gray-900 w-full break-words">{selectedEvent.ubicacion}</p>
                  </div>
                )}

                {/* Descripción */}
                {selectedEvent.descripcion && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Descripción</span>
                    </div>
                    <p className="text-sm text-gray-900 leading-relaxed w-full break-words">{selectedEvent.descripcion}</p>
                  </div>
                )}

                {/* Estado */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full ${
                      selectedEvent.estado === 'confirmada' 
                        ? 'bg-green-500' 
                        : selectedEvent.estado === 'pendiente'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Estado</span>
                  </div>
                  <div className="w-full">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      selectedEvent.estado === 'confirmada' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedEvent.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.estado === 'confirmada' ? 'Confirmada' : 
                       selectedEvent.estado === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditEvent(selectedEvent)}
                  icon={<Edit className="w-4 h-4" />}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                  className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          )}
          
          {/* Panel lateral de todos los eventos acumulados */}
          {showAllEventsPanel && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[700px] flex flex-col w-full max-w-96 min-w-96 flex-shrink-0" style={{ width: '380px', maxWidth: '380px', minWidth: '380px' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">
                  Todos los Eventos - {selectedDayDate ? `${selectedDayDate.getDate()} de ${selectedDayDate.toLocaleDateString('es-ES', { month: 'long' })}` : 'Eventos'}
                </h3>
                <button
                  onClick={() => {
                    setShowAllEventsPanel(false);
                    setSelectedDayEvents([]);
                    setSelectedDayDate(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-2 space-y-3 overflow-y-auto" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                {selectedDayEvents && selectedDayEvents.length > 0 ? selectedDayEvents.map(event => {
                  const eventColors = getEventColor(event.tipo);
                  return (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventPanel(true);
                        setShowAllEventsPanel(false);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-200 ${eventColors.bg} ${eventColors.border} ${eventColors.text}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm truncate">{event.cliente}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${eventColors.bg} ${eventColors.text}`}>
                          {event.tipo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <span>{event.hora}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.estado === 'confirmada' 
                            ? 'bg-green-100 text-green-800' 
                            : event.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {event.estado === 'confirmada' ? 'Confirmada' : 
                           event.estado === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                        </span>
                      </div>
                      {event.ubicacion && (
                        <div className="text-xs opacity-75 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.ubicacion}
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay eventos para este día
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Próximos eventos */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Eventos</h2>
        
        {paginatedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventModal(true);
                  }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer p-4"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {event.cliente || event.title || 'Sin título'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        #{event.id} - {new Date(event.fecha).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {(() => {
                      const eventColors = getEventColor(event.tipo);
                      return (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${eventColors.bg} ${eventColors.textColor || eventColors.text} ${eventColors.borderColor || eventColors.border}`}>
                          {event.tipo}
                        </span>
                      );
                    })()}
                    <span className="text-sm text-gray-500">
                      {event.hora && event.hora.slice(0, 5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={upcomingEvents.length}
            />
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay eventos próximos
          </div>
        )}
      </div>

      {/* Formulario de nuevo evento */}
      {showNewEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nuevo Evento</h3>
                <button
                  onClick={() => setShowNewEventForm(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente / Título *
                  </label>
                  <input
                    type="text"
                    value={newEventForm.cliente}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, cliente: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de evento *
                  </label>
                  <select
                    value={newEventForm.tipo}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Sesión Fotográfica">Sesión Fotográfica</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Recordatorio">Recordatorio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={newEventForm.descripcion}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={newEventForm.fecha}
                      onChange={(e) => setNewEventForm(prev => ({ ...prev, fecha: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={newEventForm.hora}
                      onChange={(e) => setNewEventForm(prev => ({ ...prev, hora: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={newEventForm.ubicacion}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, ubicacion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewEventForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Guardar Evento
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de editar evento */}
      {showEditEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Editar Evento</h3>
                <button
                  onClick={handleCancelEditEvent}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveEditEvent(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente / Título *
                  </label>
                  <input
                    type="text"
                    value={editEventForm.cliente}
                    onChange={(e) => setEditEventForm(prev => ({ ...prev, cliente: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de evento *
                  </label>
                  <select
                    value={editEventForm.tipo}
                    onChange={(e) => setEditEventForm(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Sesión Fotográfica">Sesión Fotográfica</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Recordatorio">Recordatorio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={editEventForm.descripcion}
                    onChange={(e) => setEditEventForm(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={editEventForm.fecha}
                      onChange={(e) => setEditEventForm(prev => ({ ...prev, fecha: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={editEventForm.hora}
                      onChange={(e) => setEditEventForm(prev => ({ ...prev, hora: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={editEventForm.ubicacion}
                    onChange={(e) => setEditEventForm(prev => ({ ...prev, ubicacion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={editEventForm.estado}
                    onChange={(e) => setEditEventForm(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditEvent}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                <button
                  onClick={cancelDeleteEvent}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelDeleteEvent}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={confirmDeleteEvent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del evento */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold text-gray-900">Detalles del Evento</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Header del evento */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedEvent.cliente || selectedEvent.title || 'Sin título'}
                    </h4>
                    <p className="text-gray-500">#{selectedEvent.id}</p>
                    {(() => {
                      const eventColors = getEventColor(selectedEvent.tipo);
                      return (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${eventColors.bg} ${eventColors.textColor || eventColors.text} ${eventColors.borderColor || eventColors.border} mt-2`}>
                          {selectedEvent.tipo}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Información del evento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <p className="text-gray-900">
                        {new Date(selectedEvent.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {selectedEvent.hora && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                        <p className="text-gray-900">{selectedEvent.hora}</p>
                      </div>
                    )}

                    {selectedEvent.duracion && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                        <p className="text-gray-900">{selectedEvent.duracion}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedEvent.telefono && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <p className="text-gray-900">{selectedEvent.telefono}</p>
                      </div>
                    )}

                    {selectedEvent.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{selectedEvent.email}</p>
                      </div>
                    )}

                    {selectedEvent.presupuesto && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
                        <p className="text-gray-900">${selectedEvent.presupuesto.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ubicación */}
                {selectedEvent.ubicacion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedEvent.ubicacion}</span>
                    </div>
                  </div>
                )}

                {/* Descripción */}
                {selectedEvent.descripcion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedEvent.descripcion}
                    </p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setShowEventModal(false);
                      handleEditEvent(selectedEvent);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowEventModal(false);
                      handleDeleteEvent(selectedEvent);
                    }}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;