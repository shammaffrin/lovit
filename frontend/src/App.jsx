import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// User Pages
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import ProductDetail from "./Pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Wishlist from "./Pages/user/Wishlist";
import Contact from "./pages/user/Contact";
import Checkout from "./Pages/user/Checkout";
import OrderSuccess from "./Pages/user/OrderSuccess";
import MyOrders from "./Pages/user/MyOrders";


// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AProducts from "./Pages/Admin/Aproducts";
import AOrderDetails from "./Pages/Admin/AOrderDetails";
import AAddProduct from "./Pages/Admin/AAddProduct";
import AOrders from "./Pages/Admin/AOrders";
import AUsers from "./Pages/Admin/AUsers";
import AdminLayout from "./Pages/Admin/AdminLayout";

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

const App = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* ✅ Home (for logged-in users) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* User routes */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-orders"
  element={
    <ProtectedRoute>
      <MyOrders />
    </ProtectedRoute>
  }
/>


<Route
  path="/order-success/:id"
  element={
    <ProtectedRoute>
      <OrderSuccess />
    </ProtectedRoute>
  }
/>


          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AProducts />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AAddProduct />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AOrders />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route path="/admin/orders/:orderId" element={<AOrderDetails />} />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AUsers />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;
