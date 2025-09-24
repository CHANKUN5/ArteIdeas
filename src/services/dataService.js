import { api, endpoints, apiHelpers } from './api';

// Servicio para gestión de clientes
export const clientService = {
  // Obtener todos los clientes
  getAll: (filters = {}) => {
    return apiHelpers.getList(endpoints.clients.list, 1, 100, filters);
  },

  // Obtener cliente por ID
  getById: (id) => {
    return api.get(endpoints.clients.get(id));
  },

  // Crear nuevo cliente
  create: (clientData) => {
    return api.post(endpoints.clients.create, clientData);
  },

  // Actualizar cliente
  update: (id, clientData) => {
    return api.put(endpoints.clients.update(id), clientData);
  },

  // Eliminar cliente
  delete: (id) => {
    return api.delete(endpoints.clients.delete(id));
  },

  // Buscar clientes
  search: (query) => {
    return apiHelpers.search(endpoints.clients.list, query);
  },
};

// Servicio para gestión de pedidos
export const orderService = {
  // Obtener todos los pedidos
  getAll: (filters = {}) => {
    return apiHelpers.getList(endpoints.orders.list, 1, 100, filters);
  },

  // Obtener pedido por ID
  getById: (id) => {
    return api.get(endpoints.orders.get(id));
  },

  // Crear nuevo pedido
  create: (orderData) => {
    return api.post(endpoints.orders.create, orderData);
  },

  // Actualizar pedido
  update: (id, orderData) => {
    return api.put(endpoints.orders.update(id), orderData);
  },

  // Actualizar estado de pedido
  updateStatus: (id, status) => {
    return api.patch(endpoints.orders.updateStatus(id), { status });
  },

  // Eliminar pedido
  delete: (id) => {
    return api.delete(endpoints.orders.delete(id));
  },

  // Obtener pedidos por cliente
  getByClient: (clientId) => {
    return api.get(endpoints.orders.list, { clientId });
  },

  // Obtener estadísticas de pedidos
  getStats: (period = 'month') => {
    return apiHelpers.getStats(endpoints.orders.list, period);
  },
};

// Servicio para gestión de inventario
export const inventoryService = {
  // Obtener todo el inventario
  getAll: (filters = {}) => {
    return apiHelpers.getList(endpoints.inventory.list, 1, 100, filters);
  },

  // Obtener artículo por ID
  getById: (id) => {
    return api.get(endpoints.inventory.get(id));
  },

  // Crear nuevo artículo
  create: (itemData) => {
    return api.post(endpoints.inventory.create, itemData);
  },

  // Actualizar artículo
  update: (id, itemData) => {
    return api.put(endpoints.inventory.update(id), itemData);
  },

  // Eliminar artículo
  delete: (id) => {
    return api.delete(endpoints.inventory.delete(id));
  },

  // Obtener artículos con stock bajo
  getLowStock: () => {
    return api.get(endpoints.inventory.lowStock);
  },

  // Actualizar stock
  updateStock: (id, quantity, operation = 'set') => {
    return api.patch(endpoints.inventory.update(id), { 
      stock: quantity, 
      operation 
    });
  },
};

// Servicio para gestión de producción
export const productionService = {
  // Obtener todas las órdenes de producción
  getAll: (filters = {}) => {
    return apiHelpers.getList(endpoints.production.list, 1, 100, filters);
  },

  // Obtener orden por ID
  getById: (id) => {
    return api.get(endpoints.production.get(id));
  },

  // Crear nueva orden de producción
  create: (productionData) => {
    return api.post(endpoints.production.create, productionData);
  },

  // Actualizar orden de producción
  update: (id, productionData) => {
    return api.put(endpoints.production.update(id), productionData);
  },

  // Actualizar estado de producción
  updateStatus: (id, status, progress = null) => {
    const data = { status };
    if (progress !== null) {
      data.progress = progress;
    }
    return api.patch(endpoints.production.updateStatus(id), data);
  },

  // Eliminar orden de producción
  delete: (id) => {
    return api.delete(endpoints.production.delete(id));
  },

  // Obtener estadísticas de producción
  getStats: (period = 'month') => {
    return apiHelpers.getStats(endpoints.production.list, period);
  },
};

// Servicio para gestión de contratos
export const contractService = {
  // Obtener todos los contratos
  getAll: (filters = {}) => {
    return apiHelpers.getList(endpoints.contracts.list, 1, 100, filters);
  },

  // Obtener contrato por ID
  getById: (id) => {
    return api.get(endpoints.contracts.get(id));
  },

  // Crear nuevo contrato
  create: (contractData) => {
    return api.post(endpoints.contracts.create, contractData);
  },

  // Actualizar contrato
  update: (id, contractData) => {
    return api.put(endpoints.contracts.update(id), contractData);
  },

  // Eliminar contrato
  delete: (id) => {
    return api.delete(endpoints.contracts.delete(id));
  },

  // Descargar contrato en PDF
  download: (id) => {
    return api.get(endpoints.contracts.download(id));
  },

  // Obtener contratos activos
  getActive: () => {
    return api.get(endpoints.contracts.list, { status: 'active' });
  },

  // Obtener contratos por vencer
  getExpiring: (days = 30) => {
    return api.get(endpoints.contracts.list, { expiring: days });
  },
};

