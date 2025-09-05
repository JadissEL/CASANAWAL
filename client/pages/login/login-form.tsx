import { useState } from "react";
import { motion } from "framer-motion";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemVariants } from "./login-animations";
import { FormField } from "@/components/shared/FormField";
import { InputField } from "@/components/shared/InputField";
import { PasswordToggleButton } from "@/components/shared/PasswordToggleButton";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log("Login attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div variants={itemVariants}>
      <div className="bg-white rounded-3xl p-8 shadow-soft relative overflow-hidden">
        <MoroccanPattern variant="subtle" pattern="geometric" animated={false} corners={true} className="rounded-3xl" />
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-safran rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" aria-hidden={true} />
            </div>
            <h1 className={cn("font-display text-2xl font-bold text-nuit-900 mb-2", "")}>
              Connexion
            </h1>
            <p className={cn("text-nuit-600", "")}>
              Entrez vos informations pour accéder à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Email" htmlFor="email" variants={itemVariants}>
              <InputField
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Entrez votre email"
                icon={Mail}
                required
              />
            </FormField>

            <FormField label="Mot de passe" htmlFor="password" variants={itemVariants}>
              <InputField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Entrez votre mot de passe"
                icon={Lock}
                required
                rightElement={
                  <PasswordToggleButton showPassword={showPassword} onToggle={() => setShowPassword(v => !v)} />
                }
              />
            </FormField>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="h-4 w-4 text-terracotta focus:ring-terracotta border-sable-300 rounded" />
                <label htmlFor="remember" className="text-sm text-nuit-600 ml-2">Se souvenir de moi</label>
              </div>
              <a href="/forgot-password" className="text-sm text-terracotta hover:text-terracotta-600 transition-colors">Mot de passe oublié ?</a>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-terracotta hover:bg-terracotta-600 text-white py-3 rounded-xl font-medium focus:ring-terracotta focus:ring-offset-2">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className={cn("text-sm text-nuit-600", "")}>
              Pas encore de compte ? <a href="/register" className="text-terracotta hover:text-terracotta-600 font-medium transition-colors">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


