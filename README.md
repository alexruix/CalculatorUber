# Radar Manguito - Calculadora de Rentabilidad

Sistema modular para cálculo de rentabilidad de viajes para conductores de Uber y economía gig.

## 📂 Estructura de Archivos

```
src/
├── types/
│   └── calculator.types.ts          # Interfaces y tipos TypeScript
│
├── hooks/
│   ├── useProfitability.ts          # Hook de cálculos de rentabilidad
│   └── useSessionStorage.ts         # Hook de persistencia en localStorage
│
└── components/
    └── Calculator/
        ├── index.ts                 # Barrel export
        ├── Calculator.tsx           # Componente principal (orquestador)
        ├── ProfitabilityScore.tsx   # Score visual con colores (verde/amarillo/rojo)
        ├── SessionControls.tsx      # Tráfico y precio de combustible
        ├── TripInputForm.tsx        # Formulario de entrada de datos
        ├── SessionSummary.tsx       # Resumen de viajes del día
        └── ProfileSettings.tsx      # Configuración de vehículo
```

---

## 🚀 Uso

### Importación Básica

```tsx
// Opción 1: Importar solo el componente principal
import Calculator from './components/Calculator/Calculator';

// Opción 2: Usar barrel export para importaciones múltiples
import { Calculator, ProfitabilityScore } from './components/Calculator';

// Uso
function App() {
  return <Calculator />;
}
```

### Uso de Hooks Personalizados

```tsx
import { useProfitability } from './hooks/useProfitability';
import { useSessionStorage } from './hooks/useSessionStorage';

// En tu componente
const metrics = useProfitability(
  fare, distTrip, distPickup, kmPerLiter, 
  maintPerKm, fuelPrice, isHeavyTraffic, expenseSettings
);

const [trips, setTrips] = useSessionStorage('key', []);
```

---

## 🧩 Componentes

### Calculator
**Ubicación:** `components/Calculator/Calculator.tsx`  
**Descripción:** Componente principal que orquesta toda la aplicación.  
**Responsabilidades:** Manejo de estado global, coordinación de sub-componentes.

### ProfitabilityScore
**Ubicación:** `components/Calculator/ProfitabilityScore.tsx`  
**Props:** `{ metrics: TripMetrics }`  
**Descripción:** Muestra el score visual de rentabilidad con colores dinámicos.

### SessionControls
**Ubicación:** `components/Calculator/SessionControls.tsx`  
**Props:** `{ isHeavyTraffic, setIsHeavyTraffic, fuelPrice, setFuelPrice }`  
**Descripción:** Controles de ajuste de jornada (tráfico y combustible).

### TripInputForm
**Ubicación:** `components/Calculator/TripInputForm.tsx`  
**Props:** `{ fare, setFare, distTrip, setDistTrip, ... }`  
**Descripción:** Formulario completo para entrada de datos de viaje.

### SessionSummary
**Ubicación:** `components/Calculator/SessionSummary.tsx`  
**Props:** `{ trips, onClear }`  
**Descripción:** Resumen agregado de viajes (ganancia, cantidad, ingresos).

### ProfileSettings
**Ubicación:** `components/Calculator/ProfileSettings.tsx`  
**Props:** `{ vehicleName, setVehicleName, kmPerLiter, setKmPerLiter, ... }`  
**Descripción:** Configuración de perfil de vehículo (nombre y consumo).

---

## 🔧 Hooks Personalizados

### useProfitability
**Ubicación:** `hooks/useProfitability.ts`  
**Params:** `(fare, distTrip, distPickup, kmPerLiter, maintPerKm, fuelPrice, isHeavyTraffic, expenseSettings)`  
**Returns:** `TripMetrics`  
**Descripción:** Calcula todas las métricas de rentabilidad con lógica de negocio completa.

### useSessionStorage
**Ubicación:** `hooks/useSessionStorage.ts`  
**Params:** `(key: string, initialValue: SavedTrip[])`  
**Returns:** `[SavedTrip[], Dispatch<SetStateAction<SavedTrip[]>>]`  
**Descripción:** Persiste viajes en localStorage con sincronización automática.

---

## 📊 Tipos

### TripMetrics
```typescript
interface TripMetrics {
  isValid: boolean;
  totalCost: number;
  netMargin: number;
  profitPerKm: number;
  status: 'excellent' | 'fair' | 'poor' | 'neutral';
}
```

### SavedTrip
```typescript
interface SavedTrip {
  id: number;
  fare: number;
  margin: number;
  timestamp: number;
}
```

### ExpenseToggle
```typescript
interface ExpenseToggle {
  id: string;
  label: string;
  enabled: boolean;
}
```

---

## 🎨 Umbrales de Rentabilidad

| Status | Ganancia/KM | Color | Label |
|--------|-------------|-------|-------|
| Excellent | ≥ $1000 | 🟢 Verde | EXCELENTE |
| Fair | $850 - $999 | 🟡 Amarillo | ACEPTABLE |
| Poor | < $850 | 🔴 Rojo | BAJA RENTABILIDAD |
| Neutral | Sin datos | ⚪ Gris | ESPERANDO DATOS |

---

## 🛠️ Extensibilidad

### Agregar un nuevo tipo de gasto

1. Actualiza `expenseSettings` en `Calculator.tsx`:
```tsx
const [expenseSettings] = useState<ExpenseToggle[]>([
  { id: 'fuel', label: 'Combustible', enabled: true },
  { id: 'maintenance', label: 'Mantenimiento', enabled: true }, // ← Nuevo
]);
```

2. Modifica el cálculo en `useProfitability.ts`:
```tsx
const maintCost = expenseSettings.find(e => e.id === 'maintenance')?.enabled 
  ? totalDist * maintPerKm 
  : 0;
```

### Agregar un nuevo componente

1. Crea el archivo en `components/Calculator/`
2. Expórtalo en `components/Calculator/index.ts`
3. Úsalo en `Calculator.tsx`

---

## 📝 Notas Técnicas

- **Persistencia:** Los viajes se guardan en `localStorage` con la key `nodo_session_v1`
- **Tráfico Pesado:** Reduce la eficiencia del vehículo en un 20% (multiplica `kmPerLiter` por 0.8)
- **Validación:** Un viaje es válido solo si tiene `fare > 0` y `distTrip > 0`
- **Cálculos:** Todos los valores monetarios se redondean con `Math.round()`

---

## 🔮 Próximas Mejoras

- [ ] Integración con OAuth de Uber
- [ ] Exportación de reportes (CSV/PDF)
- [ ] Gráficos de evolución diaria
- [ ] Múltiples perfiles de vehículos
- [ ] Modo offline con Service Workers
- [ ] Tests unitarios (Jest + React Testing Library)

---

## 📄 Licencia

NODO Studio © 2026