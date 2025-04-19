import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css'; // Archivo CSS para el estilo personalizado
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Inicializamos AOS para animaciones
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lógica de autenticación (esto es solo un ejemplo)
    if (email === 'test@test.com' && password === '123456') {
      // Aquí debería ir la lógica de autenticación con la API y manejo del JWT
      localStorage.setItem('jwt_token', 'token_example'); // Guardar el token en localStorage
      navigate('/home');  // Redirigir a la página de inicio
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container" data-aos="fade-up">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Iniciar sesión</button>
        </form>
        <p className="signup-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
