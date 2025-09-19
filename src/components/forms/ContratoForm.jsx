import React, { useState, useEffect } from "react";

export default function ContratoForm({ initialData = {}, onSubmit, onCancel, submitLabel = "Guardar" }) {
  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    monto: "",
    fecha: "",
    descripcion: "",
    ...initialData,
  });

  useEffect(() => {
  
    setFormData({
      nombre: "",
      cliente: "",
      monto: "",
      fecha: "",
      descripcion: "",
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">{initialData?.id ? "Editar contrato" : "Registrar contrato"}</h2>

      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Título / nombre del contrato"
        className="w-full p-2 border rounded-lg mb-3"
        required
      />

      <input
        name="cliente"
        value={formData.cliente}
        onChange={handleChange}
        placeholder="Cliente"
        className="w-full p-2 border rounded-lg mb-3"
      />

      <input
        name="monto"
        value={formData.monto}
        onChange={handleChange}
        placeholder="Monto (ej. 1500.00)"
        type="number"
        step="0.01"
        className="w-full p-2 border rounded-lg mb-3"
      />

      <input
        name="fecha"
        value={formData.fecha}
        onChange={handleChange}
        type="date"
        className="w-full p-2 border rounded-lg mb-3"
        required
      />

      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full p-2 border rounded-lg mb-4"
        rows={4}
      />

      <div className="flex gap-3">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          {submitLabel}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
