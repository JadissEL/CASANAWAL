import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { useRegisterForm } from "./useRegisterForm";
import { itemVariants } from "./animation";
import { FormField } from "@/components/shared/FormField";
import { InputField } from "@/components/shared/InputField";
import { PasswordToggleButton } from "@/components/shared/PasswordToggleButton";

export const RegisterForm = () => {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleSubmit
  } = useRegisterForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
      variants={itemVariants}
    >
      <motion.div
        className="bg-gradient-to-r from-terracotta to-safran p-8 text-center"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Créer un compte
        </h1>
        <p className="text-white/80">
          Rejoignez-nous pour une expérience culinaire authentique
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      <motion.form
        className="p-8 space-y-6"
        variants={itemVariants}
        onSubmit={handleSubmit}
      >
        <FormField label="Nom complet" htmlFor="fullName" variants={itemVariants}>
          <InputField
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Votre nom complet"
            icon={User}
            required
          />
        </FormField>

        <FormField label="Email" htmlFor="email" variants={itemVariants}>
          <InputField
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="votre@email.com"
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
            placeholder="Votre mot de passe"
            icon={Lock}
            required
            rightElement={
              <PasswordToggleButton
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />
        </FormField>

        <FormField label="Confirmer le mot de passe" htmlFor="confirmPassword" variants={itemVariants}>
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirmez votre mot de passe"
            icon={Lock}
            required
            rightElement={
              <PasswordToggleButton
                showPassword={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        </FormField>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Création du compte...
            </div>
          ) : (
            <span>Créer le compte</span>
          )}
        </Button>

        <div className="text-center pt-4">
          <p className="text-nuit-600">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-terracotta hover:text-terracotta-600 font-semibold transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
};
