import React from 'react';

const FormField = ({ fieldName, formData, setFormData, options = [], isRequired = false }) => {
  const fieldLabels = {
    name: 'Nombre de moldura',
    width: 'Ancho (pulgadas)',
    color: 'Color',
    material: 'Material',
    stock: 'Stock',
    price: 'Costo unitario (S/)',
    totalCost: 'Costo total (S/)',
    minStock: 'Stock mínimo',
    type: 'Tipo de Material',
    glassType: 'Tipo de Vidrio',
    thickness: 'Grosor (mm)',
    size: 'Tamaño (cm)',
    quantity: 'Cantidad',
    grosor: 'Grosor (mm)',
    format: 'Formato',
    paperType: 'Tipo de Papel',
    inkType: 'Tipo de Tinta',
    brand: 'Marca',
    laserType: 'Tipo de Láser',
    power: 'Potencia',
    pages: 'Páginas',
    cover: 'Tipo de Tapa',
    dimensions: 'Dimensiones'
  };

  const label = fieldLabels[fieldName] || fieldName;

  // Función para calcular el costo total automáticamente
  const calculateTotalCost = (newFormData) => {
    const price = parseFloat(newFormData.price) || 0;
    const quantity = parseInt(newFormData.quantity) || 0;
    const stock = parseInt(newFormData.stock) || 0;
    
    // Si tenemos precio y cantidad, calculamos con cantidad
    if (price > 0 && quantity > 0) {
      newFormData.totalCost = (price * quantity).toFixed(2);
    }
    // Si tenemos precio y stock (pero no cantidad), calculamos con stock
    else if (price > 0 && stock > 0 && !newFormData.quantity) {
      newFormData.totalCost = (price * stock).toFixed(2);
    }
    // Si solo tenemos precio, el total es igual al precio
    else if (price > 0) {
      newFormData.totalCost = price.toFixed(2);
    }
    // Si no hay precio, el total es 0
    else {
      newFormData.totalCost = '0.00';
    }
    
    return newFormData;
  };

  if (fieldName === 'totalCost') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="text"
          value={`S/ ${formData.totalCost || '0.00'}`}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
      </div>
    );
  }

  if (options.length > 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <select
          value={formData[fieldName] || ''}
          onChange={(e) => {
            let newFormData = { ...formData, [fieldName]: e.target.value };
            // Calcular costo total automáticamente si es un campo que afecta el precio
            if (['price', 'quantity', 'stock'].includes(fieldName)) {
              newFormData = calculateTotalCost(newFormData);
            }
            setFormData(newFormData);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required={isRequired}
        >
          <option value="">Seleccionar {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        type={fieldName === 'price' || fieldName === 'quantity' || fieldName === 'stock' || fieldName === 'minStock' ? 'number' : 'text'}
        step={fieldName === 'price' ? '0.01' : '1'}
        min={fieldName === 'price' || fieldName === 'quantity' || fieldName === 'stock' || fieldName === 'minStock' ? '0' : undefined}
        value={formData[fieldName] || ''}
        onChange={(e) => {
          let newFormData = { ...formData, [fieldName]: e.target.value };
          // Calcular costo total automáticamente si es un campo que afecta el precio
          if (['price', 'quantity', 'stock'].includes(fieldName)) {
            newFormData = calculateTotalCost(newFormData);
          }
          setFormData(newFormData);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        required={isRequired}
        placeholder={fieldName === 'dimensions' ? 'ej: 30x40cm' : ''}
      />
    </div>
  );
};

export default FormField;