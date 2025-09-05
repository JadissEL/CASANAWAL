import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, User, Mail, Phone, Building, Calendar } from "lucide-react";
import { FormField } from "@/components/shared/FormField";
import { InputField } from "@/components/shared/InputField";
import { TextareaField } from "@/components/shared/TextareaField";
import { useContactForm } from "./contact-hooks";

const inquiryTypes = [
  { value: "general", label: "Demande générale" },
  { value: "bulk", label: "Commandes entreprises/événements" },
  { value: "catering", label: "Services traiteur" },
  { value: "feedback", label: "Commentaires et avis" },
  { value: "complaint", label: "Réclamation" },
  { value: "partnership", label: "Partenariat commercial" }
];

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const SelectField = ({ label, options, value, onValueChange, placeholder, required }: SelectFieldProps) => (
  <div>
    <label className={cn("block text-sm font-medium text-nuit-700 mb-2")}>{label}</label>
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      required={required}
      className="w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
    >
      <option value="" disabled>{placeholder || "Sélectionner"}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const ContactForm = () => {
  const { formData, errors, isSubmitting, isSubmitted, handleInputChange, handleSubmit } = useContactForm();

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-white" />
        </div>
        <h3 className={cn("font-display text-2xl font-bold text-nuit-900 mb-4")}>Message envoyé avec succès !</h3>
        <p className={cn("text-nuit-600 mb-6")}>Merci de nous avoir contactés. Nous répondrons à votre demande dans les plus brefs délais.</p>
        <a href="/" className="inline-flex items-center bg-terracotta hover:bg-terracotta-600 text-white px-4 py-2 rounded-lg">Retour à l'accueil</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={cn("font-display text-2xl font-bold text-nuit-900 mb-6")}>Envoyez-nous un message</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Nom complet *" htmlFor="name">
          <InputField type="text" id="name" name="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Entrez votre nom complet" icon={User} required />
        </FormField>
        <FormField label="Email *" htmlFor="email">
          <InputField type="email" id="email" name="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Entrez votre email" icon={Mail} required />
        </FormField>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Numéro de téléphone *" htmlFor="phone">
          <InputField type="tel" id="phone" name="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+212 XXX-XXXXXX" icon={Phone} required />
        </FormField>
        <FormField label="Entreprise/Organisation (optionnel)" htmlFor="company">
          <InputField type="text" id="company" name="company" value={formData.company || ''} onChange={(e) => handleInputChange('company', e.target.value)} placeholder="Nom de l'entreprise" icon={Building} />
        </FormField>
      </div>

      <FormField label="Type de demande *" htmlFor="inquiryType">
        <SelectField label="Type de demande *" options={inquiryTypes} value={formData.inquiryType} onValueChange={(v) => handleInputChange('inquiryType', v)} placeholder="Sélectionnez le type de demande" required />
      </FormField>

      {(formData.inquiryType === 'bulk' || formData.inquiryType === 'catering') && (
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Date de l'événement (optionnel)" htmlFor="eventDate">
            <InputField type="date" id="eventDate" name="eventDate" value={formData.eventDate || ''} onChange={(e) => handleInputChange('eventDate', e.target.value)} placeholder="Sélectionnez une date" icon={Calendar} />
          </FormField>
          <FormField label="Nombre de personnes *" htmlFor="guestCount">
            <Input type="number" value={formData.guestCount || ''} onChange={(e) => handleInputChange('guestCount', e.target.value)} placeholder="Nombre approximatif" className={cn(errors.guestCount ? "border-red-500" : "")} />
          </FormField>
        </div>
      )}

      <FormField label="Votre message *" htmlFor="message">
        <TextareaField id="message" name="message" value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} placeholder="Écrivez votre message ici..." rows={5} required />
      </FormField>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white px-8 py-3 flex-1 md:flex-none">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Envoi en cours...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Envoyer le message
            </div>
          )}
        </Button>
        <a href="/" className="px-8 py-3 border rounded-lg">Annuler</a>
      </div>
    </form>
  );
};


