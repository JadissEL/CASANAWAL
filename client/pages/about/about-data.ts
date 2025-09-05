import { Heart, Award, Users, MapPin, Phone, Mail } from "lucide-react";
import { Value, ContactInfo } from "./about-types";

export const values: Value[] = [
  {
    icon: Heart,
    title: "Authenticité",
    description: "Des recettes traditionnelles transmises de génération en génération",
    color: "from-terracotta to-safran"
  },
  {
    icon: Award,
    title: "Qualité",
    description: "Des ingrédients frais et de première qualité sélectionnés avec soin",
    color: "from-safran to-zellige"
  },
  {
    icon: Users,
    title: "Passion",
    description: "Un amour authentique pour la cuisine marocaine et ses saveurs",
    color: "from-zellige to-terracotta"
  }
];

export const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Casablanca, Maroc"
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+212 6 XX XX XX XX"
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@casanawal.ma"
  }
];
