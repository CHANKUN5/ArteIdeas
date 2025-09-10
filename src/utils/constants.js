// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Arte Ideas',
  fullName: 'Arte Ideas Diseño Gráfico',
  version: '1.0.0',
  description: 'Sistema de gestión para estudios fotográficos',
  author: 'Elberc149',
  email: 'elberc149@arteideas.com',
};

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  AGENDA: '/agenda',
  PEDIDOS: '/pedidos',
  CLIENTES: '/clientes',
  INVENTARIO: '/inventario',
  PRODUCCION: '/produccion',
  CONTRATOS: '/contratos',
  REPORTES: '/reportes',
  PERFIL: '/perfil',
  CONFIGURACION: '/configuracion',
};

// Estados de pedidos
export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  IN_PROCESS: 'En Proceso',
  READY: 'Listo para Entrega',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

// Estados de producción
export const PRODUCTION_STATUS = {
  PENDING: 'Pendiente',
  IN_TRANSIT: 'En Trámite',
  IN_PROCESS: 'En Proceso',
  IN_STORAGE: 'En Almacén',
  COMPLETED: 'Completado',
};

// Estados de contratos
export const CONTRACT_STATUS = {
  ACTIVE: 'Activo',
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  EXPIRED: 'Vencido',
  COMPLETED: 'Completado',
};

// Tipos de clientes
export const CLIENT_TYPES = {
  INDIVIDUAL: 'Particular',
  SCHOOL: 'Colegio',
  COMPANY: 'Empresa',
};

// Servicios disponibles
export const SERVICES = {
  DIGITAL_PRINTING: 'Impresión Digital',
  SCHOOL_PHOTOGRAPHY: 'Fotografía Escolar',
  SCHOOL_PROMOTION: 'Promoción Escolar',
  FRAMING: 'Enmarcado',
  PHOTO_EDITING: 'Retoque Fotográfico',
  FAMILY_SESSION: 'Sesión Familiar',
  EVENT_PHOTOGRAPHY: 'Fotografía de Eventos',
  CORPORATE_PHOTOGRAPHY: 'Fotografía Corporativa',
  ENLARGEMENTS: 'Ampliaciones',
  REMEMBRANCES: 'Recordatorios',
};

// Categorías de inventario
export const INVENTORY_CATEGORIES = {
  FRAMES: 'Molduras',
  PAPER: 'Papel',
  GLASS: 'Vidrios',
  ACCESSORIES: 'Accesorios',
  TOOLS: 'Herramientas',
  EQUIPMENT: 'Equipos',
};

// Estados de inventario
export const INVENTORY_STATUS = {
  NORMAL: 'normal',
  LOW: 'bajo',
  OUT_OF_STOCK: 'agotado',
  CRITICAL: 'crítico',
};

// Prioridades
export const PRIORITY_LEVELS = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja',
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Formatos de fecha
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD [de] MMMM [de] YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'YYYY-MM-DD',
};

// Monedas soportadas
export const CURRENCIES = {
  PEN: { code: 'PEN', symbol: 'S/', name: 'Soles' },
  USD: { code: 'USD', symbol: '$', name: 'Dólares' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euros' },
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  EMPLOYEE: 'Empleado',
  PHOTOGRAPHER: 'Fotógrafo',
  ASSISTANT: 'Asistente',
};

// Permisos del sistema
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
  MANAGE_USERS: 'manage_users',
  MANAGE_INVENTORY: 'manage_inventory',
  MANAGE_FINANCES: 'manage_finances',
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
};

// Configuración de validación
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+?51)?[9]\d{8}$/, // Formato peruano
  RUC_REGEX: /^\d{11}$/, // RUC peruano
  DNI_REGEX: /^\d{8}$/, // DNI peruano
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingrese un email válido',
  INVALID_PHONE: 'Ingrese un número de teléfono válido',
  INVALID_RUC: 'Ingrese un RUC válido',
  INVALID_DNI: 'Ingrese un DNI válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
  PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
  USERNAME_TOO_SHORT: 'El nombre de usuario debe tener al menos 3 caracteres',
  NETWORK_ERROR: 'Error de conexión. Verifique su internet',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
  NOT_FOUND: 'El recurso solicitado no fue encontrado',
  SERVER_ERROR: 'Error interno del servidor',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Guardado exitosamente',
  UPDATE_SUCCESS: 'Actualizado exitosamente',
  DELETE_SUCCESS: 'Eliminado exitosamente',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  EMAIL_SENT: 'Email enviado correctamente',
  EXPORT_SUCCESS: 'Datos exportados exitosamente',
  IMPORT_SUCCESS: 'Datos importados exitosamente',
};

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Configuración de temas
export const THEME_CONFIG = {
  LIGHT: {
    name: 'light',
    label: 'Claro',
    primary: '#1DD1E3',
    secondary: '#FF9912',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
  },
  DARK: {
    name: 'dark',
    label: 'Oscuro',
    primary: '#1DD1E3',
    secondary: '#FF9912',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
  },
};

// Configuración de local storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  APP_SETTINGS: 'appSettings',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebarState',
};

// Idiomas soportados
export const LANGUAGES = {
  ES: { code: 'es', name: 'Español', flag: '🇪🇸' },
  EN: { code: 'en', name: 'English', flag: '🇺🇸' },
};

// Zonas horarias
export const TIMEZONES = {
  LIMA: 'America/Lima',
  NEW_YORK: 'America/New_York',
  LONDON: 'Europe/London',
  MADRID: 'Europe/Madrid',
};

// Formatos de exportación
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'xlsx',
  CSV: 'csv',
  JSON: 'json',
};

// Configuración de reportes
export const REPORT_TYPES = {
  SALES: 'sales',
  CLIENTS: 'clients',
  INVENTORY: 'inventory',
  PRODUCTION: 'production',
  FINANCIAL: 'financial',
};

// Periodos de tiempo para reportes
export const TIME_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Breakpoints para responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

export default {
  APP_CONFIG,
  ROUTES,
  ORDER_STATUS,
  PRODUCTION_STATUS,
  CONTRACT_STATUS,
  CLIENT_TYPES,
  SERVICES,
  INVENTORY_CATEGORIES,
  INVENTORY_STATUS,
  PRIORITY_LEVELS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  CURRENCIES,
  USER_ROLES,
  PERMISSIONS,
  PAGINATION,
  FILE_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_CONFIG,
  THEME_CONFIG,
  STORAGE_KEYS,
  LANGUAGES,
  TIMEZONES,
  EXPORT_FORMATS,
  REPORT_TYPES,
  TIME_PERIODS,
  ANIMATION_CONFIG,
  BREAKPOINTS,
};