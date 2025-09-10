import React, { useState } from 'react';
import { Calendar, Clock, Plus, Users, MapPin, Filter, CheckCircle, Circle, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [currentMonth, setCurrentMonth] = useState('Septiembre 2025');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Sesión Fotográfica Escolar',
      client: 'Juan Pérez',
      date: '14/03/2024',
      time: '09:00',
      duration: '3 horas',
      location: 'A.v arequipa',
      type: 'sesion',
      status: 'confirmado',
      participants: 150,
      notes: 'Fotografía individual y grupal para promoción 2025'
    },
    {
      id: 2,
      title: 'Entrega de Marcos',
      client: 'María López',
      date: '14/03/2024',
      time: '09:00',
      duration: '30 min',
      location: 'A.v arequipa',
      type: 'entrega',
      status: 'pendiente',
      participants: 1,
      notes: 'Marcos 20x30 y 30x40 listos para entrega'
    },
    {
      id: 3,
      title: 'Reunión Contrato Anual',
      client: 'Colegio Particular Santa Rosa',
      date: '2025-09-10',
      time: '16:00',
      duration: '1 hora',
      location: 'Oficina del Director',
      type: 'reunion',
      status: 'confirmado',
      participants: 3,
      notes: 'Negociación contrato promoción 2026'
    },
    {
      id: 4,
      title: 'Sesión Familiar',
      client: 'Familia Rodríguez',
      date: '2025-09-10',
      time: '18:00',
      duration: '2 horas',
      location: 'Parque Central',
      type: 'sesion',
      status: 'confirmado',
      participants: 5,
      notes: 'Sesión exterior para álbum familiar'
    }
  ];
  
  const projects = [
    {
      id: 101,
      client: 'Juan Pérez',
      clientId: 'CLI-001',
      title: 'Sesión Fotográfica',
      progress: 70,
      tasks: [
        { id: 1, name: 'Preparar equipo para sesión', completed: true },
        { id: 2, name: 'Realizar selección de imágenes', completed: true },
        { id: 3, name: 'Confirmar locación', completed: false }
      ],
      sessionTasks: [
        { id: 4, name: 'Capturar fotos del producto', completed: false },
        { id: 5, name: 'Revisar iluminación', completed: false }
      ]
    },
    {
      id: 102,
      client: 'María López',
      clientId: 'CLI-002',
      title: 'Álbum Familiar',
      progress: 30,
      tasks: [
        { id: 6, name: 'Seleccionar fotos para álbum', completed: true },
        { id: 7, name: 'Diseñar maqueta de álbum', completed: false },
        { id: 8, name: 'Enviar propuesta al cliente', completed: false }
      ],
      sessionTasks: []
    }
  ];

  const eventTypes = {
    sesion: { color: 'bg-blue-500', label: 'Sesión' },
    entrega: { color: 'bg-green-500', label: 'Entrega' },
    reunion: { color: 'bg-orange-500', label: 'Reunión' }
  };

  const statusColors = {
    confirmado: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelado: 'bg-red-100 text-red-800'
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'todos') return true;
    return event.type === filter;
  });

  const EventCard = ({ event }) => (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
      style={{ borderLeftColor: eventTypes[event.type]?.color.replace('bg-', '#') || '#1DD1E3' }}
      onClick={() => {
        setSelectedEvent(event);
        setShowEventModal(true);
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${eventTypes[event.type]?.color}`} />
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
          {event.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{event.client}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{event.time} - {event.duration}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </div>
      
      {event.notes && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-500">
          {event.notes}
        </div>
      )}
    </Card>
  );

  // Función para generar el calendario del mes actual
  const generateCalendar = () => {
    const days = [];
    const daysOfWeek = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
    
    // Agregar los días de la semana
    daysOfWeek.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center py-2 text-xs font-medium text-gray-500">
          {day}
        </div>
      );
    });
    
    // Agregar los días del mes (ejemplo para septiembre 2025)
    for (let i = 1; i <= 30; i++) {
      // Determinar si hay eventos para este día
      const hasEvents = events.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i;
      });
      
      // Determinar el estado del día (pendiente, confirmado, completado)
      let status = '';
      let statusComponent = null;
      
      if (i === 5) {
        status = 'bg-yellow-100';
        statusComponent = <Circle className="w-3 h-3 text-yellow-500" />;
      } else if (i === 10 || i === 11 || i === 13) {
        status = 'bg-green-100';
        statusComponent = <CheckCircle className="w-3 h-3 text-green-500" />;
      } else if (i === 19) {
        status = 'bg-blue-100';
        statusComponent = <AlertCircle className="w-3 h-3 text-blue-500" />;
      }
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`text-center py-3 border border-gray-100 ${status} ${i === 5 ? 'bg-yellow-100' : ''} hover:bg-gray-50 cursor-pointer transition-colors`}
          onClick={() => setSelectedDate(`2025-09-${i < 10 ? '0' + i : i}`)}
        >
          <div className="relative">
            <div className="text-sm font-medium">{i}</div>
            {statusComponent && (
              <div className="absolute -top-1 -right-1">
                {statusComponent}
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
  
  // Componente para mostrar un proyecto
  const ProjectItem = ({ project }) => (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">{project.clientId}</div>
          <div className="font-medium">{project.client}</div>
        </div>
        <div className="text-xs text-gray-500">70%</div>
      </div>
      
      <div className="p-3">
        <div className="font-medium mb-2">Sesión Fotográfica - {project.client}</div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span>10 Septiembre 2025</span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-700">Preparación</div>
            <div className="text-xs text-gray-500">2/3</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>
        
        {project.tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={() => console.log('Toggle task', task.id)} 
          />
        ))}
        
        {project.sessionTasks.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-700">Durante la Sesión</div>
              <div className="text-xs text-gray-500">0/2</div>
            </div>
            {project.sessionTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={() => console.log('Toggle task', task.id)} 
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-3 space-x-2">
          <Button variant="outline" size="sm">Cancelar Sesión</Button>
          <Button size="sm">Confirmar Todo</Button>
        </div>
      </div>
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
            onClick={() => setShowEventModal(true)}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Aplicar filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header del calendario */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Septiembre 2025</h2>
              <button className="p-1 hover:bg-gray-100 rounded">
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
                {filteredEvents.map((event) => (
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
                          style={{ width: `${event.status === 'confirmado' ? '75' : '25'}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de eliminar esta sesión?')) {
                              // Lógica para eliminar
                            }
                          }}
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

      {/* Event Detail Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? 'Detalles del Evento' : 'Nueva Cita'}
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
                <TaskItem 
                  task={{ id: 101, name: 'Preparar equipo fotográfico', completed: true }} 
                  onToggle={() => console.log('Toggle task')} 
                />
                <TaskItem 
                  task={{ id: 102, name: 'Confirmar asistentes', completed: false }} 
                  onToggle={() => console.log('Toggle task')} 
                />
                <TaskItem 
                  task={{ id: 103, name: 'Revisar locación', completed: false }} 
                  onToggle={() => console.log('Toggle task')} 
                />
              </div>
            </div>
            
            <Modal.Footer>
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                Cerrar
              </Button>
              <Button variant="secondary">
                Editar
              </Button>
              <Button>
                Confirmar
              </Button>
            </Modal.Footer>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Título del evento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Ej: 2 horas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  <option value="sesion">Sesión</option>
                  <option value="entrega">Entrega</option>
                  <option value="reunion">Reunión</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Dirección o lugar"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Detalles adicionales"
                ></textarea>
              </div>
            </div>
            
            <Modal.Footer>
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                Cancelar
              </Button>
              <Button>
                Guardar Evento
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Agenda;