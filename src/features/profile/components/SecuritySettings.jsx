import React from 'react';
import ToggleSwitch from '@components/ui/ToggleSwitch/ToggleSwitch.jsx';

const SecuritySettings = ({ settings, onSettingChange }) => {
  const securityOptions = [
    {
      key: 'twoFactorAuth',
      title: 'Autenticación de Dos Factores',
      description: 'Añade una capa extra de seguridad a tu cuenta',
      icon: '🔐'
    },
    {
      key: 'passwordExpiration',
      title: 'Expiración de Contraseña',
      description: 'Requerir cambio de contraseña cada 90 días',
      icon: '⏰'
    },
    {
      key: 'loginNotifications',
      title: 'Notificaciones de Inicio de Sesión',
      description: 'Recibir alertas cuando alguien acceda a tu cuenta',
      icon: '📧'
    },
    {
      key: 'sessionTimeout',
      title: 'Tiempo de Sesión Automático',
      description: 'Cerrar sesión automáticamente después de 30 minutos de inactividad',
      icon: '⏱️'
    }
  ];

  const handleToggle = (key, value) => {
    if (onSettingChange) {
      onSettingChange(key, value);
    }
  };

  return (
    <div className="space-y-6">
      {securityOptions.map((option) => (
        <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{option.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">{option.title}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          </div>
          <ToggleSwitch
            checked={settings[option.key] || false}
            onChange={(checked) => handleToggle(option.key, checked)}
          />
        </div>
      ))}
      
      {/* Información adicional de seguridad */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">💡 Consejos de Seguridad</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Usa contraseñas únicas y complejas</li>
          <li>• Habilita la autenticación de dos factores</li>
          <li>• Revisa regularmente los accesos a tu cuenta</li>
          <li>• No compartas tus credenciales con terceros</li>
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;