// Servicio para reportes y análisis
export const reportService = {
  // Reporte de ventas
  getSalesReport: (period = 'month', filters = {}) => {
    return api.get(endpoints.reports.sales, { period, ...filters });
  },

  // Reporte de clientes
  getClientReport: (period = 'month') => {
    return api.get(endpoints.reports.clients, { period });
  },

  // Reporte de inventario
  getInventoryReport: () => {
    return api.get(endpoints.reports.inventory);
  },

  // Reporte de producción
  getProductionReport: (period = 'month') => {
    return api.get(endpoints.reports.production, { period });
  },

  // Exportar reportes
  exportReport: (type, format = 'pdf', filters = {}) => {
    return api.post(endpoints.reports.export, {
      type,
      format,
      filters
    });
  },
};

// Servicio para manejo de archivos
export const fileService = {
  // Subir archivo
  upload: (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.upload(endpoints.files.upload, formData);
  },

  // Subir múltiples archivos
  uploadMultiple: (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('folder', folder);
    return api.upload(endpoints.files.upload, formData);
  },

  // Descargar archivo
  download: (id) => {
    return api.get(endpoints.files.download(id));
  },

  // Eliminar archivo
  delete: (id) => {
    return api.delete(endpoints.files.delete(id));
  },
};

// Servicio para datos de la aplicación (configuraciones, etc.)
export const appDataService = {
  // Obtener configuraciones de la aplicación
  getSettings: () => {
    return api.get('/settings');
  },

  // Actualizar configuraciones
  updateSettings: (settings) => {
    return api.put('/settings', settings);
  },

  // Obtener datos del dashboard
  getDashboardData: () => {
    return api.get('/dashboard/data');
  },

  // Obtener métricas generales
  getMetrics: (period = 'month') => {
    return api.get('/metrics', { period });
  },

  // Exportar datos completos
  exportData: (format = 'json') => {
    return api.get('/export', { format });
  },

  // Importar datos
  importData: (file) => {
    const formData = new FormData();
    formData.append('dataFile', file);
    return api.upload('/import', formData);
  },

  // Backup de datos
  createBackup: () => {
    return api.post('/backup');
  },

  // Restaurar desde backup
  restoreBackup: (backupFile) => {
    const formData = new FormData();
    formData.append('backup', backupFile);
    return api.upload('/restore', formData);
  },
};

// Mock data para desarrollo local
export const mockDataService = {
  // Simular delay de red
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Generar datos mock para clientes
  generateMockClients: (count = 10) => {
    const clients = [];
    const tipos = ['Particular', 'Colegio', 'Empresa'];
    const nombres = ['María García', 'Juan Pérez', 'Ana Torres', 'Carlos López', 'I.E. San Martín', 'Empresa TechSol'];
    
    for (let i = 1; i <= count; i++) {
      clients.push({
        id: `C${String(i).padStart(3, '0')}`,
        nombre: nombres[Math.floor(Math.random() * nombres.length)] + ` ${i}`,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        contacto: `98765${String(i).padStart(4, '0')}`,
        email: `cliente${i}@email.com`,
        direccion: `Av. Test ${i}, Lima`,
        fechaRegistro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalPedidos: Math.floor(Math.random() * 20),
        montoTotal: Math.floor(Math.random() * 5000),
      });
    }
    
    return clients;
  },

  // Generar datos mock para pedidos
  generateMockOrders: (count = 15) => {
    const orders = [];
    const servicios = ['Impresión Digital', 'Enmarcado', 'Fotografía Escolar', 'Sesión Familiar'];
    const estados = ['Pendiente', 'En Proceso', 'Listo para Entrega', 'Entregado'];
    
    for (let i = 1; i <= count; i++) {
      orders.push({
        id: String(i).padStart(3, '0'),
        cliente: `Cliente ${i}`,
        servicio: servicios[Math.floor(Math.random() * servicios.length)],
        cantidad: Math.floor(Math.random() * 50) + 1,
        fechaPedido: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaEntrega: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        precio: Math.floor(Math.random() * 1000) + 50,
        adelanto: Math.floor(Math.random() * 500),
        estado: estados[Math.floor(Math.random() * estados.length)],
      });
    }
    
    return orders;
  },
};

