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

const Register = () => {
  const { isRTL, t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(isRTL ? "كلمات المرور غير متطابقة" : "Les mots de passe ne correspondent pas");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    // Here you would typically redirect to login or dashboard
    alert(isRTL ? "تم إنشاء الحساب بنجاح!" : "Compte créé avec succès !");
  };

  return (
    <div className="min-h-screen bg-sable-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <MoroccanPattern 
          variant="zellige" 
          animate={true}
          className="w-full h-full text-terracotta" 
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-sable-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className={cn(
                "flex items-center gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" />
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
              <Button variant="outline" asChild>
                <Link to="/login">
                  {isRTL ? "تسجيل الدخول" : "Connexion"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <motion.div 
          className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="w-full max-w-md"
            variants={itemVariants}
          >
            {/* Back Button */}
            <motion.div className="mb-8" variants={itemVariants}>
              <Link 
                to="/" 
                className={cn(
                  "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 transition-colors",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <ArrowLeft className={cn("h-4 w-4", isRTL ? "rotate-180" : "")} />
                {isRTL ? "العودة للرئيسية" : "Retour à l'accueil"}
              </Link>
            </motion.div>

            {/* Register Form */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-sable-200"
              variants={itemVariants}
            >
              {/* Header */}
              <div className={cn(
                "text-center mb-8",
                isRTL ? "text-right" : "text-left"
              )}>
                <motion.h1 
                  className={cn(
                    "font-display text-3xl font-bold text-nuit-900 mb-2",
                    isRTL ? "font-cairo" : ""
                  )}
                  variants={itemVariants}
                >
                  {isRTL ? "إنشاء حساب جديد" : "Créer un compte"}
                </motion.h1>
                <motion.p 
                  className={cn(
                    "text-nuit-600",
                    isRTL ? "font-cairo" : ""
                  )}
                  variants={itemVariants}
                >
                  {isRTL ? "انضم إلى عائلة كازا نوال واستمتع بتجربة طبخ استثنائية" : "Rejoignez la famille CasaNawal et profitez d'une expérience culinaire exceptionnelle"}
                </motion.p>
              </div>

              {/* Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={itemVariants}
              >
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label 
                      htmlFor="firstName" 
                      className={cn(
                        "text-sm font-medium text-nuit-700",
                        isRTL ? "font-cairo text-right block" : ""
                      )}
                    >
                      {isRTL ? "الاسم الأول" : "Prénom"}
                    </label>
                    <div className="relative">
                      <User className={cn(
                        "absolute top-3 h-5 w-5 text-nuit-400",
                        isRTL ? "right-3" : "left-3"
                      )} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                          isRTL ? "pr-10 text-right font-cairo" : "pl-10"
                        )}
                        placeholder={isRTL ? "أدخل اسمك الأول" : "Entrez votre prénom"}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="lastName" 
                      className={cn(
                        "text-sm font-medium text-nuit-700",
                        isRTL ? "font-cairo text-right block" : ""
                      )}
                    >
                      {isRTL ? "اسم العائلة" : "Nom de famille"}
                    </label>
                    <div className="relative">
                      <User className={cn(
                        "absolute top-3 h-5 w-5 text-nuit-400",
                        isRTL ? "right-3" : "left-3"
                      )} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                          isRTL ? "pr-10 text-right font-cairo" : "pl-10"
                        )}
                        placeholder={isRTL ? "أدخل اسم عائلتك" : "Entrez votre nom de famille"}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className={cn(
                      "text-sm font-medium text-nuit-700",
                      isRTL ? "font-cairo text-right block" : ""
                    )}
                  >
                    {isRTL ? "البريد الإلكتروني" : "Adresse email"}
                  </label>
                  <div className="relative">
                    <Mail className={cn(
                      "absolute top-3 h-5 w-5 text-nuit-400",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "pr-10 text-right font-cairo" : "pl-10"
                      )}
                      placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Entrez votre email"}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label 
                    htmlFor="password" 
                    className={cn(
                      "text-sm font-medium text-nuit-700",
                      isRTL ? "font-cairo text-right block" : ""
                    )}
                  >
                    {isRTL ? "كلمة المرور" : "Mot de passe"}
                  </label>
                  <div className="relative">
                    <Lock className={cn(
                      "absolute top-3 h-5 w-5 text-nuit-400",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "pr-10 pl-10 text-right font-cairo" : "pl-10 pr-10"
                      )}
                      placeholder={isRTL ? "أدخل كلمة المرور" : "Entrez votre mot de passe"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={cn(
                        "absolute top-3 h-5 w-5 text-nuit-400 hover:text-nuit-600 transition-colors",
                        isRTL ? "left-3" : "right-3"
                      )}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label 
                    htmlFor="confirmPassword" 
                    className={cn(
                      "text-sm font-medium text-nuit-700",
                      isRTL ? "font-cairo text-right block" : ""
                    )}
                  >
                    {isRTL ? "تأكيد كلمة المرور" : "Confirmer le mot de passe"}
                  </label>
                  <div className="relative">
                    <Lock className={cn(
                      "absolute top-3 h-5 w-5 text-nuit-400",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors",
                        isRTL ? "pr-10 pl-10 text-right font-cairo" : "pl-10 pr-10"
                      )}
                      placeholder={isRTL ? "أعد إدخال كلمة المرور" : "Confirmez votre mot de passe"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={cn(
                        "absolute top-3 h-5 w-5 text-nuit-400 hover:text-nuit-600 transition-colors",
                        isRTL ? "left-3" : "right-3"
                      )}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
                    isRTL ? "font-cairo" : ""
                  )}
                >
                  {isLoading ? (
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isRTL ? "جاري إنشاء الحساب..." : "Création du compte..."}
                    </div>
                  ) : (
                    <span>{isRTL ? "إنشاء الحساب" : "Créer le compte"}</span>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className={cn(
                    "text-nuit-600",
                    isRTL ? "font-cairo" : ""
                  )}>
                    {isRTL ? "هل لديك حساب بالفعل؟" : "Vous avez déjà un compte ?"}{" "}
                    <Link 
                      to="/login" 
                      className="text-terracotta hover:text-terracotta-600 font-semibold transition-colors"
                    >
                      {isRTL ? "تسجيل الدخول" : "Se connecter"}
                    </Link>
                  </p>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
