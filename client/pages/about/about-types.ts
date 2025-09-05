export interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export interface JourneyStep {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}
