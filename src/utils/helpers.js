import { CURRENCIES, DATE_FORMATS } from './constants';

// Utilidades para formatear datos
export const formatters = {
  // Formatear moneda
  currency: (amount, currencyCode = 'PEN') => {
    const currency = CURRENCIES[currencyCode];
    if (!currency) return amount;
    
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Formatear números
  number: (number, decimals = 0) => {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  },

  // Formatear porcentajes
  percentage: (value, decimals = 1) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  },

  // Formatear fechas
  date: (date, format = 'short') => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const options = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      },
      timeOnly: { hour: '2-digit', minute: '2-digit' },
    };
    
    return new Intl.DateTimeFormat('es-PE', options[format]).format(dateObj);
  },

  // Formatear tiempo relativo
  timeAgo: (date) => {
    if (!date) return '';
    
    const now = new Date();
    const dateObj = new Date(date);
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    const intervals = {
      año: 31536000,
      mes: 2592000,
      semana: 604800,
      día: 86400,
      hora: 3600,
      minuto: 60,
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `Hace ${interval} ${unit}${interval > 1 ? (unit === 'mes' ? 'es' : 's') : ''}`;
      }
    }
    
    return 'Ahora mismo';
  },

  // Formatear teléfono
  phone: (phone) => {
    if (!phone) return '';
    
    // Formato peruano: +51 987 654 321
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('51')) {
      return `+51 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    
    return phone;
  },
};

// Utilidades para validación
export const validators = {
  // Validar email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar teléfono peruano
  phone: (phone) => {
    const phoneRegex = /^(\+?51)?[9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Validar RUC
  ruc: (ruc) => {
    const rucRegex = /^\d{11}$/;
    return rucRegex.test(ruc);
  },

  // Validar DNI
  dni: (dni) => {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  },

  // Validar contraseña
  password: (password, minLength = 6) => {
    return password && password.length >= minLength;
  },

  // Validar campo requerido
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  // Validar rango numérico
  numberRange: (number, min, max) => {
    const num = parseFloat(number);
    return !isNaN(num) && num >= min && num <= max;
  },

  // Validar fecha
  date: (date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  },

  // Validar URL
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// Utilidades para manipular strings
export const stringUtils = {
  // Capitalizar primera letra
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convertir a título
  titleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Truncar texto
  truncate: (str, length = 100, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  // Generar slug
  slugify: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },

  // Limpiar texto
  clean: (str) => {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ');
  },

  // Extraer iniciales
  getInitials: (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },
};

// Utilidades para fechas
export const dateUtils = {
  // Obtener fecha actual en formato ISO
  now: () => new Date().toISOString(),

  // Obtener inicio del día
  startOfDay: (date = new Date()) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  },

  // Obtener fin del día
  endOfDay: (date = new Date()) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  },

  // Agregar días
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // Obtener diferencia en días
  daysDiff: (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((new Date(date2) - new Date(date1)) / oneDay);
  },

  // Verificar si es el mismo día
  isSameDay: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  },

  // Obtener rango de fechas
  getDateRange: (period) => {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case 'today':
        return [dateUtils.startOfDay(now), dateUtils.endOfDay(now)];
      
      case 'yesterday':
        start.setDate(now.getDate() - 1);
        return [dateUtils.startOfDay(start), dateUtils.endOfDay(start)];
      
      case 'this_week':
        start.setDate(now.getDate() - now.getDay());
        return [dateUtils.startOfDay(start), dateUtils.endOfDay(now)];
      
      case 'this_month':
        start.setDate(1);
        return [dateUtils.startOfDay(start), dateUtils.endOfDay(now)];
      
      case 'this_year':
        start.setMonth(0, 1);
        return [dateUtils.startOfDay(start), dateUtils.endOfDay(now)];
      
      default:
        return [dateUtils.startOfDay(now), dateUtils.endOfDay(now)];
    }
  },
};

// Utilidades para arrays
export const arrayUtils = {
  // Agrupar por propiedad
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Ordenar por propiedad
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },

  // Remover duplicados
  unique: (array, key) => {
    if (!key) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  // Dividir en chunks
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // Encontrar por múltiples criterios
  findBy: (array, criteria) => {
    return array.find(item => {
      return Object.keys(criteria).every(key => item[key] === criteria[key]);
    });
  },
};

// Utilidades para objetos
export const objectUtils = {
  // Obtener valor anidado de forma segura
  get: (obj, path, defaultValue = undefined) => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  },

  // Establecer valor anidado
  set: (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    return obj;
  },

  // Limpiar propiedades vacías
  clean: (obj) => {
    const cleaned = {};
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedNested = objectUtils.clean(value);
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  },

  // Deep merge de objetos
  merge: (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          objectUtils.merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    
    return objectUtils.merge(target, ...sources);
  },
};

// Función auxiliar para verificar si es objeto
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Utilidades para archivos
export const fileUtils = {
  // Obtener extensión de archivo
  getExtension: (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  },

  // Formatear tamaño de archivo
  formatSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Verificar tipo de archivo
  isImage: (file) => {
    return file && file.type && file.type.startsWith('image/');
  },

  isPDF: (file) => {
    return file && file.type === 'application/pdf';
  },

  isDocument: (file) => {
    const docTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    return file && docTypes.includes(file.type);
  },
};

// Utilidades diversas
export const miscUtils = {
  // Generar ID único
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Generar color aleatorio
  randomColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  },

  // Debounce
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Sleep/delay
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Copiar al portapapeles
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  },
};

// Utilidades específicas para el dashboard
export const dashboardUtils = {
  // Formatear moneda en soles peruanos
  formatSoles: (amount) => {
    if (amount === null || amount === undefined) return 'S/ 0.00';
    return `S/ ${amount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },
  
  // Calcular porcentaje de cambio
  calculatePercentageChange: (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  },
  
  // Determinar el tipo de cambio (positivo/negativo)
  getChangeType: (change, isInverse = false) => {
    if (isInverse) {
      return change <= 0 ? 'positive' : 'negative';
    }
    return change >= 0 ? 'positive' : 'negative';
  },
  
  // Clasificar clientes por tipo
  classifyClients: (clients) => {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const newClients = clients.filter(client => {
      const clientDate = new Date(client.createdAt || client.fechaRegistro);
      return clientDate >= thirtyDaysAgo;
    });
    
    const recurringClients = clients.filter(client => {
      const clientDate = new Date(client.createdAt || client.fechaRegistro);
      const totalOrders = client.totalOrders || client.totalPedidos || 0;
      return clientDate < thirtyDaysAgo && totalOrders > 1;
    });
    
    return {
      newClients: newClients.length,
      recurringClients: recurringClients.length,
      totalClients: clients.length
    };
  },
  
  // Clasificar pedidos por estado
  classifyOrders: (orders) => {
    const currentDate = new Date();
    
    const activeOrders = orders.filter(order => {
      const status = order.status || order.estado;
      return status === 'en_progreso' || status === 'pendiente' || status === 'En Proceso' || status === 'Pendiente';
    });
    
    const delayedOrders = orders.filter(order => {
      const deliveryDate = new Date(order.deliveryDate || order.fechaEntrega);
      const status = order.status || order.estado;
      return deliveryDate < currentDate && status !== 'completado' && status !== 'Entregado';
    });
    
    const completedOrders = orders.filter(order => {
      const status = order.status || order.estado;
      return status === 'completado' || status === 'Entregado';
    });
    
    return {
      activeOrders: activeOrders.length,
      delayedOrders: delayedOrders.length,
      completedOrders: completedOrders.length,
      totalOrders: orders.length
    };
  },
  
  // Calcular valor neto del inventario
  calculateInventoryNetValue: (inventory) => {
    return inventory.reduce((total, item) => {
      const quantity = item.quantity || item.cantidad || 0;
      const unitPrice = item.unitPrice || item.precio || item.precioUnitario || 0;
      return total + (quantity * unitPrice);
    }, 0);
  },
  
  // Generar datos mock para desarrollo
  generateMockMetrics: () => {
    return {
      financial: {
        totalIncome: 15231.89,
        totalCosts: 8450.32,
        netProfit: 6781.57,
        incomeChange: 12.5,
        costsChange: 8.3
      },
      clients: {
        newClients: 24,
        recurringClients: 156,
        newClientsChange: 15.2,
        recurringClientsChange: 5.8
      },
      orders: {
        activeOrders: 18,
        delayedOrders: 5,
        activeOrdersChange: -2.1,
        delayedOrdersChange: -15.3
      },
      inventory: {
        netUnit: 45230.75,
        change: 8.2
      }
    };
  },
  
  // Validar datos de métricas
  validateMetrics: (metrics) => {
    const requiredFields = ['financial', 'clients', 'orders', 'inventory'];
    return requiredFields.every(field => metrics && metrics[field]);
  }
};

export default {
  formatters,
  validators,
  stringUtils,
  dateUtils,
  arrayUtils,
  objectUtils,
  fileUtils,
  miscUtils,
  dashboardUtils,
};