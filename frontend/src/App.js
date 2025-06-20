import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/layout/home/MainLayout';
import Home from './pages/home/Home';
import NotFound from './pages/home/NotFound';
import About from './pages/home/About';
import Admin from './pages/admin/Index';
import Contact from './pages/home/Contact';
import Detail from './pages/home/Detail';
import Login from './pages/home/Login';
import Register from './pages/home/Register';
import Shop from './pages/home/Shop';
import ShoppingCart from './pages/home/ShoppingCart';
import ForgotPasswordPage from './pages/home/ForgotPasswordPage';
import ResetPasswordPage from './pages/home/ResetPasswordPage';
import ProfilePage from './pages/home/ProfilePage';
import { useScriptEffects } from './hooks/useScriptEffects';
import ListProduct from './pages/admin/Products/List';
import CreateProduct from './pages/admin/Products/Create';
import EditProduct from './pages/admin/Products/Edit';
import DetailProduct from './pages/admin/Products/Detail';
import ListCategory from './pages/admin/Categories/List';
import CreateCategory from './pages/admin/Categories/Create';
import EditCategory from './pages/admin/Categories/Edit';
import DetailCategory from './pages/admin/Categories/Detail';

function PrivateAdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  const isAdmin = user && Array.isArray(user.authorities) && user.authorities.some(a => a.authority === 'ROLE_ADMIN');
  if (!isAdmin) {
    return <NotFound />;
  }
  return children;
}

function App() {
  useScriptEffects();

  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={
            <MainLayout showBanner>
              <Home />
            </MainLayout>
          } />
          <Route path="/about-us" element={
            <MainLayout >
              <About />
            </MainLayout>
          } />
          
          <Route path="/contact-us" element={
            <MainLayout >
              <Contact />
            </MainLayout>
          } />
          <Route path="/login" element={
            <MainLayout>
              <Login />
            </MainLayout>
          } />
          <Route path="/register" element={
            <MainLayout>
              <Register />
            </MainLayout>
          } />
          <Route path="/forgot-password" element={
            <MainLayout>
              <ForgotPasswordPage />
            </MainLayout>
          } />
          <Route path="/reset-password" element={
            <MainLayout>
              <ResetPasswordPage />
            </MainLayout>
          } />
          <Route path="/profile" element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          } />
          <Route path="/shop/chi-tiet/:productId" element={
            <MainLayout>
              <Detail />
            </MainLayout>
          } />
          <Route path="/shop" element={
            <MainLayout>
              <Shop />
            </MainLayout>
          } />
          <Route path="/cart" element={
            <MainLayout>
              <ShoppingCart />
            </MainLayout>
          } />
            <Route path="/admin" element={<PrivateAdminRoute><Admin /></PrivateAdminRoute>} />
            <Route path="/admin/products" element={<PrivateAdminRoute><ListProduct /></PrivateAdminRoute>} />
            <Route path="/admin/products/create" element={<PrivateAdminRoute><CreateProduct /></PrivateAdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<PrivateAdminRoute><EditProduct /></PrivateAdminRoute>} />
            <Route path="/admin/products/:id" element={<PrivateAdminRoute><DetailProduct /></PrivateAdminRoute>} />
            <Route path="/admin/categories" element={<PrivateAdminRoute><ListCategory /></PrivateAdminRoute>} />
            <Route path="/admin/categories/create" element={<PrivateAdminRoute><CreateCategory /></PrivateAdminRoute>} />
            <Route path="/admin/categories/edit/:id" element={<PrivateAdminRoute><EditCategory /></PrivateAdminRoute>} />
            <Route path="/admin/categories/detail/:id" element={<PrivateAdminRoute><DetailCategory /></PrivateAdminRoute>} />
          <Route path="*" element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          } />
        </Routes>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
