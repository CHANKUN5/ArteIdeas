import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Sidebar from "./components/common/Sidebar";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

// Importar componentes de páginas
import Reportes from "./pages/analytics/Reportes";
import Agenda from "./pages/management/Agenda";
import Activos from "./pages/management/Activos";
import Clientes from "./pages/management/Clientes";
import Contratos from "./pages/management/Contratos";
import Inventario from "./pages/management/Inventario";
import Pedidos from "./pages/management/Pedidos";
import Produccion from "./pages/management/Produccion";
import Configuracion from "./pages/profile/Configuracion";
import MiPerfil from "./pages/profile/MiPerfil";

// Importar NUEVAS vistas de autenticación
import ChangePassword from "./pages/auth/ChangePassword";
import EnviarCodigo from "./pages/auth/EnviarCodigo";
import NuevaContrasena from "./pages/auth/NuevaContrasena";
import ValidarCodigo from "./pages/auth/ValidarCodigo";

// Componente interno que maneja la lógica de autenticación
function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section) => {
    if (section === "logout") return;
    setActiveSection(section);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Cargando aplicación..." />
      </div>
    );
  }

  // Rutas de login y recuperación de contraseña
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/enviar-codigo" element={<EnviarCodigo />} />
        <Route path="/validar-codigo" element={<ValidarCodigo />} />
        <Route path="/nueva-contrasena" element={<NuevaContrasena />} />
        {/* Si intenta ir a otra ruta estando deslogueado, lo mando al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Rutas de la aplicación autenticada
  return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <div className="flex-1 flex flex-col lg:ml-100 h-screen">
          <Header
            onToggleSidebar={() => setSidebarOpen(true)}
            user={user}
            onSectionChange={handleSectionChange}
          />

          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="w-full">
              {activeSection === "dashboard" && <Dashboard onSectionChange={handleSectionChange} />}
              {activeSection === "agenda" && <Agenda />}
              {activeSection === "pedidos" && <Pedidos />}
              {activeSection === "clientes" && <Clientes />}
              {activeSection === "inventario" && <Inventario />}
              {activeSection === "activos" && <Activos />}
              {activeSection === "produccion" && <Produccion />}
              {activeSection === "contratos" && <Contratos />}
              {activeSection === "reportes" && <Reportes />}
              {activeSection === "perfil" && <MiPerfil />}
              {activeSection === "configuracion" && user?.role === 'admin' && <Configuracion />}
            </div>
          </main>
        </div>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
