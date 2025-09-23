import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, FileText, Edit, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useApp } from '../../context/AppContext';

const PaymentHistory = ({ payments = [], onUpdatePayments, editable = true }) => {
  const { showSuccess, showError } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [newPayment, setNewPayment] = useState({
    fecha: '',
    monto: '',
    metodo: 'Efectivo',
    referencia: '',
    observaciones: ''
  });

  const paymentMethods = [
    'Efectivo',
    'Transferencia Bancaria',
    'Cheque',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'Yape',
    'Plin',
    'Otro'
  ];

  const handleAddPayment = () => {
    if (!newPayment.fecha || !newPayment.monto) return;
    
    const payment = {
      id: Date.now().toString(),
      ...newPayment,
      monto: parseFloat(newPayment.monto),
      fechaCreacion: new Date().toISOString()
    };
    
    onUpdatePayments([...payments, payment]);
    setNewPayment({
      fecha: '',
      monto: '',
      metodo: 'Efectivo',
      referencia: '',
      observaciones: ''
    });
    setShowAddModal(false);
    showSuccess('Pago agregado exitosamente');
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setNewPayment({
      fecha: payment.fecha,
      monto: payment.monto.toString(),
      metodo: payment.metodo,
      referencia: payment.referencia || '',
      observaciones: payment.observaciones || ''
    });
    setShowAddModal(true);
  };

  const handleUpdatePayment = () => {
    if (!editingPayment || !newPayment.fecha || !newPayment.monto) return;
    
    const updatedPayments = payments.map(p => 
      p.id === editingPayment.id 
        ? {
            ...p,
            ...newPayment,
            monto: parseFloat(newPayment.monto)
          }
        : p
    );
    
    onUpdatePayments(updatedPayments);
    setEditingPayment(null);
    setNewPayment({
      fecha: '',
      monto: '',
      metodo: 'Efectivo',
      referencia: '',
      observaciones: ''
    });
    setShowAddModal(false);
    showSuccess('Pago actualizado exitosamente');
  };

  const handleDeletePayment = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    setPaymentToDelete(payment);
    setShowDeleteDialog(true);
  };

  const confirmDeletePayment = () => {
    if (paymentToDelete) {
      const updatedPayments = payments.filter(p => p.id !== paymentToDelete.id);
      onUpdatePayments(updatedPayments);
      showSuccess('Pago eliminado exitosamente');
      setShowDeleteDialog(false);
      setPaymentToDelete(null);
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.monto, 0);

  return (
    <div className="space-y-4">
      {/* Header con total */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Historial de Pagos</h4>
          <p className="text-sm text-gray-500">
            Total pagado: <span className="font-semibold text-green-600">S/ {totalPaid.toLocaleString()}</span>
          </p>
        </div>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Agregar Pago
          </Button>
        )}
      </div>

      {/* Lista de pagos */}
      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      S/ {payment.monto.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{payment.metodo}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{payment.fecha}</span>
                    </div>
                    {payment.referencia && (
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{payment.referencia}</span>
                      </div>
                    )}
                  </div>
                  {payment.observaciones && (
                    <p className="text-sm text-gray-600 mt-1">{payment.observaciones}</p>
                  )}
                </div>
              </div>
              {editable && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => handleEditPayment(payment)}
                    className="text-blue-600 hover:bg-blue-50"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeletePayment(payment.id)}
                    className="text-red-600 hover:bg-red-50"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>No hay pagos registrados</p>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
              className="mt-2"
            >
              Agregar Primer Pago
            </Button>
          )}
        </div>
      )}

      {/* Modal para agregar/editar pago */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingPayment ? 'Editar Pago' : 'Agregar Pago'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newPayment.fecha}
                  onChange={(e) => setNewPayment({...newPayment, fecha: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPayment.monto}
                  onChange={(e) => setNewPayment({...newPayment, monto: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago
                </label>
                <select
                  value={newPayment.metodo}
                  onChange={(e) => setNewPayment({...newPayment, metodo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia/Comprobante
                </label>
                <input
                  type="text"
                  value={newPayment.referencia}
                  onChange={(e) => setNewPayment({...newPayment, referencia: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Número de operación, cheque, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={newPayment.observaciones}
                  onChange={(e) => setNewPayment({...newPayment, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPayment(null);
                  setNewPayment({
                    fecha: '',
                    monto: '',
                    metodo: 'Efectivo',
                    referencia: '',
                    observaciones: ''
                  });
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={editingPayment ? handleUpdatePayment : handleAddPayment}
                className="flex-1"
              >
                {editingPayment ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setPaymentToDelete(null);
        }}
        onConfirm={confirmDeletePayment}
        title="Eliminar Pago"
        message={`¿Estás seguro de que quieres eliminar este pago? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default PaymentHistory;
