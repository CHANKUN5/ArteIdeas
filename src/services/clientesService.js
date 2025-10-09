// Servicio para gestionar clientes
// Actualmente usa localStorage como almacenamiento temporal
// En producción, esto se conectaría a una API real

const STORAGE_KEY = 'arte_ideas_clientes';

// Generar ID único para nuevos clientes
const generateId = () => {
  return 'C' + String(Date.now()).slice(-5).padStart(3, '0');
};

// Obtener todos los clientes
const getAll = () => {
  const clientes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return clientes;
};

// Obtener un cliente por ID
const getById = (id) => {
  const clientes = getAll();
  return clientes.find(cliente => cliente.id === id) || null;
};

// Crear un nuevo cliente
const create = (clienteData) => {
  const clientes = getAll();
  
  const nuevoCliente = {
    id: generateId(),
    ...clienteData,
    fechaRegistro: clienteData.fechaRegistro || new Date().toISOString().split('T')[0],
    ultimoPedido: clienteData.ultimoPedido || null,
    totalPedidos: clienteData.totalPedidos || 0,
    montoTotal: clienteData.montoTotal || 0
  };
  
  clientes.push(nuevoCliente);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
  
  return nuevoCliente;
};

// Actualizar un cliente existente
const update = (id, clienteData) => {
  const clientes = getAll();
  const index = clientes.findIndex(cliente => cliente.id === id);
  
  if (index !== -1) {
    clientes[index] = {
      ...clientes[index],
      ...clienteData
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    return clientes[index];
  }
  
  return null;
};

// Eliminar un cliente
const remove = (id) => {
  const clientes = getAll();
  const nuevosClientes = clientes.filter(cliente => cliente.id !== id);
  
  if (nuevosClientes.length !== clientes.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosClientes));
    return true;
  }
  
  return false;
};

// Filtrar clientes
const filter = (filters = {}) => {
  let clientes = getAll();
  
  if (filters.tipo) {
    clientes = clientes.filter(cliente => cliente.tipo === filters.tipo);
  }
  
  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    clientes = clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(searchTerm) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchTerm)) ||
      (cliente.contacto && cliente.contacto.includes(searchTerm))
    );
  }
  
  return clientes;
};

// Actualizar estadísticas de pedidos para un cliente
const updatePedidoStats = (clienteId, montoNuevo = 0) => {
  if (!clienteId) return null;
  
  const clientes = getAll();
  const index = clientes.findIndex(cliente => cliente.id === clienteId);
  
  if (index !== -1) {
    clientes[index].totalPedidos = (clientes[index].totalPedidos || 0) + 1;
    clientes[index].montoTotal = (clientes[index].montoTotal || 0) + montoNuevo;
    clientes[index].ultimoPedido = new Date().toISOString().split('T')[0];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    return clientes[index];
  }
  
  return null;
};

// Buscar clientes por nombre o contacto
const search = (query) => {
  if (!query) return [];
  
  const clientes = getAll();
  const searchTerm = query.toLowerCase();
  
  return clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(searchTerm) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm)) ||
    (cliente.contacto && cliente.contacto.includes(searchTerm))
  );
};

const clientesService = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  filter,
  updatePedidoStats,
  search
};

export default clientesService;