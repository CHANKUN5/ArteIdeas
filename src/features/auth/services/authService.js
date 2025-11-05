// Usuarios fijos del sistema
const FIXED_USERS = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@arteideas.com',
    password: 'admin123',
    role: 'admin',
    permissions: ['read:dashboard', 'write:orders', 'manage:clients', 'manage:users', 'access:configuration'],
  },
  {
    id: '2',
    name: 'Empleado',
    email: 'empleado@arteideas.com',
    password: 'empleado123',
    role: 'empleado',
    permissions: ['read:dashboard', 'write:orders', 'manage:clients'],
  }
];

// Función para obtener usuarios creados dinámicamente
const getCreatedUsers = () => {
  const users = localStorage.getItem('createdUsers');
  return users ? JSON.parse(users) : [];
};

// Función para guardar usuarios creados
const saveCreatedUsers = (users) => {
  localStorage.setItem('createdUsers', JSON.stringify(users));
};

// Función para obtener todos los usuarios (fijos + creados)
const getAllUsers = () => {
  return [...FIXED_USERS, ...getCreatedUsers()];
};

const authService = {
  login: async (credentials) => {
    if (!credentials.email || !credentials.password) {
      return { success: false, error: 'Por favor, completa todos los campos' };
    }

    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email === credentials.email);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Verificar si es un usuario nuevo (con contraseña predeterminada)
    if (user.isNewUser && credentials.password === '12345678') {
      // Marcar que necesita cambiar contraseña
      localStorage.setItem('tempUser', JSON.stringify(user));
      return { 
        success: true, 
        requiresPasswordChange: true, 
        redirectTo: '/enviar-codigo',
        user: user 
      };
    }

    // Verificar contraseña para usuarios normales
    if (user.password === credentials.password) {
      const { password, isNewUser, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', 'mock-token');
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Credenciales incorrectas' };
  },

  logout: async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { success: true };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updateProfile: async (profileData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return { success: false, error: 'No hay usuario autenticado' };
    }
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
  },

  changePassword: async (oldPassword, newPassword) => {
    // Simulación: Siempre exitoso para la maqueta
    return { success: true };
  },

  hasPermission: (permission) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.permissions?.includes(permission) || false;
  },

  hasRole: (role) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === role;
  },

  isAdmin: () => {
    return authService.hasRole('admin');
  },

  refreshToken: async () => {
    if (localStorage.getItem('token')) {
      return { success: true };
    }
    return { success: false, error: 'No hay token para renovar' };
  },

  // Función para crear nuevos usuarios (solo admin)
  createUser: async (userData) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'No tienes permisos para crear usuarios' };
    }

    const allUsers = getAllUsers();
    const existingUser = allUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      return { success: false, error: 'Ya existe un usuario con este email' };
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: '12345678', // Contraseña predeterminada
      role: userData.role || 'empleado',
      permissions: userData.role === 'admin' 
        ? ['read:dashboard', 'write:orders', 'manage:clients', 'manage:users', 'access:configuration']
        : ['read:dashboard', 'write:orders', 'manage:clients'],
      isNewUser: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    const createdUsers = getCreatedUsers();
    createdUsers.push(newUser);
    saveCreatedUsers(createdUsers);

    return { success: true, user: newUser };
  },

  // Función para obtener todos los usuarios (solo admin)
  getUsers: async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'No tienes permisos para ver usuarios' };
    }

    const allUsers = getAllUsers().map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return { success: true, users: allUsers };
  },

  // Función para enviar código de verificación (simulado)
  sendVerificationCode: async (email) => {
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    if (!tempUser || tempUser.email !== email) {
      return { success: false, error: 'Usuario no válido para verificación' };
    }

    // Código de verificación fijo para simulación
    const verificationCode = '123456';
    localStorage.setItem('verificationCode', verificationCode);
    localStorage.setItem('verificationEmail', email);
    
    console.log('Código de verificación simulado:', verificationCode); // Para desarrollo
    return { success: true, message: 'Código enviado exitosamente' };
  },

  // Función para validar código de verificación
  validateVerificationCode: async (email, code) => {
    const storedCode = localStorage.getItem('verificationCode');
    const storedEmail = localStorage.getItem('verificationEmail');
    
    if (!storedCode || !storedEmail) {
      return { success: false, error: 'No hay código de verificación activo' };
    }

    // Verificar que el email coincida
    if (email !== storedEmail) {
      return { success: false, error: 'Email no válido para verificación' };
    }

    if (code === storedCode) {
      return { success: true, email: email };
    }

    return { success: false, error: 'Código de verificación incorrecto' };
  },

  // Función para cambiar contraseña de usuario nuevo
  changeNewUserPassword: async (email, newPassword) => {
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const user = allUsers[userIndex];
    
    // Si es un usuario fijo, no se puede cambiar la contraseña de esta manera
    if (FIXED_USERS.find(u => u.email === email)) {
      return { success: false, error: 'No se puede cambiar la contraseña de usuarios del sistema' };
    }

    // Actualizar usuario creado
    const createdUsers = getCreatedUsers();
    const createdUserIndex = createdUsers.findIndex(u => u.email === email);
    
    if (createdUserIndex !== -1) {
      createdUsers[createdUserIndex] = {
        ...createdUsers[createdUserIndex],
        password: newPassword,
        isNewUser: false,
        passwordChangedAt: new Date().toISOString()
      };
      saveCreatedUsers(createdUsers);

      // Limpiar datos temporales
      localStorage.removeItem('tempUser');
      localStorage.removeItem('verificationCode');
      localStorage.removeItem('verificationEmail');

      return { success: true, message: 'Contraseña actualizada exitosamente' };
    }

    return { success: false, error: 'Error al actualizar contraseña' };
  },

  // Función para verificar si el usuario puede acceder a configuración
  canAccessConfiguration: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === 'admin';
  },
};

export default authService;