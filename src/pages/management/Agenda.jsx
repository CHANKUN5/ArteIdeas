import { AlertCircle, Calendar, CheckCircle, ChevronLeft, ChevronRight, Circle, Clock, Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Agenda = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventModal, setShowEventModal] = useState(false); // Detalles del evento
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('todos');
  // Nuevo estado para búsqueda de sesiones
  const [sessionSearch, setSessionSearch] = useState('');
  // Estado para filtro de estado
  const [statusFilter, setStatusFilter] = useState('todos');
  // Estado para filtro de tipo de sesión
  const [sessionTypeFilter, setSessionTypeFilter] = useState('todos');
  // Fecha de referencia para el calendario (primer día del mes mostrado)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Estado para contratos y pedidos
  const [contracts, setContracts] = useState(() => {
    try {
      const stored = localStorage.getItem('contracts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error leyendo contratos de localStorage', e);
      return [];
    }
  });
  
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('orders');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error leyendo pedidos de localStorage', e);
      return [];
    }
  });

  // Estado de eventos (persistencia inmediata con lazy initializer)
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('agenda_events');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error leyendo agenda_events de localStorage', e);
      return [];
    }
  });
  
  // Formulario controlado para crear/editar evento
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    type: 'sesion',
    sessionType: 'escolar', // Nuevo campo para tipo de sesión
    status: 'pendiente',
    participants: 0,
    notes: '',
    tasks: [],
    contractId: '', // ID del contrato relacionado
    orderId: '', // ID del pedido relacionado
    isContractEvent: false, // Indica si el evento está vinculado a un contrato
    isOrderEvent: false // Indica si el evento está vinculado a un pedido
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  
  // Modales de confirmación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Guardar en localStorage cuando cambien (simple y robusto)
  useEffect(() => {
    try {
      localStorage.setItem('agenda_events', JSON.stringify(events));
    } catch (e) {
      console.error('Error guardando eventos en localStorage', e);
    }
  }, [events]);

  // Cargar contratos y pedidos al montar el componente
  useEffect(() => {
    try {
      const storedContracts = localStorage.getItem('contracts');
      if (storedContracts) {
        setContracts(JSON.parse(storedContracts));
      }
      
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (e) {
      console.error('Error cargando contratos/pedidos', e);
    }
  }, []);

  // Cargar automáticamente las sesiones programadas de contratos/pedidos
  useEffect(() => {
    // Verificar si ya existen eventos para los contratos/pedidos
    const contractEvents = events.filter(event => event.isContractEvent);
    const orderEvents = events.filter(event => event.isOrderEvent);
    
    const contractIds = contractEvents.map(event => event.contractId);
    const orderIds = orderEvents.map(event => event.orderId);
    
    // Crear eventos automáticos para contratos que no tienen eventos
    const newContractEvents = contracts
      .filter(contract => !contractIds.includes(contract.id) && contract.estado === 'Activo')
      .map(contract => ({
        id: `auto-contract-${contract.id}-${Date.now()}`,
        title: `Sesión - ${contract.servicio}`,
        client: contract.cliente,
        date: new Date().toISOString().split('T')[0], // Fecha actual como fecha provisional
        time: '10:00',
        duration: '2 horas',
        location: '',
        type: 'sesion',
        sessionType: 'escolar',
        status: 'pendiente',
        participants: contract.estudiantes || 0,
        notes: `Sesión automática programada para el contrato: ${contract.servicio}`,
        tasks: [],
        contractId: contract.id,
        orderId: '',
        isContractEvent: true,
        isOrderEvent: false
      }));
    
    // Crear eventos automáticos para pedidos que no tienen eventos
    const newOrderEvents = orders
      .filter(order => !orderIds.includes(order.id) && order.estado === 'Nuevo')
      .map(order => ({
        id: `auto-order-${order.id}-${Date.now()}`,
        title: `Sesión - ${order.servicio}`,
        client: order.cliente,
        date: new Date().toISOString().split('T')[0], // Fecha actual como fecha provisional
        time: '15:00',
        duration: '1 hora',
        location: '',
        type: 'sesion',
        sessionType: order.servicio.toLowerCase().includes('familiar') ? 'familiar' : 'otro',
        status: 'pendiente',
        participants: 0,
        notes: `Sesión automática programada para el pedido: ${order.servicio}`,
        tasks: [],
        contractId: '',
        orderId: order.id,
        isContractEvent: false,
        isOrderEvent: true
      }));
    
    // Añadir los nuevos eventos si hay alguno
    if (newContractEvents.length > 0 || newOrderEvents.length > 0) {
      setEvents(prev => [...prev, ...newContractEvents, ...newOrderEvents]);
    }
  }, [contracts, orders]);


  const eventTypes = {
    reunion: { color: 'bg-orange-500', label: 'Reunión', icon: '🤝' },
    sesion_escolar: { color: 'bg-blue-500', label: 'Sesión escolar', icon: '🎓' },
    sesion_familiar: { color: 'bg-purple-500', label: 'Sesión familiar', icon: '👨‍👩‍👧' },
    sesion_retrato: { color: 'bg-pink-500', label: 'Retrato individual', icon: '👤' },
    sesion_grupal: { color: 'bg-indigo-500', label: 'Sesión grupal', icon: '👥' },
    sesion_corporativa: { color: 'bg-gray-600', label: 'Sesión corporativa', icon: '🏢' },
    sesion_oleo: { color: 'bg-amber-500', label: 'Óleo', icon: '🎨' },
    recordatorio_escolar: { color: 'bg-green-500', label: 'Recordatorio escolar', icon: '📚' },
    evento_social: { color: 'bg-red-500', label: 'Evento social', icon: '🎉' },
    producto: { color: 'bg-teal-500', label: 'Producto', icon: '📦' },
    otro: { color: 'bg-gray-400', label: 'Otro', icon: '📅' },
    promocion: { color: 'bg-indigo-500', label: 'Promoción', icon: '🎓' },
    entrega: { color: 'bg-green-500', label: 'Entrega', icon: '📦' }
  };
  
  // Tipos de sesión para filtrado y análisis
  const sessionTypes = [
    'escolar',
    'familiar',
    'retrato individual',
    'grupal',
    'corporativa',
    'óleo',
    'recordatorio escolar',
    'evento social',
    'producto',
    'otro'
  ];
  
  // Mapeo de tipos de sesión a claves de eventTypes
  const sessionTypeToEventType = {
    'escolar': 'sesion_escolar',
    'familiar': 'sesion_familiar',
    'retrato individual': 'sesion_retrato',
    'grupal': 'sesion_grupal',
    'corporativa': 'sesion_corporativa',
    'óleo': 'sesion_oleo',
    'recordatorio escolar': 'recordatorio_escolar',
    'evento social': 'evento_social',
    'producto': 'producto',
    'otro': 'otro'
  };
  
  // Función para obtener el tipo de evento basado en sessionType
  const getEventTypeFromSession = (sessionType, baseType = 'sesion') => {
    if (baseType === 'entrega') return 'entrega';
    if (baseType === 'reunion') return 'reunion';
    if (baseType === 'promocion') return 'promocion';
    
    return sessionTypeToEventType[sessionType] || 'otro';
  };

  const statusColors = {
    'pendiente_confirmacion': 'bg-yellow-500 text-white border-yellow-600',
    'confirmada': 'bg-blue-500 text-white border-blue-600',
    'en_ejecucion': 'bg-orange-500 text-white border-orange-600',
    'en_edicion': 'bg-purple-500 text-white border-purple-600',
    'entregado': 'bg-green-500 text-white border-green-600',
    'pendiente': 'bg-red-500 text-white border-red-600',
    'cancelada': 'bg-red-500 text-white border-red-600'
  };

  const deriveStatusFromType = (type) => {
    // Actualizado para usar los nuevos estados
    if (type === 'sesion') return 'pendiente_confirmacion';
    if (type === 'entrega') return 'entregado';
    if (type === 'reunion') return 'confirmada';
    return 'pendiente_confirmacion';
  };

  // Sincronizar el calendario con el filtro de fecha
  useEffect(() => {
    if (!selectedDate) return;
    const d = new Date(`${selectedDate}T00:00:00`);
    setCurrentMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [selectedDate]);

  const filteredEvents = events.filter(event => {
    if (filter !== 'todos' && event.type !== filter) return false;
    if (sessionSearch.trim()) {
      const term = sessionSearch.trim().toLowerCase();
      if (!(event.title || '').toLowerCase().includes(term) && 
          !(event.client || '').toLowerCase().includes(term) &&
          !(event.location || '').toLowerCase().includes(term)) return false;
    }
    if (statusFilter !== 'todos') {
      const eventStatus = event.status || deriveStatusFromType(event.type);
      if (eventStatus !== statusFilter) return false;
    }
    if (sessionTypeFilter !== 'todos' && event.type === 'sesion') {
      if (event.sessionType !== sessionTypeFilter) return false;
    }
    if (selectedDate) {
      // Comparación de fecha exacta (YYYY-MM-DD)
      if ((event.date || '').slice(0, 10) !== selectedDate) return false;
    }
    return true;
  });

  // Orden y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Asegurarse de que los eventos se muestren correctamente
  useEffect(() => {
    console.log("Eventos actuales:", events);
    console.log("Eventos filtrados:", filteredEvents);
    
    // Verificar localStorage para depuración
    try {
      const storedEvents = localStorage.getItem('agenda_events');
      console.log("Eventos en localStorage:", storedEvents ? JSON.parse(storedEvents) : []);
    } catch (error) {
      console.error("Error al leer eventos de localStorage:", error);
    }
  }, [events, filteredEvents]);
  
  const sortedEvents = [...filteredEvents].sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = sortedEvents.slice(pageStart, pageStart + itemsPerPage);

  // Progreso según tareas
  const getProgress = (ev) => {
    if (!ev || !Array.isArray(ev.tasks) || ev.tasks.length === 0) return 0;
    const completed = ev.tasks.filter(t => t.completed).length;
    return Math.round((completed / ev.tasks.length) * 100);
  };

  // Utilidades de calendario
  const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentMonthDate);
  const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
  const statusPriority = { 
    pendiente_confirmacion: 1, 
    confirmada: 2, 
    en_ejecucion: 3, 
    en_edicion: 4, 
    entregado: 5,
    cancelado: 0 
  };

  // Generar calendario para el mes en currentMonthDate
  const generateCalendar = () => {
    const days = [];
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay(); // 0=Dom, 6=Sab para alinear con cabecera DOM..SÁB
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Relleno de días en blanco antes del 1
    for (let i = 0; i < startWeekday; i++) {
      days.push(<div key={`blank-${i}`} className="py-3 border border-gray-100 bg-white" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad2(month + 1)}-${pad2(d)}`;
      const eventsInDay = events.filter(ev => (ev.date || '').slice(0, 10) === dateStr);

      // Determinar estado dominante del día
      let dominantStatus = null;
      for (const ev of eventsInDay) {
        const st = ev.status || deriveStatusFromType(ev.type);
        if (!dominantStatus || statusPriority[st] > statusPriority[dominantStatus]) {
          dominantStatus = st;
        }
      }

      let bgClass = '';
      let statusIcon = null;
      if (dominantStatus === 'pendiente_confirmacion') {
        bgClass = 'bg-yellow-200';
        statusIcon = <Circle className="w-4 h-4 text-yellow-500" />;
      } else if (dominantStatus === 'confirmada') {
        bgClass = 'bg-blue-200';
        statusIcon = <AlertCircle className="w-4 h-4 text-blue-500" />;
      } else if (dominantStatus === 'en_ejecucion') {
        bgClass = 'bg-orange-200';
        statusIcon = <Clock className="w-4 h-4 text-orange-500" />;
      } else if (dominantStatus === 'en_edicion') {
        bgClass = 'bg-purple-200';
        statusIcon = <Edit className="w-4 h-4 text-purple-500" />;
      } else if (dominantStatus === 'entregado') {
        bgClass = 'bg-green-200';
        statusIcon = <CheckCircle className="w-4 h-4 text-green-500" />;
      } else if (dominantStatus === 'cancelado') {
        bgClass = 'bg-red-200';
        statusIcon = <X className="w-4 h-4 text-red-500" />;
      }

      days.push(
        <div
          key={`day-${dateStr}`}
          className={`text-center py-3 border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${bgClass}`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="relative">
            <div className="text-sm font-medium">{d}</div>
            {statusIcon && (
              <div className="absolute -top-1 -right-1">{statusIcon}</div>
            )}
            
            {/* Mostrar eventos del día con iconos según tipo */}
            {eventsInDay.length > 0 && (
              <div className="mt-1 px-1">
                {eventsInDay.slice(0, 2).map((ev, idx) => {
                  // Determinar el tipo de evento real basado en sessionType y type
                  const eventTypeKey = getEventTypeFromSession(ev.sessionType, ev.type);
                  const eventType = eventTypes[eventTypeKey] || eventTypes.otro;
                  
                  // Determinar el estado para el borde de forma segura
                  let statusClass = '';
                  if (ev.status && statusColors && statusColors[ev.status]) {
                    statusClass = `border-2 border-${ev.status === 'confirmada' ? 'blue' : 
                                  ev.status === 'pendiente_confirmacion' ? 'yellow' : 
                                  ev.status === 'en_ejecucion' ? 'orange' : 
                                  ev.status === 'en_edicion' ? 'purple' : 
                                  ev.status === 'entregado' ? 'green' : 
                                  ev.status === 'cancelado' ? 'red' : 'gray'}-500`;
                  }
                  
                  return (
                    <div 
                      key={idx} 
                      className={`text-xs truncate mb-1 px-1 py-0.5 rounded ${eventType.color} text-white cursor-pointer flex items-center ${statusClass}`}
                      title={`${ev.title} - ${ev.client || 'Sin cliente'}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se active el onClick del día
                        // Redirigir a la ficha del contrato o pedido asociado
                        if (ev.isContractEvent && ev.contractId) {
                          navigate(`/contratos/${ev.contractId}`);
                        } else if (ev.isOrderEvent && ev.orderId) {
                          navigate(`/pedidos/${ev.orderId}`);
                        } else {
                          setSelectedEvent(ev);
                          setShowEventModal(true);
                        }
                      }}
                    >
                      <span className="mr-1">{eventType.icon}</span>
                      <span className="truncate">
                        {ev.client} – {ev.title}
                        {ev.sessionType && <span className="opacity-75"> ({ev.sessionType.charAt(0).toUpperCase() + ev.sessionType.slice(1)})</span>}
                      </span>
                      {(ev.isContractEvent || ev.isOrderEvent) && (
                        <span className="ml-auto text-xs">
                          {ev.isContractEvent ? `📄 #${ev.contractId?.slice(-3) || ''}` : `🛒 #${ev.orderId?.slice(-3) || ''}`}
                        </span>
                      )}
                    </div>
                  );
                })}
                {eventsInDay.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">+{eventsInDay.length - 2} más</div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };
  
  // Componente para mostrar una tarea
  const TaskItem = ({ task, onToggle }) => (
    <div className="flex items-center space-x-2 py-1">
      <div 
        className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${
          task.completed ? 'bg-primary border-primary' : 'border-gray-300'
        }`}
        onClick={onToggle}
      >
        {task.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>
      <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {task.name}
      </span>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isContractEvent"
                    name="isContractEvent"
                    checked={eventFormData.isContractEvent}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Si se marca contrato, desmarcamos pedido
                        setEventFormData(prev => ({ 
                          ...prev, 
                          isContractEvent: true,
                          isOrderEvent: false 
                        }));
                      } else {
                        setEventFormData(prev => ({ ...prev, isContractEvent: false }));
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isContractEvent" className="ml-2 block text-sm text-gray-700">
                    Vincular a un contrato
                  </label>
                </div>
                {eventFormData.isContractEvent && (
                  <select
                    name="contractId"
                    value={eventFormData.contractId}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, contractId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">Seleccionar contrato</option>
                    {contracts.map(contract => (
                      <option key={contract.id} value={contract.id}>
                        {contract.id} - {contract.client}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isOrderEvent"
                    name="isOrderEvent"
                    checked={eventFormData.isOrderEvent}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Si se marca pedido, desmarcamos contrato
                        setEventFormData(prev => ({ 
                          ...prev, 
                          isOrderEvent: true,
                          isContractEvent: false 
                        }));
                      } else {
                        setEventFormData(prev => ({ ...prev, isOrderEvent: false }));
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isOrderEvent" className="ml-2 block text-sm text-gray-700">
                    Vincular a un pedido
                  </label>
                </div>
                {eventFormData.isOrderEvent && (
                  <select
                    name="orderId"
                    value={eventFormData.orderId}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, orderId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">Seleccionar pedido</option>
                    {orders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.id} - {order.client}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
              <p className="text-sm text-gray-500">Gestiona tus citas y eventos</p>
            </div>
          </div>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowEventForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Nueva Sesión
          </Button>
        </div>
      </div>

      {/* Sección de Filtros */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Sesión</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por título, cliente o ubicación"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente_confirmacion">Pendiente de confirmación</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_ejecucion">En ejecución</option>
                <option value="en_edicion">En edición/retoque</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-end mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de sesión</label>
              <select
                value={sessionTypeFilter}
                onChange={(e) => setSessionTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="todos">Todos los tipos</option>
                {sessionTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedDate('');
                  setSessionSearch('');
                  setStatusFilter('todos');
                  setSessionTypeFilter('todos');
                  setFilter('todos');
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resto del código permanece igual */}
      {/* Calendario */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header del calendario */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</h2>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Leyenda de sesiones */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Pendiente de confirmación</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Confirmada</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">En ejecución</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600">En edición</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Entregado</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Completada</span>
              </div>
            </div>
          </div>
          
          {/* Grid del calendario */}
          <div className="grid grid-cols-7">
            {/* Días de la semana */}
            {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 border-b border-gray-200">
                {day}
              </div>
            ))}
            
            {/* Días del mes */}
            {generateCalendar()}
          </div>
        </div>
      </div>
      
      {/* Resto del código permanece igual */}
      {/* Tabla de Sesiones Programadas */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sesiones Programadas</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.time} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.status === 'confirmado' ? 'Confirmada' : 
                         event.status === 'pendiente' ? 'Pendiente' :
                         event.status === 'completado' ? 'Completada' : event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgress(event)}%` }}
                        ></div>
                      </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedEvent(event); setShowEventModal(true); }}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEventToEdit(event); setConfirmEditOpen(true); }}
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEventToDelete(event); setConfirmDeleteOpen(true); }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación de sesiones */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Mostrando {sortedEvents.length === 0 ? 0 : pageStart + 1} a {Math.min(pageStart + itemsPerPage, sortedEvents.length)} de {sortedEvents.length} resultados
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded text-sm ${
                page === currentPage
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de Detalles del Evento */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        title={'Detalles del Evento'}
        size="lg"
      >
        {selectedEvent ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${eventTypes[selectedEvent.type]?.color}`} />
              <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedEvent.status]}`}>
                {selectedEvent.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">Cliente:</label>
                <p className="text-gray-600">{selectedEvent.client}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Fecha:</label>
                <p className="text-gray-600">{selectedEvent.date}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Hora:</label>
                <p className="text-gray-600">{selectedEvent.time}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Duración:</label>
                <p className="text-gray-600">{selectedEvent.duration}</p>
              </div>
              <div className="col-span-2">
                <label className="font-medium text-gray-700">Ubicación:</label>
                <p className="text-gray-600">{selectedEvent.location}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Participantes:</label>
                <p className="text-gray-600">{selectedEvent.participants} persona{selectedEvent.participants !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            {selectedEvent.notes && (
              <div>
                <label className="font-medium text-gray-700">Notas:</label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">{selectedEvent.notes}</p>
              </div>
            )}
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Tareas relacionadas</h4>
                <div className="text-xs text-gray-500">
                  {Array.isArray(selectedEvent.tasks) ? selectedEvent.tasks.filter(t => t.completed).length : 0} de {Array.isArray(selectedEvent.tasks) ? selectedEvent.tasks.length : 0} completadas
                </div>
              </div>
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${getProgress(selectedEvent)}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                {Array.isArray(selectedEvent.tasks) && selectedEvent.tasks.length > 0 ? (
                  selectedEvent.tasks.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      onToggle={() => {
                        setSelectedEvent(prev => {
                          if (!prev) return prev;
                          const updatedTasks = (prev.tasks || []).map(task => task.id === t.id ? { ...task, completed: !task.completed } : task);
                          return { ...prev, tasks: updatedTasks };
                        });
                      }}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No hay tareas registradas.</div>
                )}
              </div>
            </div>
            
            <Modal.Footer>
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                Cerrar
              </Button>
              <Button 
                variant="secondary"
                onClick={() => { setEventToEdit(selectedEvent); setConfirmEditOpen(true); setShowEventModal(false); }}
              >
                Editar
              </Button>
              <Button
                onClick={() => {
                  if (!selectedEvent) return;
                  // Confirmar tareas y persistir en events/localStorage
                  setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, tasks: selectedEvent.tasks || [] } : ev));
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </div>
        ) : null}
      </Modal>

      {/* Modal de Crear/Editar Evento */}
      <Modal
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
          setEventFormData({
            title: '', client: '', date: '', time: '', duration: '', location: '', type: 'sesion', status: 'pendiente_confirmacion', participants: 0, notes: '', isContractEvent: false, isOrderEvent: false, contractId: '', orderId: ''
          });
        }}
        title={editingEvent ? 'Editar Evento' : 'Nueva Sesión'}
        size="lg"
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={eventFormData.title}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Título del evento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                type="text"
                name="client"
                value={eventFormData.client}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={eventFormData.date}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                name="time"
                value={eventFormData.time}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <input
                type="text"
                name="duration"
                value={eventFormData.duration}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Ej: 2 horas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="type"
                value={eventFormData.type}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="sesion_escolar">Sesión escolar</option>
                <option value="sesion_familiar">Sesión familiar</option>
                <option value="promocion">Promoción</option>
                <option value="entrega">Entrega</option>
                <option value="reunion">Reunión</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="status"
                value={eventFormData.status}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="pendiente_confirmacion">Pendiente de confirmación</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_ejecucion">En ejecución</option>
                <option value="en_edicion">En edición/retoque</option>
                <option value="entregado">Entregado</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de sesión</label>
              <select
                name="sessionType"
                value={eventFormData.sessionType}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {sessionTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vincular a contrato</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isContractEvent"
                  checked={eventFormData.isContractEvent}
                  onChange={(e) => setEventFormData(prev => ({ 
                    ...prev, 
                    isContractEvent: e.target.checked,
                    isOrderEvent: e.target.checked ? false : prev.isOrderEvent,
                    contractId: e.target.checked ? prev.contractId : '',
                    orderId: e.target.checked ? '' : prev.orderId
                  }))}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isContractEvent" className="text-sm text-gray-700">Evento de contrato</label>
              </div>
              {eventFormData.isContractEvent && (
                <select
                  name="contractId"
                  value={eventFormData.contractId}
                  onChange={(e) => {
                    const selectedContract = contracts.find(c => c.id === e.target.value);
                    setEventFormData(prev => ({ 
                      ...prev, 
                      contractId: e.target.value,
                      client: selectedContract?.cliente || prev.client,
                      title: selectedContract ? `Sesión - ${selectedContract.servicio}` : prev.title
                    }))
                  }}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Seleccionar contrato</option>
                  {contracts.map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.cliente} - {contract.servicio}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vincular a pedido</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOrderEvent"
                  checked={eventFormData.isOrderEvent}
                  onChange={(e) => setEventFormData(prev => ({ 
                    ...prev, 
                    isOrderEvent: e.target.checked,
                    isContractEvent: e.target.checked ? false : prev.isContractEvent,
                    orderId: e.target.checked ? prev.orderId : '',
                    contractId: e.target.checked ? '' : prev.contractId
                  }))}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isOrderEvent" className="text-sm text-gray-700">Evento de pedido</label>
              </div>
              {eventFormData.isOrderEvent && (
                <select
                  name="orderId"
                  value={eventFormData.orderId}
                  onChange={(e) => {
                    const selectedOrder = orders.find(o => o.id === e.target.value);
                    setEventFormData(prev => ({ 
                      ...prev, 
                      orderId: e.target.value,
                      client: selectedOrder?.cliente || prev.client,
                      title: selectedOrder ? `Sesión - ${selectedOrder.servicio}` : prev.title
                    }))
                  }}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Seleccionar pedido</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.cliente} - {order.servicio}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
              <input
                type="number"
                min="0"
                name="participants"
                value={eventFormData.participants}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Número de participantes"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                name="location"
                value={eventFormData.location}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Dirección o lugar"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea
                name="notes"
                value={eventFormData.notes}
                onChange={(e) => setEventFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                rows="3"
                placeholder="Detalles adicionales"
              ></textarea>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tareas relacionadas</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Nombre de la tarea"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const name = taskInput.trim();
                      if (!name) return;
                      setEventFormData(prev => ({ ...prev, tasks: [...(prev.tasks || []), { id: Date.now(), name, completed: false }] }));
                      setTaskInput('');
                    }
                  }}
                />
                <Button onClick={() => {
                  const name = taskInput.trim();
                  if (!name) return;
                  setEventFormData(prev => ({ ...prev, tasks: [...(prev.tasks || []), { id: Date.now(), name, completed: false }] }));
                  setTaskInput('');
                }}>Añadir</Button>
              </div>
              {Array.isArray(eventFormData.tasks) && eventFormData.tasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {eventFormData.tasks.filter(t => t.completed).length} de {eventFormData.tasks.length} completadas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgress({ tasks: eventFormData.tasks })}%` }}
                    ></div>
                  </div>
                  {eventFormData.tasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${
                            t.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}
                          onClick={() => setEventFormData(prev => ({
                            ...prev,
                            tasks: prev.tasks.map(task => 
                              task.id === t.id ? { ...task, completed: !task.completed } : task
                            )
                          }))}
                        >
                          {t.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className={`text-sm ${t.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {t.name}
                        </span>
                      </div>
                      <button 
                        className="text-red-500 text-sm hover:text-red-700" 
                        onClick={() => setEventFormData(prev => ({ ...prev, tasks: prev.tasks.filter(x => x.id !== t.id) }))}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Modal.Footer>
            <Button variant="outline" onClick={() => {
              setShowEventForm(false);
              setEditingEvent(null);
              setEventFormData({
                title: '', client: '', date: '', time: '', duration: '', location: '', type: 'sesion', status: 'pendiente', participants: 0, notes: '', tasks: []
              });
              setTaskInput('');
            }}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (!eventFormData.title.trim() || !eventFormData.client.trim()) {
                alert('Título y Cliente son requeridos');
                return;
              }
              
              try {
                if (editingEvent) {
                  // Actualizar
                  const updatedEvents = events.map(ev => ev.id === editingEvent.id ? { 
                    ...editingEvent, 
                    ...eventFormData
                  } : ev);
                  
                  // Guardar en localStorage primero para asegurar persistencia
                  localStorage.setItem('agenda_events', JSON.stringify(updatedEvents));
                  // Luego actualizar el estado
                  setEvents(updatedEvents);
                  console.log('Evento actualizado y guardado en localStorage:', updatedEvents);
                } else {
                  // Crear nuevo
                  const nextId = (events.reduce((max, ev) => Math.max(max, Number(ev.id) || 0), 0) + 1) || 1;
                  const newEvent = { 
                    id: nextId, 
                    ...eventFormData,
                    // Asegurar que todos los campos necesarios estén presentes
                    date: eventFormData.date || new Date().toISOString().split('T')[0],
                    time: eventFormData.time || '12:00',
                    duration: eventFormData.duration || '1 hora',
                    type: eventFormData.type || 'sesion',
                    status: eventFormData.status || 'pendiente',
                    tasks: eventFormData.tasks || []
                  };
                  
                  // Crear una nueva copia del array para asegurar que React detecte el cambio
                  const updatedEvents = [newEvent, ...events];
                  
                  // Guardar en localStorage primero para asegurar persistencia
                  localStorage.setItem('agenda_events', JSON.stringify(updatedEvents));
                  
                  // Luego actualizar el estado con la nueva copia
                  setEvents([...updatedEvents]);
                  console.log('Nuevo evento creado y guardado en localStorage:', newEvent);
                }
                
                // Forzar sincronización con localStorage y verificar
                const storedEvents = JSON.parse(localStorage.getItem('agenda_events') || '[]');
                console.log('Eventos en localStorage después de guardar:', storedEvents);
                
                setShowEventForm(false);
                setEditingEvent(null);
                setEventFormData({ title: '', client: '', date: '', time: '', duration: '', location: '', type: 'sesion', status: 'pendiente', participants: 0, notes: '', tasks: [] });
                setTaskInput('');
                setCurrentPage(1);
              } catch (error) {
                console.error('Error al guardar el evento:', error);
                alert('Hubo un error al guardar el evento. Por favor intente nuevamente.');
              }
            }}>
              {editingEvent ? 'Actualizar' : 'Guardar Evento'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Confirmación Eliminar */}
      <Modal
        isOpen={confirmDeleteOpen}
        onClose={() => { setConfirmDeleteOpen(false); setEventToDelete(null); }}
        title="Eliminar Sesión"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de eliminar la sesión
            {eventToDelete ? (<>
              {' '}<span className="font-semibold">{eventToDelete.title}</span> del cliente{' '}<span className="font-semibold">{eventToDelete.client}</span>?
            </>) : ' seleccionada?'}
            <br />
            <span className="text-red-500">Esta acción no se puede deshacer.</span>
          </p>
          <Modal.Footer>
            <Button variant="outline" onClick={() => { setConfirmDeleteOpen(false); setEventToDelete(null); }}>Cancelar</Button>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => {
              if (eventToDelete) {
                setEvents(prev => prev.filter(ev => ev.id !== eventToDelete.id));
              }
              setConfirmDeleteOpen(false);
              setEventToDelete(null);
            }}>Eliminar</Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Confirmación Editar */}
      <Modal
        isOpen={confirmEditOpen}
        onClose={() => { setConfirmEditOpen(false); setEventToEdit(null); }}
        title="Editar Sesión"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Deseas editar la sesión
            {eventToEdit ? (<>
              {' '}<span className="font-semibold">{eventToEdit.title}</span> del cliente{' '}<span className="font-semibold">{eventToEdit.client}</span>?
            </>) : ' seleccionada?'}
          </p>
          <Modal.Footer>
            <Button variant="outline" onClick={() => { setConfirmEditOpen(false); setEventToEdit(null); }}>Cancelar</Button>
            <Button variant="secondary" onClick={() => {
              if (eventToEdit) {
                setEditingEvent(eventToEdit);
                setEventFormData({
                  title: eventToEdit.title || '',
                  client: eventToEdit.client || '',
                  date: eventToEdit.date || '',
                  time: eventToEdit.time || '',
                  duration: eventToEdit.duration || '',
                  location: eventToEdit.location || '',
                  type: eventToEdit.type || 'sesion',
                  status: eventToEdit.status || 'pendiente',
                  participants: eventToEdit.participants || 0,
                  notes: eventToEdit.notes || '',
                  tasks: Array.isArray(eventToEdit.tasks) ? eventToEdit.tasks : []
                });
                setShowEventForm(true);
              }
              setConfirmEditOpen(false);
              setEventToEdit(null);
            }}>Continuar</Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default Agenda;
