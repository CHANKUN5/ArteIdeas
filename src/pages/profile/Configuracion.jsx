import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Palette, Database, Download, Upload, Globe, Sun, Users, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Configuracion = () => {
  const [settings, setSettings] = useState({
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: false
    },
    business: {
      companyName: 'Arte Ideas Diseño Gráfico',
      address: 'Av. Lima 123, San Juan de Lurigancho',
      phone: '987654321',
      email: 'info@arteideas.com',
      tax: '20123456789',
      currency: 'PEN'
    }
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      usuario: 'admin',
      rol: 'Administrador',
      estado: 'Activo',
      ultimoAcceso: '2024-03-20 15:30'
    }
  ]);

  const [services, setServices] = useState([
    {
      id: 1,
      servicio: 'Impresión Minilab',
      precioBase: 50.00,
      estado: 'Activo'
    }
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Simular guardado
    alert('Configuración guardada correctamente');
  };

  const SettingSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
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
    </div>
  );

  // Funciones para manejar usuarios
  const handleAddUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      ultimoAcceso: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setUsers([...users, newUser]);
    setShowUserModal(false);
  };

  const handleEditUser = (userData) => {
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, ...userData } : user
    ));
    setSelectedUser(null);
    setShowUserModal(false);
  };

  // Funciones para manejar servicios
  const handleAddService = (serviceData) => {
    const newService = {
      id: services.length + 1,
      ...serviceData,
      estado: 'Activo'
    };
    setServices([...services, newService]);
    setShowServiceModal(false);
  };

  const handleEditService = (serviceData) => {
    setServices(services.map(service => 
      service.id === selectedService.id ? { ...service, ...serviceData } : service
    ));
    setSelectedService(null);
    setShowServiceModal(false);
  };

  // Función para manejar eliminación
  const handleDelete = () => {
    if (deleteItem.type === 'user') {
      setUsers(users.filter(u => u.id !== deleteItem.item.id));
    } else if (deleteItem.type === 'service') {
      setServices(services.filter(s => s.id !== deleteItem.item.id));
    }
    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600">Personaliza tu experiencia en la plataforma</p>
          </div>
        </div>
        
        <Button onClick={handleSave}>
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gestión de Usuarios */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
            </div>
            <Button
              onClick={() => setShowUserModal(true)}
              icon={<Plus className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Nuevo Usuario
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.usuario}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.rol}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.ultimoAcceso}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteItem({ type: 'user', item: user });
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Servicios y Precios */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Servicios y Precios</h2>
            </div>
            <Button
              onClick={() => setShowServiceModal(true)}
              icon={<Plus className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Nuevo Servicio
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Base
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.servicio}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      S/{service.precioBase.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {service.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedService(service);
                            setShowServiceModal(true);
                          }}
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteItem({ type: 'service', item: service });
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Seguridad</h2>
          </div>
          
          <div className="space-y-4">
            <SettingSwitch
              checked={settings.security.twoFactor}
              onChange={(value) => handleSettingChange('security', 'twoFactor', value)}
              label="Autenticación de Dos Factores"
              description="Añade una capa extra de seguridad a tu cuenta"
            />
            

            <SettingSwitch
              checked={settings.security.passwordExpiry}
              onChange={(value) => handleSettingChange('security', 'passwordExpiry', value)}
              label="Expiración de Contraseña"
              description="Requerir cambio de contraseña cada 90 días"
            />
          </div>
        </Card>

        {/* Business Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Configuración del Negocio</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
              <input
                type="text"
                value={settings.business.companyName}
                onChange={(e) => handleSettingChange('business', 'companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input
                type="text"
                value={settings.business.address}
                onChange={(e) => handleSettingChange('business', 'address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={settings.business.phone}
                  onChange={(e) => handleSettingChange('business', 'phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.business.email}
                  onChange={(e) => handleSettingChange('business', 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RUC</label>
                <input
                  type="text"
                  value={settings.business.tax}
                  onChange={(e) => handleSettingChange('business', 'tax', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                <select
                  value={settings.business.currency}
                  onChange={(e) => handleSettingChange('business', 'currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="PEN">Soles (S/)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="mt-8">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Datos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <Download className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Exportar Datos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Descarga una copia de todos tus datos en formato JSON
            </p>
            <Button variant="outline" size="sm">
              Exportar Datos
            </Button>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Importar Datos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sube un archivo de respaldo para restaurar tus datos
            </p>
            <Button variant="outline" size="sm">
              Importar Datos
            </Button>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Zona de Peligro</h3>
          <p className="text-sm text-red-600 mb-4">
            Estas acciones son irreversibles. Procede con precaución.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
              Resetear Configuración
            </Button>
            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
              Eliminar Cuenta
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Usuario */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UserForm
          user={selectedUser}
          onSubmit={selectedUser ? handleEditUser : handleAddUser}
          onCancel={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      </Modal>

      {/* Modal de Servicio */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setSelectedService(null);
        }}
        title={selectedService ? 'Editar Servicio' : 'Nuevo Servicio'}
      >
        <ServiceForm
          service={selectedService}
          onSubmit={selectedService ? handleEditService : handleAddService}
          onCancel={() => {
            setShowServiceModal(false);
            setSelectedService(null);
          }}
        />
       </Modal>

       {/* Modal de Confirmación de Eliminación */}
       <Modal
         isOpen={showDeleteModal}
         onClose={() => {
           setShowDeleteModal(false);
           setDeleteItem(null);
         }}
         title="Confirmar Eliminación"
       >
         <div className="space-y-4">
           <div className="flex items-center space-x-3">
             <div className="flex-shrink-0">
               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                 <Trash2 className="w-5 h-5 text-red-600" />
               </div>
             </div>
             <div className="flex-1">
               <h3 className="text-lg font-medium text-gray-900">
                 ¿Estás seguro de eliminar este {deleteItem?.type === 'user' ? 'usuario' : 'servicio'}?
               </h3>
               <p className="text-sm text-gray-500">
                  {deleteItem?.type === 'user' 
                    ? `El usuario "${deleteItem?.item?.usuario}" será eliminado permanentemente.`
                    : `El servicio "${deleteItem?.item?.servicio}" será eliminado permanentemente.`
                  }
                </p>
             </div>
           </div>
           
           <div className="flex justify-end space-x-3 pt-4">
             <Button
               type="button"
               variant="outline"
               onClick={() => {
                 setShowDeleteModal(false);
                 setDeleteItem(null);
               }}
             >
               Cancelar
             </Button>
             <Button
               type="button"
               onClick={handleDelete}
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

// Componente de formulario para usuarios
const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    usuario: user?.usuario || '',
    rol: user?.rol || 'Usuario',
    estado: user?.estado || 'Activo'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        usuario: user.usuario,
        rol: user.rol,
        estado: user.estado
      });
    } else {
      setFormData({
        usuario: '',
        rol: 'Usuario',
        estado: 'Activo'
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de Usuario
        </label>
        <input
          type="text"
          value={formData.usuario}
          onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="Usuario">Usuario</option>
          <option value="Administrador">Administrador</option>
          <option value="Editor">Editor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {user ? 'Actualizar' : 'Crear'} Usuario
        </Button>
      </div>
    </form>
  );
};

// Componente de formulario para servicios
const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    servicio: service?.servicio || '',
    precioBase: service?.precioBase || 0,
    estado: service?.estado || 'Activo'
  });

  useEffect(() => {
    if (service) {
      setFormData({
        servicio: service.servicio,
        precioBase: service.precioBase,
        estado: service.estado
      });
    } else {
      setFormData({
        servicio: '',
        precioBase: 0,
        estado: 'Activo'
      });
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      precioBase: parseFloat(formData.precioBase)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Servicio
        </label>
        <input
          type="text"
          value={formData.servicio}
          onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Precio Base
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.precioBase}
          onChange={(e) => setFormData({ ...formData, precioBase: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {service ? 'Actualizar' : 'Crear'} Servicio
        </Button>
      </div>
    </form>
  );
};

export default Configuracion;