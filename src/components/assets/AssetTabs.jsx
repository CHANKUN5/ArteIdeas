import React, { useState } from 'react';
import { 
  Settings, 
  DollarSign, 
  Wrench, 
  Package, 
  Settings as ProductionIcon,
  TrendingUp,
  Calendar,
  Building,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import PaymentHistory from '../forms/PaymentHistory';
import MaintenanceHistory from '../forms/MaintenanceHistory';

const AssetTabs = ({ asset, onUpdateAsset, editable = true }) => {
  const [activeTab, setActiveTab] = useState('datos');

  const tabs = [
    { id: 'datos', label: 'Datos Principales', icon: Settings },
    { id: 'financiamiento', label: 'Financiamiento', icon: DollarSign },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: 'relaciones', label: 'Relaciones', icon: Package }
  ];

  const handleUpdateMaintenance = (maintenance) => {
    onUpdateAsset({
      ...asset,
      mantenimiento: maintenance
    });
  };

  const handleUpdateFinancing = (financing) => {
    onUpdateAsset({
      ...asset,
      financiamiento: financing
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'datos':
        return (
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900">{asset.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Categoría</label>
                  <p className="text-gray-900">{asset.categoria}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Proveedor</label>
                  <p className="text-gray-900">{asset.proveedor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Compra</label>
                  <p className="text-gray-900">{asset.fechaCompra}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ubicación</label>
                  <p className="text-gray-900">{asset.ubicacion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Responsable</label>
                  <p className="text-gray-900">{asset.responsable}</p>
                </div>
              </div>
            </div>

            {/* Estado Financiero */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Estado Financiero</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">S/ {asset.costo.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Costo Original</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">S/ {(asset.costo - asset.depreciacion).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Valor Actual</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{asset.roi}%</p>
                  <p className="text-sm text-gray-500">ROI</p>
                </div>
              </div>
            </div>

            {/* Información Técnica */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Información Técnica</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Vida Útil</label>
                  <p className="text-gray-900">{asset.vidaUtil} años</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Depreciación Anual</label>
                  <p className="text-gray-900">S/ {asset.depreciacion.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Costo Operativo Real</label>
                  <p className="text-gray-900">S/ {asset.costoOperativoReal.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    asset.estado === 'En Uso' ? 'bg-green-100 text-green-800' :
                    asset.estado === 'Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                    asset.estado === 'Fuera de Servicio' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financiamiento':
        return (
          <div className="space-y-6">
            {/* Resumen Financiero */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Entidad Financiera</label>
                  <p className="text-gray-900">{asset.financiamiento.entidad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    asset.financiamiento.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                    asset.financiamiento.estado === 'Pagado' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.financiamiento.estado}
                  </span>
                </div>
                {asset.financiamiento.entidad !== 'Contado' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Monto Financiado</label>
                      <p className="text-gray-900">S/ {asset.financiamiento.monto.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cuota Mensual</label>
                      <p className="text-gray-900">S/ {asset.financiamiento.cuotaMensual.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Número de Cuotas</label>
                      <p className="text-gray-900">{asset.financiamiento.cuotas}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fecha de Fin</label>
                      <p className="text-gray-900">{asset.financiamiento.fechaFin}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Historial de Pagos del Financiamiento */}
            {asset.financiamiento.entidad !== 'Contado' && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Historial de Pagos</h3>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No hay pagos registrados</p>
                  <p className="text-sm">Los pagos del financiamiento se registrarán aquí</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'mantenimiento':
        return (
          <MaintenanceHistory 
            maintenance={asset.mantenimiento} 
            onUpdateMaintenance={handleUpdateMaintenance}
            editable={editable}
          />
        );

      case 'relaciones':
        return (
          <div className="space-y-6">
            {/* Relación con Inventario */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Relación con Inventario
              </h3>
              <div className="space-y-2">
                {asset.relacionInventario && asset.relacionInventario.length > 0 ? (
                  asset.relacionInventario.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No hay elementos del inventario vinculados</p>
                    <p className="text-sm">Los insumos relacionados aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>

            {/* Relación con Producción */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ProductionIcon className="w-5 h-5 mr-2" />
                Relación con Producción
              </h3>
              <div className="space-y-2">
                {asset.relacionProduccion && asset.relacionProduccion.length > 0 ? (
                  asset.relacionProduccion.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                      <ProductionIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ProductionIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No hay producción vinculada</p>
                    <p className="text-sm">Los trabajos donde se usa este activo aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>

            {/* Análisis de ROI */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Análisis de ROI y Costos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ROI Actual</label>
                  <p className="text-2xl font-bold text-green-600">{asset.roi}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Costo Operativo Real</label>
                  <p className="text-2xl font-bold text-blue-600">S/ {asset.costoOperativoReal.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valor de Depreciación</label>
                  <p className="text-lg font-semibold text-gray-900">S/ {asset.depreciacion.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valor Actual</label>
                  <p className="text-lg font-semibold text-gray-900">S/ {(asset.costo - asset.depreciacion).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AssetTabs;
