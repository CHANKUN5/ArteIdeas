import { AlertCircle, Calendar, CheckCircle, ChevronLeft, ChevronRight, Circle, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventModal, setShowEventModal] = useState(false); // Detalles del evento
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [clientFilter, setClientFilter] = useState('');
  // Fecha de referencia para el calendario (primer día del mes mostrado)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
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
    status: 'pendiente',
    participants: 0,
    notes: '',
    tasks: []
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


  const eventTypes = {
    reunion: { color: 'bg-orange-500', label: 'Reunión' },
    sesion: { color: 'bg-blue-500', label: 'Sesión' },
    entrega: { color: 'bg-green-500', label: 'Entrega' }
  };

  const statusColors = {
    confirmado: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelado: 'bg-red-100 text-red-800',
    completado: 'bg-green-100 text-green-800'
  };

  const deriveStatusFromType = (type) => {
    // Mantener la lógica según lo que ya hay en el código (pendiente, confirmado, completado)
    if (type === 'sesion') return 'confirmado';
    if (type === 'entrega') return 'completado';
    if (type === 'reunion') return 'pendiente';
    return 'pendiente';
  };

  // Sincronizar el calendario con el filtro de fecha
  useEffect(() => {
    if (!selectedDate) return;
    const d = new Date(`${selectedDate}T00:00:00`);
    setCurrentMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [selectedDate]);

  const filteredEvents = events.filter(event => {
    if (filter !== 'todos' && event.type !== filter) return false;
    if (clientFilter.trim()) {
      const term = clientFilter.trim().toLowerCase();
      if (!(event.client || '').toLowerCase().includes(term)) return false;
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
  const statusPriority = { pendiente: 1, confirmado: 2, completado: 3 };

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
      if (dominantStatus === 'pendiente') {
        bgClass = 'bg-yellow-100';
        statusIcon = <Circle className="w-4 h-4 text-yellow-500" />;
      } else if (dominantStatus === 'confirmado') {
        bgClass = 'bg-blue-100';
        statusIcon = <AlertCircle className="w-4 h-4 text-blue-500" />;
      } else if (dominantStatus === 'completado') {
        bgClass = 'bg-green-100';
        statusIcon = <CheckCircle className="w-4 h-4 text-green-500" />;
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-sm text-gray-500">Gestiona tus citas y eventos</p>
          </div>
        </div>
      </div>

      {/* Sección de Filtros */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowEventForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Nueva Sesión
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <input
                type="text"
                placeholder="Buscar por cliente"
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div >
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedDate('');
                  setClientFilter('');
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
                <span className="text-xs text-gray-600">Pendiente</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Confirmada</span>
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
                        {event.status === 'confirmado' ? 'proceso' : event.status}
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tareas relacionadas</h4>
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                {Array.isArray(selectedEvent.tasks) && selectedEvent.tasks.length > 0 ? (
                  selectedEvent.tasks.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      onToggle={() => {
                        // Solo actualizar en memoria del modal; guardar con "Confirmar"
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
            title: '', client: '', date: '', time: '', duration: '', location: '', type: 'sesion', status: 'pendiente', participants: 0, notes: ''
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
                <option value="sesion">Sesión</option>
                <option value="entrega">Entrega</option>
                <option value="reunion">Reunión</option>
              </select>
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Nombre de la tarea"
                />
                <Button onClick={() => {
                  const name = taskInput.trim();
                  if (!name) return;
                  setEventFormData(prev => ({ ...prev, tasks: [...(prev.tasks || []), { id: Date.now(), name, completed: false }] }));
                  setTaskInput('');
                }}>Añadir</Button>
              </div>
              {Array.isArray(eventFormData.tasks) && eventFormData.tasks.length > 0 && (
                <div className="mt-2 space-y-2">
                  {eventFormData.tasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{t.name}</span>
                      <button className="text-red-500 text-sm" onClick={() => setEventFormData(prev => ({ ...prev, tasks: prev.tasks.filter(x => x.id !== t.id) }))}>Eliminar</button>
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
              if (editingEvent) {
                // Actualizar
                setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? { 
                  ...editingEvent, 
                  ...eventFormData,
                  status: deriveStatusFromType(eventFormData.type)
                } : ev));
              } else {
                // Crear simulado
                const nextId = (events.reduce((max, ev) => Math.max(max, Number(ev.id) || 0), 0) + 1) || 1;
                const newEvent = { 
                  id: nextId, 
                  ...eventFormData,
                  status: deriveStatusFromType(eventFormData.type)
                };
                setEvents(prev => [newEvent, ...prev]);
              }
              setShowEventForm(false);
              setEditingEvent(null);
              setEventFormData({ title: '', client: '', date: '', time: '', duration: '', location: '', type: 'sesion', status: 'pendiente', participants: 0, notes: '', tasks: [] });
              setTaskInput('');
              setCurrentPage(1);
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