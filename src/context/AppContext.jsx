import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { mockDataService } from '../services/dataService';
import { 
  notificationService,
  notifyNewClient,
  notifyClientAction,
  notifyNewOrder,
  notifyOrderAction,
  notifyNewProduct,
  notifyProductAction,
  notifyLowStock,
  notifyAgendaAction,
  notifyProductionAction,
  notifyContractAction
} from '../services/notificationService';

const AppContext = createContext();

// Tipos de acciones para el reducer
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_THEME: 'SET_THEME',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_PERSISTENT_NOTIFICATIONS: 'SET_PERSISTENT_NOTIFICATIONS',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
  SET_DATA: 'SET_DATA',
  UPDATE_DATA: 'UPDATE_DATA',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Estado inicial
const initialState = {
  // UI State
  sidebarOpen: false,
  theme: 'light',
  loading: false,
  error: null,
  
  // Notifications (temporales - toasts)
  notifications: [],
  
  // Persistent Notifications
  persistentNotifications: [],
  unreadCount: 0,
  
  // App Data
  data: {
    clients: [],
    orders: [],
    inventory: [],
    production: [],
    contracts: [],
  },
  
  // Settings
  settings: {
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    appearance: {
      theme: 'light',
      language: 'es',
      timezone: 'America/Lima',
      dateFormat: 'DD/MM/YYYY',
    },
    business: {
      companyName: 'Arte Ideas Diseño Gráfico',
      address: 'Av. Lima 123, San Juan de Lurigancho',
      phone: '987654321',
      email: 'info@arteideas.com',
      currency: 'PEN',
    },
  },
};

// Reducer para manejar el estado global
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case APP_ACTIONS.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        settings: {
          ...state.settings,
          appearance: {
            ...state.settings.appearance,
            theme: action.payload,
          },
        },
      };

    case APP_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };

    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };

    case APP_ACTIONS.SET_PERSISTENT_NOTIFICATIONS:
      return {
        ...state,
        persistentNotifications: action.payload,
      };

    case APP_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };

    case APP_ACTIONS.SET_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.type]: action.payload.data,
        },
      };

    case APP_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };

    case APP_ACTIONS.SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

