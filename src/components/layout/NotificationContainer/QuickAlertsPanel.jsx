import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, Wrench, Truck, X, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '@context/AppContext';

const QuickAlertsPanel = () => {
  const { data } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [alerts, setAlerts] = useState({
    criticalStock: [],
    upcomingMaintenance: [],
    urgentDeliveries: []
  });

  // Generar alertas de stock crítico
  const generateStockAlerts = () => {
    if (!data.inventory || data.inventory.length === 0) {
      // Datos de ejemplo para demostración
      return [
        {
          id: 'stock-1',
          productName: 'Papel A4 80gr',
          currentStock: 2,
          minStock: 10,
          category: 'Papelería',
          priority: 'high'
        },
        {
          id: 'stock-2',
          productName: 'Tinta HP 803',
          currentStock: 1,
          minStock: 5,
          category: 'Insumos',
          priority: 'critical'
        },
        {
          id: 'stock-3',
          productName: 'Cartulina 200gr',
          currentStock: 3,
          minStock: 8,
          category: 'Materiales',
          priority: 'high'
        }
      ];
    }

    return data.inventory
      .filter(item => item.stock <= (item.minStock || 5))
      .map(item => ({
        id: `stock-${item.id}`,
        productName: item.name || item.nombre,
        currentStock: item.stock || item.cantidad,
        minStock: item.minStock || 5,
        category: item.category || item.categoria,
        priority: item.stock <= 2 ? 'critical' : 'high'
      }));
  };

  // Generar alertas de mantenimiento próximo
  const generateMaintenanceAlerts = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'maint-1',
        equipmentName: 'Impresora HP LaserJet',
        maintenanceDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        type: 'Preventivo',
        priority: 'high',
        description: 'Mantenimiento preventivo programado'
      },
      {
        id: 'maint-2',
        equipmentName: 'Plotter Canon',
        maintenanceDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        type: 'Calibración',
        priority: 'medium',
        description: 'Calibración de colores y precisión'
      },
      {
        id: 'maint-3',
        equipmentName: 'Cortadora Guillotina',
        maintenanceDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        type: 'Revisión',
        priority: 'critical',
        description: 'Revisión de seguridad y afilado'
      }
    ].filter(item => item.maintenanceDate <= nextWeek);
  };

  // Generar alertas de entregas urgentes
  const generateUrgentDeliveryAlerts = () => {
    const today = new Date();
    const next3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'delivery-1',
        orderNumber: 'PED-2024-001',
        clientName: 'Empresa ABC S.A.C.',
        deliveryDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        priority: 'critical',
        status: 'En producción',
        description: 'Entrega de 500 tarjetas de presentación'
      },
      {
        id: 'delivery-2',
        orderNumber: 'PED-2024-015',
        clientName: 'Restaurante El Buen Sabor',
        deliveryDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'Listo para entrega',
        description: 'Menús y cartas publicitarias'
      },
      {
        id: 'delivery-3',
        orderNumber: 'PED-2024-022',
        clientName: 'Farmacia San José',
        deliveryDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        priority: 'critical',
        status: 'Pendiente de aprobación',
        description: 'Banners promocionales y volantes'
      }
    ].filter(item => item.deliveryDate <= next3Days);
  };

  useEffect(() => {
    const stockAlerts = generateStockAlerts();
    const maintenanceAlerts = generateMaintenanceAlerts();
    const deliveryAlerts = generateUrgentDeliveryAlerts();

    setAlerts({
      criticalStock: stockAlerts,
      upcomingMaintenance: maintenanceAlerts,
      urgentDeliveries: deliveryAlerts
    });
  }, [data]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalAlerts = alerts.criticalStock.length + alerts.upcomingMaintenance.length + alerts.urgentDeliveries.length;

  if (totalAlerts === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Panel de Alertas Rápidas</h3>
          </div>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            {totalAlerts} alerta{totalAlerts !== 1 ? 's' : ''}
          </span>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded-md transition-colors">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Stock Crítico */}
          {alerts.criticalStock.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Package className="w-4 h-4 text-red-500" />
                <h4 className="font-medium text-gray-900">Stock Crítico</h4>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {alerts.criticalStock.length}
                </span>
              </div>
              <div className="space-y-2">
                {alerts.criticalStock.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getPriorityIcon(alert.priority)}
                          <span className="font-medium">{alert.productName}</span>
                        </div>
                        <p className="text-sm opacity-75">
                          Stock actual: <span className="font-semibold">{alert.currentStock}</span> | 
                          Mínimo: <span className="font-semibold">{alert.minStock}</span>
                        </p>
                        <p className="text-xs opacity-60">{alert.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mantenimientos Próximos */}
          {alerts.upcomingMaintenance.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Wrench className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium text-gray-900">Mantenimientos Próximos</h4>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {alerts.upcomingMaintenance.length}
                </span>
              </div>
              <div className="space-y-2">
                {alerts.upcomingMaintenance.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getPriorityIcon(alert.priority)}
                          <span className="font-medium">{alert.equipmentName}</span>
                        </div>
                        <p className="text-sm opacity-75">
                          {alert.type} - {formatDate(alert.maintenanceDate)} 
                          <span className="ml-2 text-xs">
                            ({getDaysUntil(alert.maintenanceDate)} día{getDaysUntil(alert.maintenanceDate) !== 1 ? 's' : ''})
                          </span>
                        </p>
                        <p className="text-xs opacity-60">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entregas Urgentes */}
          {alerts.urgentDeliveries.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="w-4 h-4 text-green-500" />
                <h4 className="font-medium text-gray-900">Entregas Urgentes</h4>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  {alerts.urgentDeliveries.length}
                </span>
              </div>
              <div className="space-y-2">
                {alerts.urgentDeliveries.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getPriorityIcon(alert.priority)}
                          <span className="font-medium">{alert.orderNumber}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{alert.status}</span>
                        </div>
                        <p className="text-sm opacity-75">
                          {alert.clientName} - {formatDate(alert.deliveryDate)}
                          <span className="ml-2 text-xs">
                            ({getDaysUntil(alert.deliveryDate)} día{getDaysUntil(alert.deliveryDate) !== 1 ? 's' : ''})
                          </span>
                        </p>
                        <p className="text-xs opacity-60">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickAlertsPanel;
