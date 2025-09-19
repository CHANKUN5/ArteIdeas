import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // 👈 Importamos Link
import logoImage from '../../assets/icono.png'; // Importar la imagen
import styles from "./Login.module.css";

const LoginForm = ({ onLogin, error, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onLogin(formData);
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h1 className={styles.welcomeTitle}>Bienvenido</h1>

        <div className={styles.logoContainer}>
          <img 
            src={logoImage} 
            alt="Logo FOT" 
            className={styles.formLogo} />
        </div>

        <div className={styles.brandText}>
          <span className={styles.brandArte}>ARTE</span>
          <span className={styles.brandIdeas}>IDEAS</span>
        </div>

        <p className={styles.subtitle}>DISEÑO CREATIVO</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
            placeholder="@gmail.com"
          />
          {errors.email && (
            <p className={styles.errorMessageField}>{errors.email}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Contraseña</label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${styles.passwordInput} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorMessageField}>{errors.password}</p>
          )}
        </div>

        <div className="text-right mb-3">
          <Link to="/enviar-codigo" className="text-blue-600 hover:underline text-sm">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;