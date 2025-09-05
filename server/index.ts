import express from "express";
import cors from "cors";

// Core middleware
import { authenticateToken, requireRole } from "./middleware/auth";
import {
  validateProductUpdate,
  productUpdateRateLimit,
  logProductUpdate
} from "./middleware/productValidation";

// Route handlers
import { getProducts as getPublicProducts } from "./routes/products";
import { createOrder, getOrder } from "./routes/orders";
import {
  getMenu,
  getProduct,
  getMenuStats,
  getSearchSuggestions
} from "./routes/public/menu";
import {
  login,
  getProfile,
  changePassword,
  logout
} from "./routes/auth";
import {
  getDashboardStats,
  getProducts,
  toggleProductStatus,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getPayments as getAdminPayments,
  verifyPayment as verifyAdminPayment,
  requestNewReceipt,
  getOrders as getAdminOrders,
  updateOrderStatus as updateAdminOrderStatus
} from "./routes/admin/simple-all";
import {
  reportError,
  getErrors,
  clearErrors,
  getErrorStats
} from "./routes/debug";

// Offer handlers
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  toggleOfferFeatured,
  getFeaturedOffers
} from "./routes/admin/simple-all.js";

// Database connection (imported only for health checks)
import { db } from "./database/connection";

const app = express();

// Core middleware setup
app.use(cors());
app.use(express.json());

// Database connection test (non-blocking)
const testDatabaseConnection = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('🔄 Continuing with mock data fallback mode');
  }
};

// Initialize database connection (non-blocking)
setImmediate(testDatabaseConnection);

// ===== PUBLIC ROUTES =====
app.get("/api/products", getPublicProducts);
app.post("/api/orders", createOrder);
app.get("/api/orders/:reference", getOrder);

// Menu routes
app.get("/api/menu", getMenu);
app.get("/api/menu/product/:id", getProduct);
app.get("/api/menu/stats", getMenuStats);
app.get("/api/menu/suggestions", getSearchSuggestions);

// Offer routes (public)
app.get("/api/offers/featured", getFeaturedOffers);

// ===== AUTH ROUTES =====
app.post("/api/auth/login", login);
app.get("/api/auth/profile", authenticateToken, getProfile);
app.put("/api/auth/change-password", authenticateToken, changePassword);
app.post("/api/auth/logout", authenticateToken, logout);

// ===== ADMIN ROUTES - UNIFIED =====

// Helper function for admin middleware composition
const adminAuth = (roles: string[]) => [
  authenticateToken,
  requireRole(roles)
];

// Dashboard
app.get("/api/admin/dashboard/stats", ...adminAuth(['super_admin', 'order_manager', 'content_manager']), getDashboardStats);

// Categories
app.get("/api/admin/categories", ...adminAuth(['super_admin', 'content_manager']), getCategories);

// Products
app.get("/api/admin/products", ...adminAuth(['super_admin', 'content_manager']), getProducts);
app.post("/api/admin/products", ...adminAuth(['super_admin', 'content_manager']), createProduct);
app.put("/api/admin/products/:id",
  ...adminAuth(['super_admin', 'content_manager']),
  productUpdateRateLimit(15, 60000),
  logProductUpdate,
  validateProductUpdate,
  updateProduct
);
app.delete("/api/admin/products/:id", ...adminAuth(['super_admin', 'content_manager']), deleteProduct);
app.put("/api/admin/products/:id/status", ...adminAuth(['super_admin', 'content_manager']), toggleProductStatus);

// Payments
app.get("/api/admin/payments", ...adminAuth(['super_admin', 'order_manager']), getAdminPayments);
app.put("/api/admin/payments/:paymentId/verify", ...adminAuth(['super_admin', 'order_manager']), verifyAdminPayment);
app.put("/api/admin/payments/:paymentId/request-new", ...adminAuth(['super_admin', 'order_manager']), requestNewReceipt);

// Orders
app.get("/api/admin/orders", ...adminAuth(['super_admin', 'order_manager']), getAdminOrders);
app.put("/api/admin/orders/:id/status", ...adminAuth(['super_admin', 'order_manager']), updateAdminOrderStatus);

// Offers
app.get("/api/admin/offers", ...adminAuth(['super_admin', 'content_manager']), getAllOffers);
app.get("/api/admin/offers/:id", ...adminAuth(['super_admin', 'content_manager']), getOfferById);
app.post("/api/admin/offers", ...adminAuth(['super_admin', 'content_manager']), createOffer);
app.put("/api/admin/offers/:id", ...adminAuth(['super_admin', 'content_manager']), updateOffer);
app.delete("/api/admin/offers/:id", ...adminAuth(['super_admin', 'content_manager']), deleteOffer);
app.put("/api/admin/offers/:id/status", ...adminAuth(['super_admin', 'content_manager']), toggleOfferStatus);
app.put("/api/admin/offers/:id/featured", ...adminAuth(['super_admin', 'content_manager']), toggleOfferFeatured);
app.get("/api/admin/offers/featured", ...adminAuth(['super_admin', 'content_manager']), getFeaturedOffers);

// Debug routes
app.post("/api/debug/error-report", reportError);
app.get("/api/debug/errors", getErrors);
app.delete("/api/debug/errors", clearErrors);
app.get("/api/debug/stats", getErrorStats);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Server factory function for Vite config
export const createServer = () => app;

// Default export for backward compatibility
export default app;