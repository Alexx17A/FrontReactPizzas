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
import AdminLayout from './components/AdminLayout';
import AuthRoute from './components/AuthRoute';
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminCarts from './pages/Admin/Carts';
import AdminAddresses from './pages/Admin/Addresses';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tienda" element={<StoreHome />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Registro" element={<RegistroUsuarios />} />

        {/* Protected Client Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/products" element={<Products />} />

        {/* Admin Routes - Protected with AuthRoute */}
        <Route path="/admin" element={
          <AuthRoute>
            <AdminLayout />
          </AuthRoute>
        }>
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="carts" element={<AdminCarts />} />
          <Route path="addresses" element={<AdminAddresses />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;