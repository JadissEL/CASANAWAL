interface SelectFieldProps {
  label: string
  options: Array<{ value: string; label: string }>
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  required?: boolean
}