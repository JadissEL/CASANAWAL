import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface PaymentsFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  count: number;
}

export const PaymentsFilters = ({ search, setSearch, status, setStatus, count }: PaymentsFiltersProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input placeholder="Rechercher une commande ou client..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10" />
    </div>
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger>
        <SelectValue placeholder="Tous les statuts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les statuts</SelectItem>
        <SelectItem value="pending">En attente</SelectItem>
        <SelectItem value="verified">Vérifiés</SelectItem>
        <SelectItem value="rejected">Rejetés</SelectItem>
      </SelectContent>
    </Select>
    <div className="flex items-center space-x-2"><Badge variant="outline">{count} paiement(s)</Badge></div>
  </div>
);


