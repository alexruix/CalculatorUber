# MANEJATE Design Philosophy v2.0
## Park UI + Tailwind v4 + High-Energy Gaming Aesthetic
**"Dashboard de Carreras meets Financial Intelligence"**

---

## 🎯 Philosophy Statement

> "MANEJATE no es una app financiera. Es un **dashboard de carreras** donde cada viaje es una vuelta, cada ganancia es un power-up, y cada conductor es un piloto optimizando su performance."

Diseñamos para **dopamina inmediata**, **claridad nocturna**, y **decisiones en 3 segundos** mientras manejas.

---

## 🏗️ Tech Stack Architecture

### Stack Completo

```
┌─────────────────────────────────────────────────────┐
│                   MANEJATE v2.0                      │
├─────────────────────────────────────────────────────┤
│  Framework:        Astro 5                           │
│  UI Library:       Park UI (Ark UI + Panda CSS)     │
│  Styling:          Tailwind v4 + global.css          │
│  Components:       React (TSX) for interactivity     │
│  Typography:       Plus Jakarta Sans                 │
│  Icons:            Lucide React                      │
└─────────────────────────────────────────────────────┘
```

### Why Park UI?

**Park UI** = **Ark UI** (headless components) + **Panda CSS** (atomic CSS-in-JS)

✅ **Pros:**
- Componentes accesibles out-of-the-box (ARIA compliant)
- Headless = total control visual
- Integración perfecta con Tailwind
- Tree-shakeable (solo importas lo que usas)
- Typed props (TypeScript first)
- Animaciones smooth (Framer Motion bajo el hood)

✅ **Ejemplos de componentes que usaremos:**
- `<Dialog>` para modals de verificación
- `<Select>` para dropdowns de vehículos
- `<Slider>` para ajustar combustible
- `<Progress>` para XP rings
- `<Toast>` para feedback instantáneo
- `<Tabs>` para navegación entre vistas

### Source of Truth: `global.css`

```
src/
├── styles/
│   ├── global.css          ← SOURCE OF TRUTH (Design Tokens)
│   └── tailwind.css        ← Tailwind directives 
```

**Filosofía:**
1. **`global.css`** define **CSS Custom Properties** (design tokens)
2. **Tailwind v4** consume esas variables vía `@theme`
3. **Park UI** usa Tailwind classes (hereda el sistema)
4. **Resultado:** Un solo lugar para cambiar colores/espaciado/tipografía

---

## 🎨 Color System: Gaming Neon Palette

### Brand Colors (CSS Custom Properties)

```css
/* global.css - SOURCE OF TRUTH */

@layer base {
  :root {
    /* ==================== NEON GAMING PALETTE ==================== */
    
    /* PRIMARY: GREENT (Success / Profit / Action) */
    --color-primary: #00F068;
    --color-primary-glow: rgba(0, 240, 104, 0.5);
    --color-primary-dim: rgba(0, 240, 104, 0.1);
    
    /* SECONDARY: NEBULA (Gamification / XP / Progress) */
    --color-secondary: #925DEE;
    --color-secondary-glow: rgba(146, 93, 238, 0.5);
    --color-secondary-dim: rgba(146, 93, 238, 0.1);
    
    /* ACCENT: SOLAR (Alerts / Critical / Warnings) */
    --color-accent: #FF8800;
    --color-accent-glow: rgba(255, 136, 0, 0.5);
    --color-accent-dim: rgba(255, 136, 0, 0.1);
    
    /* NEUTRAL: Base Colors */
    --color-black: #000000;           /* True black background */
    --color-starlight: #E7E7E7;       /* Primary text */
    --color-moon: #5B5B5B;            /* Secondary text */
    --color-slate: #1E293B;           /* Card backgrounds */
    --color-evergreen: #00A849;       /* Alternative green */
    
    /* ==================== SEMANTIC COLORS ==================== */
    
    /* Success (Profit > threshold) */
    --color-success: var(--color-primary);
    --color-success-bg: var(--color-primary-dim);
    --color-success-border: var(--color-primary);
    
    /* Warning (Profit at limit) */
    --color-warning: var(--color-accent);
    --color-warning-bg: var(--color-accent-dim);
    --color-warning-border: var(--color-accent);
    
    /* Error (Unprofitable) */
    --color-error: #FF4444;
    --color-error-bg: rgba(255, 68, 68, 0.1);
    --color-error-border: #FF4444;
    
    /* Info */
    --color-info: var(--color-secondary);
    --color-info-bg: var(--color-secondary-dim);
    --color-info-border: var(--color-secondary);
  }
}
```

