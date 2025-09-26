import { BarChart3, Calendar, DollarSign, Download, Filter, Package, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Chart from '../../components/dashboard/Chart';
import ReportExportModal from '../../components/common/ReportExportModal';

const Reportes = () => {
  const [dateRange, setDateRange] = useState({
    inicio: '2025-01-01',
    fin: '2025-06-30'
  });
  const [reportType, setReportType] = useState('ventas');
  const [showExportModal, setShowExportModal] = useState(false);

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

  // ===== Lógica de Filtros =====
  // Para que el filtro por fechas funcione con los datos de meses,
  // mapeamos cada mes a su índice y una fecha representativa de 2025.
  const monthIndexMap = {
    'Enero': 0,
    'Febrero': 1,
    'Marzo': 2,
    'Abril': 3,
    'Mayo': 4,
    'Junio': 5,
    'Julio': 6,
    'Agosto': 7,
    'Septiembre': 8,
    'Octubre': 9,
    'Noviembre': 10,
    'Diciembre': 11,
  };

  const salesDataWithMeta = salesData.map(d => ({
    ...d,
    monthIndex: monthIndexMap[d.name] ?? 0,
    // Usamos el día 15 como referencia en cada mes del año 2025
    date: new Date(2025, monthIndexMap[d.name] ?? 0, 15)
  }));

  const filteredSalesData = useMemo(() => {
    const start = dateRange.inicio ? new Date(dateRange.inicio) : new Date(2025, 0, 1);
    const end = dateRange.fin ? new Date(dateRange.fin) : new Date(2025, 11, 31);
    // Normalizamos para incluir todo el día final
    end.setHours(23, 59, 59, 999);
    return salesDataWithMeta
      .filter(d => d.date >= start && d.date <= end)
      .map(({ name, value }) => ({ name, value }));
  }, [dateRange, salesDataWithMeta]);

  // Transformaciones para otros reportes (sin filtro de fecha porque no hay fechas en mock)
  const clientAmountBarData = useMemo(() => (
    // Para gráfico de barras por monto generado por tipo de cliente
    clientData.map(c => ({ name: c.name, value: c.amount }))
  ), [clientData]);

  const productBarData = useMemo(() => (
    // Para gráfico de barras por ingresos de producto
    topProducts.map(p => ({ name: p.producto, value: p.ingresos }))
  ), [topProducts]);

  const inventoryBarData = useMemo(() => (
    // Para gráfico de barras por stock actual
    criticalInventory.map(i => ({ name: i.item, value: i.stock }))
  ), [criticalInventory]);

  // ===== Helpers y KPIs =====
  const currency = (n) => `S/ ${Number(n || 0).toLocaleString()}`;

  // KPIs para ventas
  const ventasKPIs = useMemo(() => {
    const totalIngresos = filteredSalesData.reduce((acc, d) => acc + d.value, 0);
    const ordenes = Math.round(totalIngresos / 292); // factor simulado
    const nuevosClientes = Math.max(10, Math.round(ordenes * 0.18));
    const criticos = criticalInventory.length;
    return { totalIngresos, ordenes, nuevosClientes, criticos };
  }, [filteredSalesData, criticalInventory.length]);

  // KPIs para clientes
  const clientesKPIs = useMemo(() => {
    const totalIngresos = clientData.reduce((a, c) => a + c.amount, 0);
    const totalClientes = 1200; // simulado
    const tasaRetencion = 76; // % simulado
    const topSegment = clientData.reduce((p, c) => (c.value > p.value ? c : p), clientData[0]).name;
    return { totalIngresos, totalClientes, tasaRetencion, topSegment };
  }, [clientData]);

  // KPIs para productos
  const productosKPIs = useMemo(() => {
    const ingresos = topProducts.reduce((a, p) => a + p.ingresos, 0);
    const unidades = topProducts.reduce((a, p) => a + p.cantidad, 0);
    const top = topProducts[0]?.producto || '-';
    const variedad = topProducts.length;
    return { ingresos, unidades, top, variedad };
  }, [topProducts]);

  // KPIs para inventario
  const inventarioKPIs = useMemo(() => {
    const itemsCriticos = criticalInventory.length;
    const valorTotal = criticalInventory.reduce((a, i) => a + i.valor, 0);
    const porReponer = criticalInventory.filter(i => i.stock < i.minimo).length;
    const riesgoPromedio = Math.round(
      (criticalInventory.reduce((a, i) => a + Math.min(100, (i.minimo - i.stock) / Math.max(1, i.minimo) * 100), 0) / Math.max(1, itemsCriticos))
    );
    return { itemsCriticos, valorTotal, porReponer, riesgoPromedio };
  }, [criticalInventory]);

  // ===== Utilidades de Exportación =====
  const downloadBlob = (blob, filename) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  };

  // Función mejorada para crear CSV con plantillas organizadas
  const createOrganizedCSV = (reportData) => {
    const { title, metadata, kpis, tableData, chartData, includeCharts } = reportData;
    let csvContent = '';
    
    // BOM para mejor compatibilidad con Excel
    csvContent += '\ufeff';
    
    // === HEADER DEL REPORTE ===
    csvContent += `${title}\n`;
    csvContent += `Fecha de generación: ${new Date().toLocaleDateString('es-ES')}\n`;
    csvContent += `Hora de generación: ${new Date().toLocaleTimeString('es-ES')}\n`;
    
    if (metadata) {
      csvContent += `Período: ${metadata.periodo || 'N/A'}\n`;
      csvContent += `Tipo de reporte: ${metadata.tipo || 'N/A'}\n`;
    }
    
    csvContent += '\n';
    
    // === INDICADORES CLAVE (KPIs) ===
    if (kpis && kpis.length > 0) {
      csvContent += '=== INDICADORES CLAVE ===\n';
      csvContent += 'Indicador,Valor,Unidad\n';
      kpis.forEach(kpi => {
        csvContent += `"${kpi.nombre}","${kpi.valor}","${kpi.unidad || ''}"\n`;
      });
      csvContent += '\n';
    }
    
    // === DATOS DE TABLA PRINCIPAL ===
    if (tableData && tableData.length > 0) {
      csvContent += '=== DATOS PRINCIPALES ===\n';
      const headers = Object.keys(tableData[0]);
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';
      
      tableData.forEach(row => {
        const values = headers.map(header => {
          let value = row[header];
          if (typeof value === 'number') {
            value = value.toLocaleString('es-ES');
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += values.join(',') + '\n';
      });
      csvContent += '\n';
    }
    
    // === DATOS DE GRÁFICOS ===
    if (includeCharts && chartData && chartData.length > 0) {
      csvContent += '=== DATOS DE GRÁFICOS ===\n';
      chartData.forEach(chart => {
        csvContent += `--- ${chart.title} ---\n`;
        if (chart.data && chart.data.length > 0) {
          const chartHeaders = Object.keys(chart.data[0]);
          csvContent += chartHeaders.map(h => `"${h}"`).join(',') + '\n';
          
          chart.data.forEach(item => {
            const values = chartHeaders.map(header => {
              let value = item[header];
              if (typeof value === 'number') {
                value = value.toLocaleString('es-ES');
              }
              return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvContent += values.join(',') + '\n';
          });
        }
        csvContent += '\n';
      });
    }
    
    // === PIE DE PÁGINA ===
    csvContent += '=== INFORMACIÓN ADICIONAL ===\n';
    csvContent += 'Sistema: Arte Ideas - Sistema de Gestión\n';
    csvContent += `Total de registros: ${tableData ? tableData.length : 0}\n`;
    
    return csvContent;
  };

  const exportCSV = (filename, reportData) => {
    const csv = createOrganizedCSV(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
  };

  const exportCurrentReportCSV = () => {
    let reportData = {};
    
    if (reportType === 'ventas') {
      reportData = {
        title: 'REPORTE DE VENTAS - ARTE IDEAS',
        metadata: {
          periodo: `${dateRange.inicio || 'Enero 2025'} - ${dateRange.fin || 'Diciembre 2025'}`,
          tipo: 'Análisis de Ventas'
        },
        kpis: [
          { nombre: 'Ingresos Totales', valor: `S/ ${ventasKPIs.totalIngresos.toLocaleString()}`, unidad: 'Soles' },
          { nombre: 'Total de Órdenes', valor: ventasKPIs.ordenes, unidad: 'Unidades' },
          { nombre: 'Nuevos Clientes', valor: ventasKPIs.nuevosClientes, unidad: 'Personas' },
          { nombre: 'Productos Críticos', valor: ventasKPIs.criticos, unidad: 'Items' }
        ],
        tableData: filteredSalesData.map(item => ({
          'Mes': item.name,
          'Ingresos (S/)': item.value,
          'Porcentaje del Total': `${((item.value / filteredSalesData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%`
        })),
        chartData: [
          {
            title: 'Evolución Mensual de Ventas',
            data: filteredSalesData.map(item => ({
              'Período': item.name,
              'Valor': item.value,
              'Tendencia': item.value > 15000 ? 'Alta' : item.value > 10000 ? 'Media' : 'Baja'
            }))
          }
        ]
      };
      exportCSV('reporte_ventas', reportData);
      
    } else if (reportType === 'clientes') {
      reportData = {
        title: 'REPORTE DE CLIENTES - ARTE IDEAS',
        metadata: {
          periodo: 'Datos Actuales',
          tipo: 'Análisis de Clientes'
        },
        kpis: [
          { nombre: 'Total de Clientes', valor: clientData.length, unidad: 'Clientes' },
          { nombre: 'Ingresos Promedio', valor: `S/ ${(clientData.reduce((sum, c) => sum + c.amount, 0) / clientData.length).toFixed(0)}`, unidad: 'Soles' },
          { nombre: 'Cliente Top', valor: clientData.reduce((max, c) => c.amount > max.amount ? c : max, clientData[0])?.name || 'N/A', unidad: '' }
        ],
        tableData: clientData.map(client => ({
          'Cliente': client.name,
          'Monto Generado (S/)': client.amount,
          'Tipo': client.type || 'Regular',
          'Estado': client.amount > 5000 ? 'VIP' : 'Regular'
        })),
        chartData: [
          {
            title: 'Distribución de Clientes por Monto',
            data: clientAmountBarData.map(item => ({
              'Cliente': item.name,
              'Monto': item.value,
              'Categoría': item.value > 5000 ? 'Alto Valor' : item.value > 2000 ? 'Medio Valor' : 'Bajo Valor'
            }))
          }
        ]
      };
      exportCSV('reporte_clientes', reportData);
      
    } else if (reportType === 'productos') {
      reportData = {
        title: 'REPORTE DE PRODUCTOS - ARTE IDEAS',
        metadata: {
          periodo: 'Datos Actuales',
          tipo: 'Análisis de Productos'
        },
        kpis: [
          { nombre: 'Total de Productos', valor: topProducts.length, unidad: 'Productos' },
          { nombre: 'Ingresos Totales', valor: `S/ ${topProducts.reduce((sum, p) => sum + p.ingresos, 0).toLocaleString()}`, unidad: 'Soles' },
          { nombre: 'Producto Top', valor: topProducts[0]?.producto || 'N/A', unidad: '' }
        ],
        tableData: topProducts.map(product => ({
          'Producto': product.producto,
          'Ingresos (S/)': product.ingresos,
          'Unidades Vendidas': product.unidades,
          'Precio Promedio (S/)': (product.ingresos / product.unidades).toFixed(2)
        })),
        chartData: [
          {
            title: 'Rendimiento de Productos por Ingresos',
            data: productBarData.map(item => ({
              'Producto': item.name,
              'Ingresos': item.value,
              'Rendimiento': item.value > 3000 ? 'Excelente' : item.value > 2000 ? 'Bueno' : 'Regular'
            }))
          }
        ]
      };
      exportCSV('reporte_productos', reportData);
      
    } else if (reportType === 'inventario') {
      reportData = {
        title: 'REPORTE DE INVENTARIO CRÍTICO - ARTE IDEAS',
        metadata: {
          periodo: 'Estado Actual',
          tipo: 'Análisis de Inventario'
        },
        kpis: [
          { nombre: 'Items Críticos', valor: criticalInventory.length, unidad: 'Productos' },
          { nombre: 'Valor Total en Riesgo', valor: `S/ ${criticalInventory.reduce((sum, i) => sum + i.valor, 0)}`, unidad: 'Soles' },
          { nombre: 'Item Más Crítico', valor: criticalInventory.reduce((min, i) => (i.stock - i.minimo) < (min.stock - min.minimo) ? i : min, criticalInventory[0])?.item || 'N/A', unidad: '' }
        ],
        tableData: criticalInventory.map(item => ({
          'Producto': item.item,
          'Stock Actual': item.stock,
          'Stock Mínimo': item.minimo,
          'Diferencia': item.stock - item.minimo,
          'Valor (S/)': item.valor,
          'Estado': item.stock < item.minimo ? 'CRÍTICO' : 'BAJO'
        })),
        chartData: [
          {
            title: 'Análisis de Stock vs Mínimo Requerido',
            data: criticalInventory.map(item => ({
              'Producto': item.item,
              'Stock_Actual': item.stock,
              'Stock_Minimo': item.minimo,
              'Deficit': Math.max(0, item.minimo - item.stock),
              'Valor_en_Riesgo': item.valor
            }))
          }
        ]
      };
      exportCSV('reporte_inventario', reportData);
    }
  };

  // Función para manejar la exportación personalizada desde el modal
  const handleCustomExport = (exportConfig) => {
    const { format, includeCharts, dateRange: exportDateRange, reportType: exportReportType } = exportConfig;
    
    // Determinar qué datos exportar con plantilla organizada
    let reportData = {};
    let filename = '';
    
    if (exportReportType === 'ventas') {
      const dataToUse = exportDateRange === 'all' ? salesData : filteredSalesData;
      filename = 'reporte_ventas_personalizado';
      
      reportData = {
        title: 'REPORTE PERSONALIZADO DE VENTAS - ARTE IDEAS',
        metadata: {
          periodo: exportDateRange === 'all' ? 'Todos los períodos' : `${dateRange.inicio || 'Enero 2025'} - ${dateRange.fin || 'Diciembre 2025'}`,
          tipo: 'Análisis Personalizado de Ventas',
          incluye_graficos: includeCharts ? 'Sí' : 'No'
        },
        kpis: [
          { nombre: 'Ingresos Totales', valor: `S/ ${ventasKPIs.totalIngresos.toLocaleString()}`, unidad: 'Soles' },
          { nombre: 'Total de Órdenes', valor: ventasKPIs.ordenes, unidad: 'Unidades' },
          { nombre: 'Nuevos Clientes', valor: ventasKPIs.nuevosClientes, unidad: 'Personas' },
          { nombre: 'Productos Críticos', valor: ventasKPIs.criticos, unidad: 'Items' }
        ],
        tableData: dataToUse.map(item => ({
          'Mes': item.name,
          'Ingresos (S/)': item.value,
          'Porcentaje del Total': `${((item.value / dataToUse.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%`
        })),
        chartData: includeCharts ? [
          {
            title: 'Evolución Mensual de Ventas',
            data: dataToUse.map(item => ({
              'Período': item.name,
              'Valor': item.value,
              'Tendencia': item.value > 15000 ? 'Alta' : item.value > 10000 ? 'Media' : 'Baja'
            }))
          }
        ] : [],
        includeCharts
      };
      
    } else if (exportReportType === 'clientes') {
      filename = 'reporte_clientes_personalizado';
      
      reportData = {
        title: 'REPORTE PERSONALIZADO DE CLIENTES - ARTE IDEAS',
        metadata: {
          periodo: 'Datos Actuales',
          tipo: 'Análisis Personalizado de Clientes',
          incluye_graficos: includeCharts ? 'Sí' : 'No'
        },
        kpis: [
          { nombre: 'Total de Clientes', valor: clientData.length, unidad: 'Clientes' },
          { nombre: 'Ingresos Promedio', valor: `S/ ${(clientData.reduce((sum, c) => sum + c.amount, 0) / clientData.length).toFixed(0)}`, unidad: 'Soles' },
          { nombre: 'Cliente Top', valor: clientData.reduce((max, c) => c.amount > max.amount ? c : max, clientData[0])?.name || 'N/A', unidad: '' }
        ],
        tableData: clientData.map(client => ({
          'Cliente': client.name,
          'Monto Generado (S/)': client.amount,
          'Tipo': client.type || 'Regular',
          'Estado': client.amount > 5000 ? 'VIP' : 'Regular'
        })),
        chartData: includeCharts ? [
          {
            title: 'Distribución de Clientes por Monto',
            data: clientAmountBarData.map(item => ({
              'Cliente': item.name,
              'Monto': item.value,
              'Categoría': item.value > 5000 ? 'Alto Valor' : item.value > 2000 ? 'Medio Valor' : 'Bajo Valor'
            }))
          }
        ] : [],
        includeCharts
      };
      
    } else if (exportReportType === 'productos') {
      filename = 'reporte_productos_personalizado';
      
      reportData = {
        title: 'REPORTE PERSONALIZADO DE PRODUCTOS - ARTE IDEAS',
        metadata: {
          periodo: 'Datos Actuales',
          tipo: 'Análisis Personalizado de Productos',
          incluye_graficos: includeCharts ? 'Sí' : 'No'
        },
        kpis: [
          { nombre: 'Total de Productos', valor: topProducts.length, unidad: 'Productos' },
          { nombre: 'Ingresos Totales', valor: `S/ ${topProducts.reduce((sum, p) => sum + p.ingresos, 0).toLocaleString()}`, unidad: 'Soles' },
          { nombre: 'Producto Top', valor: topProducts[0]?.producto || 'N/A', unidad: '' }
        ],
        tableData: topProducts.map(product => ({
          'Producto': product.producto,
          'Ingresos (S/)': product.ingresos,
          'Unidades Vendidas': product.unidades,
          'Precio Promedio (S/)': (product.ingresos / product.unidades).toFixed(2)
        })),
        chartData: includeCharts ? [
          {
            title: 'Rendimiento de Productos por Ingresos',
            data: productBarData.map(item => ({
              'Producto': item.name,
              'Ingresos': item.value,
              'Rendimiento': item.value > 3000 ? 'Excelente' : item.value > 2000 ? 'Bueno' : 'Regular'
            }))
          }
        ] : [],
        includeCharts
      };
      
    } else if (exportReportType === 'inventario') {
      filename = 'reporte_inventario_personalizado';
      
      reportData = {
        title: 'REPORTE PERSONALIZADO DE INVENTARIO CRÍTICO - ARTE IDEAS',
        metadata: {
          periodo: 'Estado Actual',
          tipo: 'Análisis Personalizado de Inventario',
          incluye_graficos: includeCharts ? 'Sí' : 'No'
        },
        kpis: [
          { nombre: 'Items Críticos', valor: criticalInventory.length, unidad: 'Productos' },
          { nombre: 'Valor Total en Riesgo', valor: `S/ ${criticalInventory.reduce((sum, i) => sum + i.valor, 0)}`, unidad: 'Soles' },
          { nombre: 'Item Más Crítico', valor: criticalInventory.reduce((min, i) => (i.stock - i.minimo) < (min.stock - min.minimo) ? i : min, criticalInventory[0])?.item || 'N/A', unidad: '' }
        ],
        tableData: criticalInventory.map(item => ({
          'Producto': item.item,
          'Stock Actual': item.stock,
          'Stock Mínimo': item.minimo,
          'Diferencia': item.stock - item.minimo,
          'Valor (S/)': item.valor,
          'Estado': item.stock < item.minimo ? 'CRÍTICO' : 'BAJO'
        })),
        chartData: includeCharts ? [
          {
            title: 'Análisis de Stock vs Mínimo Requerido',
            data: criticalInventory.map(item => ({
              'Producto': item.item,
              'Stock_Actual': item.stock,
              'Stock_Minimo': item.minimo,
              'Deficit': Math.max(0, item.minimo - item.stock),
              'Valor_en_Riesgo': item.valor
            }))
          }
        ] : [],
        includeCharts
      };
    }

    // Exportar según el formato seleccionado
    if (format === 'csv') {
      exportCSV(filename, reportData);
    } else if (format === 'txt') {
      // Exportar como texto plano organizado
      const txtContent = createOrganizedCSV(reportData).replace(/,/g, ' | ');
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      downloadBlob(blob, `${filename}.txt`);
    }
    
    console.log('Exportación personalizada completada:', exportConfig);
  };

  const exportPDF = (filename = 'reporte.pdf') => {
    // Generar HTML imprimible simple con resumen de KPIs y tabla principal si aplica
    const w = window.open('', '_blank');
    if (!w) return;
    const style = `
      <style>
        body { font-family: Arial, sans-serif; padding: 16px; }
        h1 { margin: 0 0 12px; }
        .kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
        .kpi { border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f7f7f7; }
      </style>
    `;
    let title = 'Reporte';
    let kpiHtml = '';
    let tableHtml = '';

    if (reportType === 'ventas') {
      title = 'Reporte de Ventas';
      kpiHtml = `
        <div class="kpis">
          <div class="kpi"><strong>Ingresos Totales</strong><div>S/ ${ventasKPIs.totalIngresos.toLocaleString()}</div></div>
          <div class="kpi"><strong>Órdenes</strong><div>${ventasKPIs.ordenes}</div></div>
          <div class="kpi"><strong>Nuevos Clientes</strong><div>${ventasKPIs.nuevosClientes}</div></div>
          <div class="kpi"><strong>Productos Críticos</strong><div>${ventasKPIs.criticos}</div></div>
        </div>`;
      tableHtml = `
        <table>
          <thead><tr><th>Mes</th><th>Ingresos</th></tr></thead>
          <tbody>
            ${filteredSalesData.map(d => `<tr><td>${d.name}</td><td>S/ ${d.value.toLocaleString()}</td></tr>`).join('')}
          </tbody>
        </table>`;
    } else if (reportType === 'clientes') {
      title = 'Análisis de Clientes';
      kpiHtml = `
        <div class="kpis">
          <div class="kpi"><strong>Ingresos</strong><div>S/ ${clientesKPIs.totalIngresos.toLocaleString()}</div></div>
          <div class="kpi"><strong>Total Clientes</strong><div>${clientesKPIs.totalClientes}</div></div>
          <div class="kpi"><strong>Retención</strong><div>${clientesKPIs.tasaRetencion}%</div></div>
          <div class="kpi"><strong>Segmento Top</strong><div>${clientesKPIs.topSegment}</div></div>
        </div>`;
      tableHtml = `
        <table>
          <thead><tr><th>Segmento</th><th>%</th><th>Ingresos</th></tr></thead>
          <tbody>
            ${clientData.map(c => `<tr><td>${c.name}</td><td>${c.value}%</td><td>S/ ${c.amount.toLocaleString()}</td></tr>`).join('')}
          </tbody>
        </table>`;
    } else if (reportType === 'productos') {
      title = 'Productos Más Vendidos';
      kpiHtml = `
        <div class="kpis">
          <div class="kpi"><strong>Ingresos (Top)</strong><div>S/ ${productosKPIs.ingresos.toLocaleString()}</div></div>
          <div class="kpi"><strong>Unidades</strong><div>${productosKPIs.unidades}</div></div>
          <div class="kpi"><strong>Producto Top</strong><div>${productosKPIs.top}</div></div>
          <div class="kpi"><strong>Variedad</strong><div>${productosKPIs.variedad}</div></div>
        </div>`;
      tableHtml = `
        <table>
          <thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr></thead>
          <tbody>
            ${topProducts.map(p => `<tr><td>${p.producto}</td><td>${p.cantidad}</td><td>S/ ${p.ingresos.toLocaleString()}</td></tr>`).join('')}
          </tbody>
        </table>`;
    } else if (reportType === 'inventario') {
      title = 'Estado de Inventario';
      kpiHtml = `
        <div class="kpis">
          <div class="kpi"><strong>Items Críticos</strong><div>${inventarioKPIs.itemsCriticos}</div></div>
          <div class="kpi"><strong>Valor Total</strong><div>S/ ${inventarioKPIs.valorTotal.toLocaleString()}</div></div>
          <div class="kpi"><strong>Por Reponer</strong><div>${inventarioKPIs.porReponer}</div></div>
          <div class="kpi"><strong>Riesgo Promedio</strong><div>${inventarioKPIs.riesgoPromedio}%</div></div>
        </div>`;
      tableHtml = `
        <table>
          <thead><tr><th>Artículo</th><th>Stock</th><th>Mínimo</th><th>Valor</th></tr></thead>
          <tbody>
            ${criticalInventory.map(i => `<tr><td>${i.item}</td><td>${i.stock}</td><td>${i.minimo}</td><td>S/ ${i.valor.toLocaleString()}</td></tr>`).join('')}
          </tbody>
        </table>`;
    }
    w.document.write(`<html><head><title>${title}</title>${style}</head><body><h1>${title}</h1>${kpiHtml}${tableHtml}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.onafterprint = () => w.close();
  };

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
          onClick={exportCurrentReportCSV}
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

      {/* Vista dinámica por tipo de reporte */}
      {reportType === 'ventas' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ReportCard title="Ingresos Totales" value={currency(ventasKPIs.totalIngresos)} change={15.3} icon={DollarSign} color="green" />
            <ReportCard title="Órdenes Completadas" value={`${ventasKPIs.ordenes}`} change={8.2} icon={Package} color="blue" />
            <ReportCard title="Nuevos Clientes" value={`${ventasKPIs.nuevosClientes}`} change={-2.1} icon={Users} color="purple" />
            <ReportCard title="Productos Críticos" value={`${ventasKPIs.criticos}`} change={-25} icon={TrendingUp} color="yellow" />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Chart type="line" data={filteredSalesData} title="Evolución de Ventas" height={300} color="#1DD1E3" dataKey="value" nameKey="name" />
            <Chart type="pie" data={serviceData} title="Distribución por Servicios" height={300} dataKey="value" nameKey="name" />
          </div>

          {/* Detalle */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ventas por Mes (Tabla)</h3>
                <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => exportCSV('ventas_por_mes', filteredSalesData)} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mes</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSalesData.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{d.name}</td>
                        <td className="px-4 py-3 text-right font-medium">{currency(d.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Servicios vs Ingresos</h3>
              </div>
              <Chart type="bar" data={serviceData.map(s => ({ name: s.name, value: Math.round(s.value * (ventasKPIs.totalIngresos / 100)) }))} title="Participación de Servicios (estimada)" height={300} color="#34D399" dataKey="value" nameKey="name" />
            </Card>
          </div>
        </>
      )}

      {reportType === 'clientes' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ReportCard title="Ingresos por Clientes" value={currency(clientesKPIs.totalIngresos)} change={6.4} icon={DollarSign} color="green" />
            <ReportCard title="Total Clientes" value={`${clientesKPIs.totalClientes}`} change={1.2} icon={Users} color="blue" />
            <ReportCard title="Tasa de Retención" value={`${clientesKPIs.tasaRetencion}%`} change={0.8} icon={TrendingUp} color="purple" />
            <ReportCard title="Segmento Top" value={clientesKPIs.topSegment} change={0} icon={Package} color="yellow" />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Chart type="pie" data={clientData} title="Segmentación de Clientes" height={300} dataKey="value" nameKey="name" />
            <Chart type="bar" data={clientAmountBarData} title="Ingresos por Tipo de Cliente" height={300} color="#10B981" dataKey="value" nameKey="name" />
          </div>

          {/* Detalle */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Detalle de Segmentos</h3>
              <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => exportCSV('detalle_segmentos_clientes', clientData)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clientData.map((c, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="text-primary font-semibold">{c.value}%</span>
                  </div>
                  <div className="text-sm text-gray-600">Ingresos: <span className="font-semibold text-green-600">{currency(c.amount)}</span></div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${c.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {reportType === 'productos' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ReportCard title="Ingresos (Top)" value={currency(productosKPIs.ingresos)} change={9.2} icon={DollarSign} color="green" />
            <ReportCard title="Unidades Vendidas" value={`${productosKPIs.unidades}`} change={3.7} icon={Package} color="blue" />
            <ReportCard title="Producto Top" value={productosKPIs.top} change={0} icon={TrendingUp} color="purple" />
            <ReportCard title="Variedad" value={`${productosKPIs.variedad}`} change={0} icon={Package} color="yellow" />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Chart type="bar" data={topProducts.map(p => ({ name: p.producto, value: p.cantidad }))} title="Unidades por Producto" height={300} color="#3B82F6" dataKey="value" nameKey="name" />
            <Chart type="bar" data={productBarData} title="Ingresos por Producto" height={300} color="#6366F1" dataKey="value" nameKey="name" />
          </div>

          {/* Detalle */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Productos</h3>
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
                      <p className="text-sm text-gray-500">{product.cantidad} unidades • {currency(product.ingresos)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {reportType === 'inventario' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ReportCard title="Items Críticos" value={`${inventarioKPIs.itemsCriticos}`} change={-12} icon={Package} color="yellow" />
            <ReportCard title="Valor Total" value={currency(inventarioKPIs.valorTotal)} change={-4.1} icon={DollarSign} color="green" />
            <ReportCard title="Por Reponer" value={`${inventarioKPIs.porReponer}`} change={-8.3} icon={TrendingUp} color="purple" />
            <ReportCard title="Riesgo Promedio" value={`${inventarioKPIs.riesgoPromedio}%`} change={-2.7} icon={TrendingUp} color="blue" />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Chart type="bar" data={inventoryBarData} title="Stock de Artículos Críticos" height={300} color="#F59E0B" dataKey="value" nameKey="name" />
            <Chart type="bar" data={criticalInventory.map(i => ({ name: i.item, value: i.valor }))} title="Valor por Artículo" height={300} color="#EF4444" dataKey="value" nameKey="name" />
          </div>

          {/* Tabla detalle */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Inventario Crítico</h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
                <Button variant="outline" size="sm">Ver Inventario Completo</Button>
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
                      <td className="px-4 py-4"><div className="font-medium text-gray-900">{item.item}</div></td>
                      <td className="px-4 py-4 text-center"><span className="font-semibold text-red-600">{item.stock}</span></td>
                      <td className="px-4 py-4 text-center"><span className="text-gray-600">{item.minimo}</span></td>
                      <td className="px-4 py-4 text-center"><span className="font-medium">{currency(item.valor)}</span></td>
                      <td className="px-4 py-4 text-center"><span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Crítico</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Export Section */}
      <Card className="mt-8">
        <div className="text-center py-8">
          <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Exportar Reportes</h3>
          <p className="text-gray-600 mb-6">Descarga reportes detallados en diferentes formatos</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => exportPDF()}>
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={exportCurrentReportCSV}>
              Exportar Excel
            </Button>
            <Button onClick={() => setShowExportModal(true)}>
              Reporte Personalizado
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de exportación personalizada */}
      <ReportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleCustomExport}
        reportType={reportType}
      />
    </div>
  );
};

export default Reportes;