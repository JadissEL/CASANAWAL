import { Link } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactForm } from "./contact/contact-form";
import { ContactInfo } from "./contact/contact-info";

const Contact = () => {

  return (
    <div className="page-layout">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Link 
            to="/" 
            className={cn(
              "inline-flex items-center gap-2 text-terracotta hover:text-terracotta-600 mb-8 transition-colors"
            )}
          >
            <ArrowLeft className={cn("h-4 w-4", "mr-2")} />
            Retour à l'accueil
          </Link>
          
          <h1 className={cn(
            "font-display text-4xl md:text-5xl font-bold text-nuit-900 mb-6"
          )}>
            Contact
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-safran mx-auto mb-8"></div>
          
          <p className={cn(
            "text-lg text-nuit-600 max-w-2xl mx-auto"
          )}>
            Nous sommes là pour vous aider ! Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <ContactInfo />

          <div className="lg:col-span-2"><div className="bg-white rounded-2xl p-8 shadow-soft"><ContactForm /></div></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