### Tailwind v4 Integration

```css
/* tailwind.css */

@import "tailwindcss";

@theme {
  /* Extend Tailwind with our custom properties */
  
  --color-primary: var(--color-primary);
  --color-primary-glow: var(--color-primary-glow);
  
  --color-secondary: var(--color-secondary);
  --color-secondary-glow: var(--color-secondary-glow);
  
  --color-accent: var(--color-accent);
  --color-accent-glow: var(--color-accent-glow);
  
  --color-black: var(--color-black);
  --color-starlight: var(--color-starlight);
  --color-moon: var(--color-moon);
  --color-slate: var(--color-slate);
  
  /* Semantic aliases */
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);
  --color-info: var(--color-info);
}
```

### Usage in Components

```tsx
// Park UI Button with Tailwind classes
<Button className="bg-primary text-black hover:shadow-[0_0_30px_var(--color-primary-glow)]">
  CALCULAR
</Button>

// Custom component
<div className="bg-black border-2 border-primary/30">
  <h1 className="text-primary">$3,482.50</h1>
</div>
```

---

## 🔤 Typography: Plus Jakarta Sans

### Font Setup

```css
/* global.css */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

@layer base {
  :root {
    /* Font Family */
    --font-primary: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Font Sizes (Mobile-First) */
    --text-xs: 0.75rem;      /* 12px */
    --text-sm: 0.875rem;     /* 14px */
    --text-base: 1rem;       /* 16px */
    --text-lg: 1.125rem;     /* 18px */
    --text-xl: 1.25rem;      /* 20px */
    --text-2xl: 1.5rem;      /* 24px */
    --text-3xl: 1.875rem;    /* 30px */
    --text-4xl: 2.25rem;     /* 36px */
    --text-5xl: 3rem;        /* 48px */
    --text-6xl: 3.75rem;     /* 60px */
    
    /* Font Weights */
    --font-light: 300;
    --font-regular: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    --font-extrabold: 800;
    
    /* Line Heights */
    --leading-tight: 1.2;
    --leading-snug: 1.375;
    --leading-normal: 1.5;
    --leading-relaxed: 1.625;
    
    /* Letter Spacing (for uppercase labels) */
    --tracking-tight: -0.02em;
    --tracking-normal: 0;
    --tracking-wide: 0.05em;
    --tracking-wider: 0.1em;
    --tracking-widest: 0.2em;
  }
  
  body {
    font-family: var(--font-primary);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
  }
}
```

### Tailwind Extension

```css
/* tailwind.css */

@theme {
  /* Typography Scale */
  --font-size-xs: var(--text-xs);
  --font-size-sm: var(--text-sm);
  --font-size-base: var(--text-base);
  --font-size-lg: var(--text-lg);
  --font-size-xl: var(--text-xl);
  --font-size-2xl: var(--text-2xl);
  --font-size-3xl: var(--text-3xl);
  --font-size-4xl: var(--text-4xl);
  --font-size-5xl: var(--text-5xl);
  --font-size-6xl: var(--text-6xl);
  
  /* Font Weights */
  --font-weight-light: var(--font-light);
  --font-weight-normal: var(--font-regular);
  --font-weight-medium: var(--font-medium);
  --font-weight-semibold: var(--font-semibold);
  --font-weight-bold: var(--font-bold);
  --font-weight-extrabold: var(--font-extrabold);
}
```

### Typography Patterns

```tsx
// Display (Big numbers, hero titles)
<h1 className="text-6xl font-extrabold text-primary leading-tight">
  $3,482.50
</h1>

// Heading (Section titles)
<h2 className="text-3xl font-bold text-starlight uppercase tracking-tight">
  MANEJATE
</h2>

// Label (Uppercase, spaced)
<span className="text-xs font-extrabold text-primary uppercase tracking-widest">
  WEEKLY NET INCOME
</span>

// Body (Descriptions)
<p className="text-base font-medium text-moon leading-relaxed">
  Track your progress in real-time.
</p>
```

---

## 📐 Spacing & Layout

### Spacing Scale (8pt Grid)

```css
/* global.css */

@layer base {
  :root {
    /* Base unit: 4px (0.25rem) */
    --space-0: 0;
    --space-1: 0.25rem;    /* 4px */
    --space-2: 0.5rem;     /* 8px */
    --space-3: 0.75rem;    /* 12px */
    --space-4: 1rem;       /* 16px */
    --space-5: 1.25rem;    /* 20px */
    --space-6: 1.5rem;     /* 24px */
    --space-8: 2rem;       /* 32px */
    --space-10: 2.5rem;    /* 40px */
    --space-12: 3rem;      /* 48px */
    --space-16: 4rem;      /* 64px */
    --space-20: 5rem;      /* 80px */
  }
}
```

### Border Radius (Gaming Aesthetic)

```css
@layer base {
  :root {
    /* Generous rounding for modern gaming feel */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --radius-2xl: 24px;
    --radius-3xl: 32px;
    --radius-4xl: 40px;
    --radius-full: 9999px;
  }
}
```

### Container Widths

```css
@layer base {
  :root {
    /* Max widths for content */
    --container-sm: 640px;   /* Mobile-first */
    --container-md: 768px;   /* Tablets */
    --container-lg: 1024px;  /* Desktops */
  }
}
```

---

## 🎨 Park UI Component Customization

### Installation

```bash
npm install @ark-ui/react
npx @park-ui/cli init
```

### Example: Customized Button

```tsx
// components/ui/button.tsx (Park UI + Tailwind)

import { ark } from '@ark-ui/react/factory'
import { styled } from '@/styled-system/jsx'
import { button } from '@/styled-system/recipes'

export const Button = styled(ark.button, button)

// Usage with Tailwind classes
<Button 
  className="bg-primary text-black font-extrabold uppercase tracking-wide px-6 py-4 rounded-2xl hover:shadow-[0_0_30px_var(--color-primary-glow)] transition-all duration-300"
>
  CALCULAR RENTABILIDAD
</Button>
```

### Example: Neon Dialog (Modal)

```tsx
// components/ui/neon-dialog.tsx

import { Dialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'

export const NeonDialog = ({ trigger, children }: NeonDialogProps) => (
  <Dialog.Root>
    <Dialog.Trigger className="btn-primary-neon">
      {trigger}
    </Dialog.Trigger>
    
    <Portal>
      <Dialog.Backdrop className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Content className="bg-slate border-2 border-primary/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_var(--color-primary-glow)] animate-zoom-in">
          {children}
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
)
```

### Example: XP Progress Ring

```tsx
// components/ui/xp-progress.tsx

import { Progress } from '@ark-ui/react/progress'

export const XPProgress = ({ value, max }: XPProgressProps) => (
  <Progress.Root value={value} max={max}>
    <Progress.Label className="text-xs font-extrabold text-moon uppercase tracking-widest">
      XP PROGRESS
    </Progress.Label>
    
    <Progress.Track className="h-2 bg-moon/20 rounded-full overflow-hidden mt-2">
      <Progress.Range className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--color-primary-glow)]" />
    </Progress.Track>
    
    <Progress.ValueText className="text-sm font-bold text-primary mt-1">
      {value} / {max} XP
    </Progress.ValueText>
  </Progress.Root>
)
```

---

## 🎮 Component Patterns (Gaming UI)

### 1. Neon Button (Primary CTA)

```tsx
// Pattern: High-energy action button with glow

<button className="
  bg-primary 
  text-black 
  font-extrabold 
  text-base 
  uppercase 
  tracking-wide 
  px-6 
  py-4 
  rounded-2xl 
  shadow-[0_0_20px_var(--color-primary-glow)] 
  hover:shadow-[0_0_30px_var(--color-primary-glow)] 
  hover:scale-105 
  active:scale-95 
  transition-all 
  duration-300
">
  <Zap className="inline w-5 h-5 mr-2" />
  CALCULAR
</button>
```

### 2. Neon Input (Focus Glow)

```tsx
// Pattern: Input with neon border on focus

<input 
  type="text"
  className="
    w-full
    bg-white/5
    text-starlight
    font-medium
    px-5
    py-4
    border-2
    border-white/10
    rounded-2xl
    focus:border-primary
    focus:bg-primary/5
    focus:shadow-[0_0_20px_var(--color-primary-glow)]
    focus:outline-none
    placeholder:text-moon
    transition-all
    duration-300
  "
  placeholder="Ingresá la tarifa..."
/>
```

### 3. Income Card (Gamified Data)

```tsx
// Pattern: High-contrast data card with glow

<div className="
  bg-primary/10 
  border-2 
  border-primary/30 
  rounded-3xl 
  p-8 
  shadow-[0_0_30px_var(--color-primary-glow)]
">
  <div className="flex items-center justify-between mb-4">
    <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
      WEEKLY NET INCOME
    </span>
    <TrendingUp className="w-6 h-6 text-primary" />
  </div>
  
  <h2 className="text-6xl font-extrabold text-primary leading-none mb-2">
    $3,482.50
  </h2>
  
  <div className="flex items-center gap-2">
    <span className="text-sm font-extrabold text-primary">+12.5%</span>
    <span className="text-sm font-medium text-moon">vs last week</span>
  </div>
</div>
```

### 4. Level Badge (Gamification)

```tsx
// Pattern: Corner badge with level indicator

<div className="relative">
  {/* Main content */}
  <div className="w-24 h-24 bg-slate rounded-3xl border-2 border-secondary/30">
    <Car className="w-12 h-12 text-secondary" />
  </div>
  
  {/* Level badge */}
  <div className="absolute -top-2 -right-2 bg-secondary text-white px-3 py-1 rounded-full text-xs font-extrabold border-2 border-black shadow-[0_0_15px_var(--color-secondary-glow)]">
    LVL 12
  </div>
</div>
```

### 5. Status Pill (Live Indicator)

```tsx
// Pattern: Pill with pulsing dot

<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary rounded-full">
  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--color-primary-glow)]" />
  <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
    LIVE SERVER
  </span>
</div>
```

---

## 🎬 Animation System

### CSS Animations (global.css)

```css
@layer utilities {
  /* Pulse (for live indicators) */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  /* Glow Pulse (for critical alerts) */
  @keyframes glow-pulse {
    0%, 100% { 
      box-shadow: 0 0 20px var(--color-primary-glow); 
    }
    50% { 
      box-shadow: 0 0 40px var(--color-primary-glow); 
    }
  }
  
  /* Level Up (achievement animation) */
  @keyframes level-up {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  /* Zoom In (modal entrance) */
  @keyframes zoom-in {
    from { 
      opacity: 0; 
      transform: scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  /* Slide In (toast notifications) */
  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
```

### Tailwind Animation Classes

```css
@theme {
  --animate-pulse: pulse 2s infinite;
  --animate-glow-pulse: glow-pulse 2s infinite;
  --animate-level-up: level-up 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --animate-zoom-in: zoom-in 0.3s cubic-bezier(0, 0, 0.2, 1);
  --animate-slide-in: slide-in-right 0.3s cubic-bezier(0, 0, 0.2, 1);
}
```

### Usage

```tsx
// Pulsing live indicator
<div className="animate-pulse">LIVE</div>

// Achievement notification
<div className="animate-level-up">
  ¡Nivel subido!
</div>

// Modal entrance
<Dialog.Content className="animate-zoom-in">
  {children}
</Dialog.Content>
```

---

## 🎨 Glow Effects (Signature Style)

### Text Glow

```css
/* global.css */

@layer utilities {
  .text-glow-primary {
    color: var(--color-primary);
    text-shadow: 
      0 0 10px var(--color-primary-glow),
      0 0 20px var(--color-primary-glow);
  }
  
  .text-glow-secondary {
    color: var(--color-secondary);
    text-shadow: 
      0 0 10px var(--color-secondary-glow),
      0 0 20px var(--color-secondary-glow);
  }
}
```

### Box Glow (Shadows)

```tsx
// Tailwind arbitrary values
<div className="shadow-[0_0_20px_var(--color-primary-glow)]">
  Neon Card
</div>

// Dynamic glow on hover
<button className="
  hover:shadow-[0_0_30px_var(--color-primary-glow)] 
  transition-shadow 
  duration-300
">
  Hover Me
</button>
```

---

## 📱 Responsive Design (Mobile-First)

### Breakpoints

```css
/* Tailwind v4 default breakpoints (adjust if needed) */

/* Mobile: 0-640px (default, no prefix) */
/* Tablet: 640px+ (sm:) */
/* Desktop: 1024px+ (lg:) */
```

### Example: Responsive Income Card

```tsx
<div className="
  p-4 
  sm:p-6 
  lg:p-8 
  text-4xl 
  sm:text-5xl 
  lg:text-6xl 
  rounded-2xl 
  sm:rounded-3xl
">
  $3,482.50
</div>
```

---

## ♿ Accessibility

### Focus States (Keyboard Navigation)

```css
/* global.css */

@layer base {
  *:focus-visible {
    outline: none;
    box-shadow: 
      0 0 0 3px var(--color-black),
      0 0 0 6px var(--color-primary);
  }
  
  /* For inputs */
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 20px var(--color-primary-glow);
  }
}
```

### ARIA Labels (Park UI Advantage)

