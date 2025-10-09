// Servicio para gestionar órdenes de producción
// Actualmente usa localStorage como almacenamiento temporal
// En producción, esto se conectaría a una API real

const STORAGE_KEY = 'arte_ideas_produccion';

// Generar ID único para nuevas órdenes de producción
const generateId = () => {
  return 'PROD-' + Date.now().toString().slice(-6);
};

// Obtener todas las órdenes de producción
const getAll = () => {
  const produccion = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return produccion;
};

// Obtener una orden de producción por ID
const getById = (id) => {
  const produccion = getAll();
  return produccion.find(orden => orden.id === id) || null;
};

// Obtener órdenes de producción por ID de pedido
const getByPedidoId = (pedidoId) => {
  const produccion = getAll();
  return produccion.filter(orden => orden.pedidoId === pedidoId);
};

// Crear una nueva orden de producción
const create = (ordenData) => {
  const produccion = getAll();
  
  const nuevaOrden = {
    id: generateId(),
    ...ordenData,
    fechaCreacion: ordenData.fechaCreacion || new Date().toISOString().split('T')[0],
    estado: ordenData.estado || 'Pendiente',
    progreso: ordenData.progreso || 0
  };
  
  produccion.push(nuevaOrden);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produccion));
  
  return nuevaOrden;
};

// Actualizar una orden de producción existente
const update = (id, ordenData) => {
  const produccion = getAll();
  const index = produccion.findIndex(orden => orden.id === id);
  
  if (index !== -1) {
    produccion[index] = {
      ...produccion[index],
      ...ordenData
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produccion));
    return produccion[index];
  }
  
  return null;
};

// Actualizar el progreso de una orden de producción
const updateProgress = (id, progreso) => {
  const produccion = getAll();
  const index = produccion.findIndex(orden => orden.id === id);
  
  if (index !== -1) {
    produccion[index].progreso = progreso;
    
    // Actualizar estado según el progreso
    if (progreso >= 100) {
      produccion[index].estado = 'Completado';
    } else if (progreso > 0) {
      produccion[index].estado = 'En Proceso';
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produccion));
    
    // Actualizar el progreso en el pedido relacionado
    updatePedidoProgress(produccion[index].pedidoId, progreso);
    
    return produccion[index];
  }
  
  return null;
};

// Actualizar el progreso en el pedido relacionado
const updatePedidoProgress = (pedidoId, progreso) => {
  if (!pedidoId) return;
  
  const pedidosKey = 'arte_ideas_pedidos';
  const pedidos = JSON.parse(localStorage.getItem(pedidosKey) || '[]');
  const index = pedidos.findIndex(pedido => pedido.id === pedidoId);
  
  if (index !== -1) {
    pedidos[index].avance = progreso;
    localStorage.setItem(pedidosKey, JSON.stringify(pedidos));
  }
};

// Eliminar una orden de producción
const remove = (id) => {
  const produccion = getAll();
  const nuevaProduccion = produccion.filter(orden => orden.id !== id);
  
  if (nuevaProduccion.length !== produccion.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaProduccion));
    return true;
  }
  
  return false;
};

// Filtrar órdenes de producción
const filter = (filters = {}) => {
  let produccion = getAll();
  
  if (filters.estado) {
    produccion = produccion.filter(orden => orden.estado === filters.estado);
  }
  
  if (filters.cliente) {
    const clienteFilter = filters.cliente.toLowerCase();
    produccion = produccion.filter(orden => 
      orden.cliente.toLowerCase().includes(clienteFilter)
    );
  }
  
  if (filters.fechaDesde) {
    produccion = produccion.filter(orden => 
      new Date(orden.fechaCreacion) >= new Date(filters.fechaDesde)
    );
  }
  
  if (filters.fechaHasta) {
    produccion = produccion.filter(orden => 
      new Date(orden.fechaCreacion) <= new Date(filters.fechaHasta)
    );
  }
  
  return produccion;
};

// Obtener estadísticas de producción
const getStats = () => {
  const produccion = getAll();
  
  const pendientes = produccion.filter(orden => orden.estado === 'Pendiente').length;
  const enProceso = produccion.filter(orden => orden.estado === 'En Proceso').length;
  const completados = produccion.filter(orden => orden.estado === 'Completado').length;
  
  const progresoPromedio = produccion.length > 0 
    ? produccion.reduce((sum, orden) => sum + orden.progreso, 0) / produccion.length 
    : 0;
  
  return {
    total: produccion.length,
    pendientes,
    enProceso,
    completados,
    progresoPromedio
  };
};

const produccionService = {
  getAll,
  getById,
  getByPedidoId,
  create,
  update,
  updateProgress,
  delete: remove,
  filter,
  getStats
};

export default produccionService;