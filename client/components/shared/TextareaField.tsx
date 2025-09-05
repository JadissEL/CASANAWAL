interface TextareaFieldProps {
  id?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const TextareaField = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false
}: TextareaFieldProps) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full bg-white border border-sable-300 rounded-lg px-4 py-3 text-nuit-900 placeholder-nuit-400 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-colors"
    />
  );
};


