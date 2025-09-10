import { useState, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Función para obtener el valor del localStorage
  const getStoredValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error leyendo localStorage para la clave "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Función para guardar valor en localStorage
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error guardando en localStorage para la clave "${key}":`, error);
    }
  }, [key, storedValue]);

  // Función para remover valor del localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removiendo de localStorage para la clave "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook para gestionar múltiples claves de localStorage
export const useMultipleLocalStorage = (keys) => {
  const [values, setValues] = useState(() => {
    const initialValues = {};
    keys.forEach(({ key, initialValue }) => {
      try {
        const item = window.localStorage.getItem(key);
        initialValues[key] = item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(`Error leyendo localStorage para la clave "${key}":`, error);
        initialValues[key] = initialValue;
      }
    });
    return initialValues;
  });

  const setValue = useCallback((key, value) => {
    try {
      const valueToStore = value instanceof Function ? value(values[key]) : value;
      setValues(prev => ({ ...prev, [key]: valueToStore }));
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error guardando en localStorage para la clave "${key}":`, error);
    }
  }, [values]);

  const removeValue = useCallback((key) => {
    try {
      window.localStorage.removeItem(key);
      const keyConfig = keys.find(k => k.key === key);
      const initialValue = keyConfig ? keyConfig.initialValue : null;
      setValues(prev => ({ ...prev, [key]: initialValue }));
    } catch (error) {
      console.error(`Error removiendo de localStorage para la clave "${key}":`, error);
    }
  }, [keys]);

  const clearAll = useCallback(() => {
    keys.forEach(({ key }) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error limpiando localStorage para la clave "${key}":`, error);
      }
    });
    
    const initialValues = {};
    keys.forEach(({ key, initialValue }) => {
      initialValues[key] = initialValue;
    });
    setValues(initialValues);
  }, [keys]);

  return {
    values,
    setValue,
    removeValue,
    clearAll
  };
};