// Provider del contexto global
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Cargar notificaciones persistentes
  const loadPersistentNotifications = () => {
    const notifications = notificationService.getNotifications();
    const unreadCount = notificationService.getUnreadCount();
    
    dispatch({ type: APP_ACTIONS.SET_PERSISTENT_NOTIFICATIONS, payload: notifications });
    dispatch({ type: APP_ACTIONS.UPDATE_UNREAD_COUNT, payload: unreadCount });
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: true });

      try {
        // Cargar configuraciones desde localStorage
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          dispatch({ type: APP_ACTIONS.SET_SETTINGS, payload: parsedSettings });
        }

        // Cargar tema desde localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        dispatch({ type: APP_ACTIONS.SET_THEME, payload: savedTheme });

        // Generar datos mock para desarrollo
        const mockClients = mockDataService.generateMockClients(10);
        const mockOrders = mockDataService.generateMockOrders(15);

        dispatch({ type: APP_ACTIONS.SET_DATA, payload: { type: 'clients', data: mockClients } });
        dispatch({ type: APP_ACTIONS.SET_DATA, payload: { type: 'orders', data: mockOrders } });

        // Cargar notificaciones persistentes
        loadPersistentNotifications();

        // Agregar algunas notificaciones de ejemplo para demostración
        setTimeout(() => {
          notificationService.addNotification({
            title: '⚠️ Stock Crítico',
            message: 'Papel A4 80gr tiene stock bajo (2 unidades)',
            description: 'El producto Papel A4 80gr tiene solo 2 unidades disponibles. El stock mínimo recomendado es 10 unidades.',
            type: 'warning',
            category: 'inventory',
            action: 'stock_alert',
            metadata: { productName: 'Papel A4 80gr', currentStock: 2, minStock: 10 }
          });

          notificationService.addNotification({
            title: '🔧 Mantenimiento Próximo',
            message: 'Impresora HP LaserJet requiere mantenimiento',
            description: 'La impresora HP LaserJet tiene programado un mantenimiento preventivo para mañana.',
            type: 'info',
            category: 'maintenance',
            action: 'maintenance_alert',
            metadata: { equipmentName: 'Impresora HP LaserJet', maintenanceDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }
          });

          notificationService.addNotification({
            title: '🚚 Entrega Urgente',
            message: 'Pedido PED-2024-001 debe entregarse mañana',
            description: 'El pedido PED-2024-001 de Empresa ABC S.A.C. debe entregarse mañana. Está en estado "En producción".',
            type: 'warning',
            category: 'order',
            action: 'delivery_alert',
            metadata: { orderNumber: 'PED-2024-001', clientName: 'Empresa ABC S.A.C.', deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }
          });
        }, 2000);

      } catch (error) {
        dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: APP_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadInitialData();

    // Suscribirse a cambios en notificaciones persistentes
    const unsubscribe = notificationService.subscribe(() => {
      loadPersistentNotifications();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Funciones para manejar la sidebar
  const toggleSidebar = () => {
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR_OPEN, payload: !state.sidebarOpen });
  };

  const closeSidebar = () => {
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR_OPEN, payload: false });
  };

  const openSidebar = () => {
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR_OPEN, payload: true });
  };

  // Funciones para manejar el tema
  const setTheme = (theme) => {
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
    localStorage.setItem('theme', theme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Funciones para manejar notificaciones
  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      ...notification,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: newNotification });

    // Auto-remover notificación después de cierto tiempo
    if (notification.autoRemove !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.SET_NOTIFICATIONS, payload: [] });
  };

  // Funciones para manejar datos
  const setData = (type, data) => {
    dispatch({ type: APP_ACTIONS.SET_DATA, payload: { type, data } });
  };

  const updateData = (updates) => {
    dispatch({ type: APP_ACTIONS.UPDATE_DATA, payload: updates });
  };

  // Funciones para manejar configuraciones
  const updateSettings = (newSettings) => {
    const updatedSettings = {
      ...state.settings,
      ...newSettings,
    };
    
    dispatch({ type: APP_ACTIONS.SET_SETTINGS, payload: updatedSettings });
    localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    dispatch({ type: APP_ACTIONS.SET_SETTINGS, payload: initialState.settings });
    localStorage.removeItem('appSettings');
  };

  // Funciones para manejar errores
  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  // Utilidades
  const showNotification = (message, type = 'info', options = {}) => {
    return addNotification({
      message,
      type,
      ...options,
    });
  };

  const showSuccess = (message, options = {}) => {
    return showNotification(message, 'success', options);
  };

  const showError = (message, options = {}) => {
    return showNotification(message, 'error', { duration: 8000, ...options });
  };

  const showWarning = (message, options = {}) => {
    return showNotification(message, 'warning', options);
  };

  // Funciones para notificaciones persistentes
  const addPersistentNotification = (notification) => {
    const newNotification = notificationService.addNotification(notification);
    return newNotification;
  };

  const markNotificationAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllNotificationsAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removePersistentNotification = (notificationId) => {
    notificationService.removeNotification(notificationId);
  };

  const clearAllNotifications = () => {
    notificationService.clearAll();
  };

  // Funciones de conveniencia para crear notificaciones específicas
  const notifyAction = (action, entity, entityName, details = {}) => {
    return notificationService.createCRUDNotification(action, entity, entityName, details);
  };

  const notifyNewClient = (clientName, clientType = 'cliente') => {
    return notificationService.createClientNotification(clientName, clientType);
  };

  const notifyOrder = (action, orderNumber, clientName, details = {}) => {
    return notificationService.createOrderNotification(action, orderNumber, clientName, details);
  };

  const notifyStockAlert = (productName, currentStock, minStock) => {
    return notificationService.createStockNotification(productName, currentStock, minStock);
  };

  const notifyReminder = (type, title, message, dueDate, details = {}) => {
    return notificationService.createReminderNotification(type, title, message, dueDate, details);
  };

  const value = {
    // Estado
    ...state,

    // Sidebar
    toggleSidebar,
    closeSidebar,
    openSidebar,

    // Tema
    setTheme,
    toggleTheme,

    // Notificaciones temporales (toasts)
    addNotification,
    removeNotification,
    clearNotifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,

    // Notificaciones persistentes
    addPersistentNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removePersistentNotification,
    clearAllNotifications,
    
    // Funciones específicas de notificación
      notifyNewClient,
      notifyClientAction,
      notifyNewOrder,
      notifyOrderAction,
      notifyNewProduct,
      notifyProductAction,
      notifyLowStock,
      notifyAgendaAction,
      notifyProductionAction,
      notifyContractAction,

    // Datos
    setData,
    updateData,

    // Configuraciones
    updateSettings,
    resetSettings,

    // Errores
    setError,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};