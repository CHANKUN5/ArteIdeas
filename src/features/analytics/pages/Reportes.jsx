import { 
  BarChart3, Calendar, DollarSign, Download, FileSpreadsheet,
  Package, TrendingUp, Users, AlertTriangle, Clock, 
  CheckCircle, XCircle, ShoppingCart, Warehouse, Factory, 
  UserCheck, PieChart, FileCheck
} from 'lucide-react';
import { useState } from 'react';
import Button from '@components/ui/Button/Button.jsx';
import Card from '@components/ui/Card/Card.jsx';

const ReportesNuevos = () => {
  const [dateRange, setDateRange] = useState({
    inicio: '2025-01-01',
    fin: '2025-06-30'
  });
  const [periodo, setPeriodo] = useState('personalizado');
  const [activeCategory, setActiveCategory] = useState('ventas');

  const currency = (n) => `S/ ${Number(n || 0).toLocaleString()}`;

  // ===== DATOS MOCK =====
  const ventasData = {
    cards: [
      { title: 'Ventas Totales', value: currency(68431), icon: DollarSign, color: 'green' },
      { title: 'Pedidos Completados', value: '234', icon: Package, color: 'blue' },
      { title: 'Ticket Promedio', value: currency(292), icon: TrendingUp, color: 'purple' },
      { title: 'Crecimiento', value: '+15.3%', icon: TrendingUp, color: 'yellow' }
    ],
    ventasPorTipo: [
      { tipo: 'Enmarcados', cantidad: 89, monto: 12450, porcentaje: 18.2 },
      { tipo: 'Minilab', cantidad: 1250, monto: 24500, porcentaje: 35.8 },
      { tipo: 'Graduaciones', cantidad: 45, monto: 18750, porcentaje: 27.4 },
      { tipo: 'Corte Láser', cantidad: 156, monto: 12731, porcentaje: 18.6 }
    ],
    topClientes: [
      { cliente: 'Colegio San José', pedidos: 12, monto: 15600 },
      { cliente: 'María Gonzales', pedidos: 8, monto: 4200 },
      { cliente: 'Estudio Creativo', pedidos: 6, monto: 8900 }
    ]
  };

  const inventarioData = {
    cards: [
      { title: 'Valor total de inventario', value: currency(145000), icon: Warehouse, color: 'blue' },
      { title: 'Ítems bajo stock', value: '12', icon: AlertTriangle, color: 'yellow' },
      { title: 'Sin movimiento', value: '8', icon: XCircle, color: 'red' }
    ],
    inventarioPorCategoria: [
      { categoria: 'Enmarcados', valor: 45000, items: 234, stockBajo: 3 },
      { categoria: 'Minilab', valor: 38000, items: 156, stockBajo: 5 },
      { categoria: 'Graduaciones', valor: 32000, items: 89, stockBajo: 2 },
      { categoria: 'Corte Láser', valor: 30000, items: 178, stockBajo: 2 }
    ],
    alertasReabastecimiento: [
      { producto: 'Moldura Dorada 3cm', categoria: 'Enmarcados', stockActual: 5, stockMinimo: 15 },
      { producto: 'Papel Lustre 20x30', categoria: 'Minilab', stockActual: 20, stockMinimo: 50 },
      { producto: 'Vidrio 40x50', categoria: 'Enmarcados', stockActual: 8, stockMinimo: 20 }
    ]
  };

  const produccionData = {
    cards: [
      { title: 'Órdenes activas', value: '24', icon: Clock, color: 'blue' },
      { title: 'Completadas', value: '156', icon: CheckCircle, color: 'green' },
      { title: 'Atrasadas', value: '3', icon: AlertTriangle, color: 'red' },
      { title: 'Tiempo promedio', value: '2.5 días', icon: Clock, color: 'purple' }
    ],
    desempenoPorOperario: [
      { operario: 'Juan Pérez', completadas: 45, tiempoPromedio: '2.1 días', eficiencia: '95%' },
      { operario: 'Ana Martínez', completadas: 38, tiempoPromedio: '2.3 días', eficiencia: '92%' },
      { operario: 'Carlos López', completadas: 42, tiempoPromedio: '2.0 días', eficiencia: '97%' }
    ],
    mermasDesperdicios: [
      { producto: 'Moldura Premium', cantidad: 12, costo: 360, motivo: 'Defecto de fabricación' },
      { producto: 'Vidrio 50x70', cantidad: 5, costo: 425, motivo: 'Rotura en corte' }
    ],
    totalMermas: { cantidad: 17, costo: 785 }
  };

  const clientesData = {
    cards: [
      { title: 'Total de clientes', value: '1,248', icon: Users, color: 'blue' },
      { title: 'Clientes activos', value: '856', icon: UserCheck, color: 'green' },
      { title: 'Clientes nuevos', value: '42', icon: TrendingUp, color: 'purple' },
      { title: 'Inactivos', value: '392', icon: XCircle, color: 'yellow' }
    ],
    segmentacionClientes: [
      { tipoCliente: 'Empresas', cantidad: 145, ventasTotales: 45600, ticketPromedio: 314 },
      { tipoCliente: 'Particulares', cantidad: 1103, ventasTotales: 22831, ticketPromedio: 21 }
    ],
    mejoresClientes: [
      { cliente: 'Colegio San José', pedidos: 24, totalCompras: 28400, ultimaCompra: '2025-06-15' },
      { cliente: 'Estudio Creativo', pedidos: 18, totalCompras: 19200, ultimaCompra: '2025-06-10' },
      { cliente: 'María Gonzales', pedidos: 32, totalCompras: 8900, ultimaCompra: '2025-06-20' }
    ]
  };

  const financieroData = {
    cards: [
      { title: 'Ingresos Totales', value: currency(68431), icon: DollarSign, color: 'green' },
      { title: 'Costos Totales', value: currency(42150), icon: TrendingUp, color: 'red' },
      { title: 'Utilidad Bruta', value: currency(26281), icon: DollarSign, color: 'blue' },
      { title: 'Margen Bruto', value: '38.4%', icon: PieChart, color: 'purple' }
    ],
    rentabilidadPorTipo: [
      { tipoProducto: 'Enmarcados', ingresos: 12450, costos: 7200, utilidad: 5250, margen: 42.2 },
      { tipoProducto: 'Minilab', ingresos: 24500, costos: 15800, utilidad: 8700, margen: 35.5 },
      { tipoProducto: 'Graduaciones', ingresos: 18750, costos: 10950, utilidad: 7800, margen: 41.6 },
      { tipoProducto: 'Corte Láser', ingresos: 12731, costos: 8200, utilidad: 4531, margen: 35.6 }
    ],
    cuentasPorCobrar: { total: 28000, porcentaje: 22.4 }
  };

  const contratosData = {
    cards: [
      { title: 'Contratos activos', value: '18', icon: FileCheck, color: 'blue' },
      { title: 'Valor total', value: currency(145000), icon: DollarSign, color: 'green' },
      { title: 'Próximos a vencer', value: '3', icon: AlertTriangle, color: 'yellow' },
      { title: 'Cumplimiento de pagos', value: '94%', icon: CheckCircle, color: 'purple' }
    ],
    estadoContratos: [
      { nroContrato: 'CT-2025-001', cliente: 'Colegio San José', valor: 45000, pagado: 35000, saldo: 10000, vencimiento: '2025-12-31' },
      { nroContrato: 'CT-2025-002', cliente: 'Universidad Nacional', valor: 38000, pagado: 38000, saldo: 0, vencimiento: '2025-08-15' },
      { nroContrato: 'CT-2025-003', cliente: 'Municipalidad', valor: 62000, pagado: 42000, saldo: 20000, vencimiento: '2025-11-30' }
    ]
  };

  const handlePeriodoChange = (value) => {
    setPeriodo(value);
    if (value === 'personalizado') return;
    const today = new Date();
    let inicio, fin;
    switch(value) {
      case 'hoy': inicio = fin = today.toISOString().split('T')[0]; break;
      case 'semana':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        inicio = startOfWeek.toISOString().split('T')[0];
        fin = today.toISOString().split('T')[0];
        break;
      case 'mes':
        inicio = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        fin = today.toISOString().split('T')[0];
        break;
      case 'trimestre':
        const quarter = Math.floor(today.getMonth() / 3);
        inicio = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
        fin = today.toISOString().split('T')[0];
        break;
      case 'anio':
        inicio = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        fin = today.toISOString().split('T')[0];
        break;
      default: return;
    }
    setDateRange({ inicio, fin });
  };

  const exportPDF = () => alert('Exportando a PDF...');
  const exportExcel = () => alert('Exportando a Excel...');

  const ReportCard = ({ title, value, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      red: 'text-red-600 bg-red-50'
    };
    return (
      <Card className="text-center hover:shadow-lg transition-all">
        <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-3`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </Card>
    );
  };

  const CategoryButton = ({ label, icon: Icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  const categories = [
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
    { id: 'inventario', label: 'Inventario', icon: Warehouse },
    { id: 'produccion', label: 'Producción', icon: Factory },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'financiero', label: 'Financiero', icon: PieChart },
    { id: 'contratos', label: 'Contratos', icon: FileCheck }
  ];

  const renderContent = () => {
    const data = {
      ventas: ventasData,
      inventario: inventarioData,
      produccion: produccionData,
      clientes: clientesData,
      financiero: financieroData,
      contratos: contratosData
    }[activeCategory];

    if (!data) return null;

    return (
      <>
        {/* Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-${data.cards.length === 3 ? '3' : data.cards.length === 4 ? '2 lg:grid-cols-4' : '4'} gap-6 mb-8`}>
          {data.cards.map((card, i) => <ReportCard key={i} {...card} />)}
        </div>

        {/* Tablas dinámicas */}
        {activeCategory === 'ventas' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por tipo de producto</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de Producto</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cantidad</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Monto</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">% del Total</th></tr></thead><tbody className="divide-y divide-gray-200">{data.ventasPorTipo.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.tipo}</td><td className="px-4 py-3 text-center text-gray-700">{item.cantidad}</td><td className="px-4 py-3 text-right font-semibold text-gray-900">{currency(item.monto)}</td><td className="px-4 py-3 text-right text-gray-700">{item.porcentaje}%</td></tr>))}</tbody></table></div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes del periodo</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Pedidos</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Monto Total</th></tr></thead><tbody className="divide-y divide-gray-200">{data.topClientes.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.cliente}</td><td className="px-4 py-3 text-center text-gray-700">{item.pedidos}</td><td className="px-4 py-3 text-right font-semibold text-green-600">{currency(item.monto)}</td></tr>))}</tbody></table></div>
            </Card>
          </div>
        )}

        {activeCategory === 'inventario' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventario por categoría</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Valor</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ítems</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Stock Bajo</th></tr></thead><tbody className="divide-y divide-gray-200">{data.inventarioPorCategoria.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.categoria}</td><td className="px-4 py-3 text-right font-semibold text-gray-900">{currency(item.valor)}</td><td className="px-4 py-3 text-center text-gray-700">{item.items}</td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs font-medium rounded-full ${item.stockBajo > 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.stockBajo}</span></td></tr>))}</tbody></table></div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de reabastecimiento</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Stock actual</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Stock mínimo</th></tr></thead><tbody className="divide-y divide-gray-200">{data.alertasReabastecimiento.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.producto}</td><td className="px-4 py-3 text-gray-700">{item.categoria}</td><td className="px-4 py-3 text-center"><span className="font-semibold text-red-600">{item.stockActual}</span></td><td className="px-4 py-3 text-center text-gray-700">{item.stockMinimo}</td></tr>))}</tbody></table></div>
            </Card>
          </div>
        )}

        {activeCategory === 'produccion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Desempeño por operario</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Operario</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Completadas</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Tiempo promedio</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Eficiencia</th></tr></thead><tbody className="divide-y divide-gray-200">{data.desempenoPorOperario.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.operario}</td><td className="px-4 py-3 text-center text-gray-700">{item.completadas}</td><td className="px-4 py-3 text-center text-gray-700">{item.tiempoPromedio}</td><td className="px-4 py-3 text-center"><span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{item.eficiencia}</span></td></tr>))}</tbody></table></div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mermas y desperdicios</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cantidad</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Costo</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Motivo</th></tr></thead><tbody className="divide-y divide-gray-200">{data.mermasDesperdicios.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.producto}</td><td className="px-4 py-3 text-center text-gray-700">{item.cantidad}</td><td className="px-4 py-3 text-right font-semibold text-red-600">{currency(item.costo)}</td><td className="px-4 py-3 text-sm text-gray-600">{item.motivo}</td></tr>))}<tr className="bg-gray-100 font-bold"><td className="px-4 py-3">Total de mermas</td><td className="px-4 py-3 text-center">{data.totalMermas.cantidad}</td><td className="px-4 py-3 text-right text-red-600">{currency(data.totalMermas.costo)}</td><td className="px-4 py-3"></td></tr></tbody></table></div>
            </Card>
          </div>
        )}

        {activeCategory === 'clientes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segmentación de clientes</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de cliente</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cantidad</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ventas totales</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ticket promedio</th></tr></thead><tbody className="divide-y divide-gray-200">{data.segmentacionClientes.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.tipoCliente}</td><td className="px-4 py-3 text-center text-gray-700">{item.cantidad}</td><td className="px-4 py-3 text-right font-semibold text-gray-900">{currency(item.ventasTotales)}</td><td className="px-4 py-3 text-right text-gray-700">{currency(item.ticketPromedio)}</td></tr>))}</tbody></table></div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mejores clientes (LTV)</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Pedidos</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total compras</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Última compra</th></tr></thead><tbody className="divide-y divide-gray-200">{data.mejoresClientes.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.cliente}</td><td className="px-4 py-3 text-center text-gray-700">{item.pedidos}</td><td className="px-4 py-3 text-right font-semibold text-green-600">{currency(item.totalCompras)}</td><td className="px-4 py-3 text-center text-sm text-gray-600">{item.ultimaCompra}</td></tr>))}</tbody></table></div>
            </Card>
          </div>
        )}

        {activeCategory === 'financiero' && (
          <>
            <Card className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rentabilidad por tipo de producto</h3>
              <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de producto</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ingresos</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Costos</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Utilidad</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Margen %</th></tr></thead><tbody className="divide-y divide-gray-200">{data.rentabilidadPorTipo.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.tipoProducto}</td><td className="px-4 py-3 text-right text-gray-700">{currency(item.ingresos)}</td><td className="px-4 py-3 text-right text-red-600">{currency(item.costos)}</td><td className="px-4 py-3 text-right font-semibold text-green-600">{currency(item.utilidad)}</td><td className="px-4 py-3 text-right font-semibold text-blue-600">{item.margen}%</td></tr>))}</tbody></table></div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuentas por cobrar</h3>
              <p className="text-sm text-gray-600 mb-4">Total pendiente de cobro</p>
              <div className="text-4xl font-bold text-primary mb-2">{currency(data.cuentasPorCobrar.total)}</div>
              <p className="text-sm text-gray-600">Representa el {data.cuentasPorCobrar.porcentaje}% de los ingresos del periodo</p>
            </Card>
          </>
        )}

        {activeCategory === 'contratos' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de contratos</h3>
            <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Contrato</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Valor</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Pagado</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Saldo</th><th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Vencimiento</th></tr></thead><tbody className="divide-y divide-gray-200">{data.estadoContratos.map((item, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.nroContrato}</td><td className="px-4 py-3 text-gray-700">{item.cliente}</td><td className="px-4 py-3 text-right text-gray-700">{currency(item.valor)}</td><td className="px-4 py-3 text-right text-green-600">{currency(item.pagado)}</td><td className="px-4 py-3 text-right font-semibold text-red-600">{currency(item.saldo)}</td><td className="px-4 py-3 text-center text-sm text-gray-600">{item.vencimiento}</td></tr>))}</tbody></table></div>
          </Card>
        )}
      </>
    );
  };

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
        <div className="flex space-x-3">
          <Button variant="outline" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={exportExcel}>Exportar Excel</Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={exportPDF}>Exportar PDF</Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input type="date" value={dateRange.inicio} onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            <span className="text-gray-500">hasta</span>
            <input type="date" value={dateRange.fin} onChange={(e) => setDateRange(prev => ({ ...prev, fin: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select value={periodo} onChange={(e) => handlePeriodoChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              <option value="personalizado">Personalizado</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="trimestre">Este trimestre</option>
              <option value="anio">Este año</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Categorías */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <CategoryButton key={cat.id} label={cat.label} icon={cat.icon} isActive={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)} />
        ))}
      </div>

      {/* Contenido dinámico */}
      {renderContent()}
    </div>
  );
};

export default ReportesNuevos;