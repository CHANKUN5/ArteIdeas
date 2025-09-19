import React from 'react';
import { DollarSign, Users, Camera, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import Chart from '../../components/dashboard/Chart';
import MetricsPanel from '../../components/dashboard/MetricsPanel';

const Dashboard = () => {
  const statsData = [
    {
      title: 'Ingresos Totales',
      value: 15231.89,
      change: 12.5,
      changeType: 'positive',
      icon: DollarSign,
      description: 'Este mes',
      currency: true
    },
    {
      title: 'Nuevos Clientes',
      value: 1234,
      change: -20,
      changeType: 'negative',
      icon: Users,
      description: 'Últimos 30 días'
    },
    {
      title: 'Proyectos Activos',
      value: 45,
      change: 8.2,
      changeType: 'positive',
      icon: Camera,
      description: 'En progreso'
    },
    {
      title: 'Pedidos Pendientes',
      value: 23,
      change: -5,
      changeType: 'negative',
      icon: ShoppingBag,
      description: 'Por entregar'
    }
  ];

  const revenueData = [
    { name: 'Ene', value: 8500 },
    { name: 'Feb', value: 9200 },
    { name: 'Mar', value: 10800 },
    { name: 'Abr', value: 11200 },
    { name: 'May', value: 13500 },
    { name: 'Jun', value: 15231 }
  ];

  const serviceData = [
    { name: 'Fotografía Escolar', value: 40 },
    { name: 'Enmarcado', value: 25 },
    { name: 'Impresión Digital', value: 20 },
    { name: 'Retoque Fotográfico', value: 15 }
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart
          type="line"
          data={revenueData}
          title="Ingresos Mensuales"
          height={300}
          color="#1DD1E3"
        />
        <Chart
          type="pie"
          data={serviceData}
          title="Distribución por Servicios"
          height={300}
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