import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pedidos from './pages/Pedidos';
import Products from './pages/Products';
import StoreHome from './pages/client/Index';
import ProductDetail from './pages/client/ProductDetail';
import Menu from './pages/client/Menu';
import AuthForm from './pages/client/AuthForm';
import Checkout from './pages/client/Checkout';
import RegistroUsuarios from './pages/RegistroUsuarios';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<Login />} />
        <Route path="/tienda" element={<StoreHome />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Registro" element={<RegistroUsuarios />} />
      </Routes>
    </Router>
  );
};

export default App;
