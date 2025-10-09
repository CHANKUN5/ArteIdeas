// Servicio para gestionar pedidos
// Actualmente usa localStorage como almacenamiento temporal
// En producción, esto se conectaría a una API real

const STORAGE_KEY = 'arte_ideas_pedidos';

// Generar ID único para nuevos pedidos
const generateId = () => {
  return 'PED' + Date.now().toString().slice(-6);
};

// Obtener todos los pedidos
export const getPedidos = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Crear un nuevo pedido
export const createPedido = async (pedidoData) => {
  try {
    const pedidos = await getPedidos();
    const newPedido = {
      ...pedidoData,
      id: generateId(),
      fechaCreacion: new Date().toISOString()
    };
    
    pedidos.push(newPedido);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
    
    // Si el pedido está asociado a un contrato, actualizar la relación
    if (newPedido.contratoId) {
      // Aquí se implementaría la lógica para actualizar el contrato
    }
    
    // Generar orden de producción automáticamente
    createProduccionOrder(newPedido);
    
    return newPedido;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

// Actualizar un pedido existente
export const updatePedido = async (id, pedidoData) => {
  try {
    const pedidos = await getPedidos();
    const index = pedidos.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }
    
    const updatedPedido = {
      ...pedidos[index],
      ...pedidoData,
      fechaActualizacion: new Date().toISOString()
    };
    
    pedidos[index] = updatedPedido;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
    
    return updatedPedido;
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    throw error;
  }
};

// Eliminar un pedido
export const deletePedido = async (id) => {
  try {
    const pedidos = await getPedidos();
    const filteredPedidos = pedidos.filter(p => p.id !== id);
    
    if (filteredPedidos.length === pedidos.length) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPedidos));
    return true;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};

// Obtener un pedido por su ID
export const getPedidoById = async (id) => {
  try {
    const pedidos = await getPedidos();
    const pedido = pedidos.find(p => p.id === id);
    
    if (!pedido) {
      throw new Error(`Pedido con ID ${id} no encontrado`);
    }
    
    return pedido;
  } catch (error) {
    console.error('Error al obtener pedido por ID:', error);
    throw error;
  }
};

// Filtrar pedidos por cliente o estado
export const filterPedidos = async (filters) => {
  try {
    const pedidos = await getPedidos();
    
    return pedidos.filter(pedido => {
      let matches = true;
      
      if (filters.cliente && pedido.cliente) {
        matches = matches && pedido.cliente.toLowerCase().includes(filters.cliente.toLowerCase());
      }
      
      if (filters.estado && filters.estado !== 'todos') {
        matches = matches && pedido.estado === filters.estado;
      }
      
      if (filters.tipo && filters.tipo !== 'todos') {
        matches = matches && pedido.productoTipo === filters.tipo;
      }
      
      return matches;
    });
  } catch (error) {
    console.error('Error al filtrar pedidos:', error);
    throw error;
  }
};

// Función para crear una orden de producción asociada al pedido
const createProduccionOrder = (pedido) => {
  // Obtener órdenes de producción existentes
  const produccionKey = 'arte_ideas_produccion';
  const produccionData = JSON.parse(localStorage.getItem(produccionKey) || '[]');
  
  // Crear nueva orden de producción
  const nuevaOrden = {
    id: `PROD-${Date.now().toString().slice(-6)}`,
    pedidoId: pedido.id,
    cliente: pedido.cliente,
    tipo: pedido.tipo,
    descripcion: pedido.descripcion || 'Orden generada automáticamente',
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaEntrega: pedido.fechaCompromiso,
    estado: 'Pendiente',
    progreso: 0,
    responsable: pedido.responsable || 'Sistema',
    materiales: pedido.materiales || [],
    observaciones: `Orden de producción generada desde pedido ${pedido.id}`
  };
  
  // Guardar la nueva orden
  produccionData.push(nuevaOrden);
  localStorage.setItem(produccionKey, JSON.stringify(produccionData));
  
  console.log(`Orden de producción ${nuevaOrden.id} creada para el pedido ${pedido.id}`);
  
  return nuevaOrden;
};

// Actualizar el avance de un pedido
export const updatePedidoAvance = async (id, avance) => {
  try {
    const pedido = await getPedidoById(id);
    return await updatePedido(id, { ...pedido, avance });
  } catch (error) {
    console.error('Error al actualizar avance del pedido:', error);
    throw error;
  }
};