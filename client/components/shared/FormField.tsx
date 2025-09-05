import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  variants?: Variants;
  className?: string;
}

const defaultVariants: Variants = {
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

export const FormField = ({ 
  label, 
  htmlFor, 
  children, 
  variants = defaultVariants,
  className = "space-y-2"
}: FormFieldProps) => {
  return (
    <motion.div className={className} variants={variants}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-nuit-700">
        {label}
      </label>
      {children}
    </motion.div>
  );
};