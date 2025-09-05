# 🏗️ CasaNawal - Complete Architecture Documentation

## 📋 Project Overview

**CasaNawal** is a full-stack restaurant management system built with modern web technologies, featuring a client-facing menu/ordering system and an admin panel for business management.

### 🎯 Key Features
- **Client Portal**: Menu browsing, cart management, order placement
- **Admin Panel**: Product management, order tracking, payment verification
- **Real-time Updates**: Live order status and inventory management
- **Multi-language Support**: French/Arabic interface
- **Responsive Design**: Mobile-first approach
- **Database-driven**: PostgreSQL with comprehensive schema

---

## 🏛️ Architecture Overview

```
CasaNawal/
├── 📁 client/                 # React Frontend (SPA)
├── 📁 server/                 # Express.js Backend (API)
├── 📁 shared/                 # Shared TypeScript interfaces
├── 📁 docs/                   # Project documentation
├── 📁 dist/                   # Build outputs
├── 📁 public/                 # Static assets
└── 📁 netlify/               # Serverless functions
```

---

## 🎨 Frontend Architecture (Client)

### **Technology Stack**
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: TailwindCSS 3.4.11 + Framer Motion
- **UI Components**: Radix UI + Custom components
- **State Management**: React Context + Custom hooks
- **Routing**: React Router DOM 6.26.2
- **Forms**: React Hook Form + Zod validation

### **Directory Structure**
```
client/
├── 📁 components/
│   ├── 📁 ui/                 # Reusable UI components (Radix-based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   └── ... (62 files)
│   └── 📁 shared/             # Shared components
│       └── LoadingSpinner.tsx
├── 📁 pages/                  # Route components
│   ├── Index.tsx              # Home page
│   ├── Menu.tsx               # Menu display
│   ├── Cart.tsx               # Shopping cart
│   ├── Checkout.tsx           # Order checkout
│   ├── AdminDashboard.tsx     # Admin dashboard
│   ├── AdminProducts.tsx      # Product management
│   ├── AdminOrders.tsx        # Order management
│   └── ... (20 pages total)
├── 📁 hooks/                  # Custom React hooks
│   ├── useProducts.tsx        # Product data management
│   ├── useOrders.tsx          # Order operations
│   ├── useAdminAuth.tsx       # Admin authentication
│   ├── useAdminDashboard.tsx  # Admin dashboard data
│   └── ... (9 hooks total)
├── 📁 contexts/               # React Context providers
│   └── CartContext.tsx        # Shopping cart state
├── 📁 lib/                    # Utility libraries
│   ├── api.ts                 # API client functions
│   ├── utils.ts               # General utilities
│   ├── error-monitor.ts       # Error tracking
│   └── useLanguage.ts         # Internationalization
├── 📁 styles/                 # CSS organization
│   ├── base.css               # Base styles
│   ├── layout.css             # Layout components
│   └── components.css         # Component styles
├── 📁 data/                   # Static data (legacy)
│   └── dynamicOffers.ts       # Dynamic offers logic
├── App.tsx                    # Main application component
└── global.css                 # Global styles (minimal)
```

### **Key Design Patterns**

#### 1. **Component Architecture**
- **Atomic Design**: UI components follow atomic design principles
- **Composition**: Components are built using composition over inheritance
- **Props Interface**: Strongly typed props with TypeScript interfaces

#### 2. **State Management**
```typescript
// Context-based state management
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hooks for data fetching
const { data, loading, error, stableData } = useMenuData(filters);
```

#### 3. **Data Fetching Pattern**
- **Stable Data**: Prevents UI flickering during refetches
- **Loading States**: Comprehensive loading state management
- **Error Handling**: Graceful error handling with fallbacks

#### 4. **Responsive Design**
- **Mobile-first**: TailwindCSS responsive utilities
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Flexible Layouts**: CSS Grid and Flexbox

---

## 🔧 Backend Architecture (Server)

### **Technology Stack**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL 8.12.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: Zod 3.23.8
- **Email**: Nodemailer 6.9.8
- **Security**: bcryptjs 2.4.3

### **Directory Structure**
```
server/
├── 📁 database/
│   ├── 📁 migrations/         # Database schema migrations
│   │   ├── 001_initial_schema.ts
│   │   ├── 002_analytics_enhancement.ts
│   │   └── 003_payment_system.ts
│   ├── 📁 seeders/            # Database seeding scripts
│   │   ├── 001_seed_menu_data.ts
│   │   ├── 002_seed_admin_users.ts
│   │   └── 003_analytics_sample_data.ts
│   ├── 📁 models/             # Database models (future)
│   ├── connection.ts          # Database connection
│   ├── schema.sql             # Main schema
│   └── schema-v2-normalized.sql # Normalized schema
├── 📁 routes/
│   ├── 📁 admin/              # Admin API routes
│   │   ├── simple-all.ts      # Unified admin endpoints
│   │   ├── orders.ts          # Order management
│   │   └── payments.ts        # Payment management
│   ├── 📁 public/             # Public API routes
│   │   ├── menu.ts            # Menu data endpoints
│   │   ├── orders.ts          # Order creation
│   │   ├── customers.ts       # Customer management
│   │   └── utils.ts           # Public utilities
│   ├── auth.ts                # Authentication routes
│   ├── products.ts            # Product routes
│   ├── orders.ts              # Order routes
│   ├── payments.ts            # Payment routes
│   └── debug.ts               # Debug endpoints
├── 📁 middleware/
│   ├── auth.ts                # JWT authentication
│   ├── security.ts            # Security middleware
│   ├── performance.ts         # Performance optimization
│   └── productValidation.ts   # Product validation
├── 📁 services/
│   ├── emailService.ts        # Email functionality
│   ├── emailService-v2.ts     # Enhanced email service
│   └── workflowService.ts     # Business workflow
├── 📁 config/
│   └── scalability.ts         # Scalability configuration
├── 📁 scripts/                # Utility scripts
│   ├── setup-database.ts      # Database setup
│   ├── check-constraints.ts   # Constraint validation
│   └── ... (7 scripts total)
├── index.ts                   # Main server entry point
└── node-build.ts              # Build configuration
```

### **API Architecture**

#### 1. **RESTful Endpoints**
```
Public APIs:
├── GET    /api/menu                    # Get menu data
├── GET    /api/menu/product/:id        # Get product details
├── GET    /api/menu/stats              # Get menu statistics
├── GET    /api/menu/suggestions        # Search suggestions
├── POST   /api/orders                  # Create order
├── GET    /api/orders/:reference       # Get order status
└── GET    /api/products                # Get products

Admin APIs:
├── GET    /api/admin/simple-all/stats      # Dashboard stats
├── GET    /api/admin/simple-all/products   # Product management
├── POST   /api/admin/simple-all/products   # Create product
├── PUT    /api/admin/simple-all/products/:id # Update product
├── DELETE /api/admin/simple-all/products/:id # Delete product
├── GET    /api/admin/simple-all/orders      # Order management
├── PUT    /api/admin/simple-all/orders/:id/status # Update order
├── GET    /api/admin/simple-all/payments    # Payment management
└── PUT    /api/admin/simple-all/payments/:id/verify # Verify payment

Auth APIs:
├── POST   /api/auth/login              # Admin login
├── GET    /api/auth/profile            # Get profile
├── PUT    /api/auth/change-password    # Change password
└── POST   /api/auth/logout             # Logout
```

#### 2. **Middleware Stack**
```typescript
// Request flow
Request → CORS → JSON Parser → Authentication → Validation → Route Handler → Response
```

#### 3. **Database Schema**
```sql
-- Core tables
products (id, name, description, base_price, category_id, ...)
categories (id, slug, name, description, icon, ...)
orders (id, reference, customer_name, total_amount, status, ...)
order_items (id, order_id, product_id, quantity, price, ...)
payments (id, order_id, amount, method, status, ...)
admin_users (id, email, password_hash, role, ...)

-- Analytics tables
product_analytics (id, product_id, views, orders, revenue, ...)
order_analytics (id, order_id, created_at, completed_at, ...)
```

---

## 🔗 Shared Architecture

### **Type Definitions**
```typescript
// shared/api.ts - Core interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category_slug: string;
  // ... other properties
}

export interface MenuResponse {
  success: boolean;
  data: {
    products: Product[];
    categories: Category[];
    pagination: PaginationInfo;
  };
}
```

### **API Response Format**
```typescript
// Standard response format
{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## 🚀 Build & Deployment

### **Build Configuration**
```typescript
// vite.config.ts - Client build
export default defineConfig({
  server: { port: 8080 },
  build: { outDir: "dist/spa" },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": "./client",
      "@shared": "./shared"
    }
  }
});

// vite.config.server.ts - Server build
export default defineConfig({
  build: {
    outDir: "dist/server",
    rollupOptions: {
      input: "server/node-build.ts",
      output: { format: "es" }
    }
  }
});
```

### **Scripts**
```json
{
  "dev": "vite",                           // Development server
  "build": "npm run build:client && npm run build:server",
  "build:client": "vite build",            // Build client
  "build:server": "vite build --config vite.config.server.ts",
  "start": "node dist/server/node-build.mjs",
  "db:setup": "tsx server/scripts/setup-database.ts",
  "db:migrate": "tsx server/database/migrations/001_initial_schema.ts",
  "db:seed": "tsx server/database/seeders/001_seed_menu_data.ts"
}
```

---

## 🔒 Security Architecture

### **Authentication & Authorization**
- **JWT Tokens**: Stateless authentication
- **Role-based Access**: super_admin, order_manager, content_manager
- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Token-based with expiration

### **Security Middleware**
```typescript
// Security measures
- CORS configuration
- Rate limiting
- Input validation (Zod)
- SQL injection prevention
- XSS protection
- CSRF protection
```

### **Data Validation**
```typescript
// Zod schemas for validation
const productSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(2000),
  base_price: z.number().positive(),
  category_id: z.string().uuid()
});
```

---

## 📊 Database Architecture

### **Schema Design**
```sql
-- Normalized schema with relationships
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  is_vegetarian BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  prep_time_minutes INTEGER DEFAULT 15,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_sort ON products(sort_order);
```

### **Migration Strategy**
- **Versioned migrations**: Sequential migration files
- **Rollback support**: Reversible migrations
- **Data seeding**: Automated test data population
- **Schema validation**: Constraint checking

---

## 🎯 Performance Architecture

### **Frontend Optimization**
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations
- **Bundle Optimization**: Tree shaking and minification

### **Backend Optimization**
- **Database Indexing**: Strategic indexes for query performance
- **Connection Pooling**: Efficient database connections
- **Caching**: Response caching for static data
- **Compression**: Gzip compression for responses

### **API Performance**
```typescript
// Query optimization
const menuQuery = `
  SELECT p.*, c.name as category_name, c.slug as category_slug
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE p.is_active = true
  ORDER BY p.sort_order, p.name
`;
```

---

## 🔄 State Management Architecture

### **Client State**
```typescript
// Context-based state management
const CartContext = createContext<CartContextType>();

// Custom hooks for data fetching
const useMenuData = (filters: MenuFilters) => {
  const [data, setData] = useState<MenuResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ... implementation
};
```

### **Server State**
- **Database**: Single source of truth
- **Caching**: Redis (future implementation)
- **Session**: JWT tokens for stateless authentication

---

## 🧪 Testing Architecture

### **Testing Stack**
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **Component Testing**: React Testing Library (future)

### **Test Structure**
```
tests/
├── about-page.spec.ts
├── menu-page.spec.ts
└── offers-page.spec.ts
```

---

## 📱 Responsive Design Architecture

### **Breakpoint Strategy**
```css
/* TailwindCSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### **Mobile-First Approach**
- **Progressive Enhancement**: Start with mobile, enhance for larger screens
- **Touch-Friendly**: Large touch targets and gestures
- **Performance**: Optimized for mobile networks

---

## 🌐 Internationalization (i18n)

### **Language Support**
- **French**: Primary language
- **Arabic**: Secondary language (RTL support)
- **English**: Development language

### **Implementation**
```typescript
// Language switching
const { language, setLanguage } = useLanguage();

// RTL support
const isRTL = language === 'ar';
```

---

## 🔧 Development Workflow

### **Development Environment**
1. **Local Development**: `npm run dev`
2. **Database Setup**: `npm run db:setup`
3. **Data Seeding**: `npm run db:seed`
4. **Type Checking**: `npm run typecheck`

### **Build Process**
1. **Client Build**: Vite builds React app
2. **Server Build**: Vite builds Express server
3. **Asset Optimization**: CSS/JS minification
4. **Bundle Analysis**: Size optimization

### **Deployment**
- **Development**: Local Vite dev server
- **Production**: Node.js with PM2 (recommended)
- **Static Assets**: CDN-ready build output

---

## 📈 Scalability Considerations

### **Horizontal Scaling**
- **Load Balancing**: Multiple server instances
- **Database**: Read replicas for read-heavy operations
- **Caching**: Redis for session and data caching

### **Vertical Scaling**
- **Resource Optimization**: Memory and CPU usage
- **Database Optimization**: Query performance tuning
- **Asset Optimization**: Image compression and CDN

---

## 🔍 Monitoring & Logging

### **Error Tracking**
```typescript
// Error monitoring
const reportError = (error: Error, context?: any) => {
  console.error('Error captured:', error, context);
  // Send to monitoring service
};
```

### **Performance Monitoring**
- **Response Times**: API endpoint monitoring
- **Database Queries**: Query performance tracking
- **Client Metrics**: User interaction analytics

---

## 🚀 Future Enhancements

### **Planned Features**
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Business intelligence dashboard
- **Mobile App**: React Native application
- **Payment Gateway**: Stripe integration
- **Inventory Management**: Stock tracking system

### **Technical Improvements**
- **Microservices**: Service decomposition
- **GraphQL**: Alternative to REST API
- **Docker**: Containerization
- **CI/CD**: Automated deployment pipeline

---

## 📚 Key Design Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
3. **Single Responsibility**: Each component/module has one purpose
4. **Type Safety**: Comprehensive TypeScript usage
5. **Performance First**: Optimized for speed and efficiency
6. **Accessibility**: WCAG compliance
7. **Security**: Defense in depth approach
8. **Maintainability**: Clean, documented code

---

*This architecture document provides a comprehensive overview of the CasaNawal project structure, technologies, and design patterns. It serves as a reference for developers working on the project and can be used for onboarding new team members.*
