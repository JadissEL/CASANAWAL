// =====================================================
// EXTENDED THEME CONFIGURATION
// =====================================================

export const extendedTheme = {
  // Container configuration
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },

  // Typography
  fontFamily: {
    'playfair': ['Playfair Display', 'serif'] as string[],
    'inter': ['Inter', 'sans-serif'] as string[],
    'cairo': ['Cairo', 'sans-serif'] as string[],
  },

  // Border radius system
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
    '2xl': '1rem',
    '3xl': '1.5rem',
  },

  // Custom shadow system
  boxShadow: {
    'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
} as const;
