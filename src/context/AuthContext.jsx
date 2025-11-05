import { createContext, useContext, useEffect, useReducer } from 'react';
import authService from '../features/auth/services/authService';

const AuthContext = createContext();

// Tipos de acciones para el reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  CLEAR_AUTH: 'CLEAR_AUTH',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE_IMAGE: 'UPDATE_PROFILE_IMAGE',
  SET_PROFILE_IMAGE: 'SET_PROFILE_IMAGE',
};

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_AUTH:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE_IMAGE:
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: action.payload
        }
      };

    case AUTH_ACTIONS.SET_PROFILE_IMAGE:
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          profileImage: action.payload
        } : null
      };

    default:
      return state;
  }
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      try {
        if (authService.isAuthenticated()) {
          const user = authService.getUser();
          // Cargar imagen de perfil desde localStorage si existe
          const savedImage = localStorage.getItem('userProfileImage');
          if (savedImage) {
            user.profileImage = savedImage;
          }
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH });
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authService.login(credentials);

      if (result.success) {
        // Si el usuario necesita cambiar contraseña, no lo autenticamos completamente
        if (result.requiresPasswordChange) {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          // Enviar código de verificación automáticamente
          await authService.sendVerificationCode(result.user.email);
          return { 
            success: true, 
            requiresPasswordChange: true, 
            redirectTo: '/change-password',
            user: result.user 
          };
        }
        
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: result.user });
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error durante el login';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      await authService.logout();
      // Limpiar imagen de perfil del localStorage al hacer logout
      localStorage.removeItem('userProfileImage');
      dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH });
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Actualizar perfil de usuario
  const updateProfile = async (profileData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      // Preservar la imagen de perfil si existe
      if (state.user && state.user.profileImage && !profileData.profileImage) {
        profileData.profileImage = state.user.profileImage;
      }
      
      const result = await authService.updateProfile(profileData);

      if (result.success) {
        // Asegurar que la imagen de perfil se mantenga
        if (state.user && state.user.profileImage && !result.user.profileImage) {
          result.user.profileImage = state.user.profileImage;
        }
        
        // Actualizar el estado del usuario para reflejar cambios en la UI
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: result.user });
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error actualizando perfil';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Actualizar imagen de perfil
  const updateProfileImage = async (imageFile) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      // Convertir imagen a base64 para almacenamiento permanente
      const imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      
      // Actualizar en el contexto
      dispatch({ 
        type: AUTH_ACTIONS.UPDATE_PROFILE_IMAGE, 
        payload: imageUrl 
      });
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('userProfileImage', imageUrl);
      
      // Forzar actualización de componentes que usan el contexto
      const updatedUser = {...state.user, profileImage: imageUrl};
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
      
      return { success: true, imageUrl };
    } catch (error) {
      const errorMessage = error.message || 'Error actualizando imagen de perfil';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Establecer imagen de perfil directamente
  const setProfileImage = (imageUrl) => {
    dispatch({ 
      type: AUTH_ACTIONS.SET_PROFILE_IMAGE, 
      payload: imageUrl 
    });
    localStorage.setItem('userProfileImage', imageUrl);
  };

  // Cambiar contraseña
  const changePassword = async (oldPassword, newPassword) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authService.changePassword(oldPassword, newPassword);

      if (!result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.error });
      }

      return result;
    } catch (error) {
      const errorMessage = error.message || 'Error cambiando contraseña';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Verificar permisos
  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  // Verificar rol
  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  // Verificar si es administrador
  const isAdmin = () => {
    return authService.isAdmin();
  };

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      
      if (result.success) {
        const user = authService.getUser();
        // Mantener la imagen de perfil al refrescar
        const savedImage = localStorage.getItem('userProfileImage');
        if (savedImage) {
          user.profileImage = savedImage;
        }
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      } else {
        dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH });
      }
      
      return result;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH });
      return { success: false, error: error.message };
    }
  };

  const value = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,

    // Acciones
    login,
    logout,
    updateProfile,
    updateProfileImage,
    setProfileImage,
    changePassword,
    clearError,
    refreshToken,

    // Utilidades
    hasPermission,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};