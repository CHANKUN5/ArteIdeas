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
  ChevronDown,
  HardDrive,
  X,
  Download
} from 'lucide-react'; 
import { useEffect, useState } from 'react'; 
import Button from '../../components/common/Button'; 
import Card from '../../components/common/Card'; 
import Drawer from '../../components/common/Drawer'; 
import ConfirmationDialog from '../../components/common/ConfirmationDialog'; 
import AssetForm from '../../components/forms/AssetForm'; 
import AssetTabs from '../../components/assets/AssetTabs'; 
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext'; 

const Activos = () => { 
  const { showSuccess, showError, showWarning } = useApp(); 
  
  // Datos iniciales por defecto mejorados
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
        fechaFin: '2024-12-15',
        cuotasPagadas: 8,
        historialPagos: [
          '2024-01-15: Pago inicial - S/ 450.00',
          '2024-02-15: Cuota mensual - S/ 450.00',
          '2024-03-15: Cuota mensual - S/ 450.00',
          '2024-04-15: Cuota mensual - S/ 450.00',
          '2024-05-15: Cuota mensual - S/ 450.00',
          '2024-06-15: Cuota mensual - S/ 450.00',
          '2024-07-15: Cuota mensual - S/ 450.00',
          '2024-08-15: Cuota mensual - S/ 450.00'
        ]
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
        fechaFin: '',
        cuotasPagadas: 0,
        historialPagos: []
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
        fechaFin: '2024-05-10',
        cuotasPagadas: 6,
        historialPagos: [
          '2023-11-10: Pago inicial - S/ 500.00',
          '2023-12-10: Cuota mensual - S/ 500.00',
          '2024-01-10: Cuota mensual - S/ 500.00',
          '2024-02-10: Cuota mensual - S/ 500.00',
          '2024-03-10: Cuota mensual - S/ 500.00',
          '2024-04-10: Cuota final - S/ 500.00'
        ]
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
    },
    {
      id: 'AST004',
      nombre: 'Laptop Dell Inspiron 15',
      categoria: 'Equipos Informáticos',
      proveedor: 'Dell Perú',
      fechaCompra: '2024-01-25',
      costo: 2800.00,
      vidaUtil: 3,
      depreciacion: 933.33,
      estado: 'En Uso',
      ubicacion: 'Oficina',
      responsable: 'Ana Torres',
      financiamiento: {
        entidad: 'Banco de Crédito',
        monto: 2800.00,
        cuotas: 24,
        cuotaMensual: 125.00,
        estado: 'Activo',
        fechaInicio: '2024-01-25',
        fechaFin: '2026-01-25',
        cuotasPagadas: 10,
        historialPagos: [
          '2024-01-25: Pago inicial - S/ 125.00',
          '2024-02-25: Cuota mensual - S/ 125.00',
          '2024-03-25: Cuota mensual - S/ 125.00',
          '2024-04-25: Cuota mensual - S/ 125.00',
          '2024-05-25: Cuota mensual - S/ 125.00',
          '2024-06-25: Cuota mensual - S/ 125.00',
          '2024-07-25: Cuota mensual - S/ 125.00',
          '2024-08-25: Cuota mensual - S/ 125.00',
          '2024-09-25: Cuota mensual - S/ 125.00',
          '2024-10-25: Cuota mensual - S/ 125.00'
        ]
      },
      mantenimiento: {
        ultimoMantenimiento: '2024-09-20',
        proximoMantenimiento: '2025-03-20',
        costoUltimoMantenimiento: 0.00,
        historial: []
      },
      relacionInventario: ['Cargador Dell', 'Mouse inalámbrico'],
      relacionProduccion: ['Diseño gráfico 2024'],
      roi: 18.5,
      costoOperativoReal: 600.00,
      fechaCreacion: '2024-01-25'
    }
  ]; 

  // Funciones mejoradas para localStorage con validación y respaldo
  const STORAGE_KEYS = {
    assets: 'arteIdeas_assets',
    settings: 'arteIdeas_settings',
    backup: 'arteIdeas_backup'
  };

  const loadAssetsFromStorage = () => { 
    try { 
      const savedAssets = localStorage.getItem(STORAGE_KEYS.assets); 
      if (savedAssets) { 
        const parsedAssets = JSON.parse(savedAssets);
        // Validar que los datos tengan la estructura correcta
        if (Array.isArray(parsedAssets) && parsedAssets.length > 0) {
          // Verificar que cada activo tenga las propiedades mínimas requeridas
          const validAssets = parsedAssets.filter(asset => 
            asset.id && asset.nombre && asset.categoria
          );
          if (validAssets.length > 0) {
            return validAssets;
          }
        }
      } 
    } catch (error) { 
      console.error('Error al cargar activos desde localStorage:', error);
      // Intentar cargar desde backup
      try {
        const backupAssets = localStorage.getItem(STORAGE_KEYS.backup);
        if (backupAssets) {
          const parsedBackup = JSON.parse(backupAssets);
          if (Array.isArray(parsedBackup) && parsedBackup.length > 0) {
            console.log('Datos restaurados desde backup');
            return parsedBackup;
          }
        }
      } catch (backupError) {
        console.error('Error al cargar backup:', backupError);
      }
    } 
    return defaultAssets; 
  }; 

  const saveAssetsToStorage = (assetsToSave) => { 
    try { 
      if (!Array.isArray(assetsToSave)) {
        console.error('Los datos a guardar deben ser un array');
        return;
      }
      
      // Crear backup antes de guardar
      const currentData = localStorage.getItem(STORAGE_KEYS.assets);
      if (currentData) {
        localStorage.setItem(STORAGE_KEYS.backup, currentData);
      }
      
      // Guardar datos principales
      localStorage.setItem(STORAGE_KEYS.assets, JSON.stringify(assetsToSave));
      
      // Guardar timestamp de última actualización
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({
        lastUpdate: new Date().toISOString(),
        version: '1.0'
      }));
      
    } catch (error) { 
      console.error('Error al guardar activos en localStorage:', error);
      // Si hay error de espacio, intentar limpiar datos antiguos
      if (error.name === 'QuotaExceededError') {
        try {
          localStorage.removeItem(STORAGE_KEYS.backup);
          localStorage.setItem(STORAGE_KEYS.assets, JSON.stringify(assetsToSave));
        } catch (retryError) {
          console.error('Error crítico: No se pueden guardar los datos', retryError);
        }
      }
    } 
  }; 

  // Estado inicial con datos desde localStorage 
  const [assets, setAssets] = useState(() => loadAssetsFromStorage()); 

  // useEffect para guardar automáticamente cuando cambien los activos 
  useEffect(() => { 
    if (assets && assets.length >= 0) { // Permitir arrays vacíos
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

  // Estados para tabs y modales adicionales
  const [activeTab, setActiveTab] = useState('activos');
  const [showActivoModal, setShowActivoModal] = useState(false);
  const [showFinanciamientoModal, setShowFinanciamientoModal] = useState(false);
  const [showMantenimientoModal, setShowMantenimientoModal] = useState(false);
  const [showFinanciamientoForm, setShowFinanciamientoForm] = useState(false);
  const [showMantenimientoForm, setShowMantenimientoForm] = useState(false);
  const [selectedFinanciamiento, setSelectedFinanciamiento] = useState(null);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const [selectedActivoForDetails, setSelectedActivoForDetails] = useState(null);

  const statusConfig = { 
    'En Uso': { color: 'bg-green-100 text-green-800', textColor: 'text-green-600' }, 
    'Mantenimiento': { color: 'bg-yellow-100 text-yellow-800', textColor: 'text-yellow-600' }, 
    'Fuera de Servicio': { color: 'bg-red-100 text-red-800', textColor: 'text-red-600' }, 
    'Vendido': { color: 'bg-gray-100 text-gray-800', textColor: 'text-gray-600' }, 
    'Obsoleto': { color: 'bg-orange-100 text-orange-800', textColor: 'text-orange-600' },
    'Activo': { color: 'bg-green-100 text-green-800', textColor: 'text-green-600' },
    'Inactivo': { color: 'bg-red-100 text-red-800', textColor: 'text-red-600' }
  }; 

  const categoriaColors = {
    'Impresora': 'bg-blue-100 text-blue-800',
    'Maquinaria': 'bg-purple-100 text-purple-800',
    'Herramienta': 'bg-green-100 text-green-800',
    'Equipo_oficina': 'bg-orange-100 text-orange-800',
    'Equipos Fotográficos': 'bg-indigo-100 text-indigo-800',
    'Equipos Informáticos': 'bg-cyan-100 text-cyan-800',
    'Equipos de Impresión': 'bg-blue-100 text-blue-800',
    'Equipos de Iluminación': 'bg-yellow-100 text-yellow-800',
    'Mobiliario': 'bg-gray-100 text-gray-800',
    'Otros': 'bg-slate-100 text-slate-800'
  };

  const estadoColors = {
    'Activo': 'bg-green-100 text-green-800',
    'Mantenimiento': 'bg-yellow-100 text-yellow-800',
    'Inactivo': 'bg-red-100 text-red-800',
    'Pagado': 'bg-green-100 text-green-800',
    'Mora': 'bg-red-100 text-red-800',
    'Programado': 'bg-blue-100 text-blue-800',
    'Completado': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800',
    'En Uso': 'bg-green-100 text-green-800',
    'Fuera de Servicio': 'bg-red-100 text-red-800',
    'Vendido': 'bg-gray-100 text-gray-800',
    'Obsoleto': 'bg-orange-100 text-orange-800'
  };

  const tipoPagoColors = {
    'Contado': 'bg-green-100 text-green-800',
    'Financiado': 'bg-blue-100 text-blue-800',
    'Leasing': 'bg-purple-100 text-purple-800'
  };

  const tipoMantenimientoColors = {
    'Preventivo': 'bg-blue-100 text-blue-800',
    'Correctivo': 'bg-orange-100 text-orange-800'
  };

  const filteredAssets = assets.filter(asset => { 
    const matchesSearch = asset.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         asset.categoria.toLowerCase().includes(searchTerm.toLowerCase()); 
    const matchesStatus = statusFilter === 'todos' || asset.estado === statusFilter; 
    const matchesCategory = categoryFilter === 'todos' || asset.categoria === categoryFilter; 
    return matchesSearch && matchesStatus && matchesCategory; 
  }); 

  // Funciones para obtener financiamientos y mantenimientos
  const getActivosFinanciados = () => {
    return assets.filter(asset => 
      asset.financiamiento && asset.financiamiento.entidad !== 'Contado' && asset.financiamiento.estado !== 'Pagado'
    ).map(asset => ({
      codigo: asset.id,
      activoId: asset.id,
      entidad: asset.financiamiento.entidad,
      montoFinanciado: asset.financiamiento.monto,
      cuotasTotales: asset.financiamiento.cuotas,
      cuotaMensual: asset.financiamiento.cuotaMensual,
      fechaInicio: asset.financiamiento.fechaInicio,
      fechaFin: asset.financiamiento.fechaFin,
      cuotasPagadas: asset.financiamiento.cuotasPagadas || 0,
      estado: asset.financiamiento.estado,
      historialPagos: asset.financiamiento.historialPagos || [],
      totalPagado: asset.financiamiento.historialPagos?.reduce((total, pago) => {
        const monto = parseFloat(pago.split('-')[1]?.replace('S/', '').trim()) || 0;
        return total + monto;
      }, 0) || 0
    }));
  };

  const getActivosEnMantenimiento = () => {
    return assets.filter(asset => asset.estado === 'Mantenimiento')
    .map(asset => ({
      codigo: asset.id,
      activoId: asset.id,
      tipo: asset.mantenimiento.historial[asset.mantenimiento.historial.length - 1]?.tipo || 'Preventivo',
      fechaMantenimiento: asset.mantenimiento.ultimoMantenimiento || new Date().toISOString().split('T')[0],
      costo: asset.mantenimiento.costoUltimoMantenimiento || 0,
      proveedor: asset.mantenimiento.historial[asset.mantenimiento.historial.length - 1]?.tecnico || 'Servicio Técnico',
      descripcion: asset.mantenimiento.historial[asset.mantenimiento.historial.length - 1]?.descripcion || `Mantenimiento de ${asset.nombre}`,
      proximoMantenimiento: asset.mantenimiento.proximoMantenimiento,
      estado: 'Programado',
      repuestosInsumos: []
    }));
  };

  const getActivoNombre = (activoId) => {
    const activo = assets.find(a => a.id === activoId);
    return activo ? activo.nombre : 'Activo no encontrado';
  };

  const filteredFinanciamientos = getActivosFinanciados().filter(fin => {
    const activo = assets.find(a => a.id === fin.activoId);
    const matchesSearch = fin.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activo?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fin.estado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivo = !selectedActivoForDetails || fin.activoId === selectedActivoForDetails.id;
    return matchesSearch && matchesActivo;
  });

  const filteredMantenimientos = getActivosEnMantenimiento().filter(mant => {
    const activo = assets.find(a => a.id === mant.activoId);
    const matchesSearch = mant.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mant.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activo?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mant.estado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivo = !selectedActivoForDetails || mant.activoId === selectedActivoForDetails.id;
    return matchesSearch && matchesActivo;
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
            {asset.financiamiento && asset.financiamiento.estado !== 'Pagado' && asset.financiamiento.entidad !== 'Contado' && ( 
              <div className="mb-4 p-3 bg-blue-50 rounded-lg"> 
                <div className="flex items-center space-x-2 mb-2"> 
                  <DollarSign className="w-4 h-4 text-blue-600" /> 
                  <span className="text-sm font-medium text-blue-900">Financiamiento</span> 
                </div> 
                <div className="text-sm text-blue-800"> 
                  <p>{asset.financiamiento.entidad} - S/ {asset.financiamiento.cuotaMensual.toLocaleString()}/mes</p> 
                  <p>{asset.financiamiento.cuotas - (asset.financiamiento.cuotasPagadas || 0)} cuotas restantes</p> 
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
  const activosEnUso = assets.filter(a => a.estado === 'En Uso' || a.estado === 'Activo').length; 
  const valorTotalActivos = assets.reduce((sum, a) => sum + a.costo, 0); 
  const valorActualActivos = assets.reduce((sum, a) => sum + (a.valorActual || 0), 0);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  // Funciones de utilidad
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
  };

  const exportData = () => {
    try {
      const financiamientosData = getActivosFinanciados();
      const mantenimientosData = getActivosEnMantenimiento();
      
      const dataToExport = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          totalActivos: assets.length,
          totalFinanciamientos: financiamientosData.length,
          totalMantenimientos: mantenimientosData.length,
          valorTotalActivos: assets.reduce((sum, a) => sum + (a.costo || 0), 0),
          valorActualActivos: assets.reduce((sum, a) => sum + (a.valorActual || a.costo - (a.depreciacion || 0)), 0)
        },
        activos: assets,
        financiamientos: financiamientosData,
        mantenimientos: mantenimientosData,
        estadisticas: {
          activosPorCategoria: assets.reduce((acc, asset) => {
            acc[asset.categoria] = (acc[asset.categoria] || 0) + 1;
            return acc;
          }, {}),
          activosPorEstado: assets.reduce((acc, asset) => {
            acc[asset.estado] = (acc[asset.estado] || 0) + 1;
            return acc;
          }, {}),
          financiamientosActivos: financiamientosData.filter(f => f.estado === 'Activo').length,
          mantenimientosPendientes: mantenimientosData.filter(m => m.estado === 'Programado').length
        }
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `activos_completo_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showSuccess('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar datos:', error);
      showError('Error al exportar los datos');
    }
  };

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
            variant="outline"
            icon={<Download className="w-4 h-4" />} 
            onClick={exportData}
          > 
            Exportar 
          </Button>
          <Button 
            variant="outline"
            icon={<Filter className="w-4 h-4" />} 
            onClick={resetFilters}
          > 
            Limpiar Filtros 
          </Button>
          <Button 
            icon={<Plus className="w-4 h-4" />} 
            onClick={() => setShowNewAssetDrawer(true)} 
          > 
            Nuevo Activo 
          </Button> 
        </div> 
      </div> 

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('activos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'activos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => {
              setActiveTab('financiamientos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'financiamientos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Financiamientos
          </button>
          <button
            onClick={() => {
              setActiveTab('mantenimientos');
              setSelectedActivoForDetails(null);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'mantenimientos'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mantenimientos
          </button>
        </div>
      </div>

      {activeTab === 'activos' && (
        <>
          {/* Stats Cards Mejoradas */} 
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"> 
            <Card className="text-center hover:shadow-lg transition-shadow duration-200"> 
              <div className="p-6">
                <Settings className="w-8 h-8 text-primary mx-auto mb-3" /> 
                <h3 className="text-3xl font-bold text-primary mb-1">{totalActivos}</h3> 
                <p className="text-sm text-gray-500 mb-2">Total Activos</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </Card> 
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200"> 
              <div className="p-6">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" /> 
                <h3 className="text-3xl font-bold text-green-600 mb-1">{activosEnUso}</h3> 
                <p className="text-sm text-gray-500 mb-2">En Uso</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${totalActivos > 0 ? (activosEnUso / totalActivos) * 100 : 0}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {totalActivos > 0 ? Math.round((activosEnUso / totalActivos) * 100) : 0}%
                  </span>
                </div>
              </div>
            </Card> 
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200"> 
              <div className="p-6">
                <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-3" /> 
                <h3 className="text-3xl font-bold text-blue-600 mb-1">S/ {valorTotalActivos.toLocaleString()}</h3> 
                <p className="text-sm text-gray-500 mb-2">Valor Total</p>
                <div className="flex items-center justify-center text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Inversión Total
                </div>
              </div>
            </Card> 
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200"> 
              <div className="p-6">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" /> 
                <h3 className="text-3xl font-bold text-green-600 mb-1">S/ {valorActualActivos.toLocaleString()}</h3> 
                <p className="text-sm text-gray-500 mb-2">Valor Actual</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${valorTotalActivos > 0 ? (valorActualActivos / valorTotalActivos) * 100 : 0}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {valorTotalActivos > 0 ? Math.round((valorActualActivos / valorTotalActivos) * 100) : 0}%
                  </span>
                </div>
              </div>
            </Card> 
          </div> 

          {/* Filters Mejorados */} 
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
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                      searchTerm ? 'border-primary bg-primary/5' : 'border-gray-300'
                    }`} 
                  /> 
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div> 
              </div> 
              
              <div className="flex items-center space-x-3"> 
                <Filter className="w-5 h-5 text-gray-400" /> 
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)} 
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                    statusFilter && statusFilter !== 'todos' ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`} 
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
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                    categoryFilter && categoryFilter !== 'todos' ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`} 
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
            
            {/* Indicadores de filtros activos */}
            {(searchTerm || (statusFilter && statusFilter !== 'todos') || (categoryFilter && categoryFilter !== 'todos')) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-sm text-gray-600 font-medium">Filtros activos:</span>
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Búsqueda: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm('')}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {statusFilter && statusFilter !== 'todos' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Estado: {statusFilter}
                        <button
                          onClick={() => setStatusFilter('todos')}
                          className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {categoryFilter && categoryFilter !== 'todos' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Categoría: {categoryFilter}
                        <button
                          onClick={() => setCategoryFilter('todos')}
                          className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredAssets.length} de {totalActivos} activos
                  </div>
                </div>
              </div>
            )}
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
        </>
      )}

      {activeTab === 'financiamientos' && (
        <Card className="border border-primary/10">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar financiamientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            {selectedActivoForDetails && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Filtrando por: <span className="font-semibold">{selectedActivoForDetails.nombre}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedActivoForDetails(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Limpiar filtro
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Listado de Financiamientos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-primary/10">
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Código</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Activo</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Entidad</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Monto Financiado</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Cuota Mensual</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Cuotas Pagadas</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Estado</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinanciamientos.map((fin, idx) => (
                  <tr key={fin.codigo} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                    <td className="py-3 px-3 text-sm font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{fin.codigo}</span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700 break-words">{getActivoNombre(fin.activoId)}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">S/ {fin.montoFinanciado.toFixed(2)}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">S/ {fin.cuotaMensual.toFixed(2)}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">{fin.cuotasPagadas} / {fin.cuotasTotales}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[fin.estado]}`}>
                        {fin.estado}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedFinanciamiento(fin);
                            setShowFinanciamientoModal(true);
                          }}
                          className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'mantenimientos' && (
        <Card className="border border-primary/10">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar mantenimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            {selectedActivoForDetails && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Filtrando por: <span className="font-semibold">{selectedActivoForDetails.nombre}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedActivoForDetails(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Limpiar filtro
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Listado de Mantenimientos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-primary/10">
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Código</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Activo</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Tipo</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Fecha</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Costo</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Proveedor</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Estado</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-800">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMantenimientos.map((mant, idx) => (
                  <tr key={mant.codigo} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'} hover:bg-primary/10`}>
                    <td className="py-3 px-3 text-sm font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{mant.codigo}</span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700 break-words">{getActivoNombre(mant.activoId)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tipoMantenimientoColors[mant.tipo]}`}>
                        {mant.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700">{mant.fechaMantenimiento}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">S/ {mant.costo.toFixed(2)}</td>
                    <td className="py-3 px-3 text-sm text-gray-700 break-words">{mant.proveedor}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[mant.estado]}`}>
                        {mant.estado}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedMantenimiento(mant);
                            setShowMantenimientoModal(true);
                          }}
                          className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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

      {/* Modal para detalles de financiamiento */}
      <Modal
        isOpen={showFinanciamientoModal}
        onClose={() => {
          setShowFinanciamientoModal(false);
          setSelectedFinanciamiento(null);
        }}
        title="Detalles del Financiamiento"
        size="lg"
      >
        {selectedFinanciamiento && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedFinanciamiento.entidad}</h3>
                <p className="text-gray-600">{getActivoNombre(selectedFinanciamiento.activoId)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <p className="text-gray-900">{selectedFinanciamiento.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Financiado</label>
                <p className="text-gray-900">S/ {selectedFinanciamiento.montoFinanciado.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuota Mensual</label>
                <p className="text-gray-900">S/ {selectedFinanciamiento.cuotaMensual.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas Totales</label>
                <p className="text-gray-900">{selectedFinanciamiento.cuotasTotales}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas Pagadas</label>
                <p className="text-gray-900">{selectedFinanciamiento.cuotasPagadas}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[selectedFinanciamiento.estado]}`}>
                  {selectedFinanciamiento.estado}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <p className="text-gray-900">{selectedFinanciamiento.fechaInicio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <p className="text-gray-900">{selectedFinanciamiento.fechaFin}</p>
              </div>
            </div>

            {selectedFinanciamiento.historialPagos && selectedFinanciamiento.historialPagos.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Historial de Pagos
                </h4>
                <div className="space-y-2">
                  {selectedFinanciamiento.historialPagos.map((pago, index) => {
                    const parts = pago.split('-');
                    const fechaDescripcion = parts[0]?.trim() || '';
                    const monto = parts[1]?.trim() || '';
                    const [fecha, descripcion] = fechaDescripcion.split(':');
                    
                    return (
                      <div key={index} className="p-3 bg-white rounded border border-gray-200 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">

                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">{fecha?.trim()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{descripcion?.trim()}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">{monto}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Mantenimiento */}
      <Modal
        isOpen={showMantenimientoModal}
        onClose={() => {
          setShowMantenimientoModal(false);
          setSelectedMantenimiento(null);
        }}
        title="Detalles del Mantenimiento"
        size="lg"
      >
        {selectedMantenimiento && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedMantenimiento.tipo}</h3>
                <p className="text-gray-600">{getActivoNombre(selectedMantenimiento.activoId)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <p className="text-gray-900">{selectedMantenimiento.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tipoMantenimientoColors[selectedMantenimiento.tipo]}`}>
                  {selectedMantenimiento.tipo}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <p className="text-gray-900">{selectedMantenimiento.fecha}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                <p className="text-gray-900">S/ {selectedMantenimiento.costo.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <p className="text-gray-900">{selectedMantenimiento.proveedor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estadoColors[selectedMantenimiento.estado]}`}>
                  {selectedMantenimiento.estado}
                </span>
              </div>
            </div>

            {selectedMantenimiento.descripcion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedMantenimiento.descripcion}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Activos;
