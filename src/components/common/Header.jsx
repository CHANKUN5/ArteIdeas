import React, { useState } from 'react';
import { Search, Bell, User, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar, user, onSectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  // Datos de ejemplo para la búsqueda
  const searchData = {
    clientes: [
      { id: 1, name: 'Juan Pérez', type: 'cliente', email: 'juan@email.com' },
      { id: 2, name: 'María López', type: 'cliente', email: 'maria@email.com' },
      { id: 3, name: 'Carlos Sánchez', type: 'cliente', email: 'carlos@email.com' }
    ],
    pedidos: [
      { id: 'P001', name: 'Pedido P001 - Impresión Minilab', type: 'pedido', cliente: 'Juan Pérez' },
      { id: 'P002', name: 'Pedido P002 - Enmarcado', type: 'pedido', cliente: 'María López' },
      { id: 'P003', name: 'Pedido P003 - Retoque', type: 'pedido', cliente: 'Carlos Sánchez' }
    ],
    inventario: [
      { id: 1, name: 'Moldura Clásica Negra', type: 'inventario', stock: 15 },
      { id: 2, name: 'Vidrio 30x40', type: 'inventario', stock: 8 },
      { id: 3, name: 'Passe-partout Blanco', type: 'inventario', stock: 25 }
    ]
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(value.length > 0);
  };

  const handleResultClick = (item) => {
    setSearchTerm('');
    setShowSearchResults(false);
    
    // Redirigir según el tipo
    switch (item.type) {
      case 'cliente':
        navigate('/clientes');
        break;
      case 'pedido':
        navigate('/pedidos');
        break;
      case 'inventario':
        navigate('/inventario');
        break;
      default:
        break;
    }
  };

  const filteredResults = () => {
    if (!searchTerm) return [];
    
    const allResults = [
      ...searchData.clientes,
      ...searchData.pedidos,
      ...searchData.inventario
    ];
    
    return allResults.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cliente && item.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 5);
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between pr-6 pl-3 md:pl-4 lg:pl-0 shadow-sm">
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="h-0.5 w-6 bg-gray-600"></div>
            <div className="h-0.5 w-6 bg-gray-600"></div>
            <div className="h-0.5 w-6 bg-gray-600"></div>
          </div>
        </button>
        
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar clientes, pedidos, inventario..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Resultados de búsqueda */}
            {showSearchResults && filteredResults().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredResults().map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(item)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.email && <p className="text-sm text-gray-500">{item.email}</p>}
                        {item.cliente && <p className="text-sm text-gray-500">Cliente: {item.cliente}</p>}
                        {item.stock !== undefined && <p className="text-sm text-gray-500">Stock: {item.stock}</p>}
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => {
            // Simular notificaciones
            alert('Tienes 3 notificaciones nuevas:\n• Nuevo pedido de Juan Pérez\n• Stock bajo en Moldura Clásica\n• Cita programada para mañana');
          }}
          className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
        </button>
          
        <button 
          onClick={() => onSectionChange("configuracion")}
          className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </button>

        <hutton 
          onClick={()=>onSectionChange("perfil")}
          className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 transition"
        >
          <User className="w-4 h-4 text-white"/>
        </hutton>

        <div
          onClick={() => onSectionChange && onSectionChange('perfil')}
          className="flex items-center space-x-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Elberc149'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Administrador'}</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;