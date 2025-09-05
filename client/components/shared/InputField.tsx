import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface InputFieldProps {
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  rightElement?: ReactNode;
}

export const InputField = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  rightElement
}: InputFieldProps) => {
  return (
    <div className="relative">
      <Icon className="absolute top-3 left-3 h-5 w-5 text-nuit-400" />
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white border border-sable-300 rounded-lg px-4 py-3 pl-10 pr-10 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors"
        placeholder={placeholder}
        required={required}
      />
      {rightElement && (
        <div className="absolute top-3 right-3">
          {rightElement}
        </div>
      )}
    </div>
  );
};