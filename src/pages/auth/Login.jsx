import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/auth/AnimatedBackground';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  const { login, error, loading, clearError } = useAuth();

  const handleLogin = async (credentials) => {
    clearError();
    const result = await login(credentials);
    
    if (result.success) {
      // El AuthContext se encargará de actualizar el estado de autenticación
      // y la aplicación se re-renderizará automáticamente
      console.log('Login exitoso:', result.user);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md">
        <LoginForm 
          onLogin={handleLogin} 
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Login;