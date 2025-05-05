import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/stylesRegistroUsuarios.css';

const RegistroUsuarios = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  // Inicializar AOS
  React.useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quad',
      once: true,
      offset: 50
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Conexión con tu backend
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        username: formData.nombre,
        email: formData.email,
        password: formData.password,
       // telefono: formData.telefono pense que ibamos a ocupar el telefono XD pero ya vi que no
      });

      // Guardar token en localStorage
      localStorage.setItem('authToken', response.data.token);
      
      setRegistrationSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Error al registrar. Intenta nuevamente.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-card" data-aos="zoom-in">
        <div className="registro-header">
          <div className="pizza-icon" data-aos="fade-down" data-aos-delay="100">
            🍕
          </div>
          <h2 data-aos="fade-down" data-aos-delay="150">Crear Cuenta</h2>
          <p data-aos="fade-down" data-aos-delay="200">Únete a la familia TazzPizza <br/>y recibe grandes Descuentos % </p>
        </div>

        {registrationSuccess ? (
          <div className="registro-success" data-aos="fade-up">
            <div className="success-animation">✓</div>
            <h3>¡Registro exitoso!</h3>
            <p>Redirigiendo...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registro-form">
          <div className={`input-group ${errors.nombre ? 'error' : ''}`} data-aos="fade-up" data-aos-delay="250">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
              />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>

            <div className={`input-group ${errors.email ? 'error' : ''}`} data-aos="fade-up" data-aos-delay="300">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className={`input-group ${errors.password ? 'error' : ''}`} data-aos="fade-up" data-aos-delay="400">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña (mín. 6 caracteres)"
                required
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className={`input-group ${errors.confirmPassword ? 'error' : ''}`} data-aos="fade-up" data-aos-delay="450">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                required
              />
              {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
            </div>

            {errors.submit && (
              <div className="form-error" data-aos="fade-up">
                {errors.submit}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
              data-aos="fade-up"
              data-aos-delay="500"
            >
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : (
                'Registrarse'
              )}
            </button>

            <div className="login-link" data-aos="fade-up" data-aos-delay="550">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistroUsuarios;