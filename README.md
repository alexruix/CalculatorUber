# Manejate 🚀
> "La posta de tus viajes"

**Manejate** es un dashboard de carreras con inteligencia financiera diseñado específicamente para choferes de plataformas (Uber, Cabify, Rappi, etc.) en Argentina. Transforma los datos crudos de las apps en métricas de rentabilidad en tiempo real con una estética *High-energy gaming*.

---

## 🛠️ Stack Tecnológico
- **Core:** Astro 5 (SSR & Islands Architecture)
- **UI:** React 19 + Tailwind CSS v4
- **Componentes:** Park UI (Ark UI + Panda CSS tokens)
- **Estado:** Zustand + Persist Middleware (Zero-Flicker Sync)
- **Backend:** Supabase (Auth, DB, Realtime)
- **Mobile:** PWA (Vite PWA) con soporte offline

---

## 🏗️ Arquitectura: Atomic Design
Seguimos una metodología de diseño atómico estricta para garantizar escalabilidad y consistencia:

- `src/components/ui/atoms`: Componentes base (Buttons, Inputs, Badges).
- `src/components/ui/molecules`: Combinación de átomos (JourneyCard, DailyGoal).
- `src/components/ui/organisms`: Complejidad lógica (ProfitabilityScore, TripForm).
- `src/components/ui/templates`: Layouts de página reactivos.
- `src/pages`: Rutas de Astro.

---

## ⚡ Funcionalidades Clave
1. **Radar de Rentabilidad:** Algoritmo en tiempo real que calcula Ganancia Neta, $/KM y EPH (Ganancia por hora).
2. **Psicología del Conductor:** Interfaz jerárquica que prioriza "Plata en mano" y alertas de pérdida.
3. **Persistencia Total:** Recuperación instantánea de sesión y pestaña activa mediante hidratación local.
4. **Modo Emergencia:** Feedback visual agresivo (shaking & glow) ante viajes con ROI negativo.
5. **Onboarding Contextual:** Configuración detallada de costos (nafta, mantenimiento, amortización).

---

## 🎨 Sistema de Diseño
- **Fuente:** Plus Jakarta Sans (400, 700, 800).
- **Estética:** Dark Mode por defecto, neones, glassmorphism y micro-animaciones CSS.
- **Accesibilidad:** Cumplimiento WCAG AA (fuentes min 12px, contrastes reforzados).
- **Localización:** Formato ARS ($3.482,50), 24h (14:30) y copy en español rioplatense.

---

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualización de build
npm run preview
```

**Variables de Entorno:**
Requiere un archivo `.env` con las credenciales de Supabase:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

---

## 📅 RoadMap 2026
- [x] Migración a Astro 5 & Tailwind v4
- [x] Persistencia de Sesión Zero-Flicker
- [ ] Integración con Mercado Pago para suscripciones Pro
- [ ] Exportación de balances mensuales en PDF
- [ ] Modo "Cero Datos" para ahorro de batería extremo

---

## 📄 Licencia
NODO Studio © 2026 - Diseñado para quienes mueven la ciudad.