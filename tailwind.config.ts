import type { Config } from "tailwindcss";
import { moroccanColors, shadcnColors } from "./tailwind/colors";
import { extendedTheme } from "./tailwind/theme";
import { animationKeyframes, animationUtilities } from "./tailwind/animations";
import { plugins } from "./tailwind/plugins";

// =====================================================
// MAIN TAILWIND CONFIGURATION
// =====================================================

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  
  theme: {
    container: extendedTheme.container,
    extend: {
      fontFamily: extendedTheme.fontFamily,
      colors: {
        ...moroccanColors,
        ...shadcnColors,
      },
      borderRadius: extendedTheme.borderRadius,
      boxShadow: extendedTheme.boxShadow,
      keyframes: animationKeyframes,
      animation: animationUtilities,
    },
  },
  
  plugins,
} satisfies Config;
