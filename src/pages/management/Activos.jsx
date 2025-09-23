import { 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Wrench, 
  Package, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Drawer from '../../components/common/Drawer';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import AssetForm from '../../components/forms/AssetForm';
import AssetTabs from '../../components/assets/AssetTabs';
import { useApp } from '../../context/AppContext';

const Activos = () => {
  const { showSuccess, showError, showWarning } = useApp();
  
  // Datos iniciales por defecto
  const defaultAssets = [
    {
      id: 'AST001',
      nombre: 'Cámara Canon EOS R5',
      categoria: 'Equipos Fotográficos',
      proveedor: 'Canon Perú',
      fechaCompra: '2024-01-15',
      costo: 8500.00,
      vidaUtil: 5,
      depreciacion: 1700.00,
      estado: 'En Uso',
      ubicacion: 'Estudio Principal',
      responsable: 'Carlos Mendoza',
      financiamiento: {
        entidad: 'BBVA',
        monto: 5000.00,
        cuotas: 12,
        cuotaMensual: 450.00,
        estado: 'Activo',
        fechaInicio: '2024-01-15',
        fechaFin: '2024-12-15'
      },
      mantenimiento: {
        ultimoMantenimiento: '2024-10-15',
        proximoMantenimiento: '2025-01-15',
        costoUltimoMantenimiento: 250.00,
        historial: [
          {
            fecha: '2024-10-15',
            tipo: 'Preventivo',
            descripcion: 'Limpieza de sensor y calibración',
            costo: 250.00,
            tecnico: 'Servicio Técnico Canon'
          }
        ]
      },
      relacionInventario: ['Lente 24-70mm', 'Batería LP-E6NH'],
      relacionProduccion: ['Sesión Estudio 2024-11-15'],
      roi: 15.2,
      costoOperativoReal: 1200.00,
      fechaCreacion: '2024-01-15'
    },
    {
      id: 'AST002',
      nombre: 'Computadora MacBook Pro M2',
      categoria: 'Equipos Informáticos',
      proveedor: 'Apple Store',
      fechaCompra: '2024-03-20',
      costo: 12000.00,
      vidaUtil: 4,
      depreciacion: 3000.00,
      estado: 'En Uso',
      ubicacion: 'Oficina',
      responsable: 'Ana Torres',
      financiamiento: {
        entidad: 'Contado',
        monto: 0.00,
        cuotas: 0,
        cuotaMensual: 0.00,
        estado: 'Pagado',
        fechaInicio: '',
        fechaFin: ''
      },
      mantenimiento: {
        ultimoMantenimiento: '2024-09-20',
        proximoMantenimiento: '2025-03-20',
        costoUltimoMantenimiento: 0.00,
        historial: []
      },
      relacionInventario: ['Mouse Logitech MX Master 3', 'Teclado Apple Magic'],
      relacionProduccion: ['Edición Video Promoción 2024'],
      roi: 22.5,
      costoOperativoReal: 800.00,
      fechaCreacion: '2024-03-20'
    },
    {
      id: 'AST003',
      nombre: 'Impresora Canon PIXMA Pro-100',
      categoria: 'Equipos de Impresión',
      proveedor: 'Canon Perú',
      fechaCompra: '2023-11-10',
      costo: 2800.00,
      vidaUtil: 3,
      depreciacion: 933.33,
      estado: 'Mantenimiento',
      ubicacion: 'Taller de Impresión',
      responsable: 'Luis García',
      financiamiento: {
        entidad: 'BCP',
        monto: 2800.00,
        cuotas: 6,
        cuotaMensual: 500.00,
        estado: 'Pagado',
        fechaInicio: '2023-11-10',
        fechaFin: '2024-05-10'
      },
      mantenimiento: {
        ultimoMantenimiento: '2024-11-20',
        proximoMantenimiento: '2025-02-20',
        costoUltimoMantenimiento: 180.00,
        historial: [
          {
            fecha: '2024-11-20',
            tipo: 'Correctivo',
            descripcion: 'Cambio de cabezales de impresión',
            costo: 180.00,
            tecnico: 'Servicio Técnico Canon'
          }
        ]
      },
      relacionInventario: ['Papel Fotográfico A4', 'Tinta Canon'],
      relacionProduccion: ['Impresión Fotografías Graduación'],
      roi: 8.7,
      costoOperativoReal: 450.00,
      fechaCreacion: '2023-11-10'
    }
  ];

  // Función para cargar activos desde localStorage
  const loadAssetsFromStorage = () => {
    try {
      const savedAssets = localStorage.getItem('arteIdeas_assets');
      if (savedAssets) {
        return JSON.parse(savedAssets);
      }
    } catch (error) {
      console.error('Error al cargar activos desde localStorage:', error);
    }
    return defaultAssets;
  };

  // Función para guardar activos en localStorage
  const saveAssetsToStorage = (assetsToSave) => {
    try {
      localStorage.setItem('arteIdeas_assets', JSON.stringify(assetsToSave));
    } catch (error) {
      console.error('Error al guardar activos en localStorage:', error);
    }
  };

  // Estado inicial con datos desde localStorage
  const [assets, setAssets] = useState(loadAssetsFromStorage);

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const savedAssets = loadAssetsFromStorage();
    setAssets(savedAssets);
  }, []);

  // useEffect para guardar automáticamente cuando cambien los activos
  useEffect(() => {
    if (assets.length > 0) {
      saveAssetsToStorage(assets);
    }
  }, [assets]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showNewAssetDrawer, setShowNewAssetDrawer] = useState(false);
  const [showEditAssetDrawer, setShowEditAssetDrawer] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const statusConfig = {
    'En Uso': { color: 'bg-green-100 text-green-800', textColor: 'text-green-600' },
    'Mantenimiento': { color: 'bg-yellow-100 text-yellow-800', textColor: 'text-yellow-600' },
    'Fuera de Servicio': { color: 'bg-red-100 text-red-800', textColor: 'text-red-600' },
    'Vendido': { color: 'bg-gray-100 text-gray-800', textColor: 'text-gray-600' },
    'Obsoleto': { color: 'bg-orange-100 text-orange-800', textColor: 'text-orange-600' }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || asset.estado === statusFilter;
    const matchesCategory = categoryFilter === 'todos' || asset.categoria === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Función para generar ID único
  const generateAssetId = () => {
    const lastId = assets.length > 0 ? 
      Math.max(...assets.map(a => parseInt(a.id.replace('AST', '')))) : 0;
    return `AST${String(lastId + 1).padStart(3, '0')}`;
  };

  const AssetCard = ({ asset }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const diasProximoMantenimiento = Math.ceil((new Date(asset.mantenimiento.proximoMantenimiento) - new Date()) / (1000 * 60 * 60 * 24));
    const valorActual = asset.costo - asset.depreciacion;

    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        {/* Header del acordeón */}
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {asset.nombre}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                #{asset.id} - {asset.categoria}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[asset.estado].color}`}>
              {asset.estado}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>

        {/* Body del acordeón */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Package className="w-4 h-4" />
                <span>{asset.proveedor}</span>
                <span>•</span>
                <span>{asset.ubicacion}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Costo:</span>
                <p className="font-semibold text-gray-900">S/ {asset.costo.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Valor Actual:</span>
                <p className="font-semibold text-blue-600">S/ {valorActual.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">ROI:</span>
                <p className="font-semibold text-green-600">{asset.roi}%</p>
              </div>
              <div>
                <span className="text-gray-500">Próximo Mantenimiento:</span>
                <p className={`font-medium ${diasProximoMantenimiento < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                  {diasProximoMantenimiento > 0 ? `${diasProximoMantenimiento} días` : 'Vencido'}
                </p>
              </div>
            </div>

            {/* Información financiera */}
            {asset.financiamiento.estado !== 'Pagado' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Financiamiento</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p>{asset.financiamiento.entidad} - S/ {asset.financiamiento.cuotaMensual.toLocaleString()}/mes</p>
                  <p>{asset.financiamiento.cuotas} cuotas restantes</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Comprado: {asset.fechaCompra}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => {
                  setSelectedAsset(asset);
                  setShowAssetDrawer(true);
                }}
              >
                Ver Detalles
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => openEditModal(asset)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="text-red-600 hover:bg-red-50"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setShowEditAssetDrawer(true);
  };

  const handleDeleteAsset = (assetId) => {
    const asset = assets.find(a => a.id === assetId);
    setAssetToDelete(asset);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAsset = () => {
    if (assetToDelete) {
      setAssets(assets.filter(a => a.id !== assetToDelete.id));
      showSuccess(`Activo "${assetToDelete.nombre}" eliminado exitosamente`);
      setShowDeleteDialog(false);
      setAssetToDelete(null);
    }
  };

  const handleCreateAsset = (assetData) => {
    const newAsset = {
      ...assetData,
      id: generateAssetId(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setAssets([...assets, newAsset]);
    setShowNewAssetDrawer(false);
    showSuccess(`Activo "${newAsset.nombre}" creado exitosamente`);
  };

  const handleUpdateAsset = (updatedAsset) => {
    setAssets(assets.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    if (selectedAsset && selectedAsset.id === updatedAsset.id) {
      setSelectedAsset(updatedAsset);
    }
  };

  const handleEditAsset = (assetData) => {
    const updatedAsset = {
      ...editingAsset,
      ...assetData
    };
    setAssets(assets.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setShowEditAssetDrawer(false);
    setEditingAsset(null);
    showSuccess(`Activo "${updatedAsset.nombre}" actualizado exitosamente`);
  };

  const totalActivos = assets.length;
  const activosEnUso = assets.filter(a => a.estado === 'En Uso').length;
  const valorTotalActivos = assets.reduce((sum, a) => sum + a.costo, 0);
  const valorActualActivos = assets.reduce((sum, a) => sum + (a.costo - a.depreciacion), 0);

  // Lógica de paginación
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const assetsOnCurrentPage = filteredAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activos y Maquinaria</h1>
            <p className="text-gray-600">Gestiona tus equipos y activos</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewAssetDrawer(true)}
          >
            Nuevo Activo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">{totalActivos}</h3>
          <p className="text-sm text-gray-500">Total Activos</p>
        </Card>
        
        <Card className="text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-600">{activosEnUso}</h3>
          <p className="text-sm text-gray-500">En Uso</p>
        </Card>
        
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-blue-600">S/ {valorTotalActivos.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Valor Total</p>
        </Card>
        
        <Card className="text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-600">S/ {valorActualActivos.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Valor Actual</p>
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
                placeholder="Buscar por nombre o categoría..."
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
              <option value="En Uso">En Uso</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Fuera de Servicio">Fuera de Servicio</option>
              <option value="Vendido">Vendido</option>
              <option value="Obsoleto">Obsoleto</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="todos">Todas las categorías</option>
              <option value="Equipos Fotográficos">Equipos Fotográficos</option>
              <option value="Equipos Informáticos">Equipos Informáticos</option>
              <option value="Equipos de Impresión">Equipos de Impresión</option>
              <option value="Equipos de Iluminación">Equipos de Iluminación</option>
              <option value="Mobiliario">Mobiliario</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 items-start">
        {assetsOnCurrentPage.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
      
      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Anterior
          </Button>
          <span className="text-gray-700 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Siguiente
          </Button>
        </div>
      )}
      
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron activos</h3>
          <p className="text-gray-500 mb-4">Ajusta los filtros o crea un nuevo activo</p>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewAssetDrawer(true)}
          >
            Nuevo Activo
          </Button>
        </div>
      )}

      {/* Asset Detail Drawer */}
      <Drawer
        isOpen={showAssetDrawer}
        onClose={() => {
          setShowAssetDrawer(false);
          setSelectedAsset(null);
        }}
        title={`Activo ${selectedAsset?.id}`}
        size="xl"
      >
        {selectedAsset && (
          <div className="space-y-6">
            {/* Header del activo */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedAsset.nombre}</h3>
                <p className="text-gray-500">{selectedAsset.categoria}</p>
                <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedAsset.estado].color}`}>
                  {selectedAsset.estado}
                </span>
              </div>
            </div>

            {/* Pestañas del activo */}
            <AssetTabs 
              asset={selectedAsset} 
              onUpdateAsset={handleUpdateAsset}
              editable={true}
            />

            {/* Botones de acción */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setShowAssetDrawer(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button 
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
                onClick={() => {
                  setShowAssetDrawer(false);
                  openEditModal(selectedAsset);
                }}
              >
                Editar
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* New Asset Drawer */}
      <Drawer
        isOpen={showNewAssetDrawer}
        onClose={() => setShowNewAssetDrawer(false)}
        title="Nuevo Activo"
        size="xl"
      >
        <AssetForm
          onSubmit={handleCreateAsset}
          onCancel={() => setShowNewAssetDrawer(false)}
          submitLabel="Crear Activo"
        />
      </Drawer>

      {/* Edit Asset Drawer */}
      <Drawer
        isOpen={showEditAssetDrawer}
        onClose={() => {
          setShowEditAssetDrawer(false);
          setEditingAsset(null);
        }}
        title={`Editar Activo ${editingAsset?.id}`}
        size="xl"
      >
        <AssetForm
          initialData={editingAsset}
          onSubmit={handleEditAsset}
          onCancel={() => {
            setShowEditAssetDrawer(false);
            setEditingAsset(null);
          }}
          submitLabel="Actualizar Activo"
          isEditing={true}
        />
      </Drawer>

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setAssetToDelete(null);
        }}
        onConfirm={confirmDeleteAsset}
        title="Eliminar Activo"
        message={`¿Estás seguro de que quieres eliminar el activo "${assetToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Activos;
