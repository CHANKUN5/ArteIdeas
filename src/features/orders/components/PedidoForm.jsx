import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, School, Calendar, DollarSign, FileText, Clipboard } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { createPedido, updatePedido } from '../../services/pedidosService';
import produccionService from '../../services/produccionService';

const PedidoForm = ({ pedido, onClose, onSave }) => {
  const { notifySuccess, notifyError } = useApp();
  const [activeTab, setActiveTab] = useState('particular');
  const [loading, setLoading] = useState(false);
  
  const todayISO = new Date().toISOString().split("T")[0];
  const initialFormData = {
    // Datos comunes
    id: '',
    productoTipo: 'Particular',
    fechaPedido: todayISO,
    fechaCompromiso: '',
    costoEstimado: 0,
    precioVenta: 0,
    utilidad: 0,
    avance: 0,
    estado: 'Pendiente de confirmación',
    subestado: '',
    notas: '',
    
    // Datos de cliente particular
    cliente: '',
    telefono: '',
    email: '',
    direccion: '',
    
    // Datos de colegio
    nombreColegio: '',
    nivelEducativo: '',
    cantidadAlumnos: 0,
    contactoColegio: '',
    telefonoColegio: '',
    
    // Datos de empresa
    razonSocial: '',
    ruc: '',
    representante: '',
    telefonoEmpresa: '',
    emailEmpresa: '',
    
    // Datos de pago
    total: 0,
    aCuenta: 0,
    saldo: 0,
    
    // Relaciones
    contratoId: null,
    produccionId: null
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  // Si hay un pedido para editar, cargar sus datos
  useEffect(() => {
    if (pedido) {
      setFormData({
        ...initialFormData,
        ...pedido
      });
      
      // Determinar el tipo de cliente para activar la pestaña correcta
      if (pedido.productoTipo === 'Colegio') {
        setActiveTab('colegio');
      } else if (pedido.productoTipo === 'Empresa') {
        setActiveTab('empresa');
      } else {
        setActiveTab('particular');
      }
    }
  }, [pedido]);
  
  // Calcular utilidad y saldo automáticamente
  useEffect(() => {
    const precioVenta = parseFloat(formData.precioVenta) || 0;
    const costoEstimado = parseFloat(formData.costoEstimado) || 0;
    const total = parseFloat(formData.total) || 0;
    const aCuenta = parseFloat(formData.aCuenta) || 0;
    
    const utilidad = precioVenta - costoEstimado;
    const saldo = total - aCuenta;
    
    setFormData(prev => ({
      ...prev,
      utilidad: utilidad.toFixed(2),
      saldo: saldo.toFixed(2)
    }));
  }, [formData.precioVenta, formData.costoEstimado, formData.total, formData.aCuenta]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Preparar datos según el tipo de cliente
      const pedidoData = {
        ...formData,
        productoTipo: activeTab === 'particular' ? 'Particular' : 
                      activeTab === 'colegio' ? 'Colegio' : 'Empresa'
      };
      
      if (pedido?.id) {
        // Actualizar pedido existente
        const updatedPedido = await updatePedido(pedido.id, pedidoData);
        notifySuccess('Pedido actualizado correctamente');
        
        // Actualizar la orden de producción relacionada si existe
         if (updatedPedido.produccionId) {
           await produccionService.update(updatedPedido.produccionId, {
             cliente: updatedPedido.cliente || updatedPedido.nombreColegio || updatedPedido.razonSocial,
             fechaEntrega: updatedPedido.fechaCompromiso,
             estado: updatedPedido.estado
           });
         }
      } else {
        // Crear nuevo pedido
        const newPedido = await createPedido(pedidoData);
        notifySuccess('Pedido creado correctamente');
        
        // Crear orden de producción automáticamente
         const nuevaOrdenProduccion = await produccionService.create({
           pedidoId: newPedido.id,
           cliente: newPedido.cliente || newPedido.nombreColegio || newPedido.razonSocial,
           tipo: newPedido.productoTipo,
           descripcion: 'Orden generada automáticamente',
           fechaEntrega: newPedido.fechaCompromiso,
           estado: 'Pendiente',
           progreso: 0,
           observaciones: `Orden de producción generada desde pedido ${newPedido.id}`
         });
         
         // Actualizar el pedido con la referencia a la orden de producción
         await updatePedido(newPedido.id, { produccionId: nuevaOrdenProduccion.id });
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      notifyError('Error al guardar el pedido');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {pedido ? 'Editar Pedido' : 'Nuevo Pedido'}
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Pestañas para tipos de cliente */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'particular'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('particular')}
        >
          Particular
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'colegio'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('colegio')}
        >
          Colegio
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'empresa'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('empresa')}
        >
          Empresa
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Campos comunes para todos los tipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Pedido</label>
            <input
              type="date"
              name="fechaPedido"
              value={formData.fechaPedido}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Compromiso</label>
            <input
              type="date"
              name="fechaCompromiso"
              value={formData.fechaCompromiso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        {/* Campos específicos según el tipo de cliente */}
        {activeTab === 'particular' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'colegio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Colegio</label>
              <input
                type="text"
                name="nombreColegio"
                value={formData.nombreColegio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={activeTab === 'colegio'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nivel Educativo</label>
              <select
                name="nivelEducativo"
                value={formData.nivelEducativo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={activeTab === 'colegio'}
              >
                <option value="">Seleccionar nivel</option>
                <option value="Inicial">Inicial</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad de Alumnos</label>
              <input
                type="number"
                name="cantidadAlumnos"
                value={formData.cantidadAlumnos}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Persona de Contacto</label>
              <input
                type="text"
                name="contactoColegio"
                value={formData.contactoColegio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono de Contacto</label>
              <input
                type="text"
                name="telefonoColegio"
                value={formData.telefonoColegio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'empresa' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Razón Social</label>
              <input
                type="text"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={activeTab === 'empresa'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RUC</label>
              <input
                type="text"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={activeTab === 'empresa'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Representante</label>
              <input
                type="text"
                name="representante"
                value={formData.representante}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="telefonoEmpresa"
                value={formData.telefonoEmpresa}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="emailEmpresa"
                value={formData.emailEmpresa}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
        
        {/* Detalles del pedido */}
        <h3 className="text-lg font-medium mb-3">Detalles del Pedido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Costo Estimado (S/)</label>
            <input
              type="number"
              name="costoEstimado"
              value={formData.costoEstimado}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio de Venta (S/)</label>
            <input
              type="number"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Utilidad (S/)</label>
            <input
              type="number"
              name="utilidad"
              value={formData.utilidad}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
        </div>
        
        {/* Estado del pedido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Pendiente de confirmación">Pendiente de confirmación</option>
              <option value="En producción">En producción</option>
              <option value="Listo para entrega">Listo para entrega</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subestado</label>
            <select
              name="subestado"
              value={formData.subestado}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Ninguno</option>
              <option value="edición digital">Edición digital</option>
              <option value="impresión">Impresión</option>
              <option value="enmarcado">Enmarcado</option>
            </select>
          </div>
        </div>
        
        {/* Notas */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>
        
        {/* Información de pago */}
        <h3 className="text-lg font-medium mb-3">Información de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Total (S/)</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">A Cuenta (S/)</label>
            <input
              type="number"
              name="aCuenta"
              value={formData.aCuenta}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Saldo (S/)</label>
            <input
              type="number"
              name="saldo"
              value={formData.saldo}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : pedido ? 'Actualizar Pedido' : 'Crear Pedido'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;