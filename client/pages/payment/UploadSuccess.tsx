import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderDetails } from "./usePaymentUpload";

interface UploadSuccessProps {
  orderDetails: OrderDetails | null;
}

export const UploadSuccess = ({ orderDetails }: UploadSuccessProps) => {
  return (
    <div className="min-h-screen bg-sable-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-nuit-800 mb-4">
            Reçu envoyé avec succès !
          </h2>
          
          <p className="text-lg text-nuit-600 mb-8">
            "Nous allons vérifier votre reçu de paiement et confirmer votre commande sous peu."
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-nuit-800 mb-4">Prochaines étapes :</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                "Nous vérifions votre reçu (généralement 2-4 heures)"
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                "Si vérifié, nous confirmons votre commande et commençons la préparation"
              </li>
              <li className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                "Si problème, nous demanderons un nouveau reçu"
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">
                <ArrowLeft className={cn("h-4 w-4", "mr-2")} />
                "Retour à l"accueil"
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to={`/order-status/${orderDetails?.reference}`}>
                "Suivre ma commande"
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
