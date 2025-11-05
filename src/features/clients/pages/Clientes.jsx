import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Eye, Edit, Trash2, Phone, MapPin, Package } from 'lucide-react';
import Card from '@components/ui/Card/Card.jsx';
import Button from '@components/ui/Button/Button.jsx';
import Modal from '@components/ui/Modal/Modal.jsx';
import ClientForm from '@features/clients/components/ClientForm.jsx';
import { useApp } from '@context/AppContext';

const Clientes = () => {
  const { notifyNewClient, notifyClientAction } = useApp();
  const [clients, setClients] = useState([
    {
      id: 'C001',
      nombre: 'Valentino Olivas',
      tipo: 'Colegio',
      contacto: '987654321',
      email: 'valentino@email.com',
      ie: 'I.E Contas',
      direccion: 'Av. Lima 123, San Juan de Lurigancho',
      detalles: 'Auto padrino, cliente frecuente desde 2020',
      fechaRegistro: '2020-03-15',
      ultimoPedido: '2025-06-08',
      totalPedidos: 15,
      montoTotal: 3250.00,
      documento: '20123456789'
    },
    {
      id: 'C002',
      nombre: 'María López García',
      tipo: 'Particular',
      contacto: '987654322',
      email: 'maria.lopez@email.com',
      ie: '',
      direccion: 'Jr. Cusco 456, Cercado de Lima',
      detalles: 'Cliente frecuente, prefiere marcos clásicos',
      fechaRegistro: '2021-07-22',
      ultimoPedido: '2025-06-07',
      totalPedidos: 8,
      montoTotal: 1450.00,
      documento: '45678912'
    },
    {
      id: 'C003',
      nombre: 'I.E. San Martín de Porres',
      tipo: 'Colegio',
      contacto: '014567890',
      email: 'direccion@sanmartin.edu.pe',
      ie: 'I.E. San Martín de Porres',
      direccion: 'Av. Colonial 789, Callao',
      detalles: 'Contrato anual de promoción escolar',
      fechaRegistro: '2019-02-10',
      ultimoPedido: '2025-06-05',
      totalPedidos: 24,
      montoTotal: 15750.00,
      documento: '20987654321'
    },
    {
      id: 'C004',
      nombre: 'Familia Rodríguez',
      tipo: 'Particular',
      contacto: '987654324',
      email: 'rodriguez.familia@email.com',
      ie: '',
      direccion: 'Av. Brasil 321, Magdalena',
      detalles: 'Sesiones familiares anuales',
      fechaRegistro: '2022-11-05',
      ultimoPedido: '2025-06-06',
      totalPedidos: 4,
      montoTotal: 890.00,
      documento: '77889966'
    },
    {
      id: 'C005',
      nombre: 'Empresa TechSolutions SAC',
      tipo: 'Empresa',
      contacto: '012345678',
      email: 'eventos@techsolutions.com',
      ie: 'TechSolutions SAC',
      direccion: 'Jr. Lampa 654, Cercado de Lima',
      detalles: 'Eventos corporativos y fotografía institucional',
      fechaRegistro: '2023-01-18',
      ultimoPedido: '2025-05-28',
      totalPedidos: 6,
      montoTotal: 2100.00,
      documento: '20555444333'
    }
  ]);

  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const typeColors = {
    'Particular': 'bg-blue-100 text-blue-800',
    'Colegio': 'bg-green-100 text-green-800',
    'Empresa': 'bg-purple-100 text-purple-800'
  };

  const handleCreateClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: `C${String(clients.length + 1).padStart(3, '0')}`,
      fechaRegistro: new Date().toISOString().split('T')[0],
      ultimoPedido: null,
      totalPedidos: 0,
      montoTotal: 0
    };
    setClients([...clients, newClient]);
    
    // Notificación persistente para nuevo cliente
    notifyNewClient(newClient);
    
    setShowClientForm(false);
  };

  const handleEditClient = (clientData) => {
    setClients(clients.map(client => 
      client.id === selectedClient.id ? { ...client, ...clientData } : client
    ));
    
    // Notificación persistente
    notifyClientAction('edit', { ...selectedClient, ...clientData });
    
    setSelectedClient(null);
    setShowClientForm(false);
  };

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      setClients(clients.filter(client => client.id !== clientToDelete.id));
      
      // Notificación persistente
      notifyClientAction('delete', clientToDelete);
      
      setShowDeleteModal(false);
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = client.nombre.toLowerCase().includes(term) ||
                         (client.email || '').toLowerCase().includes(term) ||
                         (client.contacto || '').toLowerCase().includes(term) ||
                         (client.documento || '').toLowerCase().includes(term);
    const matchesType = typeFilter === 'todos' || client.tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="responsive-mobile">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <p className="text-sm text-gray-500">Gestiona tu base de datos de clientes</p>
            </div>
          </div>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowClientForm(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 border border-primary/10 bg-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscador</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono, email, DNI o RUC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex md:justify-end">
            <button
              type="button"
              onClick={() => setShowFilters(prev => !prev)}
              className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all ${showFilters ? 'text-[#32D5E6] border-[#32D5E6] bg-white' : 'text-gray-700 border-gray-300 hover:bg-white/60'}`}
            >
              <Filter className={`w-4 h-4 mr-2 ${showFilters ? 'text-[#32D5E6]' : 'text-gray-600'}`} />
              Filtros
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cliente</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="todos">Todos</option>
                <option value="Particular">Particular</option>
                <option value="Colegio">Colegio</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                onClick={() => { setTypeFilter('todos'); setSearchTerm(''); }}
                className="px-4 py-2 rounded-lg text-white ml-auto"
                style={{ backgroundColor: '#32D5E6' }}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Listado de Clientes */}
      <Card className="border border-primary/10">
        <h3 className="font-semibold text-gray-900 mb-4">Listado de Clientes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 bg-primary/10">
                <th className="text-left py-3 px-3 font-medium text-gray-800">CLIENTE</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">TIPO</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">CONTACTO</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">DIRECCIÓN</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">PEDIDOS</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">T. GASTADO</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">U. PEDIDO</th>
                <th className="text-left py-3 px-3 font-medium text-gray-800">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client, idx) => (
                <tr key={client.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                  <td className="py-3 px-3 text-sm text-gray-700 break-words">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="font-medium">{client.nombre}</span>
                        <span className="text-xs text-gray-500">{client.documento || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeColors[client.tipo]}`}>{client.tipo}</span>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-700 break-words">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{client.contacto}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-700 break-words">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="truncate max-w-[280px]">{client.direccion}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-700 break-words">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>{client.totalPedidos}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-700 break-words">S/ {Number(client.montoTotal || 0).toFixed(2)}</td>
                  <td className="py-3 px-3 text-sm text-gray-700 break-words">{client.ultimoPedido || '-'}</td>
                  <td className="py-3 px-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientModal(true);
                        }}
                        className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientForm(true);
                        }}
                        className="p-1 hover:bg-secondary/10 rounded text-secondary hover:text-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client)}
                        className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredClients.length)} de {filteredClients.length} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
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
              Siguiente
            </button>
          </div>
        </div>
      </Card>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-500 mb-4">Añade tu primer cliente para comenzar</p>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowClientForm(true)}
          >
            Nuevo Cliente
          </Button>
        </div>
      )}

      {/* Client Detail Modal */}
      <Modal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setSelectedClient(null);
        }}
        title={selectedClient?.nombre}
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedClient.nombre}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[selectedClient.tipo]}`}>
                  {selectedClient.tipo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente ID</label>
                <p className="text-gray-900">{selectedClient.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Pedido</label>
                <p className="text-gray-900">{selectedClient.ultimoPedido || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <p className="text-gray-900">{selectedClient.contacto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedClient.email || 'No registrado'}</p>
              </div>
              {selectedClient.documento && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{selectedClient.tipo === 'Particular' ? 'DNI' : 'RUC'}</label>
                  <p className="text-gray-900">{selectedClient.documento}</p>
                </div>
              )}
              {selectedClient.ie && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
                  <p className="text-gray-900">{selectedClient.ie}</p>
                </div>
              )}
              {selectedClient.direccion && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <p className="text-gray-900">{selectedClient.direccion}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{selectedClient.totalPedidos}</p>
                <p className="text-sm text-gray-500">Total Pedidos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">S/ {selectedClient.montoTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Gastado</p>
              </div>
            </div>

            {selectedClient.detalles && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detalles Adicionales</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedClient.detalles}</p>
                </div>
              </div>
            )}

            <Modal.Footer>
              <Button 
                variant="outline" 
                onClick={() => setShowClientModal(false)}
              >
                Cerrar
              </Button>
              <Button 
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
                onClick={() => {
                  setShowClientModal(false);
                  setShowClientForm(true);
                }}
              >
                Editar
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      {/* Client Form Modal */}
      <Modal
        isOpen={showClientForm}
        onClose={() => {
          setShowClientForm(false);
          setSelectedClient(null);
        }}
        title={selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="xl"
      >
        <ClientForm
          client={selectedClient}
          onSubmit={selectedClient ? handleEditClient : handleCreateClient}
          onCancel={() => {
            setShowClientForm(false);
            setSelectedClient(null);
          }}
        />
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClientToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                ¿Estás seguro de eliminar este cliente?
              </h3>
              <p className="text-sm text-gray-500">
                El cliente "{clientToDelete?.nombre}" será eliminado permanentemente junto con todo su historial.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setClientToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteClient}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clientes;
