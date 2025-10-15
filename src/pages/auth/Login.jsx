import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/auth/AnimatedBackground';
import styles from '../../components/auth/Login.module.css';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

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
          console.log('Login exitoso:', result.user);
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
