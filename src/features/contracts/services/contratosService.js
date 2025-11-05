// Servicio para gestionar contratos
// Actualmente usa localStorage como almacenamiento temporal
// En producción, esto se conectaría a una API real

const STORAGE_KEY = 'arte_ideas_contratos';

// Generar ID único para nuevos contratos
const generateId = () => {
  return 'CTR' + Date.now().toString().slice(-5);
};

// Obtener todos los contratos
export const getContratos = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    throw error;
  }
};

// Crear un nuevo contrato
export const createContrato = async (contratoData) => {
  try {
    const contratos = await getContratos();
    const newContrato = {
      ...contratoData,
      id: generateId(),
      fechaCreacion: new Date().toISOString()
    };
    
    contratos.push(newContrato);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos));
    
    return newContrato;
  } catch (error) {
    console.error('Error al crear contrato:', error);
    throw error;
  }
};

// Actualizar un contrato existente
export const updateContrato = async (id, contratoData) => {
  try {
    const contratos = await getContratos();
    const index = contratos.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Contrato con ID ${id} no encontrado`);
    }
    
    const updatedContrato = {
      ...contratos[index],
      ...contratoData,
      fechaActualizacion: new Date().toISOString()
    };
    
    contratos[index] = updatedContrato;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos));
    
    return updatedContrato;
  } catch (error) {
    console.error('Error al actualizar contrato:', error);
    throw error;
  }
};

// Eliminar un contrato
export const deleteContrato = async (id) => {
  try {
    const contratos = await getContratos();
    const filteredContratos = contratos.filter(c => c.id !== id);
    
    if (filteredContratos.length === contratos.length) {
      throw new Error(`Contrato con ID ${id} no encontrado`);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContratos));
    return true;
  } catch (error) {
    console.error('Error al eliminar contrato:', error);
    throw error;
  }
};

// Obtener un contrato por su ID
export const getContratoById = async (id) => {
  try {
    const contratos = await getContratos();
    const contrato = contratos.find(c => c.id === id);
    
    if (!contrato) {
      throw new Error(`Contrato con ID ${id} no encontrado`);
    }
    
    return contrato;
  } catch (error) {
    console.error('Error al obtener contrato por ID:', error);
    throw error;
  }
};

// Filtrar contratos por tipo o estado
export const filterContratos = async (filters) => {
  try {
    const contratos = await getContratos();
    
    return contratos.filter(contrato => {
      let matches = true;
      
      if (filters.tipo && filters.tipo !== 'todos') {
        matches = matches && contrato.tipo === filters.tipo;
      }
      
      if (filters.estado && filters.estado !== 'todos') {
        matches = matches && contrato.estado === filters.estado;
      }
      
      if (filters.cliente) {
        const clienteNombre = contrato.clienteNombre || contrato.razonSocial || '';
        matches = matches && clienteNombre.toLowerCase().includes(filters.cliente.toLowerCase());
      }
      
      return matches;
    });
  } catch (error) {
    console.error('Error al filtrar contratos:', error);
    throw error;
  }
};

// Obtener resumen de contratos (totales)
export const getContratosSummary = async () => {
  try {
    const contratos = await getContratos();
    
    const total = contratos.length;
    const activos = contratos.filter(c => c.estado === 'activo').length;
    
    const valorTotal = contratos.reduce((sum, contrato) => {
      return sum + (parseFloat(contrato.valorTotal) || 0);
    }, 0);
    
    const pagado = contratos.reduce((sum, contrato) => {
      return sum + (parseFloat(contrato.pagado) || 0);
    }, 0);
    
    return {
      total,
      activos,
      valorTotal,
      pagado
    };
  } catch (error) {
    console.error('Error al obtener resumen de contratos:', error);
    throw error;
  }
};