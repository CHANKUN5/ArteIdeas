import { Eye, EyeOff, Key, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@components/ui/Button/Button.jsx';
import { useApp } from '@context/AppContext';
import { useAuth } from '@context/AuthContext';
import authService from '@/features/auth/services/authService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useApp();
  const { login } = useAuth();

  // Obtener datos del usuario desde el estado de navegación
  const userData = location.state?.user;

  const [step, setStep] = useState(1); // 1: Verificación, 2: Nueva contraseña
  const [loading, setLoading] = useState(false);
  
  // Estado para verificación
  const [verificationCode, setVerificationCode] = useState('');
  
  // Estado para nueva contraseña
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});

  // Redirigir si no hay datos del usuario
  if (!userData) {
    navigate('/');
    return null;
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await authService.validateVerificationCode(userData.email, verificationCode);
      
      if (result.success) {
        showSuccess('Código verificado correctamente');
        setStep(2);
      } else {
        setErrors({ verification: result.error });
      }
    } catch (error) {
      setErrors({ verification: 'Error al verificar el código' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validaciones
    const newErrors = {};
    
    if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await authService.changeNewUserPassword(
        userData.email, 
        passwordData.newPassword
      );
      
      if (result.success) {
        showSuccess('Contraseña actualizada correctamente. Iniciando sesión...');
        
        // Iniciar sesión automáticamente con las nuevas credenciales
        const loginResult = await login(userData.email, passwordData.newPassword);
        
        if (loginResult.success) {
          navigate('/dashboard');
        } else {
          showError('Error al iniciar sesión. Por favor, inicie sesión manualmente.');
          navigate('/login');
        }
      } else {
        setErrors({ password: result.error });
      }
    } catch (error) {
      setErrors({ password: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const result = await authService.sendVerificationCode(userData.email);
      if (result.success) {
        showSuccess('Código de verificación reenviado');
      } else {
        showError(result.error);
      }
    } catch (error) {
      showError('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 1 ? (
              <Shield className="w-8 h-8 text-primary" />
            ) : (
              <Key className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Verificación de Cuenta' : 'Nueva Contraseña'}
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? `Hemos enviado un código de verificación a ${userData.email}`
              : 'Crea una nueva contraseña segura para tu cuenta'
            }
          </p>
        </div>

        {/* Paso 1: Verificación */}
        {step === 1 && (
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center text-lg tracking-widest ${
                  errors.verification ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="000000"
                maxLength="6"
                required
              />
              {errors.verification && (
                <p className="mt-1 text-sm text-red-600">{errors.verification}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!verificationCode || verificationCode.length !== 6}
            >
              Verificar Código
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                disabled={loading}
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </form>
        )}

        {/* Paso 2: Nueva Contraseña */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-12 ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, newPassword: !showPasswords.newPassword })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-12 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Repite la contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirmPassword: !showPasswords.confirmPassword })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.password && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.password}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!passwordData.newPassword || !passwordData.confirmPassword}
            >
              <Lock className="w-4 h-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </form>
        )}

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ¿Necesitas ayuda? Contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;