// Utilidades para manejo de datos
export const dataUtils = {
  // Formatear moneda peruana
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  },

  // Formatear fecha
  formatDate: (date, format = 'short') => {
    const options = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    };
    
    return new Intl.DateTimeFormat('es-PE', options[format]).format(new Date(date));
  },

  // Calcular progreso de pago
  calculatePaymentProgress: (total, paid) => {
    return Math.round((paid / total) * 100);
  },

  // Determinar estado de stock
  getStockStatus: (current, minimum) => {
    if (current === 0) return 'agotado';
    if (current <= minimum) return 'bajo';
    return 'normal';
  },

  // Filtrar y ordenar datos
  filterAndSort: (data, filters, sortBy, sortOrder = 'asc') => {
    let filteredData = [...data];
    
    // Aplicar filtros
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        filteredData = filteredData.filter(item => {
          if (typeof item[key] === 'string') {
            return item[key].toLowerCase().includes(filters[key].toLowerCase());
          }
          return item[key] === filters[key];
        });
      }
    });
    
    // Aplicar ordenamiento
    if (sortBy) {
      filteredData.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    return filteredData;
  },
};

// Servicio para métricas del dashboard
export const dashboardService = {
  // Obtener métricas de ingresos y costos
  getFinancialMetrics: async () => {
    try {
      // Simulación de datos - reemplazar con llamadas reales a la API
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      return {
        totalIncome: 15231.89,
        totalCosts: 8450.32,
        netProfit: 6781.57,
        incomeChange: 12.5,
        costsChange: 8.3
      };
    } catch (error) {
      console.error('Error obteniendo métricas financieras:', error);
      throw error;
    }
  },
  
  // Obtener métricas de clientes
  getClientMetrics: async () => {
    try {
      const allClients = await clientService.getAll();
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      // Clasificar clientes nuevos vs recurrentes
      const newClients = allClients.data?.filter(client => {
        const clientDate = new Date(client.createdAt);
        return clientDate >= thirtyDaysAgo;
      }) || [];
      
      const recurringClients = allClients.data?.filter(client => {
        const clientDate = new Date(client.createdAt);
        return clientDate < thirtyDaysAgo && client.totalOrders > 1;
      }) || [];
      
      return {
        newClients: newClients.length,
        recurringClients: recurringClients.length,
        newClientsChange: 15.2,
        recurringClientsChange: 5.8
      };
    } catch (error) {
      console.error('Error obteniendo métricas de clientes:', error);
      return {
        newClients: 24,
        recurringClients: 156,
        newClientsChange: 15.2,
        recurringClientsChange: 5.8
      };
    }
  },
  
  // Obtener métricas de pedidos
  getOrderMetrics: async () => {
    try {
      const allOrders = await orderService.getAll();
      const currentDate = new Date();
      
      // Clasificar pedidos activos vs retrasados
      const activeOrders = allOrders.data?.filter(order => {
        return order.status === 'en_progreso' || order.status === 'pendiente';
      }) || [];
      
      const delayedOrders = allOrders.data?.filter(order => {
        const deliveryDate = new Date(order.deliveryDate);
        return deliveryDate < currentDate && order.status !== 'completado';
      }) || [];
      
      return {
        activeOrders: activeOrders.length,
        delayedOrders: delayedOrders.length,
        activeOrdersChange: -2.1,
        delayedOrdersChange: -15.3
      };
    } catch (error) {
      console.error('Error obteniendo métricas de pedidos:', error);
      return {
        activeOrders: 18,
        delayedOrders: 5,
        activeOrdersChange: -2.1,
        delayedOrdersChange: -15.3
      };
    }
  },
  
  // Obtener unidad neta del inventario
  getInventoryNetUnit: async () => {
    try {
      const inventory = await inventoryService.getAll();
      
      // Calcular unidad neta (valor total del inventario)
      const netUnit = inventory.data?.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
      }, 0) || 0;
      
      // Calcular cambio basado en el mes anterior (simulado)
      const previousMonthValue = netUnit * 0.92; // Simulación de 8% de crecimiento
      const change = ((netUnit - previousMonthValue) / previousMonthValue) * 100;
      
      return {
        netUnit: netUnit,
        change: change
      };
    } catch (error) {
      console.error('Error obteniendo unidad neta del inventario:', error);
      return {
        netUnit: 45230.75,
        change: 8.2
      };
    }
  },
  
  // Obtener todas las métricas del dashboard
  getAllMetrics: async () => {
    try {
      const [financial, clients, orders, inventory] = await Promise.all([
        dashboardService.getFinancialMetrics(),
        dashboardService.getClientMetrics(),
        dashboardService.getOrderMetrics(),
        dashboardService.getInventoryNetUnit()
      ]);

      return {
        financial,
        clients,
        orders,
        inventory
      };
    } catch (error) {
      console.error('Error obteniendo métricas del dashboard:', error);
      throw error;
    }
  }
};