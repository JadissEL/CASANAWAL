import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onToggle: () => void;
}

export const PasswordToggleButton = ({ showPassword, onToggle }: PasswordToggleButtonProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="h-5 w-5 text-nuit-400 hover:text-nuit-600 transition-colors"
    >
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  );
};