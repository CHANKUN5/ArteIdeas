import React, { useState } from 'react';
import { BrowserRouter as RouterDom, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { publicRoutes, protectedRoutes, errorRoutes } from './routes.config.js';

// Layout components (importando archivos directos, sin index.js)
import Sidebar from '@components/layout/Sidebar/Sidebar.jsx';
import Header from '@components/layout/Header/Header.jsx';
import NotificationContainer from '@components/layout/NotificationContainer/NotificationContainer.jsx';

// Fallback NotFound global
import NotFound from '@pages/NotFound/NotFound.jsx';

// Layout principal para rutas autenticadas
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mapa sección -> ruta y su inverso para determinar el activo
  const sectionToPath = {
    dashboard: '/dashboard',
    agenda: '/agenda',
    pedidos: '/pedidos',
    clientes: '/clientes',
    inventario: '/inventario',
    activos: '/activos',
    gastos: '/gastos',
    produccion: '/produccion',
    contratos: '/contratos',
    reportes: '/reportes',
    perfil: '/perfil',
    configuracion: '/configuracion',
  };

  const pathToSection = Object.fromEntries(
    Object.entries(sectionToPath).map(([section, path]) => [path, section])
  );

  const activeSection = pathToSection[location.pathname] || 'dashboard';

  const handleSectionChange = (section) => {
    const path = sectionToPath[section] || '/dashboard';
    navigate(path);
    setSidebarOpen(false);
  };

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
          onSectionChange={handleSectionChange}
        />

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>

        <NotificationContainer />
      </div>
    </div>
  );
};

const Router = () => {
  return (
    <RouterDom>
      <Routes>
        {/* Rutas públicas de autenticación */}
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {protectedRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          {/* Rutas de error dentro de la app */}
          {errorRoutes.filter(r => r.path !== '*').map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          {/* Fallback not found */}
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Fallback global */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouterDom>
  );
};

export default Router;