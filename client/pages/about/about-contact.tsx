import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { contactInfo } from "./about-data";
import { itemVariants } from "./about-animations";

export const AboutContact = () => (
  <motion.section variants={itemVariants} className="text-center">
    <div className="bg-nuit-900 text-white rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
      <h2 className={cn(
        "font-display text-xl md:text-2xl font-semibold mb-6",
        ""
      )}>
        Contactez CasaNawal
      </h2>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        {contactInfo.map((contact, index) => {
          const IconComponent = contact.icon;
          return (
            <div key={index} className="flex flex-col items-center">
              <IconComponent className="h-6 w-6 text-safran mb-2" aria-hidden={true} />
              <p className={cn(
                "text-sm text-gray-300",
                ""
              )}>
                {contact.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </motion.section>
);
