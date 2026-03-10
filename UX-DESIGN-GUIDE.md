# MANEJATE Gaming: Profile Screen UX Guide

## 🎯 Decisiones de Diseño (Enfoque Híbrido)

El `ProfileScreen` actual utiliza un **enfoque híbrido**: combina la eficiencia de edición de un "Dashboard" para conductores con la estética premium y jerarquía limpia de servicios como "Lemon". Se ha migrado a una arquitectura plana (sin acordeones) para maximizar la velocidad de acceso a la información y edición de variables críticas (GNC, Combustible, Metas) sin navegación redundante.

## 📋 Jerarquía de Información

La pantalla se organiza en cinco módulos estratégicos que utilizan **Glassmorphism** y un sistema de **Atómic Design** refinado:

### 1. Identity Header (User Card Premium)

- **Layout Claude-Style**: Alineación a la izquierda con Avatar en gradiente (`bg-linear-to-br`), nombre prominente y rol dinámico.
- **Glassmorphism**: Contenedor con `backdrop-blur-xl` y un _offset glow_ en la esquina superior derecha que refuerza la estética gaming sin saturar el centro de la vista.
- **Chevron Edit**: Un botón circular de acceso rápido que simboliza la capacidad de edición profunda del perfil.

### 2. Mi Rendimiento (Dashboard de Carrera)

- **Glanceability**: Métricas clave (Costo/KM, Eficiencia, Metas) visibles de inmediato en una grilla de lectura rápida.
- **Gamificación**: Uso de insignias (`Badge`) de alto contraste para indicar estados o novedades.

### 3. Mi Perfil (La Máquina & Estrategia)

- **Edición Inline**: Los inputs de vehículo, combustible y consumo se mantienen accesibles directamente en el feed principal (Edit-in-place). Esto ahorra clics innecesarios durante la jornada laboral.
- **Master Toggles**: Control instantáneo sobre qué gastos impactan en el cálculo del margen.

### 4. Descubrí (Nivelación & Comunidad) [NUEVO]

- Utiliza el nuevo átomo `SectionItemButton`: botones tipo lista con íconos dedicados, descripciones secundarias y badges promocionales.
- **Jerarquía Visual**: Separado por encabezados en mayúsculas (`text-xs font-extrabold text-moon uppercase tracking-widest`).

### 5. Seguridad y Privacidad

- Reemplazo de botones genéricos por `SectionItemButton` para una experiencia de configuración móvil nativa y cohesiva.
- **Danger Zone**: Área de destrucción de datos protegida visualmente con tonos rojos y sombras de alerta (`shadow-red`).

## 🎨 Gaming Aesthetic Aplicado (Tokens & Animaciones)

- **Glass Containers**: Uso de la clase `.glass` (definida en el Design System) para efectos de profundidad.
- **Neon Glows**: Implementación de `--color-primary-glow` y variantes semánticas en badges y sombras de contenedores.
- **SectionItemButton**: Átomo diseñado para microinteracciones de _click_ (`active:scale-[0.98]`) y transiciones de color en hover.

## ♿ Accesibilidad (A11y & Mobile First)

- **Target Areas**: Todos los botones de sección cumplen con el estándar de 48px de altura.
- **Semantic Structure**: Uso de etiquetas `section` con `aria-labelledby` para una navegación clara mediante lectores de pantalla.
- **High Contrast**: Texto `starlight` sobre fondos oscuros con soporte para `backdrop-blur` en dispositivos modernos.

## 📊 Métricas de Medición Esperadas (Objetivos de UX)

Esta estructura atómica y reingeniería visual optimizará las siguientes KPIs interactivas del producto final.

| Métrica                   | Valor Clave                          |
| :------------------------ | :----------------------------------- |
| **Time to find setting**  | < 5 segundos                         |
| **Taps to edit vehicle**  | 2 clicks o inputs directos           |
| **Pro badge visibility**  | 80% notar la jerarquía visual        |
| **Referral CTR**          | > 25% gracias a badges visuales      |
| **Setting Comprehension** | 95% éxito de entendimiento de inputs |

---

**Generado para MANEJATE v2.0 usando el nuevo Design System Base (Park UI).**
