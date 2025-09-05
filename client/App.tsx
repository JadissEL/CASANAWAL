import "./global.css";
import React from "react";
import { createRoot } from "react-dom/client";

// Core providers and utilities
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

// Error monitoring
import "@/lib/error-monitor";

// UI components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { DebugButton } from "@/components/ui/debug-button";

// Context providers
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider, RequireAuth } from "@/hooks/useAdminAuth";

// Public pages
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Offers from "./pages/Offers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentAccess from "./pages/PaymentAccess";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminProducts from "./pages/AdminProducts";
import AdminPayments from "./pages/AdminPayments";
import PaymentUpload from "./pages/PaymentUpload";

const queryClient = new QueryClient();

// Helper component for admin routes with role-based access
const AdminRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => (
  <RequireAuth roles={roles}>
    {children}
  </RequireAuth>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <CartProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/payment-access" element={<PaymentAccess />} />
              <Route path="/payment-upload/:orderReference" element={<PaymentUpload />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={<AdminRoute><AdminDashboard /></AdminRoute>}
              />
              <Route
                path="/admin/orders"
                element={<AdminRoute roles={['super_admin', 'order_manager']}><AdminOrders /></AdminRoute>}
              />
              <Route
                path="/admin/analytics"
                element={<AdminRoute roles={['super_admin', 'order_manager']}><AdminAnalytics /></AdminRoute>}
              />
              <Route
                path="/admin/products"
                element={<AdminRoute roles={['super_admin', 'content_manager']}><AdminProducts /></AdminRoute>}
              />
              <Route
                path="/admin/payments"
                element={<AdminRoute roles={['super_admin', 'order_manager']}><AdminPayments /></AdminRoute>}
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
          <DebugButton />
        </TooltipProvider>
      </CartProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
