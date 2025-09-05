import { motion } from "framer-motion";
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
import { containerVariants } from "./register/animation";
import { RegisterHeader } from "./register/RegisterHeader";
import { RegisterForm } from "./register/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nuit-50 via-white to-sable-50 relative overflow-hidden">
      <MoroccanPattern />
      
      <RegisterHeader />

      <main className="relative z-10 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <RegisterForm />
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
