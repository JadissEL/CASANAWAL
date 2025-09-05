import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const OrderConfirmationBackButton = () => (
  <div className="text-center pt-8">
    <Button 
      asChild
      className="bg-terracotta hover:bg-terracotta-600 text-white px-8 py-3"
    >
      <Link to="/">
        {"Retour au menu principal"}
      </Link>
    </Button>
  </div>
);
