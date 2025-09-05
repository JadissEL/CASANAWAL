# 🛡️ Admin Panel Implementation Guide

## Overview

The CasaNawal admin panel provides a comprehensive management system for restaurant operations, featuring secure authentication, role-based access control, and intuitive interfaces for managing orders, content, and analytics.

## 🚀 Features Implemented

### 🔐 Authentication System
- **JWT-based authentication** with 24-hour token expiration
- **Secure password hashing** using bcrypt
- **Role-based access control** (Super Admin, Content Manager, Order Manager)
- **Permission-based authorization** for granular access control
- **Automatic token refresh** and session management

### 👥 User Roles

#### Super Admin (`super_admin`)
- Full system access
- User management
- System settings
- All content and order permissions
- Analytics and reporting

#### Content Manager (`content_manager`)
- Product management
- Category management
- Translation management
- Limited analytics access

#### Order Manager (`order_manager`)
- Order management
- Payment verification
- Customer communication
- Order analytics

### 📊 Dashboard Features
- **Real-time statistics** (orders, revenue, products)
- **Recent order overview** with status tracking
- **Quick action buttons** for common tasks
- **Analytics widgets** with key performance indicators
- **Responsive design** for mobile and desktop

### 🛍️ Order Management
- **Advanced filtering** by status, date, customer
- **Search functionality** across order details
- **Bulk operations** for efficiency
- **Status tracking** with visual indicators
- **Payment verification** tools
- **Export capabilities** for reporting

### 📦 Content Management
- **Product catalog** management
- **Category organization**
- **Multi-language support** (French/Arabic)
- **Image management**
- **Stock tracking**
- **Featured product selection**

## 🏗️ Technical Architecture

### Backend Components

#### Authentication Middleware (`server/middleware/auth.ts`)
```typescript
// JWT token verification
export const authenticateToken: RequestHandler
// Role-based access control
export const requireRole: (roles: string[]) => RequestHandler
// Permission-based access control
export const requirePermission: (permission: string) => RequestHandler
```

#### Auth Routes (`server/routes/auth.ts`)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get current user profile
- `POST /api/admin/auth/change-password` - Change password
- `POST /api/admin/auth/logout` - Logout (client-side)

#### Admin Routes (`server/routes/admin.ts`)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/orders/management` - Order management data
- `GET /api/admin/content/management` - Content management data
- `GET /api/admin/settings` - System settings
- `PUT /api/admin/settings/:key` - Update system setting
- `GET /api/admin/analytics` - Analytics data

### Frontend Components

#### Admin Layout (`client/components/ui/admin-layout.tsx`)
- **Responsive sidebar** navigation
- **User profile** dropdown
- **Notification system**
- **Role-based** menu filtering
- **Mobile-friendly** design

#### Authentication Hook (`client/hooks/useAdminAuth.tsx`)
```typescript
// Main authentication context
export function AdminAuthProvider({ children })
// Authentication hook
export function useAdminAuth(): AuthContextType
// Protected route component
export function RequireAuth({ children, roles? })
```

#### Dashboard Hook (`client/hooks/useAdminDashboard.tsx`)
```typescript
// Dashboard data fetching
export function useAdminDashboard()
// Order management data
export function useOrderManagement(filters?)
// Content management data
export function useContentManagement(filters?)
```

## 🔧 Setup Instructions

### 1. Database Setup
The admin panel requires the database to be properly configured:

```bash
# Run the complete database setup
npm run db:setup
```

This will:
- Create all database tables
- Seed menu data
- Create default admin users
- Configure system settings

### 2. Environment Configuration
Ensure your `.env` file includes:

```env
# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Default admin credentials
ADMIN_EMAIL=admin@casanawal.ma
ADMIN_PASSWORD=change_this_password
```

### 3. Default Admin Accounts

The system creates three default admin accounts:

#### Super Admin
- **Email:** `admin@casanawal.ma`
- **Password:** `Admin123!`
- **Access:** Full system control

