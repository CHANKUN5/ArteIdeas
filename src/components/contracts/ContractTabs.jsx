import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Package, 
  Settings, 
  Paperclip,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PaymentHistory from '../forms/PaymentHistory';
import ClausesTable from '../forms/ClausesTable';

const ContractTabs = ({ contract, onUpdateContract, editable = true }) => {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: FileText },
    { id: 'pagos', label: 'Pagos', icon: DollarSign },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pedidos', label: 'Pedidos', icon: Package },
    { id: 'produccion', label: 'Producción', icon: Settings },
    { id: 'documentos', label: 'Documentos', icon: Paperclip }
  ];

  const handleUpdatePayments = (payments) => {
    const totalPaid = payments.reduce((sum, payment) => sum + payment.monto, 0);
    onUpdateContract({
      ...contract,
      pagos: payments,
      pagado: totalPaid,
      porcentajePagado: contract.valor > 0 ? Math.round((totalPaid / contract.valor) * 100) : 0
    });
  };

  const handleUpdateClauses = (clauses) => {
    onUpdateContract({
      ...contract,
      clausulas: clauses.filter(c => c.trim() !== '')
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Cliente</label>
                  <p className="text-gray-900">{contract.cliente}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Servicio</label>
                  <p className="text-gray-900">{contract.servicio}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">{contract.tipo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Responsable</label>
                  <p className="text-gray-900">{contract.responsable}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Inicio</label>
                  <p className="text-gray-900">{contract.fechaInicio}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Fin</label>
                  <p className="text-gray-900">{contract.fechaFin}</p>
                </div>
              </div>
            </div>

            {/* Estado Financiero */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Estado Financiero</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">S/ {contract.valor.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Valor Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">S/ {contract.pagado.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Pagado ({contract.porcentajePagado}%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">S/ {(contract.valor - contract.pagado).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Saldo Pendiente</p>
                </div>
              </div>
            </div>

            {/* Datos de Ejecución */}
            {contract.estudiantes > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Datos de Ejecución</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estudiantes Contratados</label>
                    <p className="text-gray-900">{contract.estudiantes}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estudiantes Atendidos</label>
                    <p className="text-gray-900">{contract.estudiantesAtendidos || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Productos Incluidos</label>
                    <p className="text-gray-900">{contract.productosIncluidos || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Entrega Pactada</label>
                    <p className="text-gray-900">{contract.fechaEntregaPactada || 'No especificada'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cláusulas */}
            <ClausesTable 
              clauses={contract.clausulas || []} 
              onUpdateClauses={handleUpdateClauses}
              editable={editable}
            />

            {/* Observaciones */}
            {contract.observaciones && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
                <p className="text-gray-700">{contract.observaciones}</p>
              </div>
            )}
          </div>
        );

      case 'pagos':
        return (
          <PaymentHistory 
            payments={contract.pagos || []} 
            onUpdatePayments={handleUpdatePayments}
            editable={editable}
          />
        );

      case 'agenda':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sesiones Programadas</h3>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No hay sesiones programadas</p>
                <p className="text-sm">Las sesiones se crearán automáticamente según el calendario</p>
              </div>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Pedidos Derivados</h3>
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No hay pedidos derivados</p>
                <p className="text-sm">Los pedidos se crearán automáticamente desde este contrato</p>
              </div>
            </div>
          </div>
        );

      case 'produccion':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Producción Vinculada</h3>
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No hay producción vinculada</p>
                <p className="text-sm">La producción se vinculará automáticamente con este contrato</p>
              </div>
            </div>
          </div>
        );

      case 'documentos':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Documentos Adjuntos</h3>
              <div className="text-center py-8 text-gray-500">
                <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No hay documentos adjuntos</p>
                <p className="text-sm">Puedes adjuntar contratos firmados, facturas y otros documentos</p>
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

export default ContractTabs;
