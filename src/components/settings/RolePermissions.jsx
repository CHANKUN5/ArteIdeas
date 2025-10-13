import React from 'react';
import ToggleSwitch from '../common/ToggleSwitch';
import { Users, Shield, Settings, FileText, Camera, Calendar, DollarSign, BarChart } from 'lucide-react';

const RolePermissions = ({ 
  selectedRole, 
  onRoleChange, 
  permissions, 
  onPermissionChange, 
  onSave, 
  onReset, 
  loading 
}) => {
  const roles = ['admin', 'editor', 'viewer'];
  
  const modules = [
    { key: 'users', label: 'Gestión de Usuarios', icon: Users },
    { key: 'services', label: 'Servicios y Precios', icon: DollarSign },
    { key: 'gallery', label: 'Galería de Fotos', icon: Camera },
    { key: 'appointments', label: 'Citas y Reservas', icon: Calendar },
    { key: 'reports', label: 'Reportes y Estadísticas', icon: BarChart },
    { key: 'settings', label: 'Configuración del Sistema', icon: Settings },
    { key: 'security', label: 'Configuración de Seguridad', icon: Shield },
    { key: 'documents', label: 'Documentos y Facturas', icon: FileText }
  ];

  const sensitiveActions = [
    { key: 'delete_users', label: 'Eliminar Usuarios' },
    { key: 'modify_prices', label: 'Modificar Precios' },
    { key: 'access_reports', label: 'Acceder a Reportes Financieros' },
    { key: 'system_backup', label: 'Realizar Respaldos del Sistema' },
    { key: 'user_permissions', label: 'Modificar Permisos de Usuario' }
  ];

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      editor: 'Editor',
      viewer: 'Visualizador'
    };
    return labels[role] || role;
  };

  const getPermissionsSummary = () => {
    if (!permissions[selectedRole]) return 'Sin permisos configurados';
    
    const moduleCount = Object.values(permissions[selectedRole].modules || {}).filter(Boolean).length;
    const actionCount = Object.values(permissions[selectedRole].sensitiveActions || {}).filter(Boolean).length;
    
    return `${moduleCount} módulos, ${actionCount} acciones sensibles`;
  };

  const handleModuleChange = (moduleKey, value) => {
    if (onPermissionChange) {
      onPermissionChange(selectedRole, 'modules', moduleKey, value);
    }
  };

  const handleActionChange = (actionKey, value) => {
    if (onPermissionChange) {
      onPermissionChange(selectedRole, 'sensitiveActions', actionKey, value);
    }
  };

  const handleSavePermissions = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleResetPermissions = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Rol */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Seleccionar Rol para Configurar
        </label>
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {getRoleLabel(role)}
            </option>
          ))}
        </select>
      </div>

      {/* Resumen de Permisos */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-1">
          Permisos para {getRoleLabel(selectedRole)}
        </h4>
        <p className="text-sm text-blue-700">{getPermissionsSummary()}</p>
      </div>

      {/* Permisos de Módulos */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Acceso a Módulos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const isChecked = permissions[selectedRole]?.modules?.[module.key] || false;
            
            return (
              <div key={module.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{module.label}</span>
                </div>
                <ToggleSwitch
                  checked={isChecked}
                  onChange={(checked) => handleModuleChange(module.key, checked)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Acciones Sensibles */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Acciones Sensibles</h4>
        <div className="space-y-3">
          {sensitiveActions.map((action) => {
            const isChecked = permissions[selectedRole]?.sensitiveActions?.[action.key] || false;
            
            return (
              <div key={action.key} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </div>
                <ToggleSwitch
                  checked={isChecked}
                  onChange={(checked) => handleActionChange(action.key, checked)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Advertencia de Seguridad */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h5 className="font-medium text-yellow-900 mb-2">⚠️ Advertencia de Seguridad</h5>
        <p className="text-sm text-yellow-800">
          Las acciones sensibles pueden afectar la seguridad y funcionamiento del sistema. 
          Asigna estos permisos solo a usuarios de confianza.
        </p>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between">
        <button
          onClick={handleResetPermissions}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Restablecer por Defecto
        </button>
        
        <button
          onClick={handleSavePermissions}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </div>
          ) : (
            'Guardar Permisos'
          )}
        </button>
      </div>
    </div>
  );
};

export default RolePermissions;