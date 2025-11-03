// Configuración de rutas
// Define listas de rutas públicas y protegidas con sus componentes

// Rutas públicas (autenticación)
import Login from '@features/auth/pages/Login.jsx';
import ChangePassword from '@features/auth/pages/ChangePassword.jsx';
import EnviarCodigo from '@features/auth/pages/EnviarCodigo.jsx';
import ValidarCodigo from '@features/auth/pages/ValidarCodigo.jsx';
import NuevaContrasena from '@features/auth/pages/NuevaContrasena.jsx';

// Rutas protegidas (aplicación)
import Dashboard from '@pages/dashboard/Dashboard.jsx';
import Agenda from '@pages/management/Agenda.jsx';
import Pedidos from '@pages/management/Pedidos.jsx';
import Clientes from '@features/clientes/pages/Clientes.jsx';
import Inventario from '@pages/management/Inventario.jsx';
import Activos from '@pages/management/Activos.jsx';
import Gastos from '@pages/management/Gastos.jsx';
import Produccion from '@pages/management/Produccion.jsx';
import Contratos from '@pages/management/Contratos.jsx';
import Reportes from '@pages/analytics/Reportes.jsx';
import MiPerfil from '@pages/profile/MiPerfil.jsx';
import Configuracion from '@pages/profile/Configuracion.jsx';

// Rutas de error
import NotFound from '@pages/NotFound/NotFound.jsx';
import ServerError from '@pages/ServerError/ServerError.jsx';
import Unauthorized from '@pages/Unauthorized/Unauthorized.jsx';
import NetworkError from '@pages/NetworkError/NetworkError.jsx';
import Maintenance from '@pages/Maintenance/Maintenance.jsx';

export const publicRoutes = [
  { path: '/login', Component: Login },
  { path: '/change-password', Component: ChangePassword },
  { path: '/enviar-codigo', Component: EnviarCodigo },
  { path: '/validar-codigo', Component: ValidarCodigo },
  { path: '/nueva-contrasena', Component: NuevaContrasena },
];

export const protectedRoutes = [
  { path: '/dashboard', Component: Dashboard },
  { path: '/agenda', Component: Agenda },
  { path: '/pedidos', Component: Pedidos },
  { path: '/clientes', Component: Clientes },
  { path: '/inventario', Component: Inventario },
  { path: '/activos', Component: Activos },
  { path: '/gastos', Component: Gastos },
  { path: '/produccion', Component: Produccion },
  { path: '/contratos', Component: Contratos },
  { path: '/reportes', Component: Reportes },
  { path: '/perfil', Component: MiPerfil },
  { path: '/configuracion', Component: Configuracion },
];

export const errorRoutes = [
  { path: '/error/500', Component: ServerError },
  { path: '/error/401', Component: Unauthorized },
  { path: '/error/network', Component: NetworkError },
  { path: '/maintenance', Component: Maintenance },
  { path: '*', Component: NotFound },
];