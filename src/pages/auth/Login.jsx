import logoImage from '../../assets/icono.png'; // Importar la imagen
import AnimatedBackground from '../../components/auth/AnimatedBackground';
import styles from '../../components/auth/Login.module.css';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login, error, loading, clearError } = useAuth();

  const handleLogin = async (credentials) => {
    clearError();

    try {
      const result = await login(credentials);

      if (result.success) {
        console.log('Login exitoso:', result.user);
      }
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <img
          src={logoImage} // Usar la imagen importada
          alt="Logo FOT"
          className={styles.headerLogo}
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftSection}>
          <AnimatedBackground />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formWrapper}>
            <LoginForm
              onLogin={handleLogin}
              error={error}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}></div>
    </div>
  );
};

export default Login;