import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Chart from '../../components/dashboard/Chart';

const Reportes = () => {
  const [dateRange, setDateRange] = useState({
    inicio: '2025-01-01',
    fin: '2025-06-30'
  });
  const [reportType, setReportType] = useState('ventas');

  // Datos de ventas mensuales
  const salesData = [
    { name: 'Enero', value: 8500 },
    { name: 'Febrero', value: 9200 },
    { name: 'Marzo', value: 10800 },
    { name: 'Abril', value: 11200 },
    { name: 'Mayo', value: 13500 },
    { name: 'Junio', value: 15231 }
  ];

  // Distribución por servicios
  const serviceData = [
    { name: 'Impresión Minilab', value: 35, color: '#2ED573' },
    { name: 'Recordatorios Escolares', value: 25, color: '#1DD1E3' },
    { name: 'Enmarcado', value: 20, color: '#FF4757' },
    { name: 'Retoques Fotográficos', value: 20, color: '#FFB800' }
  ];

  // Datos de clientes por tipo
  const clientData = [
    { name: 'Colegios', value: 45, amount: 35000 },
    { name: 'Particulares', value: 35, amount: 18500 },
    { name: 'Empresas', value: 20, amount: 12750 }
  ];

  // Top productos más vendidos
  const topProducts = [
    { producto: 'Marcos 20x30', cantidad: 156, ingresos: 4680 },
    { producto: 'Impresión 10x15', cantidad: 1250, ingresos: 3750 },
    { producto: 'Marcos 30x40', cantidad: 89, ingresos: 3560 },
    { producto: 'Recordatorios', cantidad: 2400, ingresos: 7200 },
    { producto: 'Ampliaciones', cantidad: 245, ingresos: 2450 }
  ];

  // Datos de inventario crítico
  const criticalInventory = [
    { item: 'Moldura Clásica Negra', stock: 8, minimo: 10, valor: 124 },
    { item: 'Papel Fotográfico 20x30', stock: 50, minimo: 80, valor: 140 },
    { item: 'Vidrio Antireflejo 30x40', stock: 5, minimo: 15, valor: 175 }
  ];

  const ReportCard = ({ title, value, change, icon: Icon, color = "primary", onClick }) => (
    <Card 
      className="text-center hover:shadow-md transition-all cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <Icon className={`w-8 h-8 text-${color} mx-auto mb-3`} />
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
      {change && (
        <div className={`mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}% vs mes anterior
        </div>
      )}
    </Card>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600">Análisis de datos y métricas del negocio</p>
          </div>
        </div>
        
        <Button 
          icon={<Download className="w-4 h-4" />}
          variant="secondary"
          onClick={() => {
            // Simular descarga de reportes
            alert('Descargando reportes...\n• Reporte de Ventas (PDF)\n• Análisis de Inventario (Excel)\n• Estadísticas de Clientes (CSV)');
          }}
        >
          Exportar Reportes
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.inicio}
              onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <span className="text-gray-500">hasta</span>
            <input
              type="date"
              value={dateRange.fin}
              onChange={(e) => setDateRange(prev => ({ ...prev, fin: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="ventas">Reporte de Ventas</option>
              <option value="clientes">Análisis de Clientes</option>
              <option value="productos">Productos más Vendidos</option>
              <option value="inventario">Estado de Inventario</option>
            </select>
          </div>
        </div>
      </Card>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <ReportCard
          title="Ingresos Totales"
          value="S/ 68,431"
          change={15.3}
          icon={DollarSign}
          color="green"
          onClick={() => alert('Detalle de Ingresos:\n• Ventas: S/ 45,200\n• Servicios: S/ 18,500\n• Otros: S/ 4,731')}
        />
        <ReportCard
          title="Órdenes Completadas"
          value="234"
          change={8.2}
          icon={Package}
          color="blue"
          onClick={() => alert('Órdenes Completadas:\n• Este mes: 234\n• Mes anterior: 216\n• Tasa de crecimiento: +8.2%')}
        />
        <ReportCard
          title="Nuevos Clientes"
          value="45"
          change={-12.5}
          icon={Users}
          color="purple"
          onClick={() => alert('Nuevos Clientes:\n• Este mes: 45\n• Mes anterior: 51\n• Variación: -12.5%')}
        />
        <ReportCard
          title="Productos Críticos"
          value="3"
          change={-25}
          icon={TrendingUp}
          color="yellow"
          onClick={() => alert('Productos con Stock Bajo:\n• Moldura Clásica Negra: 8 unidades\n• Papel Fotográfico 20x30: 50 unidades\n• Vidrio Antireflejo 30x40: 5 unidades')}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Chart
          type="line"
          data={salesData}
          title="Evolución de Ventas (6 meses)"
          height={300}
          color="#1DD1E3"
          dataKey="value"
          nameKey="name"
        />
        
        <Chart
          type="pie"
          data={serviceData}
          title="Distribución por Servicios"
          height={300}
          dataKey="value"
          nameKey="name"
        />
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Top Productos */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.producto}</p>
                    <p className="text-sm text-gray-500">{product.cantidad} unidades vendidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">S/ {product.ingresos.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Análisis de Clientes */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Análisis por Tipo de Cliente</h3>
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
          </div>
          
          <div className="space-y-4">
            {clientData.map((client, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{client.name}</h4>
                  <span className="text-2xl font-bold text-primary">{client.value}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ingresos generados:</span>
                  <span className="font-semibold text-green-600">S/ {client.amount.toLocaleString()}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${client.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Inventory Critical Report */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Inventario Crítico</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
            <Button variant="outline" size="sm">
              Ver Inventario Completo
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Artículo</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Stock Actual</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Stock Mínimo</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Valor</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {criticalInventory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{item.item}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-red-600">{item.stock}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-gray-600">{item.minimo}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-medium">S/ {item.valor}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Crítico
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Section */}
      <Card className="mt-8">
        <div className="text-center py-8">
          <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Exportar Reportes</h3>
          <p className="text-gray-600 mb-6">Descarga reportes detallados en diferentes formatos</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              Exportar PDF
            </Button>
            <Button variant="outline">
              Exportar Excel
            </Button>
            <Button>
              Reporte Personalizado
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reportes;