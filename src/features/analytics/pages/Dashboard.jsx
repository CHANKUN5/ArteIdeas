import { Banknote, Calendar, Clock, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuickAlertsPanel from '@components/layout/NotificationContainer/QuickAlertsPanel.jsx';
import StatsCard from '@features/analytics/components/StatsCard.jsx';
import { dashboardService } from '@services/dataService.js';


const Dashboard = ({ onSectionChange }) => {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('hoy'); // 'hoy', 'semana', 'mes'

  // Datos simulados según el filtro de tiempo
  const getFilteredData = () => {
    // Simulación de datos diferentes según el filtro seleccionado
    if (timeFilter === 'hoy') {
      return {
        ingresos: 12500,
        pedidosActivos: 15,
        entregasATiempo: 92,
        valorInventario: 125400,
        cambioIngresos: 5.2,
        cambioPedidos: 1.5,
        cambioEntregas: 2.1,
        cambioInventario: -1.2
      };
    } else if (timeFilter === 'semana') {
      return {
        ingresos: 87600,
        pedidosActivos: 28,
        entregasATiempo: 85,
        valorInventario: 125400,
        cambioIngresos: 8.7,
        cambioPedidos: -1.2,
        cambioEntregas: 1.8,
        cambioInventario: -2.5
      };
    } else { // mes
      return {
        ingresos: 342800,
        pedidosActivos: 41,
        entregasATiempo: 87,
        valorInventario: 125400,
        cambioIngresos: 12.5,
        cambioPedidos: -2.1,
        cambioEntregas: 3.2,
        cambioInventario: -4.0
      };
    }
  };

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulamos la carga de datos
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [timeFilter]);

  // Datos para las nuevas secciones

  // Datos de producción
  const produccionData = {
    pendientes: 23,
    enProceso: 18,
    completadas: 98,
    atrasadas: 7
  };

  // Datos de clientes
  const clientesData = {
    total: 342,
    nuevosEsteMes: 8,
    activos: 156,
    inactivos: 186
  };

  // Datos de contratos
  const contratosData = {
    valorTotal: 892000,
    activos: 34,
    pagosPendientes: 146000,
    porVencer: 3
  };

  // Productos más vendidos
  const productosVendidos = [
    {
      nombre: 'Enmarcado Premium',
      ventas: 45,
      valor: 89500
    },
    {
      nombre: 'Impresión Minilab',
      ventas: 78,
      valor: 45600
    },
    {
      nombre: 'Cuadros Graduación',
      ventas: 23,
      valor: 67800
    },
    {
      nombre: 'Corte Laser MDF',
      ventas: 34,
      valor: 28900
    }
  ];

  // Pedidos recientes
  const pedidosRecientes = [
    {
      id: 'PED-1234',
      cliente: 'Mario González',
      tipo: 'Enmarcado',
      valor: 2500,
      estado: 'En Proceso'
    },
    {
      id: 'PED-1235',
      cliente: 'Carlos Ruiz',
      tipo: 'Minilab',
      valor: 890,
      estado: 'Pendiente'
    },
    {
      id: 'PED-1236',
      cliente: 'Ana Martínez',
      tipo: 'Graduación',
      valor: 4200,
      estado: 'Completado'
    },
    {
      id: 'PED-1237',
      cliente: 'Luis Pérez',
      tipo: 'Corte Laser',
      valor: 1500,
      estado: 'Atrasado'
    }
  ];

  // Entregas programadas para hoy
  const entregasProgramadas = {
    cantidad: 5,
    pedidosListos: true
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header con filtro de tiempo */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-gray-600">Vista general de tu negocio fotográfico</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeFilter('hoy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeFilter === 'hoy' ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setTimeFilter('semana')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeFilter === 'semana' ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setTimeFilter('mes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeFilter === 'mes' ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* Quick Alerts Panel */}
      <QuickAlertsPanel />

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Datos filtrados según el timeFilter */}
          {(() => {
            const data = getFilteredData();
            return (
              <>
                {/* Ingresos */}
                <StatsCard 
                  title={`Ingresos ${timeFilter === 'hoy' ? 'de hoy' : timeFilter === 'semana' ? 'esta semana' : 'este mes'}`}
                  value={data.ingresos}
                  change={data.cambioIngresos}
                  changeType="positive"
                  icon={Banknote}
                  description={timeFilter === 'hoy' ? 'Hoy' : timeFilter === 'semana' ? 'Esta semana' : 'Este mes'}
                  currency={true}
                  onSectionChange={() => onSectionChange('reportes')}
                />
                
                {/* Pedidos activos */}
                <StatsCard 
                  title="Pedidos activos"
                  value={data.pedidosActivos}
                  secondaryValue="156 total"
                  change={data.cambioPedidos}
                  changeType={data.cambioPedidos >= 0 ? "positive" : "negative"}
                  icon={ShoppingCart}
                  description="23 pendientes, 18 en proceso"
                  onSectionChange={() => onSectionChange('pedidos')}
                />
                
                {/* Entregas a tiempo */}
                <StatsCard 
                  title="Entregas a tiempo"
                  value={data.entregasATiempo}
                  secondaryValue="7 atrasadas"
                  change={data.cambioEntregas}
                  changeType="positive"
                  icon={Clock}
                  description="2.5h promedio"
                  showPercentage={true}
                  onSectionChange={() => onSectionChange('produccion')}
                />
                
                {/* Valor de inventario */}
                <StatsCard 
                  title="Valor de inventario"
                  value={data.valorInventario}
                  change={data.cambioInventario}
                  changeType="negative"
                  icon={Package}
                  description="12 stock bajo"
                  currency={true}
                  onSectionChange={() => onSectionChange('inventario')}
                />
              </>
            );
          })()}
        </div>
      )}

      {/* Nuevas secciones: Estado de Producción, Clientes, Contratos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Estado de Producción */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Estado de Producción</h2>
          </div>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-amber-100">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-gray-700">Pendientes</span>
              </div>
              <span className="font-bold text-gray-900">{produccionData.pendientes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700">En Proceso</span>
              </div>
              <span className="font-bold text-gray-900">{produccionData.enProceso}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Completadas</span>
              </div>
              <span className="font-bold text-gray-900">{produccionData.completadas}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-red-100">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700">Atrasadas</span>
              </div>
              <span className="font-bold text-gray-900">{produccionData.atrasadas}</span>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <button 
              onClick={() => onSectionChange('produccion')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Ver Producción
            </button>
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Clientes</h2>
          </div>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total:</span>
              <span className="font-bold text-gray-900">{clientesData.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Nuevos este mes:</span>
              <span className="font-bold text-green-600">+{clientesData.nuevosEsteMes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Activos:</span>
              <span className="font-bold text-gray-900">{clientesData.activos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Inactivos:</span>
              <span className="font-bold text-gray-900">{clientesData.inactivos}</span>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <button 
              onClick={() => onSectionChange('clientes')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Ver Clientes
            </button>
          </div>
        </div>

        {/* Contratos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Contratos</h2>
          </div>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Valor Total:</span>
              <span className="font-bold text-gray-900">${(contratosData.valorTotal / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Contratos activos:</span>
              <span className="font-bold text-gray-900">{contratosData.activos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pagos pendientes:</span>
              <span className="font-bold text-amber-600">${(contratosData.pagosPendientes / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Por vencer:</span>
              <span className="font-bold text-red-600">{contratosData.porVencer}</span>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <button 
              onClick={() => onSectionChange('contratos')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Ver Contratos
            </button>
          </div>
        </div>
      </div>

      {/* Productos más vendidos y Pedidos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Productos más vendidos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Productos Más Vendidos</h2>
            <button className="text-sm text-primary font-medium hover:underline" onClick={() => onSectionChange('inventario')}>
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {productosVendidos.map((producto, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600">{producto.ventas} ventas</p>
                </div>
                <span className="font-bold text-gray-900">S/ {producto.valor.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pedidos Recientes</h2>
            <button className="text-sm text-primary font-medium hover:underline" onClick={() => onSectionChange('pedidos')}>
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {pedidosRecientes.map((pedido, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">{pedido.id}</h3>
                  <p className="text-sm text-gray-600">{pedido.cliente} • {pedido.tipo}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-900">S/ {pedido.valor}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    pedido.estado === 'Completado' ? 'bg-green-100 text-green-800' : 
                    pedido.estado === 'En Proceso' ? 'bg-blue-100 text-blue-800' : 
                    pedido.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {pedido.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Entregas Programadas Hoy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Entregas Programadas Hoy</h2>
          </div>
          <button 
            onClick={() => onSectionChange('agenda')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Ver Entregas
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-green-50 p-4 rounded-xl flex-1">
            <p className="text-gray-700 mb-2">
              <span className="font-bold text-2xl text-gray-900">{entregasProgramadas.cantidad}</span> pedidos listos para entregar
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
              <p className="text-sm text-gray-600">Todos los pedidos están listos para ser entregados hoy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;