Park UI components come with ARIA attributes out-of-the-box:

```tsx
// Automatic ARIA support
<Dialog.Root>
  <Dialog.Trigger aria-label="Open verification dialog">
    Verificar
  </Dialog.Trigger>
  <Dialog.Content aria-labelledby="dialog-title">
    <Dialog.Title id="dialog-title">Verificación</Dialog.Title>
    {/* Content */}
  </Dialog.Content>
</Dialog.Root>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```


## 🎯 Design Principles Recap

### 1. **High Contrast** (Legibilidad Nocturna)
Negro puro (#000) vs Neón vibrante (#00F068, #925DEE, #FF8800)

### 2. **Instant Feedback** (Dopamina)
Cada acción tiene respuesta visual:
- Click → Scale + Glow pulse
- Focus → Border color + Shadow glow
- Success → Green glow + XP notification
- Error → Red glow + Shake animation

### 3. **Gamification First**
Todo es un juego:
- Viajes = Niveles
- Ganancias = XP
- Objetivos = Achievements
- Dashboard = Scorecard

### 4. **Mobile-Optimized**
Pantalla vertical, pulgar-friendly:
- Botones grandes (min 44px)
- Texto legible (min 16px body)
- Touch targets espaciados
- Bottom navigation

### 5. **Performance Feel**
Sensación de velocidad:
- Transiciones rápidas (200-300ms)
- Animaciones suaves (ease-out)
- Feedback inmediato (no loading states largos)
- Gradientes dinámicos

---

## 📋 Quick Reference: Color Usage

| Use Case | Color | Tailwind Class | CSS Variable |
|----------|-------|----------------|--------------|
| **Primary CTA** | Verde Neón | `bg-primary` | `var(--color-primary)` |
| **Profit > $1000** | Verde Neón | `text-primary` | `var(--color-success)` |
| **XP / Levels** | Púrpura | `bg-secondary` | `var(--color-secondary)` |
| **Alertas Críticas** | Naranja | `bg-accent` | `var(--color-accent)` |
| **Profit < $850** | Rojo | `text-error` | `var(--color-error)` |
| **Background** | Negro | `bg-black` | `var(--color-black)` |
| **Texto Principal** | Starlight | `text-starlight` | `var(--color-starlight)` |
| **Texto Secundario** | Moon | `text-moon` | `var(--color-moon)` |
| **Cards** | Slate | `bg-slate` | `var(--color-slate)` |

---

## 🚀 Getting Started (Implementation)

### Step 1: Install Dependencies

```bash
# Tailwind v4
npm install tailwindcss@next @tailwindcss/vite@next

# Park UI
npm install @ark-ui/react
npx @park-ui/cli init

# Icons
npm install lucide-react
```

### Step 2: Setup `global.css`

```css
/* src/styles/global.css */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

@layer base {
  :root {
    /* [Copy all design tokens from above] */
  }
  
  body {
    font-family: var(--font-primary);
    background: var(--color-black);
    color: var(--color-starlight);
  }
}

@layer utilities {
  /* [Copy animations and glow utilities] */
}
```

### Step 3: Setup `tailwind.css`

```css
/* src/styles/tailwind.css */

@import "tailwindcss";

@theme {
  /* [Copy Tailwind theme extensions] */
}
```
---

## 🎓 Best Practices

### DO ✅

- **Use CSS variables** en `global.css` como source of truth
- **Extend Tailwind** con `@theme` para consistency
- **Leverage Park UI** para accesibilidad automática
- **Apply glow effects** en hover/focus para feedback
- **Use semantic colors** (success, warning, error)
- **Test en dark environment** (la app es nocturna)
- **Optimize for thumbs** (mobile-first, large targets)

### DON'T ❌

- **No hardcodear colores** (siempre usar variables)
- **No usar sombras genéricas** (usar glow con color)
- **No ignorar accesibilidad** (Park UI te ayuda, úsalo)
- **No sobrecargar animaciones** (menos es más)
- **No usar Inter o Roboto** (Plus Jakarta Sans es nuestra marca)
- **No diseñar para desktop first** (conductores usan móvil)

---

## 📚 Resources

- **Park UI Docs:** https://park-ui.com/docs
- **Tailwind v4 Docs:** https://tailwindcss.com/docs
- **Ark UI (Headless):** https://ark-ui.com
- **Lucide Icons:** https://lucide.dev
- **Plus Jakarta Sans:** [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

---

**MANEJATE v2.0 - Built with Park UI, Powered by Dopamine 🏎️⚡**