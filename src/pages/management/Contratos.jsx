import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Calendar, DollarSign, Eye, Edit, Download, Users, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Contratos = () => {
  const [contracts, setContracts] = useState([
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
      estudiantes: 180,
      observaciones: 'Incluye fotografía individual, grupal y eventos especiales',
      clausulas: [
        'Sesiones fotográficas durante todo el año escolar',
        'Entrega de fotografías individuales y grupales',
        'Cobertura de eventos especiales (graduación, actuaciones)',
        'Entrega final en diciembre 2025'
      ],
      fechaCreacion: '2025-02-15',
      responsable: 'Carlos Mendoza'
    },
    {
      id: 'CTR002',
      cliente: 'Colegio Particular Santa Rosa',
      servicio: 'Fotografía Institucional',
      tipo: 'Semestral',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-12-31',
      valor: 15000.00,
      pagado: 15000.00,
      estado: 'Pagado',
      porcentajePagado: 100,
      estudiantes: 120,
      observaciones: 'Contrato completamente pagado al inicio',
      clausulas: [
        'Fotografía de promoción 2025',
        'Sesiones individuales y grupales',
        'Material de marketing institucional',
        'Entrega digital y física'
      ],
      fechaCreacion: '2025-05-20',
      responsable: 'Ana Torres'
    },
    {
      id: 'CTR003',
      cliente: 'Empresa TechSolutions SAC',
      servicio: 'Eventos Corporativos 2025',
      tipo: 'Anual',
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      valor: 18000.00,
      pagado: 9000.00,
      estado: 'Activo',
      porcentajePagado: 50,
      estudiantes: 0,
      observaciones: 'Cobertura de eventos corporativos mensuales',
      clausulas: [
        'Cobertura fotográfica de eventos mensuales',
        'Fotografías para redes sociales y marketing',
        'Entrega en formato digital',
        'Sesiones adicionales con costo extra'
      ],
      fechaCreacion: '2024-12-15',
      responsable: 'Luis García'
    },
    {
      id: 'CTR004',
      cliente: 'I.E. José Carlos Mariátegui',
      servicio: 'Promoción Escolar 2025',
      tipo: 'Anual',
      fechaInicio: '2025-04-01',
      fechaFin: '2025-12-31',
      valor: 22000.00,
      pagado: 4400.00,
      estado: 'Pendiente',
      porcentajePagado: 20,
      estudiantes: 160,
      observaciones: 'Pendiente de pago inicial, trabajo iniciará con adelanto',
      clausulas: [
        'Promoción escolar completa',
        'Fotografía individual de 160 estudiantes',
        'Sesiones grupales por aulas',
        'Evento de graduación incluido'
      ],
      fechaCreacion: '2025-03-10',
      responsable: 'Juan Pérez'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const statusConfig = {
    'Activo': { color: 'bg-green-100 text-green-800', textColor: 'text-green-600' },
    'Pendiente': { color: 'bg-yellow-100 text-yellow-800', textColor: 'text-yellow-600' },
    'Pagado': { color: 'bg-blue-100 text-blue-800', textColor: 'text-blue-600' },
    'Vencido': { color: 'bg-red-100 text-red-800', textColor: 'text-red-600' },
    'Completado': { color: 'bg-gray-100 text-gray-800', textColor: 'text-gray-600' }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.servicio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || contract.estado === statusFilter;
    const matchesType = typeFilter === 'todos' || contract.tipo === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const ContractCard = ({ contract }) => {
    const saldoPendiente = contract.valor - contract.pagado;
    const diasRestantes = Math.ceil((new Date(contract.fechaFin) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{contract.cliente}</h3>
              <p className="text-sm text-gray-500">#{contract.id} - {contract.tipo}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[contract.estado].color}`}>
            {contract.estado}
          </span>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-1">{contract.servicio}</h4>
          {contract.estudiantes > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{contract.estudiantes} estudiantes</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Valor Total:</span>
            <p className="font-semibold text-gray-900">S/ {contract.valor.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Pagado:</span>
            <p className="font-semibold text-green-600">S/ {contract.pagado.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Saldo:</span>
            <p className={`font-semibold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
              S/ {saldoPendiente.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Vencimiento:</span>
            <p className={`font-medium ${diasRestantes < 30 ? 'text-red-600' : 'text-gray-900'}`}>
              {diasRestantes > 0 ? `${diasRestantes} días` : 'Vencido'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Progreso de Pago</span>
            <span className="font-medium">{contract.porcentajePagado}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                contract.porcentajePagado === 100 ? 'bg-green-500' : 
                contract.porcentajePagado >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${contract.porcentajePagado}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{contract.fechaInicio} - {contract.fechaFin}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => {
              setSelectedContract(contract);
              setShowContractModal(true);
            }}
          >
            Ver Detalles
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              className="text-blue-600 hover:bg-blue-50"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>
    );
  };

  const totalContratos = contracts.length;
  const contratosActivos = contracts.filter(c => c.estado === 'Activo').length;
  const valorTotal = contracts.reduce((sum, c) => sum + c.valor, 0);
  const totalPagado = contracts.reduce((sum, c) => sum + c.pagado, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-600">Gestiona tus contratos y cotizaciones</p>
          </div>
        </div>
        
        <Button 
          icon={<Plus className="w-4 h-4" />}
        >
          Nuevo Contrato
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">{totalContratos}</h3>
          <p className="text-sm text-gray-500">Total Contratos</p>
        </Card>
        
        <Card className="text-center">
          <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-600">{contratosActivos}</h3>
          <p className="text-sm text-gray-500">Activos</p>
        </Card>
        
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-blue-600">S/ {valorTotal.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Valor Total</p>
        </Card>
        
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-600">S/ {totalPagado.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Total Pagado</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Completado">Completado</option>
              <option value="Vencido">Vencido</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Anual">Anual</option>
              <option value="Semestral">Semestral</option>
              <option value="Mensual">Mensual</option>
              <option value="Por Proyecto">Por Proyecto</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredContracts.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contratos</h3>
          <p className="text-gray-500 mb-4">Ajusta los filtros o crea un nuevo contrato</p>
          <Button 
            icon={<Plus className="w-4 h-4" />}
          >
            Nuevo Contrato
          </Button>
        </div>
      )}

      {/* Contract Detail Modal */}
      <Modal
        isOpen={showContractModal}
        onClose={() => {
          setShowContractModal(false);
          setSelectedContract(null);
        }}
        title={`Contrato ${selectedContract?.id}`}
        size="xl"
      >
        {selectedContract && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedContract.cliente}</h3>
                <p className="text-gray-500">{selectedContract.servicio}</p>
                <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedContract.estado].color}`}>
                  {selectedContract.estado}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
                <p className="text-gray-900">{selectedContract.tipo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <p className="text-gray-900">{selectedContract.responsable}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                <p className="text-gray-900">{selectedContract.fechaInicio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                <p className="text-gray-900">{selectedContract.fechaFin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                <p className="text-gray-900 font-semibold">S/ {selectedContract.valor.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Pagado</label>
                <p className="text-green-600 font-semibold">S/ {selectedContract.pagado.toLocaleString()}</p>
              </div>
              {selectedContract.estudiantes > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Estudiantes</label>
                  <p className="text-gray-900">{selectedContract.estudiantes}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resumen Financiero</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">S/ {selectedContract.valor.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Valor Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">S/ {selectedContract.pagado.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Pagado ({selectedContract.porcentajePagado}%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">S/ {(selectedContract.valor - selectedContract.pagado).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Saldo Pendiente</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cláusulas del Contrato</label>
              <div className="space-y-2">
                {selectedContract.clausulas.map((clausula, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{clausula}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedContract.observaciones && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedContract.observaciones}</p>
                </div>
              </div>
            )}

            <Modal.Footer>
              <Button 
                variant="outline" 
                onClick={() => setShowContractModal(false)}
              >
                Cerrar
              </Button>
              <Button 
                variant="ghost"
                icon={<Download className="w-4 h-4" />}
              >
                Descargar PDF
              </Button>
              <Button 
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
              >
                Editar
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Contratos;