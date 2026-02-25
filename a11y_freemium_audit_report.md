# Auditoría de Accesibilidad (a11y) y Arquitectura Freemium

*Fecha de la Auditoría:* Febrero 2026
*Estado Actual:* Arquitectura Atomic Design completa con Zustand.

Esta auditoría técnica ha examinado el estado de la aplicación luego de su fase de refactorización profunda para trazar una hoja de ruta centrada en dos grandes ejes solicitados:
1. **Accesibilidad y UX (a11y)**: Solucionar todos los anti-patrones de uso de interfaces pequeñas y asegurar correcto soporte para conductores que usan el teléfono en sus tableros (distancia, contraste, legibilidad).
2. **Escalabilidad a Freemium**: Adaptar nuestro manejo de estado, _hooks_ y arquitectura para facilitar la inserción de Paywalls y validaciones (Features PRO / Premium).

---

## 1. Análisis de Accesibilidad (a11y)

### 🔴 Riesgos Críticos (WCAG Violations)

*   **Miniaturización de Fuentes (El peor infractor):**
    En múltiples zonas se están utilizando de manera abusiva clases nativas de tailwind como `text-[8px]`, `text-[9px]`, `text-[10px]` y `text-[11px]`.
    *   *Ubicaciones observadas:* `SessionAnalysis.tsx`, `HistoryTab.tsx`, `BottomNavigation.tsx`, `ProfitabilityScore.tsx`.
    *   *Por qué es un problema:* Los conductores usan los smartphones montados en el salpicadero/tablero a distancias de entre 50 y 80 cm. Una fuente de 9 píxeles es imperceptible para un alto porcentaje de usuarios y está muy por debajo de los estándares WCAG de la W3C (Mínimo recomendado: 12px `text-xs`).
*   **Contraste Cuestionable en Modo "Neutral" o Deshabilitado:**
    La paleta de grises (ej. `text-white/20`, texto sobre fondos oscuros o `white/3`) pierde el ratio de contraste de `4.5:1` estipulado para textos pequeños.

### 🟡 Advertencias Estructurales

*   **Falta de Títulos de Sección Ocultos de Pantalla (`sr-only`):**
    Los lectores de pantalla no perciben correctamente los "saltos" entre distintos bloques del `SessionAnalysis` porque hay muchos divs con íconos pero sin cabeceras unificadas legibles.
*   **Falta de Zonas Live (`aria-live="polite"`):**
    Por ejemplo, el `<MiniSummary>` dentro del `CalculatorTab` se actualiza silenciosamente (cambia el contador de viajes). Esto debería anunciar los cambios a un lector de pantalla cuando el conductor hace hit en "Anotar Viaje".

---

## 2. Diagnóstico Arquitectónico para Escalar a "Freemium"

Al haber refactorizado `Calculator.tsx` en `CalculatorTemplate.tsx` y extraer la lógica mediante **Zustand**, hemos sentado cimientos formidables. Ahora, debemos considerar cómo bloquear o proteger funcionalmente componentes bajo este nuevo formato.

### ✅ Puntos Fuertes Actuales

*   **Agnosticismo de Renderizado (Organismos independizados):** Como el componente `SessionAnalysis` ya está encapsulado como Organismo Atómico, podemos "envolverlo" en un HOC (Higher-Order Component) de validación Premium o simplemente renderizar un componente `<PaywallOverlay>` sin afectar a los demás archivos.
*   **Estado Reactivo sin Boilerplate:** Zustand permite agregar booleanos de manera trivial. Si agregamos la propiedad `isPro: boolean` en `useProfileStore` es consumible al instante sin necesidad de Prop-Drilling.

### 🟡 Áreas que Requieren Diseño Estratégico ("Gating")

*   **¿Qué funcionalidades serán de Paga (Premium)?**
    1.  *Radar de Gamificación y Tips (`SessionAnalysis.tsx`)*: Este tab aporta infinito valor a la retención y entendimiento profundo (Rendimientos, tips, promedios y medallas). Sería un excelente _hook_ premium.
    2.  *Histórico Profundo (`HistoryTab.tsx`)*: El usuario gratis podría acceder solo a "Hoy" y "Ayer". Semanas completas y meses pueden ser para _Premium_.
    3.  *Backup en la Nube (Próximamente)*: Dado que estamos usando `localStorage` puro (`persist` middleware), los usuarios necesitan sincronizar entre dispositivos si pierden la app. Un login (Supabase) actuaría mágicamente como plan Premium.

---

## 3. Plan de Acción Propuesto (Pródigos Pasos)

Como Senior Software Engineer de este proyecto, sugiero las siguientes implementaciones (que requieren edición de código):

### Fase 1: Erradicación de Micro-fuentes (A11Y)
1. **Modificar `manejate-ui.css` y las vistas JSX:**
   - Buscar todos los `text-[8px]` a `text-[11px]` y escalar a `text-xs` o `text-[12px]`.
   - Ajustar el padding, leading (interlineado) y márgenes consecuentemente para que el diseño no se rompa visualmente. En `SessionAnalysis` la grilla 3x3 quizás requiera cambiar su forma o tamaño de los elementos hijos.
   - Escalar los `touch-targets` genéricos mínimos para que un "dedo grande en un bache" no pulse "Limpiar caché" por accidente (usando min-w-12 y min-h-12 en los CSS globals para elementos interactivos).

### Fase 2: Implementación de Módulo Semántico Web (SEO & a11y)
1. **Ajustar el `<Layout.astro>`:**
   - Inyectar Open Graph tags, estructurarlo con semántica (`<main>`, `<nav>`, `<article>`).
   - Validar que haya solo un `<h1>` que tenga impacto SEO, escondiendo otros si resultan redundantes.

### Fase 3: Prototipo Guard Freemium
1. **Actualizar el Store:** Agregar propiedades de `userTier: 'free' | 'pro'` al `useProfileStore`.
2. **Crear Organismo `<PremiumGate>`**: Proveer un Wrapper/Template que oculte funcionalidad basándose en la store y emita un blur + botón `[Suscríbete para destrabar]`.
3. **Aplicar el PremiumGate**:
   - Tab "Analysis" se bloquea o limita parcialmente.
   - Selectores de fecha antiguos dentro del "HistoryTab" se bloquean a `Free`.

---

**¿Estás de acuerdo con seguir este Plan de Acción y comenzar la modificación del CSS y los componentes para resolver `Fase 1` (A11Y Erradicación de Fuentes Pequeñas)?**
