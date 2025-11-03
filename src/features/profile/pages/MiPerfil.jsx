import { AtSign, Camera, Edit, Key, Mail, MapPin, Phone, Save, Shield, User, X } from 'lucide-react';
import React, { useState } from 'react';
import Button from '@components/ui/Button/Button.jsx';
import Card from '@components/ui/Card/Card.jsx';
import Modal from '@components/ui/Modal/Modal.jsx';
import { useAuth } from '@context/AuthContext.jsx';

const MiPerfil = () => {
  const { user, updateProfileImage, updateProfile } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({ 
    name: user?.name || 'Elberc149',
    email: user?.email || 'elberc149@arteideas.com',
    telefono: user?.telefono || '987654321',
    direccion: user?.direccion || 'Av. Lima 123, San Juan de Lurigancho',
    biografia: user?.biografia || 'Fotógrafo profesional especializado en fotografía escolar y eventos. Con más de 10 años de experiencia en el sector.',
    profileImage: user?.profileImage || null
  });
  
  const fileInputRef = React.useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailData, setEmailData] = useState({
    currentPassword: '',
    newEmail: '',
    confirmEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Estado para controlar la alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' o 'error'

  const showNotification = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleEditToggle = () => {
    if (editMode) {
      setTempProfile({ 
        name: user?.name || 'Elberc149',
        email: user?.email || 'elberc149@arteideas.com',
        telefono: user?.telefono || '987654321',
        direccion: user?.direccion || 'Av. Lima 123, San Juan de Lurigancho',
        biografia: user?.biografia || 'Fotógrafo profesional especializado en fotografía escolar y eventos. Con más de 10 años de experiencia en el sector.',
        profileImage: user?.profileImage || null
      });
      setSelectedFile(null); // Limpiar el archivo seleccionado al cancelar la edición
    }
    setEditMode(!editMode);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!tempProfile.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!tempProfile.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(tempProfile.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!tempProfile.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateProfile()) {
      try {
        let imageUrl = tempProfile.profileImage;
        
        // Si hay un archivo seleccionado, actualizar la imagen primero
        if (selectedFile) {
          const imageResult = await updateProfileImage(selectedFile);
          if (imageResult.success) {
            imageUrl = imageResult.imageUrl;
          } else {
            showNotification('Error al actualizar la imagen de perfil', 'error');
            return;
          }
        }
        
        // Actualizar el perfil con todos los datos, incluyendo la imagen si se actualizó
        const profileData = {
          ...tempProfile,
          profileImage: imageUrl
        };
        
        const result = await updateProfile(profileData);
        if (result.success) {
          setEditMode(false);
          setSelectedFile(null); // Limpiar el archivo seleccionado
          showNotification('Perfil actualizado correctamente');
        } else {
          showNotification('Error al guardar: ' + result.error, 'error');
        }
      } catch (error) {
        showNotification('Error al guardar el perfil', 'error');
      }
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Contraseña actual requerida';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nueva contraseña requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mínimo 6 caracteres';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePassword()) {
      // Aquí iría la lógica para cambiar la contraseña
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setErrors({});
      showNotification('Contraseña actualizada correctamente');
    }
  };

  const handleEmailChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = () => {
    const newErrors = {};
    
    if (!emailData.currentPassword) {
      newErrors.currentPassword = 'Contraseña actual requerida';
    }
    
    if (!emailData.newEmail) {
      newErrors.newEmail = 'Nuevo email requerido';
    } else if (!/\S+@\S+\.\S+/.test(emailData.newEmail)) {
      newErrors.newEmail = 'Email inválido';
    }
    
    if (emailData.newEmail !== emailData.confirmEmail) {
      newErrors.confirmEmail = 'Los emails no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = () => {
    if (validateEmail()) {
      // Aquí iría la lógica para cambiar el email
      setEmailData({ currentPassword: '', newEmail: '', confirmEmail: '' });
      setShowEmailModal(false);
      setErrors({});
      showNotification('Email actualizado correctamente');
    }
  };
  
  // Función para manejar la selección de archivo de avatar
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Función para validar y procesar el archivo de imagen
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Formato de archivo no válido. Por favor, sube una imagen en formato JPG, PNG, GIF o WebP.', 'error');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      showNotification('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.', 'error');
      return;
    }
    
    setImageLoading(true);
    
    try {
      // Crear una URL temporal para la vista previa de la imagen
      const imageUrl = URL.createObjectURL(file);
      
      // Guardar el archivo para usarlo cuando se presione el botón guardar
      setSelectedFile(file);
      
      // Actualizar solo el estado temporal para mostrar la vista previa
      setTempProfile(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
      
    } catch (error) {
      showNotification('Error al procesar la imagen', 'error');
    } finally {
      setImageLoading(false);
      e.target.value = ''; // Resetear input
    }
  };

  const activityStats = [
    { label: 'Pedidos Procesados', value: '234', period: 'Este mes' },
    { label: 'Clientes Atendidos', value: '89', period: 'Este mes' },
    { label: 'Sesiones Realizadas', value: '45', period: 'Este mes' },
    { label: 'Horas Trabajadas', value: '180', period: 'Este mes' }
  ];

  const recentActivity = [
    { action: 'Creó pedido #234', time: 'Hace 2 horas', icon: 'pedido' },
    { action: 'Actualizó cliente María López', time: 'Hace 4 horas', icon: 'cliente' },
    { action: 'Completó sesión I.E. San Martín', time: 'Ayer', icon: 'sesion' },
    { action: 'Generó reporte mensual', time: '2 días', icon: 'reporte' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Alerta de notificación */}
      {showAlert && (
        <div className={`fixed top-5 right-5 z-50 flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px] transform transition-all duration-300 ease-in-out ${
          alertType === 'success' 
            ? 'bg-green-50 border-l-4 border-green-500 text-green-700' 
            : 'bg-red-50 border-l-4 border-red-500 text-red-700'
        }`}>
          <div className="flex items-center">
            <div className={`rounded-full p-1 mr-3 ${
              alertType === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
            }`}>
              {alertType === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">{alertMessage}</span>
          </div>
          <button 
            onClick={() => setShowAlert(false)}
            className={`ml-4 ${
              alertType === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              icon={<AtSign className="w-4 h-4" />}
              onClick={() => setShowEmailModal(true)}
            >
              Cambiar Email
            </Button>
            <Button 
              variant="outline"
              icon={<Key className="w-4 h-4" />}
              onClick={() => setShowPasswordModal(true)}
            >
              Cambiar Contraseña
            </Button>
          </div>
          {!editMode ? (
            <Button 
              icon={<Edit className="w-4 h-4" />}
              onClick={handleEditToggle}
            >
              Editar Perfil
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                icon={<X className="w-4 h-4" />}
                onClick={handleEditToggle}
              >
                Cancelar
              </Button>
              <Button 
                icon={<Save className="w-4 h-4" />}
                onClick={handleSave}
              >
                Guardar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                  {tempProfile.profileImage ? (
                    <img 
                      src={tempProfile.profileImage} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                  {imageLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                {editMode && (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                />
                <button 
                  onClick={handleAvatarClick}
                  disabled={imageLoading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </>
            )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Elberc149'}</h2>
                <p className="text-gray-600">{user?.role || 'Administrador'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Cuenta Verificada</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                {editMode ? (
                  <div>
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-3">{user?.name || 'Elberc149'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {editMode ? (
                  <div>
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 py-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user?.email || 'elberc149@arteideas.com'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                {editMode ? (
                  <div>
                    <input
                      type="tel"
                      value={tempProfile.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                        errors.telefono ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 py-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user?.telefono || '987654321'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <div className="flex items-center space-x-2 py-3">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{user?.rol || 'Administrador'}</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={tempProfile.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center space-x-2 py-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user?.direccion || 'Av. Lima 123, San Juan de Lurigancho'}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                {editMode ? (
                  <textarea
                    value={tempProfile.biografia}
                    onChange={(e) => handleInputChange('biografia', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Cuéntanos sobre ti y tu experiencia profesional..."
                  />
                ) : (
                  <p className="text-gray-900 py-3">{user?.biografia || 'Fotógrafo profesional especializado en fotografía escolar y eventos. Con más de 10 años de experiencia en el sector.'}</p>
                )}
              </div>
            </div>

            {!editMode && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha de Registro:</span>
                    <p className="font-medium">{user?.fechaRegistro || '2024-01-15'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Última Conexión:</span>
                    <p className="font-medium">{user?.ultimaConexion || '2025-06-09 14:30'}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              {activityStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-xs text-gray-400">{stat.period}</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setErrors({});
        }}
        title="Cambiar Contraseña"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu contraseña actual"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu nueva contraseña"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Confirma tu nueva contraseña"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <Modal.Footer>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowPasswordModal(false);
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setErrors({});
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handlePasswordSubmit}>
            Actualizar Contraseña
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Email Change Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setEmailData({ currentPassword: '', newEmail: '', confirmEmail: '' });
          setErrors({});
        }}
        title="Cambiar Email"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={emailData.currentPassword}
              onChange={(e) => handleEmailChange('currentPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu contraseña actual"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={emailData.newEmail}
                onChange={(e) => handleEmailChange('newEmail', e.target.value)}
                className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                  errors.newEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="nuevo@email.com"
              />
            </div>
            {errors.newEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.newEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nuevo Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={emailData.confirmEmail}
                onChange={(e) => handleEmailChange('confirmEmail', e.target.value)}
                className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                  errors.confirmEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirma tu nuevo email"
              />
            </div>
            {errors.confirmEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmEmail}</p>
            )}
          </div>
        </div>

        <Modal.Footer>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowEmailModal(false);
              setEmailData({ currentPassword: '', newEmail: '', confirmEmail: '' });
              setErrors({});
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleEmailSubmit}>
            Actualizar Email
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MiPerfil;