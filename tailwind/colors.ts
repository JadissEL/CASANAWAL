// =====================================================
// MOROCCAN BRAND COLOR PALETTE
// =====================================================

export const moroccanColors = {
  // Terracotta - Warm, earthy red-orange
  terracotta: {
    DEFAULT: "#C65F3D",
    50: "#FCF7F5",
    100: "#F8E8E3",
    200: "#F0CFC4",
    300: "#E5A996",
    400: "#D67D5F",
    500: "#C65F3D",
    600: "#B84727",
    700: "#9A3720",
    800: "#7F301E",
    900: "#6A2B1D",
  },

  // Safran - Vibrant golden yellow
  safran: {
    DEFAULT: "#E6A200",
    50: "#FFFBF0",
    100: "#FEF5D6",
    200: "#FDEBAD",
    300: "#FBD974",
    400: "#F8C842",
    500: "#E6A200",
    600: "#D18600",
    700: "#B56B00",
    800: "#955500",
    900: "#7A4500",
  },

  // Zellige - Rich teal blue-green
  zellige: {
    DEFAULT: "#0F7E7E",
    50: "#F0FAFA",
    100: "#CCF2F2",
    200: "#99E5E5",
    300: "#4DD1D1",
    400: "#26B8B8",
    500: "#0F7E7E",
    600: "#0D6B6B",
    700: "#0B5757",
    800: "#094646",
    900: "#073939",
  },

  // Sable - Warm sand/beige tones
  sable: {
    DEFAULT: "#F4E9DC",
    50: "#FEFCFA",
    100: "#F4E9DC",
    200: "#E9D3BE",
    300: "#DDB89F",
    400: "#D09D81",
    500: "#C38762",
    600: "#B06F47",
    700: "#8E5637",
    800: "#6D422A",
    900: "#4C2F1E",
  },

  // Nuit - Deep, rich dark tones
  nuit: {
    DEFAULT: "#1F1B16",
    50: "#F7F6F5",
    100: "#E8E5E1",
    200: "#D1CBC3",
    300: "#B0A799",
    400: "#8F8270",
    500: "#726354",
    600: "#5C4F42",
    700: "#4A3F34",
    800: "#3E342A",
    900: "#362C23",
    950: "#1F1B16",
  },
} as const;

// =====================================================
// SHADCN/UI COLOR SYSTEM
// =====================================================

export const shadcnColors = {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  sidebar: {
    DEFAULT: "hsl(var(--sidebar-background))",
    foreground: "hsl(var(--sidebar-foreground))",
    primary: "hsl(var(--sidebar-primary))",
    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
    accent: "hsl(var(--sidebar-accent))",
    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
    border: "hsl(var(--sidebar-border))",
    ring: "hsl(var(--sidebar-ring))",
  },
} as const;
