import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ReportExportModal = ({ isOpen, onClose, onExport, reportType = 'general' }) => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [includeCharts, setIncludeCharts] = useState(false);
  const [dateRange, setDateRange] = useState('current');

  // Formatos disponibles - solo CSV y TXT por ahora
  const availableFormats = [
    {
      id: 'csv',
      name: 'CSV (Comma Separated Values)',
      description: 'Ideal para Excel y análisis de datos',
      icon: FileSpreadsheet,
      extension: '.csv'
    },
    {
      id: 'txt',
      name: 'TXT (Texto Plano)',
      description: 'Formato simple de texto',
      icon: FileText,
      extension: '.txt'
    }
  ];

  const handleExport = () => {
    const exportConfig = {
      format: selectedFormat,
      includeCharts,
      dateRange,
      reportType
    };
    
    onExport(exportConfig);
    onClose();
  };

  const resetForm = () => {
    setSelectedFormat('csv');
    setIncludeCharts(false);
    setDateRange('current');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Exportar Reporte Personalizado"
      size="md"
    >
      <div className="space-y-6">
        {/* Selección de formato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Formato de exportación
          </label>
          <div className="space-y-3">
            {availableFormats.map((format) => {
              const IconComponent = format.icon;
              return (
                <div
                  key={format.id}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFormat === format.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={selectedFormat === format.id}
                      onChange={() => setSelectedFormat(format.id)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{format.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {format.extension}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opciones adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Opciones adicionales
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeCharts"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="includeCharts" className="ml-2 text-sm text-gray-700">
                Incluir datos de gráficos (cuando sea posible)
              </label>
            </div>
          </div>
        </div>

        {/* Rango de datos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rango de datos
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="current">Datos actuales mostrados</option>
            <option value="all">Todos los datos disponibles</option>
            <option value="last30">Últimos 30 días</option>
            <option value="last90">Últimos 90 días</option>
          </select>
        </div>

        {/* Información del reporte */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Tipo de reporte: {reportType === 'ventas' ? 'Ventas' : 
                                 reportType === 'clientes' ? 'Clientes' : 
                                 reportType === 'productos' ? 'Productos' : 
                                 reportType === 'inventario' ? 'Inventario' : 'General'}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Se exportarán los datos correspondientes al tipo de reporte seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleClose}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          icon={<Download className="w-4 h-4" />}
        >
          Exportar {selectedFormat.toUpperCase()}
        </Button>
      </div>
    </Modal>
  );
};

export default ReportExportModal;