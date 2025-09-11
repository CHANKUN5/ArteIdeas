import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Importar componentes de páginas
import Agenda from './pages/management/Agenda';
import Clientes from './pages/management/Clientes';
import Inventario from './pages/management/Inventario';
import Pedidos from './pages/management/Pedidos';
import Produccion from './pages/management/Produccion';
import Contratos from './pages/management/Contratos';
import Reportes from './pages/analytics/Reportes';
import MiPerfil from './pages/profile/MiPerfil';
import Configuracion from './pages/profile/Configuracion';

// Componente interno que maneja la lógica de autenticación
function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleSectionChange = (section) => {
    if (section === 'logout') {
      // El logout se maneja en el AuthContext
      return;
    }
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Cargando aplicación..." />
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Login />
      </div>
    );
  }

  // Si está autenticado, mostrar la aplicación principal
  return (
    <AppProvider>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        <div className="flex-1 flex flex-col lg:ml-100 h-screen"> {/* Añadido margen izquierdo para el sidebar */}
          <Header
            onToggleSidebar={() => setSidebarOpen(true)}
            user={user}
            onSectionChange={handleSectionChange}
          />
          
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="w-full">
              {activeSection === 'dashboard' && <Dashboard />}
              {activeSection === 'agenda' && <Agenda />}
              {activeSection === 'pedidos' && <Pedidos />}
              {activeSection === 'clientes' && <Clientes />}
              {activeSection === 'inventario' && <Inventario />}
              {activeSection === 'produccion' && <Produccion />}
              {activeSection === 'contratos' && <Contratos />}
              {activeSection === 'reportes' && <Reportes />}
              {activeSection === 'perfil' && <MiPerfil />}
              {activeSection === 'configuracion' && <Configuracion />}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;