#### Content Manager
- **Email:** `content@casanawal.ma`
- **Password:** `Content123!`
- **Access:** Product and content management

#### Order Manager
- **Email:** `orders@casanawal.ma`
- **Password:** `Orders123!`
- **Access:** Order and payment management

⚠️ **IMPORTANT:** Change these default passwords immediately in production!

## 🛡️ Security Features

### Authentication Security
- **JWT tokens** with configurable expiration
- **bcrypt password hashing** with salt rounds of 12
- **Automatic logout** on token expiration
- **CSRF protection** through SameSite cookies

### Authorization Security
- **Role-based access control** at route level
- **Permission-based** fine-grained access
- **Admin-only endpoints** protection
- **SQL injection prevention** through parameterized queries

### Data Security
- **Input validation** using Zod schemas
- **Sensitive data masking** in logs
- **Audit trails** for admin actions
- **Password complexity** requirements

## 📱 User Interface

### Design System
- **Consistent styling** with TailwindCSS
- **Moroccan-inspired** color palette
- **Responsive layout** for all screen sizes
- **Accessible components** following WCAG guidelines

### Key UI Components
- **Dashboard cards** with real-time data
- **Data tables** with sorting and filtering
- **Modal dialogs** for detailed actions
- **Status badges** with color coding
- **Loading states** and error handling

## 🔄 Data Flow

### Authentication Flow
1. Admin enters credentials on login page
2. Backend validates credentials and generates JWT
3. Frontend stores token and user data
4. Subsequent requests include Authorization header
5. Backend validates token on protected routes

### Order Management Flow
1. Admin accesses order management page
2. Frontend fetches filtered order data
3. Admin can update order status
4. Backend validates permissions and updates database
5. Real-time updates reflect in dashboard

## 📊 API Endpoints Summary

### Public Endpoints
- `POST /api/admin/auth/login` - Admin login

### Protected Endpoints (Requires Authentication)
- `GET /api/admin/auth/profile` - User profile
- `POST /api/admin/auth/change-password` - Change password
- `GET /api/admin/dashboard/stats` - Dashboard data

### Role-Protected Endpoints
- `GET /api/admin/orders/management` - Order Manager + Super Admin
- `GET /api/admin/content/management` - Content Manager + Super Admin
- `GET /api/admin/settings` - Super Admin only
- `GET /api/admin/analytics` - Order Manager + Super Admin

## 🚀 Future Enhancements

### Planned Features
- **Real-time notifications** for new orders
- **Advanced analytics** with charts and graphs
- **Bulk operations** for order processing
- **Customer communication** tools
- **Inventory management** integration
- **Report generation** and export
- **Admin activity logs** and audit trails
- **Two-factor authentication** (2FA)

### Integration Opportunities
- **SMS notifications** for order updates
- **Email marketing** integration
- **Payment gateway** webhooks
- **Delivery tracking** systems
- **Customer feedback** management

## 🔧 Troubleshooting

### Common Issues

#### Authentication Problems
```bash
# Check JWT secret configuration
echo $JWT_SECRET

# Verify database connection
npm run db:setup
```

#### Permission Errors
```sql
-- Check user roles in database
SELECT email, role, permissions FROM admin_users;
```

#### Database Connection Issues
```bash
# Test database connection
psql -h localhost -p 5432 -U casanawal_user -d casanawal_db
```

### Debugging Tips
- Check browser console for authentication errors
- Verify environment variables are loaded
- Ensure database is running and accessible
- Check server logs for detailed error messages

## 📞 Support

For technical support or questions about the admin panel:
- Review the implementation code in the respective files
- Check the database schema in `server/database/schema.sql`
- Refer to the API documentation in route files
- Test authentication flow with provided admin accounts

---

**✅ Admin Panel Status: FULLY IMPLEMENTED AND READY FOR USE**

The admin panel provides a complete management solution for CasaNawal operations with enterprise-level security, intuitive user interface, and comprehensive functionality for all administrative tasks.
