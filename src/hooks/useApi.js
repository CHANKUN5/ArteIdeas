import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (requestFn) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await requestFn();
      return { data: result, error: null, success: true };
    } catch (err) {
      const errorMessage = err.message || 'Ha ocurrido un error';
      setError(errorMessage);
      return { data: null, error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Simular operaciones CRUD para clientes
  const clientsApi = {
    getAll: useCallback(() => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        {
          id: 1,
          nombre: 'María González',
          tipo: 'Particular',
          contacto: '987654321',
          email: 'maria@email.com',
          ie: '',
          direccion: 'Av. Los Olivos 123',
          detalles: 'Cliente frecuente',
          fechaRegistro: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'I.E. San Martín de Porres',
          tipo: 'Colegio',
          contacto: '964125378',
          email: 'secretaria@sanmartin.edu.pe',
          ie: 'I.E. San Martín de Porres',
          direccion: 'Jr. Educación 456',
          detalles: 'Promoción 2025 - 180 estudiantes',
          fechaRegistro: '2024-02-01'
        }
      ];
    }), [makeRequest]),

    create: useCallback((clientData) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now(), ...clientData, fechaRegistro: new Date().toISOString().split('T')[0] };
    }), [makeRequest]),

    update: useCallback((id, clientData) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...clientData };
    }), [makeRequest]),

    delete: useCallback((id) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { deleted: true, id };
    }), [makeRequest])
  };

  // Simular operaciones CRUD para pedidos
  const ordersApi = {
    getAll: useCallback(() => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'PED001',
          cliente: 'María González',
          servicio: 'Impresión Digital',
          cantidad: 24,
          fechaPedido: '2025-06-01',
          fechaEntrega: '2025-06-15',
          precio: 120.00,
          adelanto: 50.00,
          estado: 'En Proceso',
          especificaciones: '10x15cm, papel fotográfico mate',
          observaciones: 'Entrega urgente'
        },
        {
          id: 'PED002',
          cliente: 'I.E. San Martín de Porres',
          servicio: 'Fotografía Escolar',
          cantidad: 180,
          fechaPedido: '2025-05-20',
          fechaEntrega: '2025-07-30',
          precio: 4500.00,
          adelanto: 1500.00,
          estado: 'Planificación',
          especificaciones: 'Sesión individual y grupal, formato digital y físico',
          observaciones: 'Promoción 2025 completa'
        }
      ];
    }), [makeRequest]),

    create: useCallback((orderData) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { id: 'PED' + String(Date.now()).slice(-3), ...orderData };
    }), [makeRequest]),

    update: useCallback((id, orderData) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...orderData };
    }), [makeRequest]),

    delete: useCallback((id) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { deleted: true, id };
    }), [makeRequest])
  };

  // Simular operaciones para inventario
  const inventoryApi = {
    getAll: useCallback(() => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
      return [
        {
          id: 1,
          nombre: 'Moldura Clásica Negra 20x30',
          categoria: 'Marcos',
          stock: 25,
          minimo: 10,
          precio: 35.50,
          proveedor: 'Marcos y Más SAC',
          ubicacion: 'Almacén A-1',
          fechaIngreso: '2025-05-15'
        },
        {
          id: 2,
          nombre: 'Papel Fotográfico Brillante A4',
          categoria: 'Papel',
          stock: 150,
          minimo: 50,
          precio: 2.80,
          proveedor: 'Suministros Gráficos',
          ubicacion: 'Almacén B-2',
          fechaIngreso: '2025-06-01'
        }
      ];
    }), [makeRequest]),

    updateStock: useCallback((id, newStock) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      return { id, stock: newStock, updated: true };
    }), [makeRequest])
  };

  // Simular operaciones para contratos
  const contractsApi = {
    getAll: useCallback(() => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
      return [
        {
          id: 'CTR001',
          cliente: 'I.E. San Martín de Porres',
          servicio: 'Promoción Escolar 2025',
          tipo: 'Anual',
          fechaInicio: '2025-03-01',
          fechaFin: '2025-12-31',
          valor: 25000.00,
          pagado: 7500.00,
          estado: 'Activo',
          porcentajePagado: 30,
          estudiantes: 180
        }
      ];
    }), [makeRequest])
  };

  // Simular datos de dashboard
  const dashboardApi = {
    getStats: useCallback(() => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        ingresos: 15231.89,
        clientes: 1234,
        proyectos: 45,
        pedidos: 123,
        ventasDelMes: [
          { name: 'Enero', value: 8500 },
          { name: 'Febrero', value: 9200 },
          { name: 'Marzo', value: 10800 },
          { name: 'Abril', value: 11200 },
          { name: 'Mayo', value: 13500 },
          { name: 'Junio', value: 15231 }
        ]
      };
    }), [makeRequest])
  };

  // Simular agenda
  const agendaApi = {
    getEvents: useCallback((date) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        {
          id: 1,
          title: 'Sesión Fotográfica - María González',
          start: '2025-06-10T10:00:00',
          end: '2025-06-10T12:00:00',
          type: 'sesion',
          client: 'María González',
          status: 'confirmado'
        },
        {
          id: 2,
          title: 'Entrega - Promoción San Martín',
          start: '2025-06-12T14:00:00',
          end: '2025-06-12T16:00:00',
          type: 'entrega',
          client: 'I.E. San Martín',
          status: 'pendiente'
        }
      ];
    }), [makeRequest]),

    createEvent: useCallback((eventData) => makeRequest(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now(), ...eventData };
    }), [makeRequest])
  };

  return {
    loading,
    error,
    setError,
    clients: clientsApi,
    orders: ordersApi,
    inventory: inventoryApi,
    contracts: contractsApi,
    dashboard: dashboardApi,
    agenda: agendaApi
  };
};

export default useApi;