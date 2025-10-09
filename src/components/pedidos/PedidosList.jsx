import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

const PedidosList = ({ onNewPedido, onEditPedido, onViewPedido }) => {
  const { notifySuccess, notifyError } = useApp();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteFilter, setClienteFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos de prueba simulados
  const datosPrueba = [
    {
      id: 1,
      cliente: "Colegio San Agustín",
      productoTipo: "Colegio",
      estado: "En producción",
      subestado: "Corte láser",
      fechaPedido: "2024-01-15",
      fechaCompromiso: "2024-01-25",
      costoEstimado: 1200,
      precioVenta: 1800,
      utilidad: 600,
      avance: 65
    },
    {
      id: 2,
      cliente: "María Rodríguez",
      productoTipo: "Particular",
      estado: "Pendiente de confirmación",
      subestado: "Esperando confirmación",
      fechaPedido: "2024-01-16",
      fechaCompromiso: "2024-01-22",
      costoEstimado: 350,
      precioVenta: 500,
      utilidad: 150,
      avance: 0
    },
    {
      id: 3,
      cliente: "Empresa Constructora XYZ",
      productoTipo: "Empresa",
      estado: "Listo para entrega",
      subestado: "Embalaje",
      fechaPedido: "2024-01-10",
      fechaCompromiso: "2024-01-20",
      costoEstimado: 2500,
      precioVenta: 3800,
      utilidad: 1300,
      avance: 100
    },
    {
      id: 4,
      cliente: "Colegio Santa María",
      productoTipo: "Colegio",
      estado: "Entregado",
      subestado: "Completado",
      fechaPedido: "2024-01-05",
      fechaCompromiso: "2024-01-15",
      costoEstimado: 1800,
      precioVenta: 2700,
      utilidad: 900,
      avance: 100
    },
    {
      id: 5,
      cliente: "Juan Pérez",
      productoTipo: "Particular",
      estado: "En producción",
      subestado: "Impresión",
      fechaPedido: "2024-01-17",
      fechaCompromiso: "2024-01-24",
      costoEstimado: 420,
      precioVenta: 650,
      utilidad: 230,
      avance: 40
    }
  ];

  // Cargar pedidos
  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      // Simular carga de datos con delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPedidos(datosPrueba);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      notifyError('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesCliente = clienteFilter === '' || 
      pedido.cliente.toLowerCase().includes(clienteFilter.toLowerCase());
    
    const matchesTipo = tipoFilter === 'todos' || 
      pedido.productoTipo === tipoFilter;
    
    const matchesEstado = estadoFilter === 'todos' || 
      pedido.estado === estadoFilter;
    
    return matchesCliente && matchesTipo && matchesEstado;
  });

  // Paginación
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPedidos = filteredPedidos.slice(startIndex, startIndex + itemsPerPage);

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        // Simular eliminación con delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setPedidos(pedidos.filter(pedido => pedido.id !== id));
        notifySuccess('Pedido eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
        notifyError('No se pudo eliminar el pedido');
      }
    }
  };

  // Colores para estados
  const statusColors = {
    "Pendiente de confirmación": "bg-blue-100 text-blue-800",
    "En producción": "bg-yellow-100 text-yellow-800",
    "Listo para entrega": "bg-emerald-100 text-emerald-800",
    "Entregado": "bg-green-100 text-green-800"
  };

  // Opciones para filtros
  const tiposProducto = ['Particular', 'Colegio', 'Empresa'];
  const estados = ['Pendiente de confirmación', 'En producción', 'Listo para entrega', 'Entregado'];

  // Limpiar filtros
  const limpiarFiltros = () => {
    setClienteFilter('');
    setTipoFilter('todos');
    setEstadoFilter('todos');
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <Button 
          onClick={onNewPedido}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Nuevo Pedido
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Buscar por Cliente"
              value={clienteFilter}
              onChange={(e) => setClienteFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Producto</label>
            <select
              className="w-full p-2 border rounded"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              {tiposProducto.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="w-full p-2 border rounded"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={limpiarFiltros} variant="secondary">
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Colegio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subestado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Compromiso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Estimado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avance (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="12" className="px-6 py-4 text-center">Cargando pedidos...</td>
                </tr>
              ) : paginatedPedidos.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-6 py-4 text-center">No se encontraron pedidos</td>
                </tr>
              ) : (
                paginatedPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pedido.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pedido.productoTipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[pedido.estado] || 'bg-gray-100'}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{pedido.subestado}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pedido.fechaPedido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pedido.fechaCompromiso}</td>
                    <td className="px-6 py-4 whitespace-nowrap">S/ {pedido.costoEstimado}</td>
                    <td className="px-6 py-4 whitespace-nowrap">S/ {pedido.precioVenta}</td>
                    <td className="px-6 py-4 whitespace-nowrap">S/ {pedido.utilidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${pedido.avance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{pedido.avance}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onViewPedido(pedido)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => onEditPedido(pedido)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pedido.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredPedidos.length)}
                </span>{" "}
                de <span className="font-medium">{filteredPedidos.length}</span> resultados
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="secondary"
                className="flex items-center"
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="secondary"
                className="flex items-center"
              >
                Siguiente
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosList;