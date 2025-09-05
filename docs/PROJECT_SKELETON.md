# 🏗️ Full-Stack Project Skeleton Template

## 📁 Project Structure

```
project-name/
├── 📁 client/                    # React Frontend
│   ├── 📁 components/
│   │   ├── 📁 ui/               # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── index.ts         # Export all components
│   │   └── 📁 shared/           # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── 📁 pages/                # Route components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── 📁 contexts/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── 📁 lib/                  # Utility libraries
│   │   ├── api.ts               # API client functions
│   │   ├── utils.ts             # General utilities
│   │   ├── constants.ts         # App constants
│   │   └── types.ts             # TypeScript types
│   ├── 📁 styles/               # CSS organization
│   │   ├── base.css             # Base styles
│   │   ├── layout.css           # Layout components
│   │   └── components.css       # Component styles
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Entry point
│   ├── global.css               # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── 📁 server/                   # Express.js Backend
│   ├── 📁 database/
│   │   ├── 📁 migrations/       # Database schema migrations
│   │   │   ├── 001_initial_schema.ts
│   │   │   └── 002_add_users.ts
│   │   ├── 📁 seeders/          # Database seeding scripts
│   │   │   └── 001_seed_data.ts
│   │   ├── connection.ts        # Database connection
│   │   └── schema.sql           # Main schema
│   ├── 📁 routes/
│   │   ├── 📁 api/              # API routes
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── users.ts         # User management
│   │   │   └── index.ts         # Route aggregator
│   │   └── index.ts             # Main routes
│   ├── 📁 middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── validation.ts        # Input validation
│   │   ├── errorHandler.ts      # Error handling
│   │   └── cors.ts              # CORS configuration
│   ├── 📁 services/
│   │   ├── emailService.ts      # Email functionality
│   │   └── fileService.ts       # File upload handling
│   ├── 📁 config/
│   │   ├── database.ts          # Database configuration
│   │   └── environment.ts       # Environment variables
│   ├── 📁 utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── encryption.ts        # Encryption utilities
│   │   └── validation.ts        # Validation schemas
│   ├── index.ts                 # Main server entry point
│   └── types.ts                 # Server TypeScript types
├── 📁 shared/                   # Shared code between client and server
│   ├── api.ts                   # Shared TypeScript interfaces
│   ├── constants.ts             # Shared constants
│   └── utils.ts                 # Shared utility functions
├── 📁 docs/                     # Project documentation
│   ├── README.md                # Project overview
│   ├── API.md                   # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── CONTRIBUTING.md          # Contribution guidelines
├── 📁 public/                   # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
├── 📁 tests/                    # Test files
│   ├── 📁 e2e/                  # End-to-end tests
│   │   └── basic.spec.ts
│   └── 📁 unit/                 # Unit tests
│       └── utils.test.ts
├── 📁 scripts/                  # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── setup.sh
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Project README
```

## 📦 Package.json Template

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "Full-stack web application",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "vite build --config vite.config.server.ts",
    "start": "node dist/server/index.mjs",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "db:setup": "tsx server/scripts/setup-database.ts",
    "db:migrate": "tsx server/database/migrations/001_initial_schema.ts",
    "db:seed": "tsx server/database/seeders/001_seed_data.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "zod": "^3.22.4",
    "nodemailer": "^6.9.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/pg": "^8.10.9",
    "@types/nodemailer": "^6.4.14",
    "@types/node": "^20.9.0",
    "@vitejs/plugin-react": "^4.1.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "prettier": "^3.1.0",
    "eslint": "^8.53.0",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.39.0",
    "tsx": "^4.6.0"
  }
}
```

## ⚙️ Configuration Files

### Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/client',
  },
});
```

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["client/*"],
      "@shared/*": ["shared/*"]
    }
  },
  "include": ["client", "server", "shared"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### TailwindCSS Configuration (tailwind.config.ts)
```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './client/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## 🔧 Core Files Templates

### Client Entry Point (client/main.tsx)
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Main App Component (client/App.tsx)
```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

### Server Entry Point (server/index.ts)
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
```

### Database Connection (server/database/connection.ts)
```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};

export default pool;
```

### Shared API Types (shared/api.ts)
```typescript
// Common interfaces shared between client and server

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
```

### Authentication Context (client/contexts/AuthContext.tsx)
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@shared/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token, user: userData } = await response.json();
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### API Client (client/lib/api.ts)
```typescript
import { ApiResponse } from '@shared/api';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(data: Partial<{ name: string; email: string }>) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
```

### Environment Variables (.env.example)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Client Configuration
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone <your-repo>
cd your-project-name
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:setup
npm run db:migrate
npm run db:seed

# Start development
npm run dev

# Build for production
npm run build
npm start
```

## 📝 Key Features Included

✅ **Full-stack TypeScript setup**  
✅ **React + Vite frontend**  
✅ **Express.js backend**  
✅ **PostgreSQL database**  
✅ **JWT authentication**  
✅ **TailwindCSS styling**  
✅ **React Router navigation**  
✅ **Context-based state management**  
✅ **API client with error handling**  
✅ **Database migrations and seeding**  
✅ **Environment configuration**  
✅ **Development and production builds**  
✅ **Basic testing setup**  
✅ **ESLint and Prettier**  
✅ **Git ignore and documentation**  

This skeleton provides a solid foundation for building full-stack web applications with modern technologies and best practices! 🎉
