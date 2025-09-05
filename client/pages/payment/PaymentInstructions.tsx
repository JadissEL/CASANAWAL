import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const PaymentInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Informations de paiement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-2">
            Méthodes de paiement acceptées :
          </h3>
          <ul className="space-y-1 text-orange-700">
            <li>• Virement bancaire</li>
            <li>• Mobile Money (Orange Money, Inwi Money)</li>
            <li>• Espèces (à la livraison)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Coordonnées bancaires :</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Banque :</strong> Crédit du Maroc</p>
            <p><strong>RIB :</strong> 011 780 0001234567890 25</p>
            <p><strong>Bénéficiaire :</strong> CasaNawal Restaurant</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Instructions importantes :
          </h3>
          <ul className="space-y-1 text-blue-700 text-sm">
            <li>• Incluez votre référence de commande dans le virement</li>
            <li>• Conservez votre reçu jusqu"à confirmation</li>
            <li>• Notre équipe vérifie les paiements sous 2-4h</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
