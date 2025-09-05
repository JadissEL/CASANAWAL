import { motion } from "framer-motion";
import { LoginNav } from "./login/login-nav";
import { containerVariants } from "./login/login-animations";
import { LoginHero } from "./login/login-hero";
import { LoginForm } from "./login/login-form";

const Login = () => {
  return (
    <div className="min-h-screen bg-sable-50">
      <LoginNav />
      <main className="relative">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LoginHero />
          <LoginForm />
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
