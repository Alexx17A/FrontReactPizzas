import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin imports
import AdminHome from './pages/admin/Home';
import AdminPedidos from './pages/admin/Pedidos';
import AdminProducts from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Carts from './pages/admin/Carts';
import AdminLayout from './components/AdminLayout';

// Client/Store imports
import StoreHome from './pages/client/Index';
import ProductDetail from './pages/client/ProductDetail';
import Menu from './pages/client/Menu';
import Checkout from './pages/checkout/Checkout';
import PedidosUsuario from './pages/PedidosUsuario';

// Auth imports
import Login from './pages/Login';
import Register from './pages/Register';
import AuthForm from './pages/client/AuthForm';
import RegistroUsuarios from './pages/RegistroUsuarios';

// Public Pages
import SobreNosotros from './pages/SobreNosotros';

// Components and Providers
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/checkout/Layout';
import { AuthProvider } from './context/AuthContext';
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* ============= RUTAS DE AUTENTICACIÓN (SIN LAYOUT) ============= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/Registro" element={<RegistroUsuarios />} />


        {/* ============= RUTAS PROTEGIDAS DE LA TIENDA (CON LAYOUT Y PADDING) ============= */}
        <Route path="/" element={
          <ProtectedRoute requiredRole={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']}>
            <Layout withNavbarPadding={true}>
              <StoreHome />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/tienda" element={
          <ProtectedRoute requiredRole={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']}>
            <Layout withNavbarPadding={false}>
              <StoreHome />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/menu" element={
          <ProtectedRoute requiredRole={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']}>
            <Layout withNavbarPadding={true} navbarSolid={true}>
              <Menu />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute requiredRole={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']}>
            <Layout withNavbarPadding={true} navbarSolid={true}>
              <Checkout />
            </Layout>
          </ProtectedRoute>
        } />

  <Route path="/pedidosUsuario" element={<Layout withNavbarPadding={true} navbarSolid={true}><PedidosUsuario /></Layout>} />
        {/* ============= PRODUCT DETAIL (PROTEGIDO) ============= */}
        <Route path="/producto/:id" element={
          <ProtectedRoute requiredRole={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']}>
            <Layout withNavbarPadding={false}>
              <ProductDetail />
            </Layout>
          </ProtectedRoute>
        } />

        
        <Route path="/about" element={
          <Layout withNavbarPadding={true} navbarSolid={true}>
            <SobreNosotros />
          </Layout>
        } />

        {/* Rutas Admin agrupadas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['ROLE_ADMIN', 'ROLE_SELLER']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="carts" element={<Carts />} />
          <Route path="pedidos" element={<AdminPedidos />} />
        </Route>

        {/* ============= RUTA DE FALLBACK ============= */}
        <Route path="*" element={<Navigate to="/login" replace />} /> {/* Cambiado a /login */}
      </Routes>
    </AuthProvider>
  );
};

export default App;