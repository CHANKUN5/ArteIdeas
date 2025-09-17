import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings,
  FileText,
  BarChart3,
  User,
  LogOut,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/logo.png'; // Importamos la imagen del logo

const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const { logout } = useAuth();
  const menuSections = [
    {
      title: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'agenda', label: 'Agenda', icon: Calendar },
        { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
        { id: 'clientes', label: 'Clientes', icon: Users }
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { id: 'inventario', label: 'Inventario', icon: Package },
        { id: 'produccion', label: 'Producción', icon: Settings },
        { id: 'contratos', label: 'Contratos', icon: FileText }
      ]
    },
    {
      title: 'ANÁLISIS',
      items: [
        { id: 'reportes', label: 'Reportes', icon: BarChart3 }
      ]
    },
    {
      title: 'CUENTA',
      items: [
        { id: 'perfil', label: 'Mi Perfil', icon: User },
        { id: 'configuracion', label: 'Configuración', icon: Settings },
        { id: 'logout', label: 'Cerrar Sesión', icon: LogOut }
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 h-screen bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64 lg:w-64 lg:h-screen
      `}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Arte Ideas</h1>
              <p className="text-xs text-gray-500">Estudio Fotográfico</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Elberc149</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  const handleClick = () => {
                    if (item.id === 'logout') {
                      logout();
                    } else {
                      onSectionChange(item.id);
                    }
                  };

                  return (
                    <li key={item.id}>
                      <button
                        onClick={handleClick}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                          ${isActive 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;