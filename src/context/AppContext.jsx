import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockDataService } from '../services/dataService';

const AppContext = createContext();

// Tipos de acciones para el reducer
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_THEME: 'SET_THEME',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
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
  
  // Notifications
  notifications: [],
  
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

      } catch (error) {
        dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: APP_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadInitialData();
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

    // Notificaciones
    addNotification,
    removeNotification,
    clearNotifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,

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