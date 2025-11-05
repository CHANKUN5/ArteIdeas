import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { getContratos, deleteContrato, getContratosSummary } from '../../services/contratosService';

const ContratosList = ({ onNewContrato, onEditContrato }) => {
  const { notifySuccess, notifyError } = useApp();
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    activos: 0,
    valorTotal: 0,
    pagado: 0
  });
  
  // Estados para filtros
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar contratos y resumen
  useEffect(() => {
    loadContratos();
  }, []);

  const loadContratos = async () => {
    setLoading(true);
    try {
      const data = await getContratos();
      setContratos(data);
      
      // Cargar resumen
      const summaryData = await getContratosSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error al cargar contratos:', error);
      notifyError('No se pudieron cargar los contratos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar contratos
  const filteredContratos = contratos.filter(contrato => {
    const clienteNombre = contrato.clienteNombre || contrato.razonSocial || '';
    
    const matchesSearch = searchTerm === '' || 
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === 'todos' || 
      contrato.tipo === tipoFilter;
    
    const matchesEstado = estadoFilter === 'todos' || 
      contrato.estado === estadoFilter;
    
    return matchesSearch && matchesTipo && matchesEstado;
  });

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contrato?')) {
      try {
        await deleteContrato(id);
        setContratos(contratos.filter(contrato => contrato.id !== id));
        
        // Actualizar resumen después de eliminar
        const summaryData = await getContratosSummary();
        setSummary(summaryData);
        
        notifySuccess('Contrato eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar contrato:', error);
        notifyError('No se pudo eliminar el contrato');
      }
    }
  };

  // Resetear datos (para demo)
  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de resetear todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('arte_ideas_contratos');
      loadContratos();
      notifySuccess('Datos reseteados correctamente');
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setTipoFilter('todos');
    setEstadoFilter('todos');
    setSearchTerm('');
  };

  // Colores para estados
  const statusColors = {
    "activo": "bg-green-100 text-green-800",
    "pendiente": "bg-yellow-100 text-yellow-800",
    "pagado": "bg-blue-100 text-blue-800"
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Contratos</h2>
          <p className="ml-2 text-gray-500">Gestiona tus contratos y cotizaciones</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleResetData}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset Datos
          </Button>
          <Button 
            onClick={onNewContrato}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Nuevo Contrato
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Contratos</h3>
              <p className="text-lg font-semibold">{summary.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Activos</h3>
              <p className="text-lg font-semibold">{summary.activos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
              <p className="text-lg font-semibold">S/ {summary.valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Pagado</h3>
              <p className="text-lg font-semibold">S/ {summary.pagado.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filtros</h3>
          <Button 
            onClick={limpiarFiltros}
            variant="secondary"
            size="sm"
          >
            Limpiar Filtros
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Buscar por cliente o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full p-2 border rounded"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="particular">Particular</option>
              <option value="colegio">Colegio</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full p-2 border rounded"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de contratos */}
      {loading ? (
        <div className="text-center py-8">
          <p>Cargando contratos...</p>
        </div>
      ) : filteredContratos.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron contratos</p>
          <Button 
            onClick={onNewContrato}
            variant="primary"
            className="mt-4"
          >
            Crear Nuevo Contrato
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredContratos.map((contrato) => (
            <div key={contrato.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      {contrato.clienteNombre || contrato.razonSocial || 'Cliente sin nombre'}
                    </h3>
                    <p className="text-sm text-gray-500">#{contrato.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[contrato.estado] || 'bg-gray-100'}`}>
                    {contrato.estado}
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Tipo:</span>
                    <span>{contrato.tipo}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Valor Total:</span>
                    <span>S/ {parseFloat(contrato.valorTotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Pagado:</span>
                    <span>S/ {parseFloat(contrato.pagado).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Saldo:</span>
                    <span>S/ {parseFloat(contrato.saldo).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => onEditContrato(contrato)}
                    className="p-1 text-yellow-600 hover:text-yellow-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(contrato.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContratosList;