import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const ContactInfo = () => (
  <div className="space-y-6">
    <h2 className={cn("font-display text-2xl font-bold text-nuit-900 mb-6")}>Informations de contact</h2>

    <InfoCard icon={<Phone className="h-6 w-6 text-white" />} bg="from-terracotta to-safran" title="Téléphone" lines={["+212 6 XX XX XX XX", "Disponible 24h/7j"]} />
    <InfoCard icon={<Mail className="h-6 w-6 text-white" />} bg="from-safran to-zellige" title="Email" lines={["contact@casanawal.ma", "Réponse en quelques heures"]} />
    <InfoCard icon={<MapPin className="h-6 w-6 text-white" />} bg="from-zellige to-terracotta" title="Localisation" lines={["Casablanca, Maroc", "Livraison locale"]} />
    <HoursCard />
  </div>
);

const InfoCard = ({ icon, bg, title, lines }: { icon: React.ReactNode; bg: string; title: string; lines: string[] }) => (
  <div className="bg-white rounded-2xl p-6 shadow-soft">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div className="text-left">
        <h3 className="font-semibold text-nuit-900 mb-1">{title}</h3>
        <p className="text-nuit-600">{lines[0]}</p>
        <p className="text-xs text-nuit-500 mt-1">{lines[1]}</p>
      </div>
    </div>
  </div>
);

const HoursCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-soft">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-zellige rounded-full flex items-center justify-center flex-shrink-0">
        <Clock className="h-6 w-6 text-white" />
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-nuit-900 mb-2">Horaires d'ouverture</h3>
        <div className="space-y-1 text-sm text-nuit-600">
          <div className="flex justify-between"><span>Lun - Ven</span><span>9h - 22h</span></div>
          <div className="flex justify-between"><span>Week-end</span><span>10h - 23h</span></div>
        </div>
      </div>
    </div>
  </div>
);


