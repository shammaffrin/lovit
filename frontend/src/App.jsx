import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./Pages/user/pagewrapper";
import ScrollToTop from "./Pages/user/ScrolltoTop";

// User Pages
import Home from "./pages/user/Home";
import Shop from "./Pages/user/Shop";
import ProductDetail from "./Pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Wishlist from "./Pages/user/Wishlist";
import Contact from "./pages/user/Contact";
import Checkout from "./Pages/user/Checkout";
import OrderSuccess from "./Pages/user/OrderSuccess";
import MyOrders from "./Pages/user/MyOrders";

// Auth Pages
import Login from "./Pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AProducts from "./Pages/Admin/Aproducts";
import AOrderDetails from "./Pages/Admin/AOrderDetails";
import AAddProduct from "./Pages/Admin/AAddProduct";
import AOrders from "./Pages/Admin/AOrders";
import AUsers from "./Pages/Admin/AUsers";
import AdminLayout from "./Pages/Admin/AdminLayout";
import EditProduct from "./Pages/Admin/Editproduct";

// Components
import Navbar from "./Components/Header";
import Footer from "./components/Footer";

// Protected route for logged-in users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Admin route protection
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user?.isAdmin) return <Navigate to="/login" replace />;
  return children;
};

// Layout wrapper (hide header/footer on admin pages)
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <LayoutWrapper>
      <AnimatePresence mode="wait">
        <PageWrapper key={location.pathname}>
          <Routes location={location} key={location.pathname}>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected user pages */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

            {/* Admin pages */}
            <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><AProducts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminLayout><EditProduct /></AdminLayout></AdminRoute>} />
            <Route path="/admin/add-product" element={<AdminRoute><AdminLayout><AAddProduct /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AOrders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminLayout><AOrderDetails /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AUsers /></AdminLayout></AdminRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </AnimatePresence>
    </LayoutWrapper>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;
