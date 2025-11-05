import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, School, Calendar, DollarSign } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { createContrato, updateContrato } from '../../services/contratosService';
import clientesService from '../../features/clients/services/clientesService';

const ContratoForm = ({ contrato, onClose, onSave }) => {
  const { notifySuccess, notifyError } = useApp();
  const [loading, setLoading] = useState(false);
  
  const initialFormData = {
    id: '',
    tipo: 'particular',
    clienteId: '',
    clienteNombre: '',
    razonSocial: '',
    ruc: '',
    tipoContrato: 'Anual',
    valorTotal: 0,
    pagado: 0,
    saldo: 0,
    estado: 'activo',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    notas: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  // Si hay un contrato para editar, cargar sus datos
  useEffect(() => {
    if (contrato) {
      setFormData({
        ...initialFormData,
        ...contrato
      });
    }
  }, [contrato]);
  
  // Calcular saldo automáticamente
  useEffect(() => {
    const valorTotal = parseFloat(formData.valorTotal) || 0;
    const pagado = parseFloat(formData.pagado) || 0;
    const saldo = valorTotal - pagado;
    
    setFormData(prev => ({
      ...prev,
      saldo: saldo.toFixed(2)
    }));
  }, [formData.valorTotal, formData.pagado]);
  
  // Calcular fecha fin automáticamente basado en tipo de contrato
  useEffect(() => {
    if (formData.fechaInicio && formData.tipoContrato) {
      const fechaInicio = new Date(formData.fechaInicio);
      let fechaFin = new Date(fechaInicio);
      
      if (formData.tipoContrato === 'Anual') {
        fechaFin.setFullYear(fechaFin.getFullYear() + 1);
      } else if (formData.tipoContrato === 'Semestral') {
        fechaFin.setMonth(fechaFin.getMonth() + 6);
      } else if (formData.tipoContrato === 'Trimestral') {
        fechaFin.setMonth(fechaFin.getMonth() + 3);
      }
      
      setFormData(prev => ({
        ...prev,
        fechaFin: fechaFin.toISOString().split('T')[0]
      }));
    }
  }, [formData.fechaInicio, formData.tipoContrato]);
  
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
      if (contrato?.id) {
        // Actualizar contrato existente
        await updateContrato(contrato.id, formData);
        notifySuccess('Contrato actualizado correctamente');
      } else {
        // Crear nuevo contrato
        await createContrato(formData);
        notifySuccess('Contrato creado correctamente');
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar contrato:', error);
      notifyError('Error al guardar el contrato');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {contrato ? 'Editar Contrato' : 'Nuevo Contrato'}
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Tipo de cliente */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Tipo de Cliente</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo"
                value="particular"
                checked={formData.tipo === 'particular'}
                onChange={handleChange}
                className="mr-2"
              />
              Particular
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo"
                value="colegio"
                checked={formData.tipo === 'colegio'}
                onChange={handleChange}
                className="mr-2"
              />
              Colegio
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo"
                value="empresa"
                checked={formData.tipo === 'empresa'}
                onChange={handleChange}
                className="mr-2"
              />
              Empresa
            </label>
          </div>
        </div>
        
        {/* Datos del cliente según tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {formData.tipo === 'particular' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
              <input
                type="text"
                name="clienteNombre"
                value={formData.clienteNombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          
          {formData.tipo === 'colegio' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Colegio</label>
              <input
                type="text"
                name="clienteNombre"
                value={formData.clienteNombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          
          {formData.tipo === 'empresa' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Razón Social</label>
                <input
                  type="text"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
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
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Contrato</label>
            <select
              name="tipoContrato"
              value={formData.tipoContrato}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Anual">Anual</option>
              <option value="Semestral">Semestral</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Único">Único</option>
            </select>
          </div>
        </div>
        
        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              readOnly={formData.tipoContrato !== 'Único'}
            />
          </div>
        </div>
        
        {/* Información financiera */}
        <h3 className="text-lg font-medium mb-3">Información Financiera</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Valor Total (S/)</label>
            <input
              type="number"
              name="valorTotal"
              value={formData.valorTotal}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pagado (S/)</label>
            <input
              type="number"
              name="pagado"
              value={formData.pagado}
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
        
        {/* Estado */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="activo">Activo</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>
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
            {loading ? 'Guardando...' : contrato ? 'Actualizar Contrato' : 'Crear Contrato'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContratoForm;