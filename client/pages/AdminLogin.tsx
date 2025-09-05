import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft, Mail, Lock } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { FormField } from "@/components/shared/FormField";
import { InputField } from "@/components/shared/InputField";
import { PasswordToggleButton } from "@/components/shared/PasswordToggleButton";
import { itemVariants } from "./login/login-animations";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    try {
      await login(formData.email, formData.password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nuit-900 via-nuit-800 to-nuit-900 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpolygon points='30,0 60,30 30,60 0,30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Administration CasaNawal
            </h1>
            
            <p className="text-white/70">
              Connectez-vous pour accéder au panneau d'administration
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="bg-red-500/20 border-red-500/30 text-red-100">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <FormField label="Adresse e-mail" htmlFor="email" variants={itemVariants}>
              <InputField
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@casanawal.ma"
                icon={Mail}
                required
              />
            </FormField>

            {/* Password Field */}
            <FormField label="Mot de passe" htmlFor="password" variants={itemVariants}>
              <InputField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Votre mot de passe"
                icon={Lock}
                required
                rightElement={
                  <PasswordToggleButton
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(prev => !prev)}
                  />
                }
              />
            </FormField>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-300 flex-shrink-0" />
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Accès sécurisé
                </p>
                <p className="text-blue-200/70 text-xs">
                  Votre session est protégée et sera automatiquement fermée après 24 heures d'inactivité.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            © 2024 CasaNawal. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
