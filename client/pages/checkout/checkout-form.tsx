import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, MapPin, Calendar, Clock, Mail, MessageSquare } from "lucide-react";
import { itemVariants } from "./checkout-animations";
import { motion } from "framer-motion";
import { OrderForm } from "./checkout-hooks";

interface CheckoutFormProps {
  formData: OrderForm;
  timeSlots: { value: string; label: string }[];
  isLoading: boolean;
  validatePhone: (p: string) => boolean;
  isFormValid: () => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CheckoutForm = ({ formData, timeSlots, isLoading, validatePhone, isFormValid, onChange, onSubmit }: CheckoutFormProps) => (
  <motion.div variants={itemVariants} className="lg:col-span-3">
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sable-200">
      <h2 className={cn("font-display text-xl font-bold text-nuit-900 mb-6")}>Informations de livraison</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-nuit-700 flex items-center gap-2")}><Phone className="h-4 w-4 text-terracotta" />Numéro de téléphone *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={onChange} className={cn("w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors", !validatePhone(formData.phone) && formData.phone !== "" ? "border-red-300" : "")} placeholder={"+212XXXXXXXXX ou 0XXXXXXXXX"} required />
          {!validatePhone(formData.phone) && formData.phone !== "" && (<p className={cn("text-sm text-red-600")}>Format de numéro de téléphone invalide</p>)}
        </div>
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-nuit-700 flex items-center gap-2")}><MapPin className="h-4 w-4 text-terracotta" />Adresse de livraison *</label>
          <textarea name="address" value={formData.address} onChange={onChange} rows={3} className={cn("w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors resize-none")} placeholder={"Rue/numéro, quartier, ville"} required />
        </div>
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-nuit-700 flex items-center gap-2")}><Calendar className="h-4 w-4 text-terracotta" />Date de livraison *</label>
          <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={onChange} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} className={cn("w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors")} required />
        </div>
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-nuit-700 flex items-center gap-2")}><Clock className="h-4 w-4 text-terracotta" />Créneau de livraison *</label>
          <select name="deliverySlot" value={formData.deliverySlot} onChange={onChange} className={cn("w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors")} required>
            <option value="">Sélectionnez un créneau</option>
            {timeSlots.map(slot => (<option key={slot.value} value={slot.value}>{slot.label}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-nuit-700 flex items-center gap-2")}><Mail className="h-4 w-4 text-nuit-400" />Email (facultatif)</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} className={cn("w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors")} placeholder={"votre@email.com"} />
        </div>
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-nuit-700 flex items-center gap-2")}><MessageSquare className="h-4 w-4 text-nuit-400" />Notes (facultatif)</label>
          <textarea name="notes" value={formData.notes} onChange={onChange} rows={3} className={cn("w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors resize-none")} placeholder={"Allergies, instructions d'accès, etc..."} />
        </div>
        <div className="flex items-start gap-3">
          <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={onChange} className="mt-1 h-4 w-4 text-terracotta border-sable-300 rounded focus:ring-terracotta focus:ring-offset-0" required />
          <label className={cn("text-sm text-nuit-600 cursor-pointer")}>J'accepte les <span className="text-terracotta font-semibold">conditions de vente</span> & la <span className="text-terracotta font-semibold">politique de confidentialité</span> *</label>
        </div>
        <Button type="submit" disabled={!isFormValid() || isLoading} className={cn("w-full bg-gradient-to-r from-terracotta to-safran hover:from-terracotta-600 hover:to-safran-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed")}>{isLoading ? (<div className={cn("flex items-center gap-2")}><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Traitement en cours...</div>) : (<span>Valider la commande</span>)}</Button>
      </form>
    </div>
  </motion.div>
);


