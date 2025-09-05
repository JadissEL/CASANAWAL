import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChefHat, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings, 
  Users, 
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { NotificationCenter } from "./notification-center";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "content_manager", "order_manager"]
  },
  {
    name: "Commandes",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["super_admin", "order_manager"]
  },
  {
    name: "Produits",
    href: "/admin/products",
    icon: Package,
    roles: ["super_admin", "content_manager"]
  },
  {
    name: "Paiements",
    href: "/admin/payments",
    icon: CreditCard,
    roles: ["super_admin", "order_manager"]
  },
  {
    name: "Analyses",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["super_admin", "order_manager"]
  },
  {
    name: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin"]
  },
  {
    name: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    roles: ["super_admin"]
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles)
  );

  return (
    <div className="admin-page-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-nuit-900/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="admin-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="admin-sidebar-header">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-xl flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-nuit-900">
                  CasaNawal
                </h1>
                <p className="text-xs text-nuit-500">Administration</p>
              </div>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="admin-sidebar-nav">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "admin-nav-item",
                        isActive ? "admin-nav-item-active" : "admin-nav-item-inactive"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-terracotta" : "text-nuit-400"
                      )} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="admin-sidebar-footer">
            <div className="flex items-center space-x-3 p-3 bg-sable-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-nuit-600 to-nuit-700 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-nuit-900 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-nuit-500 truncate">
                  {user?.role === 'super_admin' && 'Super Admin'}
                  {user?.role === 'content_manager' && 'Gestionnaire de contenu'}
                  {user?.role === 'order_manager' && 'Gestionnaire de commandes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="admin-content-area">
        {/* Top bar */}
        <header className="admin-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h2 className="text-lg font-semibold text-nuit-900">
                  {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'Administration'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationCenter />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-nuit-600 to-nuit-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block font-medium text-nuit-700">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
