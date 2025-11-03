import React, { useState } from 'react';
import { User, Briefcase, Calendar, DollarSign, Building2, FileText } from 'lucide-react';
import Button from '@components/ui/Button/Button.jsx';

// Formulario reutilizable para Personal y Servicios
const GastosForm = ({ type = 'personal', data = null, onSubmit, onCancel }) => {
  const isPersonal = type === 'personal';

  // Estado inicial dinámico por tipo
  const [form, setForm] = useState(
    isPersonal
      ? {
          codigo: data?.codigo || '',
          nombre: data?.nombre || '',
          cargo: data?.cargo || '',
          salarioBase: data?.salarioBase ?? 0,
          bonificaciones: data?.bonificaciones ?? 0,
          descuentos: data?.descuentos ?? 0,
          fechaPago: data?.fechaPago || '',
          estado: data?.estado || 'Pendiente'
        }
      : {
          codigo: data?.codigo || '',
          tipo: data?.tipo || '',
          proveedor: data?.proveedor || '',
          monto: data?.monto ?? 0,
          fechaVenc: data?.fechaVenc || '',
          fechaPago: data?.fechaPago || '',
          estado: data?.estado || 'Pendiente',
          periodo: data?.periodo || ''
        }
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'monto' || name === 'salarioBase' || name === 'bonificaciones' || name === 'descuentos' ? Number(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.codigo.trim()) e.codigo = 'El código es requerido';
    if (isPersonal) {
      if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
      if (!form.cargo.trim()) e.cargo = 'El cargo es requerido';
      if (form.salarioBase < 0) e.salarioBase = 'Debe ser mayor o igual a 0';
      if (form.bonificaciones < 0) e.bonificaciones = 'Debe ser mayor o igual a 0';
      if (form.descuentos < 0) e.descuentos = 'Debe ser mayor o igual a 0';
    } else {
      if (!form.tipo.trim()) e.tipo = 'El tipo de servicio es requerido';
      if (!form.proveedor.trim()) e.proveedor = 'El proveedor es requerido';
      if (form.monto <= 0) e.monto = 'Debe ser mayor que 0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit(form);
      setLoading(false);
    }, 300);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {isPersonal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.codigo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="EMP001"
            />
            {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Nombre y apellidos"
              />
            </div>
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.cargo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Puesto"
              />
            </div>
            {errors.cargo && <p className="mt-1 text-sm text-red-600">{errors.cargo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salario Base *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="salarioBase"
                value={form.salarioBase}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.salarioBase ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.salarioBase && <p className="mt-1 text-sm text-red-600">{errors.salarioBase}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bonificaciones</label>
            <input
              type="number"
              name="bonificaciones"
              value={form.bonificaciones}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.bonificaciones ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descuentos</label>
            <input
              type="number"
              name="descuentos"
              value={form.descuentos}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.descuentos ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Pago</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="fechaPago"
                value={form.fechaPago}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option>Pendiente</option>
              <option>Pagado</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.codigo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="SRV001"
            />
            {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.tipo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Seleccionar</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Luz">Luz</option>
                <option value="Agua">Agua</option>
                <option value="Internet">Internet</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Gas">Gas</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="proveedor"
                value={form.proveedor}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.proveedor ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Proveedor"
              />
            </div>
            {errors.proveedor && <p className="mt-1 text-sm text-red-600">{errors.proveedor}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monto *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="monto"
                value={form.monto}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.monto ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="fechaVenc"
                value={form.fechaVenc}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Pago</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="fechaPago"
                value={form.fechaPago}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option>Pendiente</option>
              <option>Pagado</option>
              <option>Vencido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
            <input
              name="periodo"
              value={form.periodo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Enero 2025"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" loading={loading}>{data ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  );
};

export default GastosForm;

