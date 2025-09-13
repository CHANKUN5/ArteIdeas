const authService = {
  login: async (credentials) => {
    // Acepta cualquier email y contraseña no vacíos
    if (credentials.email && credentials.password) {
      const user = {
        id: '1',
        name: 'Elber',
        email: credentials.email,
        role: 'admin',
        permissions: ['read:dashboard', 'write:orders', 'manage:clients'],
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token');
      return { success: true, user };
    }
    return { success: false, error: 'Por favor, completa todos los campos' };
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
};

export default authService;