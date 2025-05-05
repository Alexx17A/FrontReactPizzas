import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/signin',
        { username, password },
        { withCredentials: true }
      );

      // La respuesta trae al jwtToken en formato "CookieName=JWT; Path=..."
      const raw = response.data.jwtToken;
      // Extraemos sólo el JWT entre '=' y ';' PERO NO JALAAAAAA
      const jwt = raw.substring(raw.indexOf('=') + 1, raw.indexOf(';'));

      const roles = response.data.roles;

      if (jwt) {
        // Guardamos el JWT puro 
        localStorage.setItem('jwt_token', jwt);
        localStorage.setItem('username', response.data.username);

        if (roles.includes('ROLE_ADMIN')) {
          localStorage.setItem('userRole', 'ROLE_ADMIN');
          navigate('/home');
        } else if (roles.includes('ROLE_USER')) {
          localStorage.setItem('userRole', 'ROLE_USER');
          navigate('/tienda');
        } else {
          setError('No tienes un rol válido asignado.');
        }
      } else {
        setError('Error: Token no recibido');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.response?.data?.message || 'Credenciales incorrectas o error del servidor');
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
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>
        <p className="signup-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
