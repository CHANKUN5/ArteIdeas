import React, { useState, useEffect } from 'react';
import Card from '@components/ui/Card/Card.jsx';
import Button from '@components/ui/Button/Button.jsx';
import Modal from '@components/ui/Modal/Modal.jsx';
import { 
  Users, 
  Settings, 
  Plus, 
  UserCheck,
  Trash2,
  Save
} from 'lucide-react';
import authService from '@/features/auth/services/authService.js';
import { useApp } from '@context/AppContext.jsx';

// Importar componentes extraídos
import UserTable from '@components/tables/UserTable.jsx';
// Se removieron Servicios y Precios, y Seguridad según requerimiento
import BusinessConfig from '@/features/profile/components/BusinessConfig.jsx';
import RolePermissions from '@/features/profile/components/RolePermissions.jsx';
import UserForm from '@features/profile/components/UserForm.jsx';

const Configuracion = () => {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [selectedRole, setSelectedRole] = useState('admin');

  // Servicios de ejemplo
  const [services] = useState([
    { id: 1, name: 'Impresión Minilab', basePrice: 5.00, status: 'Activo' }
  ]);

  // Configuraciones de seguridad
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiration: true,
    loginNotifications: false,
    sessionTimeout: true
  });

  // Configuración del negocio
  const [businessConfig, setBusinessConfig] = useState({
    companyName: 'Arte Ideas Diseño Gráfico',
    address: 'Av. Lima 123, San Juan de Lurigancho',
    phone: '987654321',
    email: 'info@arte-ideas.com',
    ruc: '20123456789',
    currency: 'PEN'
  });

  // Estado de permisos simulados (coincide con la lista de la imagen)
  const [permissions, setPermissions] = useState({
    admin: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: true,
        clientes: true,
        inventario: true,
        activos: true,
        gastos: true,
        produccion: true,
        contratos: true,
        reportes: true
      },
      sensitiveActions: {
        view_costs: true,
        view_prices: true,
        view_margins: true,
        view_client_data: true,
        view_financial_data: true,
        edit_prices: true,
        delete_records: true
      }
    },
    ventas: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: true,
        clientes: true,
        inventario: false,
        activos: false,
        gastos: true,
        produccion: false,
        contratos: true,
        reportes: true
      },
      sensitiveActions: {
        view_costs: false,
        view_prices: true,
        view_margins: true,
        view_client_data: true,
        view_financial_data: true,
        edit_prices: true,
        delete_records: false
      }
    },
    produccion: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: true,
        clientes: false,
        inventario: true,
        activos: true,
        gastos: false,
        produccion: true,
        contratos: false,
        reportes: false
      },
      sensitiveActions: {
        view_costs: true,
        view_prices: false,
        view_margins: false,
        view_client_data: false,
        view_financial_data: false,
        edit_prices: false,
        delete_records: false
      }
    },
    operario: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: false,
        clientes: false,
        inventario: true,
        activos: true,
        gastos: false,
        produccion: true,
        contratos: false,
        reportes: false
      },
      sensitiveActions: {
        view_costs: false,
        view_prices: false,
        view_margins: false,
        view_client_data: false,
        view_financial_data: false,
        edit_prices: false,
        delete_records: false
      }
    }
  });

  // Valores por defecto de permisos (simulado) para cada rol
  const roleDefaults = {
    admin: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: true,
        clientes: true,
        inventario: true,
        activos: true,
        gastos: true,
        produccion: true,
        contratos: true,
        reportes: true
      },
      sensitiveActions: {
        view_costs: true,
        view_prices: true,
        view_margins: true,
        view_client_data: true,
        view_financial_data: true,
        edit_prices: true,
        delete_records: true
      }
    },
    ventas: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: true,
        clientes: true,
        inventario: false,
        activos: false,
        gastos: true,
        produccion: false,
        contratos: true,
        reportes: true
      },
      sensitiveActions: {
        view_costs: false,
        view_prices: true,
        view_margins: true,
        view_client_data: true,
        view_financial_data: true,
        edit_prices: true,
        delete_records: false
      }
    },
    produccion: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: true,
        clientes: false,
        inventario: true,
        activos: true,
        gastos: false,
        produccion: true,
        contratos: false,
        reportes: false
      },
      sensitiveActions: {
        view_costs: true,
        view_prices: false,
        view_margins: false,
        view_client_data: false,
        view_financial_data: false,
        edit_prices: false,
        delete_records: false
      }
    },
    operario: {
      modules: {
        dashboard: true,
        agenda: true,
        pedidos: false,
        clientes: false,
        inventario: true,
        activos: true,
        gastos: false,
        produccion: true,
        contratos: false,
        reportes: false
      },
      sensitiveActions: {
        view_costs: false,
        view_prices: false,
        view_margins: false,
        view_client_data: false,
        view_financial_data: false,
        edit_prices: false,
        delete_records: false
      }
    }
  };

  // Notificaciones
  const { showSuccess, showError } = useApp();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await authService.getUsers();
      if (result.success) {
        const formattedUsers = result.users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'Empleado',
          status: user.status || 'Activo'
        }));
        setUsers(formattedUsers);
      } else {
        showError('Error al cargar usuarios');
      }
    } catch (error) {
      showError('Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const result = await authService.createUser({
        ...userData,
        role: userData.role || 'Empleado',
        status: 'Activo'
      });
      if (result.success) {
        await loadUsers();
        setShowUserModal(false);
        showSuccess('Usuario creado exitosamente');
      } else {
        showError(result.message || 'Error al crear usuario');
      }
    } catch (error) {
      showError('Error al crear usuario');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  // Actualizar usuario (simulado) usando estado local
  const handleUpdateUser = (updatedData) => {
    try {
      setUsers(prev => prev.map(u => (
        u.id === editingUser?.id 
          ? { ...u, name: updatedData.name, email: updatedData.email, role: updatedData.role || u.role, status: updatedData.status || u.status }
          : u
      )));
      setShowUserModal(false);
      setEditingUser(null);
      showSuccess('Usuario actualizado exitosamente');
    } catch (error) {
      showError('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = (user) => {
    setDeleteItem({ type: 'usuario', item: user });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteItem?.type === 'usuario') {
      setUsers(users.filter(u => u.id !== deleteItem.item.id));
      showSuccess('Usuario eliminado exitosamente');
    }
    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  const handleBusinessConfigChange = (field, value) => {
    setBusinessConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBusinessConfig = () => {
    showSuccess('Configuración del negocio guardada exitosamente');
  };

  // Función para manejar cambio de rol (solo actualiza selección)
  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  // Función para manejar cambios de permisos individuales
  const handlePermissionChange = (roleKey, category, itemKey, value) => {
    setPermissions(prev => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        [category]: {
          ...prev[roleKey][category],
          [itemKey]: value
        }
      }
    }));
  };

  // Función para guardar permisos
  const handleSavePermissions = async () => {
    if (!selectedRole) {
      showError('Selecciona un rol para guardar los permisos');
      return;
    }

    try {
      // Aquí iría la lógica para guardar en el backend
      showSuccess(`Permisos para ${selectedRole} guardados exitosamente`);
    } catch (error) {
      showError('Error al guardar los permisos. Inténtalo de nuevo.');
    }
  };

  // Función para obtener resumen de permisos activos
  const getPermissionsSummary = () => {
    if (!selectedRole || !permissions[selectedRole]) return null;
    
    const activeModules = Object.entries(permissions[selectedRole].modules || {})
      .filter(([_, hasAccess]) => hasAccess)
      .length;
    
    const activeSensitive = Object.entries(permissions[selectedRole].sensitiveActions || {})
      .filter(([_, hasAccess]) => hasAccess)
      .length;
    
    return {
      role: selectedRole,
      activeModules,
      totalModules: Object.keys(permissions[selectedRole].modules || {}).length,
      activeSensitiveData: activeSensitive,
      totalSensitiveData: Object.keys(permissions[selectedRole].sensitiveActions || {}).length
    };
  };

  // Función para resetear permisos a valores por defecto del rol
  const resetPermissionsToDefault = () => {
    if (selectedRole && roleDefaults[selectedRole]) {
      setPermissions(prev => ({
        ...prev,
        [selectedRole]: roleDefaults[selectedRole]
      }));
      showSuccess(`Permisos restablecidos a los valores por defecto para ${selectedRole}`);
    }
  };

  // Función para manejar cambios en configuración de seguridad
  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Función para obtener etiquetas de módulos en español
  const getModuleLabel = (module) => {
    const labels = {
      dashboard: 'Dashboard',
      agenda: 'Agenda',
      pedidos: 'Pedidos',
      clientes: 'Clientes',
      inventario: 'Inventario',
      reportes: 'Reportes',
      configuracion: 'Configuración'
    };
    return labels[module] || module;
  };

  // Componente ToggleSwitch
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en la plataforma</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Guardar Cambios
        </Button>
      </div>

      {/* GRID 2x2: Distribución según imagen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FILA SUPERIOR IZQUIERDA: Gestión de Usuarios */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <Card.Title>Gestión de Usuarios</Card.Title>
                </div>
              </div>
              <Button
                onClick={() => {
                  setEditingUser(null);
                  setShowUserModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <UserTable
              users={users}
              loading={loadingUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </Card.Content>
        </Card>

      {/* Sección de Servicios y Precios eliminada */}

      {/* Sección de Seguridad eliminada */}

        {/* FILA INFERIOR DERECHA: Configuración del Negocio */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <Card.Title>Configuración del Negocio</Card.Title>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <BusinessConfig
              config={businessConfig}
              onChange={handleBusinessConfigChange}
              onSave={handleSaveBusinessConfig}
              loading={false}
            />
          </Card.Content>
        </Card>
      </div>

      {/* Roles y Permisos - Sección completa debajo del grid */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <Card.Title>Roles y Permisos</Card.Title>
                <p className="text-sm text-gray-600 mt-1">Configura los permisos para cada rol de usuario</p>
              </div>
            </div>
            <Button
              onClick={handleSavePermissions}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!selectedRole}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Permisos
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <RolePermissions
            selectedRole={selectedRole}
            permissions={permissions}
            onRoleChange={handleRoleChange}
            onPermissionChange={handlePermissionChange}
            onSave={handleSavePermissions}
            onReset={resetPermissionsToDefault}
            getPermissionsSummary={getPermissionsSummary}
          />
        </Card.Content>
      </Card>

      {/* Modal para Crear/Editar Usuario */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          onCancel={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¿Estás seguro de que quieres eliminar este {deleteItem?.type}?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Configuracion;