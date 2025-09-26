import { Banknote, Clock, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuickAlertsPanel from '../../components/common/QuickAlertsPanel';
import Chart from '../../components/dashboard/Chart';
import MetricsPanel from '../../components/dashboard/MetricsPanel';
import StatsCard from '../../components/dashboard/StatsCard';
import { dashboardService } from '../../services/dataService';


const Dashboard = ({ onSectionChange }) => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const metrics = await dashboardService.getAllMetrics();
        
        // Calcular utilidad neta
        const netProfit = metrics.financial.totalIncome - metrics.financial.totalCosts;
        const netProfitPercentage = Math.round((netProfit / metrics.financial.totalIncome) * 100);
        
        const newStatsData = [
          {
            title: 'Ingresos Totales',
            value: metrics.financial.totalIncome,
            change: metrics.financial.incomeChange,
            changeType: metrics.financial.incomeChange >= 0 ? 'positive' : 'negative',
            icon: Banknote,
            description: 'Este mes',
            currency: true
          },
          {
            title: 'Costos Totales',
            value: metrics.financial.totalCosts,
            change: metrics.financial.costsChange,
            changeType: metrics.financial.costsChange >= 0 ? 'negative' : 'positive', // Para costos, menos es mejor
            icon: TrendingDown,
            description: 'Este mes',
            currency: true
          },
          {
            title: 'Utilidad Neta',
            value: netProfit,
            secondaryValue: `${netProfitPercentage}%`,
            change: Math.round(metrics.financial.incomeChange - metrics.financial.costsChange),
            changeType: netProfit >= 0 ? 'positive' : 'negative',
            icon: TrendingUp,
            description: 'Margen de ganancia',
            currency: true,
            showPercentage: true
          },
          {
            title: 'Pedidos',
            value: `${metrics.orders.activeOrders} activos`,
            secondaryValue: `${metrics.orders.delayedOrders} retrasados`,
            change: metrics.orders.activeOrdersChange,
            changeType: metrics.orders.delayedOrdersChange <= 0 ? 'positive' : 'negative',
            icon: Clock,
            description: 'Estado actual',
            multiValue: true
          },
          {
            title: 'Clientes',
            value: `${metrics.clients.newClients} nuevos`,
            secondaryValue: `${metrics.clients.recurringClients} recurrentes`,
            change: metrics.clients.newClientsChange,
            changeType: metrics.clients.newClientsChange >= 0 ? 'positive' : 'negative',
            icon: Users,
            description: 'Base de clientes',
            multiValue: true
          }
        ];
        
        setStatsData(newStatsData);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        // Datos de fallback en caso de error
        const fallbackNetProfit = 15231.89 - 8450.32;
        const fallbackNetProfitPercentage = Math.round((fallbackNetProfit / 15231.89) * 100);
        
        setStatsData([
          {
            title: 'Ingresos Totales',
            value: 15231.89,
            change: 12.5,
            changeType: 'positive',
            icon: Banknote,
            description: 'Este mes',
            currency: true
          },
          {
            title: 'Costos Totales',
            value: 8450.32,
            change: 8.3,
            changeType: 'negative',
            icon: TrendingDown,
            description: 'Este mes',
            currency: true
          },
          {
            title: 'Utilidad Neta',
            value: fallbackNetProfit,
            secondaryValue: `${fallbackNetProfitPercentage}%`,
            change: 4,
            changeType: 'positive',
            icon: TrendingUp,
            description: 'Margen de ganancia',
            currency: true,
            showPercentage: true
          },
          {
            title: 'Pedidos',
            value: '18 activos',
            secondaryValue: '5 retrasados',
            change: -2.1,
            changeType: 'positive',
            icon: Clock,
            description: 'Estado actual',
            multiValue: true
          },
          {
            title: 'Clientes',
            value: '24 nuevos',
            secondaryValue: '156 recurrentes',
            change: 15.2,
            changeType: 'positive',
            icon: Users,
            description: 'Base de clientes',
            multiValue: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const financialData = [
    { name: 'Ene', ingresos: 8500, costos: 5100, utilidad: 3400 },
    { name: 'Feb', ingresos: 9200, costos: 5520, utilidad: 3680 },
    { name: 'Mar', ingresos: 10800, costos: 6480, utilidad: 4320 },
    { name: 'Abr', ingresos: 11200, costos: 6720, utilidad: 4480 },
    { name: 'May', ingresos: 13500, costos: 8100, utilidad: 5400 },
    { name: 'Jun', ingresos: 15231, costos: 8450, utilidad: 6781 }
  ];

  const serviceFinancialData = [
    { 
      name: 'Foto Escolar', 
      ingresoTotal: 6093,
      costoTotal: 3657, 
      margenNeto: 2436
    },
    { 
      name: 'Enmarcado', 
      ingresoTotal: 3808,
      costoTotal: 2285, 
      margenNeto: 1523
    },
    { 
      name: 'Impresión', 
      ingresoTotal: 3046,
      costoTotal: 1828, 
      margenNeto: 1218
    },
    { 
      name: 'Retoque', 
      ingresoTotal: 2285,
      costoTotal: 1371, 
      margenNeto: 914
    }
  ];

  const recentActivities = [
    {
      type: 'pedido',
      title: 'Nuevo pedido creado',
      description: 'Promoción Escolar - Colegio San José',
      time: 'Hace 5 minutos'
    },
    {
      type: 'cita',
      title: 'Cita programada',
      description: 'Sesión familiar - Familia López',
      time: 'Hace 15 minutos'
    },
    {
      type: 'produccion',
      title: 'Trabajo completado',
      description: 'Marco 30x40 - Cliente: María García',
      time: 'Hace 1 hora'
    },
    {
      type: 'alerta',
      title: 'Stock bajo',
      description: 'Moldura Clásica Negra - Solo 3 unidades',
      time: 'Hace 2 horas'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Sesión Fotográfica',
      client: 'I.E. San Martín',
      time: '10:00 AM',
      priority: 'alta'
    },
    {
      title: 'Entrega de Marcos',
      client: 'María López',
      time: '2:30 PM',
      priority: 'media'
    },
    {
      title: 'Reunión Contrato',
      client: 'Colegio Particular',
      time: '4:00 PM',
      priority: 'alta'
    },
    {
      title: 'Sesión Familiar',
      client: 'Familia Rodríguez',
      time: '6:00 PM',
      priority: 'baja'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <p className="text-gray-600">Vista general de tu negocio fotográfico</p>
      </div>

      {/* Quick Alerts Panel */}
      <QuickAlertsPanel />

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className={index < 2 ? "md:col-span-1" : ""}>
              <StatsCard {...stat} onSectionChange={onSectionChange} />
            </div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 h-260px">
        <Chart
          type="multiLine"
          data={financialData}
          title="Análisis Financiero Mensual"
          height={300}
          lines={[
            { key: 'ingresos', name: 'Ingresos', color: '#1DD1E3' },
            { key: 'costos', name: 'Costos', color: '#FF6B6B' },
            { key: 'utilidad', name: 'Utilidad', color: '#4ECDC4' }
          ]}
        />
        <Chart
          type="bar"
          data={serviceFinancialData}
          title="Análisis Financiero por Servicio"
          height={350}
          bars={[
            { key: 'ingresoTotal', name: 'Ingreso Total', color: '#1DD1E3' },
            { key: 'costoTotal', name: 'Costo Total', color: '#FF6B6B' },
            { key: 'margenNeto', name: 'Margen Neto', color: '#4ECDC4' }
          ]}
        />
      </div>

      {/* Metrics Panel */}
      <MetricsPanel
        recentActivities={recentActivities}
        upcomingEvents={upcomingEvents}
      />
    </div>
  );
};

export default Dashboard;