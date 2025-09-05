# Tailwind CSS Configuration Guide

## 📁 **Configuration Structure**

The Tailwind configuration has been refactored into a modular structure for better maintainability:

```
tailwind/
├── colors.ts          # Moroccan brand colors + shadcn/ui colors
├── theme.ts           # Extended theme configuration
├── animations.ts      # Animation keyframes and utilities
├── plugins.ts         # Plugin configuration
└── tailwind.config.ts # Main configuration file
```

## 🎨 **Color System**

### **Moroccan Brand Colors**
Located in `tailwind/colors.ts`:

- **Terracotta** (`#C65F3D`) - Warm, earthy red-orange
- **Safran** (`#E6A200`) - Vibrant golden yellow  
- **Zellige** (`#0F7E7E`) - Rich teal blue-green
- **Sable** (`#F4E9DC`) - Warm sand/beige tones
- **Nuit** (`#1F1B16`) - Deep, rich dark tones

### **Usage Examples**
```tsx
// Moroccan colors
<div className="bg-terracotta text-white">Terracotta background</div>
<div className="text-safran-500">Golden text</div>
<div className="border-zellige-300">Teal border</div>

// Shadcn/ui colors
<div className="bg-primary text-primary-foreground">Primary button</div>
<div className="bg-card text-card-foreground">Card component</div>
```

## 🔤 **Typography**

### **Font Families**
- **Playfair Display** - Elegant serif for headings
- **Inter** - Clean sans-serif for body text
- **Cairo** - Arabic-friendly font for multilingual support

### **Usage**
```tsx
<h1 className="font-playfair text-4xl">Elegant Heading</h1>
<p className="font-inter text-base">Body text</p>
<span className="font-cairo">نص عربي</span>
```

## 🎭 **Animations**

### **Available Animations**
- `accordion-down` - Smooth accordion expansion
- `accordion-up` - Smooth accordion collapse

### **Usage**
```tsx
<div className="animate-accordion-down">Expanding content</div>
<div className="animate-accordion-up">Collapsing content</div>
```

## 🎯 **Custom Shadows**

### **Soft Shadows**
- `shadow-soft` - Subtle elevation shadow
- `shadow-soft-lg` - Larger soft shadow

### **Usage**
```tsx
<div className="shadow-soft">Soft shadow card</div>
<div className="shadow-soft-lg">Large soft shadow</div>
```

## 🔧 **Border Radius**

### **Extended Radius System**
- `rounded-2xl` - 1rem radius
- `rounded-3xl` - 1.5rem radius

### **Usage**
```tsx
<div className="rounded-2xl">Large rounded corners</div>
<div className="rounded-3xl">Extra large rounded corners</div>
```

## 📱 **Container System**

### **Responsive Container**
- Centers content automatically
- 2rem padding on all sides
- Max-width at 1400px for 2xl screens

### **Usage**
```tsx
<div className="container mx-auto">
  <div className="container">Centered content</div>
</div>
```

## 🚀 **Development Workflow**

### **Adding New Colors**
1. Add to `tailwind/colors.ts` in the `moroccanColors` object
2. Use semantic naming (e.g., `spice`, `herb`, `clay`)
3. Include full color scale (50-900)

### **Adding New Animations**
1. Add keyframes to `tailwind/animations.ts`
2. Add animation utility to `animationUtilities`
3. Use descriptive names

### **Adding New Fonts**
1. Add to `tailwind/theme.ts` in `fontFamily`
2. Include fallback fonts
3. Update font loading in HTML

## 🎨 **Design System Principles**

### **Color Usage**
- **Primary Actions**: Use `terracotta` for CTAs
- **Secondary Actions**: Use `safran` for highlights
- **Backgrounds**: Use `sable` for warm backgrounds
- **Text**: Use `nuit` for dark text
- **Accents**: Use `zellige` for interactive elements

### **Typography Hierarchy**
- **H1-H2**: `font-playfair` for elegance
- **H3-H6**: `font-inter` for readability
- **Body**: `font-inter` for consistency
- **Arabic**: `font-cairo` for proper rendering

### **Spacing & Layout**
- Use Tailwind's default spacing scale
- Container system for consistent layouts
- Soft shadows for depth without heaviness

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Colors not working**: Check import in `tailwind.config.ts`
2. **Fonts not loading**: Verify font imports in HTML
3. **Animations not working**: Check plugin installation

### **Build Issues**
1. **TypeScript errors**: Ensure proper type annotations
2. **Missing styles**: Verify content paths in config
3. **Plugin errors**: Check plugin compatibility

## 📚 **Resources**

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Moroccan Design Inspiration](https://www.pinterest.com/search/pins/?q=moroccan%20design)
- [Color Theory Guide](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)
