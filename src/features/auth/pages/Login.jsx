import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/features/auth/components/AnimatedBackground.jsx';
import styles from '@/features/auth/components/Login.module.css';
import LoginForm from '@/features/auth/components/LoginForm.jsx';
import { useAuth } from '@context/AuthContext';

const Login = () => {
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    clearError();
    try {
      const result = await login(credentials);

      if (result.success) {
        if (result.requiresPasswordChange) {
          navigate(result.redirectTo, { state: { user: result.user } });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <AnimatedBackground />

      {/* 👇 Eliminamos header y footer, solo el formulario */}
      <div className={styles.centerWrapper}>
        <div className={styles.formWrapper}>
          <LoginForm onLogin={handleLogin} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Login;
