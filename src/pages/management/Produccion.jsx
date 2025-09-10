import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Minus,
  Send,
  Utensils,
  Frame,
  Truck,
  GraduationCap,
  Wrench,
  Palette,
  Printer
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Produccion = () => {
  const [productions, setProductions] = useState([
    {
      id: '1',
      productoTerminado: 'Marco 30x40',
      materialesUsados: 'Madera, Vidrio',
      mermas: '0.5 cm',
      estadoEnvio: 'No enviado',
      selected: false
    },
    {
      id: '2',
      productoTerminado: 'Marco 20x30',
      materialesUsados: 'Madera, Vidrio',
      mermas: '0.3 cm',
      estadoEnvio: 'No enviado',
      selected: false
    },
    {
      id: '3',
      productoTerminado: 'Marco 40x50',
      materialesUsados: 'Madera, Vidrio',
      mermas: '0.7 cm',
      estadoEnvio: 'No enviado',
      selected: false
    },
    {
      id: '4',
      productoTerminado: 'Marco 15x20',
      materialesUsados: 'Madera, Vidrio',
      mermas: '0.2 cm',
      estadoEnvio: 'No enviado',
      selected: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('Producción Interna');
  const [activeSubTab, setActiveSubTab] = useState('Recetas');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);

  // Configuración de pestañas principales
  const mainTabs = [
    { id: 'Producción Interna', label: 'Producción Interna', icon: Settings, color: 'bg-blue-600' },
    { id: 'Enmarcado', label: 'Enmarcado', icon: Frame, color: 'bg-green-600' },
    { id: 'Minilab', label: 'Minilab', icon: Truck, color: 'bg-orange-600' },
    { id: 'Recordatorios', label: 'Recordatorios', icon: GraduationCap, color: 'bg-purple-600' },
    { id: 'Retoque Digital', label: 'Retoque Digital', icon: Wrench, color: 'bg-red-600' },
    { id: 'Pintura al Óleo', label: 'Pintura al Óleo', icon: Palette, color: 'bg-red-800' },
    { id: 'Edición Gráfica', label: 'Edición Gráfica', icon: Printer, color: 'bg-blue-800' }
  ];

  // Configuración de sub-pestañas
  const subTabs = {
    'Producción Interna': [
      { id: 'Recetas', label: 'Recetas' },
      { id: 'Productos Terminados', label: 'Productos Terminados' },
      { id: 'Control de Calidad', label: 'Control de Calidad' }
    ],
    'Enmarcado': [
      { id: 'Marcos', label: 'Marcos' },
      { id: 'Vidrios', label: 'Vidrios' },
      { id: 'Passe-partout', label: 'Passe-partout' }
    ],
    'Minilab': [
      { id: 'Impresión', label: 'Impresión' },
      { id: 'Revelado', label: 'Revelado' },
      { id: 'Acabados', label: 'Acabados' }
    ],
    'Recordatorios': [
      { id: 'Escolares', label: 'Escolares' },
      { id: 'Graduaciones', label: 'Graduaciones' },
      { id: 'Eventos', label: 'Eventos' }
    ],
    'Retoque Digital': [
      { id: 'Fotografía', label: 'Fotografía' },
      { id: 'Restauración', label: 'Restauración' },
      { id: 'Efectos', label: 'Efectos' }
    ],
    'Pintura al Óleo': [
      { id: 'Retratos', label: 'Retratos' },
      { id: 'Paisajes', label: 'Paisajes' },
      { id: 'Restauración', label: 'Restauración' }
    ],
    'Edición Gráfica': [
      { id: 'Diseño', label: 'Diseño' },
      { id: 'Maquetación', label: 'Maquetación' },
      { id: 'Impresión', label: 'Impresión' }
    ]
  };

  const handleSelectAll = () => {
    const allSelected = productions.every(prod => prod.selected);
    setProductions(productions.map(prod => ({ ...prod, selected: !allSelected })));
  };

  const handleSelectItem = (id) => {
    setProductions(productions.map(prod => 
      prod.id === id ? { ...prod, selected: !prod.selected } : prod
    ));
  };

  const handleSendSelected = () => {
    const selectedItems = productions.filter(prod => prod.selected);
    if (selectedItems.length > 0) {
      alert(`Enviando ${selectedItems.length} productos a Productos Terminados`);
      // Aquí iría la lógica para enviar a productos terminados
    }
  };

  const filteredProductions = productions.filter(production => {
    const matchesSearch = production.productoTerminado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         production.materialesUsados.toLowerCase().includes(searchTerm.toLowerCase());
    // Aquí se puede agregar lógica adicional para filtrar por sub-pestaña si es necesario
    return matchesSearch;
  });

  const selectedCount = productions.filter(prod => prod.selected).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producción</h1>
            <p className="text-sm text-gray-500">Seguimiento de trabajos en proceso</p>
          </div>
        </div>
      </div>

      {/* Pestañas principales */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setActiveSubTab(subTabs[tab.id]?.[0]?.id || '');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeMainTab === tab.id
                    ? `${tab.color} text-white shadow-sm`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeMainTab === tab.id && (
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white ml-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-pestañas */}
      {subTabs[activeMainTab] && (
        <div className="mb-6">
          <div className="flex space-x-1">
            {subTabs[activeMainTab].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSubTab === subTab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Título de la sección */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeMainTab} - {activeSubTab}
          </h2>
        </div>

        {/* Barra de acciones */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <Button
            onClick={() => setShowRecipeModal(true)}
            icon={<Utensils className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {activeSubTab === 'Recetas' ? 'Registrar Receta' : 
             activeSubTab === 'Productos Terminados' ? 'Agregar Producto' :
             activeSubTab === 'Control de Calidad' ? 'Nueva Inspección' :
             'Nuevo Item'}
          </Button>
          
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Buscar ${activeSubTab.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={productions.length > 0 && productions.every(prod => prod.selected)}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto Terminado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materiales Usados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mermas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Envío
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProductions.map((production) => (
                <tr key={production.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={production.selected}
                      onChange={() => handleSelectItem(production.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {production.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {production.productoTerminado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {production.materialesUsados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {production.mermas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProduction(production)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProduction(production)}
                        className="text-yellow-600 hover:bg-yellow-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                            setProductions(productions.filter(p => p.id !== production.id));
                          }
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Minus className="w-4 h-4" />}
                      className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                    >
                      Descontar
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {production.estadoEnvio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla con acciones y paginación */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSendSelected}
              disabled={selectedCount === 0}
              icon={<Send className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar seleccionados a Productos Terminados
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              disabled
              className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 bg-blue-100 rounded">
              Página 1 de 1
            </span>
            <button
              disabled
              className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal para registrar receta */}
      <Modal
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        title="Registrar Nueva Receta"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Producto Terminado</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Marco 30x40"
              />
            </div>
            <div>
              <label className="form-label">Materiales Usados</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Madera, Vidrio"
              />
            </div>
            <div>
              <label className="form-label">Mermas (cm)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: 0.5"
              />
            </div>
            <div>
              <label className="form-label">Cantidad</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="1"
              />
            </div>
          </div>

          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowRecipeModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              // Aquí iría la lógica para guardar la receta
              setShowRecipeModal(false);
            }}>
              Registrar Receta
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default Produccion;