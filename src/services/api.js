import axios from 'axios';

// Crear una instancia de axios para configurar los headers
const api = axios.create({
  baseURL: 'TU HOST AQUI',  // Cambia por tu URL de la API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el token desde el localStorage
const getToken = () => {
  return localStorage.getItem('jwt_token');
};

// Interceptor para añadir el JWT a las cabeceras de las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
