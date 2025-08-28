import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { useLanguage } from "@/lib/useLanguage";
import { 
  ChefHat, 
  ArrowLeft, 
  Eye,
  EyeOff,
  Mail,
  Lock,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const Login = () => {
  const { isRTL, t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Here you would integrate with your authentication system
    console.log("Login attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-sable-50">
      {/* Navigation */}
      <nav 
        className="bg-white/95 backdrop-blur-sm border-b border-sable-200"
        role="navigation"
        aria-label={isRTL ? "التنقل الرئيسي" : "Navigation principale"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg"
              aria-label={isRTL ? "العودة إلى الصفحة الرئيسية" : "Retour à l'accueil"}
            >
              <div className={cn(
                "flex items-center gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-nuit-900">
                    {isRTL ? "كازا نوال" : "CasaNawal"}
                  </h1>
                  <p className="text-xs text-nuit-600">
                    {isRTL ? "المطبخ المغربي الأصيل" : "Cuisine Marocaine Authentique"}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button className="bg-terracotta hover:bg-terracotta-600 text-white focus:ring-terracotta focus:ring-offset-2">
                {t('nav.cart')} (0)
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          {/* Back Link */}
          <motion.div variants={itemVariants}>
            <Link 
              to="/" 
              className={cn(
                "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 transition-colors duration-200 mb-8 group focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 rounded-lg p-2 -ml-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
              aria-label={isRTL ? "العودة إلى الصفحة الرئيسية" : "Retour à l'accueil"}
            >
              <ArrowLeft 
                className={cn(
                  "h-4 w-4 transition-transform group-hover:-translate-x-1",
                  isRTL ? "rotate-180" : ""
                )} 
                aria-hidden="true"
              />
              <span className="font-medium">{isRTL ? "العودة إلى الصفحة الرئ��سية" : "Retour à l'accueil"}</span>
            </Link>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-3xl p-8 shadow-soft relative overflow-hidden">
              <MoroccanPattern
                variant="subtle"
                pattern="geometric"
                animated={false}
                corners={true}
                className="rounded-3xl"
              />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <h1 className={cn(
                    "font-display text-2xl font-bold text-nuit-900 mb-2",
                    isRTL ? "font-cairo" : ""
                  )}>
                    {isRTL ? "تسجيل الدخول" : "Connexion"}
                  </h1>
                  <p className={cn(
                    "text-nuit-600",
                    isRTL ? "font-cairo" : ""
                  )}>
                    {isRTL 
                      ? "أدخل بيانا��ك للوصول إلى حسابك"
                      : "Entrez vos informations pour accéder à votre compte"
                    }
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className={cn(
                        "block text-sm font-medium text-nuit-900 mb-2",
                        isRTL ? "font-cairo text-right" : "text-left"
                      )}
                    >
                      {isRTL ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border border-sable-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-colors",
                          isRTL ? "text-right pr-12 font-cairo" : "text-left pl-12"
                        )}
                        placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Entrez votre email"}
                      />
                      <Mail className={cn(
                        "absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-nuit-400",
                        isRTL ? "right-4" : "left-4"
                      )} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label 
                      htmlFor="password" 
                      className={cn(
                        "block text-sm font-medium text-nuit-900 mb-2",
                        isRTL ? "font-cairo text-right" : "text-left"
                      )}
                    >
                      {isRTL ? "كلمة المرور" : "Mot de passe"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border border-sable-300 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-colors",
                          isRTL ? "text-right pr-12 pl-12 font-cairo" : "text-left pl-12 pr-12"
                        )}
                        placeholder={isRTL ? "أدخل كلمة المرور" : "Entrez votre mot de passe"}
                      />
                      <Lock className={cn(
                        "absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-nuit-400",
                        isRTL ? "right-4" : "left-4"
                      )} aria-hidden="true" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                          "absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-nuit-400 hover:text-nuit-600 transition-colors",
                          isRTL ? "left-4" : "right-4"
                        )}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className={cn(
                    "flex items-center justify-between",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "flex items-center",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 text-terracotta focus:ring-terracotta border-sable-300 rounded"
                      />
                      <label 
                        htmlFor="remember" 
                        className={cn(
                          "text-sm text-nuit-600",
                          isRTL ? "mr-2 font-cairo" : "ml-2"
                        )}
                      >
                        {isRTL ? "تذكرني" : "Se souvenir de moi"}
                      </label>
                    </div>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-terracotta hover:text-terracotta-600 transition-colors"
                    >
                      {isRTL ? "نسيت كلمة المرور؟" : "Mot de passe oublié ?"}
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-terracotta hover:bg-terracotta-600 text-white py-3 rounded-xl font-medium focus:ring-terracotta focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isRTL ? "جاري تسجيل الدخول..." : "Connexion en cours..."}
                      </div>
                    ) : (
                      isRTL ? "تسجيل الدخول" : "Se connecter"
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className={cn(
                    "text-sm text-nuit-600",
                    isRTL ? "font-cairo" : ""
                  )}>
                    {isRTL ? "ليس لديك حساب؟" : "Pas encore de compte ?"}{" "}
                    <Link 
                      to="/register" 
                      className="text-terracotta hover:text-terracotta-600 font-medium transition-colors"
                    >
                      {isRTL ? "أنشئ حساباً جديداً" : "Créer un compte"}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
