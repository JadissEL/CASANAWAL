# Utilisation du Composant MoroccanPattern

Le composant `MoroccanPattern` offre des motifs décoratifs sophistiqués inspirés de l'art marocain traditionnel.

## Importation

```tsx
import { MoroccanPattern } from "@/components/ui/moroccan-pattern";
```

## Exemples d'utilisation

### 1. Motif subtil pour arrière-plan de section

```tsx
<div className="relative p-8 bg-white rounded-3xl">
  <MoroccanPattern 
    variant="subtle" 
    pattern="mixed" 
    animated={true} 
  />
  <div className="relative z-10">
    {/* Contenu principal */}
  </div>
</div>
```

### 2. Motif medium pour cartes produits

```tsx
<div className="relative bg-sable-50 rounded-2xl p-6 group hover:shadow-lg transition-shadow">
  <MoroccanPattern 
    variant="medium" 
    pattern="geometric" 
    corners={false}
    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
  />
  <div className="relative z-10">
    {/* Contenu de la carte */}
  </div>
</div>
```

### 3. Motif bold pour headers spéciaux

```tsx
<header className="relative py-16 bg-gradient-to-br from-terracotta to-safran">
  <MoroccanPattern 
    variant="bold" 
    pattern="zellige" 
    animated={true}
    corners={true}
    className="text-white/20"
  />
  <div className="relative z-10 text-center text-white">
    <h1>Titre Principal</h1>
  </div>
</header>
```

## Props disponibles

- `variant`: `'subtle' | 'medium' | 'bold'` - Contrôle l'opacité du motif
- `pattern`: `'zellige' | 'geometric' | 'mixed'` - Type de motif à afficher
- `animated`: `boolean` - Active l'animation subtile
- `corners`: `boolean` - Affiche les éléments décoratifs dans les coins
- `className`: `string` - Classes CSS supplémentaires

## Motifs inclus

1. **Khatam** - Étoile à 8 branches traditionnelle marocaine
2. **Entrelacs de Fès** - Motifs entrelacés inspirés des mosaïques de Fès
3. **Nid d'abeille d'Alhambra** - Motifs hexagonaux de l'Alhambra
4. **Calligraphie fluide** - Motifs inspirés de la calligraphie arabe

## Palette de couleurs

Les motifs utilisent automatiquement les couleurs de la palette Nawal:
- Terracotta: #C65F3D
- Safran: #E6A200  
- Zellige Teal: #0F7E7E
- Sable: #F4E9DC
- Nuit: #1F1B16
