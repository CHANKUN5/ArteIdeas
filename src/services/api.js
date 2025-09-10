// Configuración base para las llamadas a la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configuración de timeouts
const DEFAULT_TIMEOUT = 10000;

// Interceptor para manejar errores comunes
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Error desconocido del servidor' };
    }
    
    throw new ApiError(
      errorData.message || `Error ${response.status}`,
      response.status,
      errorData
    );
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
};

// Función base para hacer requests
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Agregar token de autorización si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Crear AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  
  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado', 408);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Error de conexión', 0, error);
  }
};

// Métodos HTTP principales
export const api = {
  // GET request
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return makeRequest(url, { method: 'GET' });
  },
  
  // POST request
  post: (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // PUT request
  put: (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // PATCH request
  patch: (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE request
  delete: (endpoint) => {
    return makeRequest(endpoint, { method: 'DELETE' });
  },
  
  // Upload de archivos
  upload: (endpoint, formData) => {
    const token = localStorage.getItem('authToken');
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return makeRequest(endpoint, {
      method: 'POST',
      body: formData,
      headers, // No incluir Content-Type para FormData
    });
  },
};

// Endpoints específicos de la aplicación
export const endpoints = {
  // Autenticación
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Clientes
  clients: {
    list: '/clients',
    create: '/clients',
    get: (id) => `/clients/${id}`,
    update: (id) => `/clients/${id}`,
    delete: (id) => `/clients/${id}`,
  },
  
  // Pedidos
  orders: {
    list: '/orders',
    create: '/orders',
    get: (id) => `/orders/${id}`,
    update: (id) => `/orders/${id}`,
    delete: (id) => `/orders/${id}`,
    updateStatus: (id) => `/orders/${id}/status`,
  },
  
  // Inventario
  inventory: {
    list: '/inventory',
    create: '/inventory',
    get: (id) => `/inventory/${id}`,
    update: (id) => `/inventory/${id}`,
    delete: (id) => `/inventory/${id}`,
    lowStock: '/inventory/low-stock',
  },
  
  // Producción
  production: {
    list: '/production',
    create: '/production',
    get: (id) => `/production/${id}`,
    update: (id) => `/production/${id}`,
    delete: (id) => `/production/${id}`,
    updateStatus: (id) => `/production/${id}/status`,
  },
  
  // Contratos
  contracts: {
    list: '/contracts',
    create: '/contracts',
    get: (id) => `/contracts/${id}`,
    update: (id) => `/contracts/${id}`,
    delete: (id) => `/contracts/${id}`,
    download: (id) => `/contracts/${id}/download`,
  },
  
  // Reportes
  reports: {
    sales: '/reports/sales',
    clients: '/reports/clients',
    inventory: '/reports/inventory',
    production: '/reports/production',
    export: '/reports/export',
  },
  
  // Archivos
  files: {
    upload: '/files/upload',
    download: (id) => `/files/${id}`,
    delete: (id) => `/files/${id}`,
  },
};

// Funciones de conveniencia para operaciones comunes
export const apiHelpers = {
  // Obtener lista con paginación
  getList: async (endpoint, page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    return api.get(endpoint, params);
  },
  
  // Buscar elementos
  search: async (endpoint, query, filters = {}) => {
    const params = { q: query, ...filters };
    return api.get(`${endpoint}/search`, params);
  },
  
  // Obtener estadísticas
  getStats: async (endpoint, period = 'month') => {
    return api.get(`${endpoint}/stats`, { period });
  },
};

export default api;