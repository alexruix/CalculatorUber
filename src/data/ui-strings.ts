/**
 * ui-strings.ts
 * ─────────────────────────────────────────────────────────────
 * Single Source of Truth para todos los textos de la UI.
 * Principio: los componentes son 100% presentacionales. Nunca
 * deben contener strings hardcodeados de negocio o UX.
 *
 * Namespaces:
 *  · PROFITABILITY  → ProfitabilityScore
 *  · TRIP_FORM      → TripInputForm (Mis Viajes)
 *  · SHIFT_CLOSE    → ShiftCloseForm (Cierre de Turno)
 *  · HISTORY        → HistoryTab
 *  · ONBOARDING     → OnboardingFlow
 *  · COMMON         → Strings reutilizables
 */

// ─────────────────────────────────────────────────────────────
// COMMON
// ─────────────────────────────────────────────────────────────
export const COMMON = {
  loading:       'Cargando...',
  back:          'Atrás',
  next:          'Siguiente',
  save:          'Guardar',
  delete:        'Eliminar',
  cancel:        'Cancelar',
  confirm:       'Confirmar',
  currency:      '$',
  perKm:         '/KM',
  perHour:       '/hr',
  noData:        'Sin datos por ahora',
} as const;

// ─────────────────────────────────────────────────────────────
// PROFITABILITY SCORE
// ─────────────────────────────────────────────────────────────
export const PROFITABILITY = {
  // Etiquetas de estado del semáforo
  statusLabels: {
    excellent: 'EXCELENTE',
    fair:      'SIRVE',
    poor:      'AL HORNO',
    danger:    'PIERDE',
    neutral:   'ESPERANDO DATOS',
  },

  // Etiqueta de ROI según vertical
  roiLabel: {
    delivery:  'RETORNO TOTAL (INC. PROPINA)',
    default:   'FACTOR DE RENTABILIDAD',
  },

  // Mensajes de insight contextual (Rioplatense auténtico)
  insights: {
    critical: "¡Ojo! Este viaje no cubre tus costos operativos. Estás perdiendo plata.", // ROI < 1
    poor: {
        default: "Ganancia mínima detectada. Apenas cubrís los gastos y el desgaste.", // 1.0 - 1.3
        transport: "Rendimiento bajo para pasajeros. El desgaste es mayor a la ganancia."
    },
    fair: {
        default: "Rendimiento aceptable. Vas por buen camino para tu meta." // 1.3 - 1.8
    },
    excellent: {
        default: "¡Excelente rentabilidad! Estás maximizando cada kilómetro.", // > 1.8
        delivery: "¡Ritmo de delivery nivel pro! Alta eficiencia."
    }
  },

  // Labels de métricas en el card
  netLabel:     'En mano',
  costLabel:    'Costo total',
  qualityLabel: 'Rendimiento',
  roiUnit:      'ROI',
  currency:     '$',
  perKm:        '/KM',
} as const;

// ─────────────────────────────────────────────────────────────
// TRIP FORM — Mis Viajes
// ─────────────────────────────────────────────────────────────
export const TRIP_FORM = {
  sectionTitle:   'Carga tu viaje',
  sectionSubtitle: 'Datos tal cual figuran en el historial de la app',

  fields: {
    fare: {
      label:       'Total del viaje',
      adjustMinus: 'Restar 1000',
      adjustPlus:  'Sumar 1000',
    },
    distance: {
      label:       'Recorrido (KM)',
      placeholder: '5 km',
    },
    duration: {
      label:       'Duración (min)',
      placeholder: '20 min',
    },
    startTime: {
      label:       'Hora de inicio',
      placeholder: '12:00',
      hint:        'Para calcular tiempo de espera entre viajes',
      dateTrigger: '¿Cargar viaje de otro día?'
    },
    tips: {
      label:       'Propinas',
      placeholder: '0',
    },
    expenses: {
      label:       'Gastos extras del viaje',
      placeholder: 'Peajes, etc.',
    },
  },

  saveButton: 'Guardar Viaje',
  clearButton: 'Limpiar Formulario',
} as const;

// ─────────────────────────────────────────────────────────────
// SHIFT CLOSE — Cierre de Turno
// ─────────────────────────────────────────────────────────────
export const SHIFT_CLOSE = {
  sectionTitle: 'Cierre de Jornada',
  sectionSubtitle: 'Tirá los números finales para tu balance',
  
  fields: {
    shiftStartTime: { label: 'Hora de inicio del turno', placeholder: 'HH:MM' },
    shiftEndTime: { label: 'Hora de fin del turno', placeholder: 'HH:MM' },
    odometerStart: { label: 'KM Odómetro Inicial', placeholder: 'Ej: 125000 (Opcional)' },
    odometerEnd: { label: 'KM Odómetro Final', placeholder: 'Ej: 125150 (Opcional)' },
    extraExpenses: { label: 'Gastos extras del día', placeholder: 'Comida, café, etc. (Opcional)', hint: 'Se restan de tu ganancia final' },
  },
  
  saveButton: 'Cerrar Jornada',
  clearButton: 'Limpiar Cierre',
  
  excessiveIdleWarning: {
    title: (percent: number) => `Detectamos mucho tiempo muerto (${percent}%)`,
    body: '¿Te olvidaste de cargar algún viaje?',
    addTripBtn: '+ Cargar viaje perdido',
    dismissBtn: 'No, todo bien'
  }
} as const;

// ─────────────────────────────────────────────────────────────
// HISTORY TAB
// ─────────────────────────────────────────────────────────────
export const HISTORY = {
  emptyTitle:    'Sin registros',
  emptyBody:     'Los turnos que guardes aparecerán aquí organizados por fecha.',
  sectionTitle:  'Tus turnos',

  stats: {
    netLabel:   'Plata limpia',
    fareLabel:  'Recaudación',
    perShift:   '/turno',
    shifts:     { one: 'turno', many: 'turnos' },
  },

  filters: {
    today:   'Hoy',
    yesterday: 'Ayer',
    week:    'Semana',
    month:   'Mes',
    all:     'Todo',
  },

  clearConfirm: '¿Limpiamos todo el historial? Mirá que no hay vuelta atrás...',
} as const;

// ─────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────
export const ONBOARDING = {
  appName: 'Manejate',
  appTagline: 'Configuración',

  step1: {
    title:    'Elegí tu rubro',
    subtitle: 'Personalizaremos tu radar',
    verticals: {
      transport:  { label: 'Transporte',  caption: 'Uber, Didi, Cabify' },
      delivery:   { label: 'Delivery',    caption: 'Rappi, PedidosYa' },
      logistics:  { label: 'Logística',   caption: 'Envíos Extra, Cargas' },
    },
  },

  step2: {
    title:   'Tu vehículo',
    stepLabel: 'Paso 2 de 3',
    fields: {
      driverName:       { label: 'Tu nombre o apodo',        hint: 'Así te saludaremos al iniciar la jornada', placeholder: 'Ej: Carlos, Caro' },
      vehicleName:      { label: 'Modelo o apodo del vehículo', hint: 'Ej: Fiat Cronos, Moto 150cc', placeholder: 'Ej: Peugeot 208' },
      fuelPrice:        { label: 'Nafta/GNC ($/L)',           placeholder: '1400' },
      kmPerLiter:       { label: 'Consumo (km/l)',            placeholder: '10' },
      maintPerKm:       { label: 'Gasto de mantenimiento',   hint: 'Aceite, frenos, neumáticos, etc.', placeholder: '15' },
      vehicleValue:     { label: 'Valor del vehículo ($)',    hint: 'Precio de mercado actual', placeholder: '3.000.000' },
      vehicleLifetimeKm:{ label: 'Vida útil (km)',            hint: 'KM totales estimados', placeholder: '200000' },
    },
    amortSection: {
      title:   'Amortización vehicular',
      badge:   'opcional',
      description: 'Con estos datos calculamos el costo real de desgaste de tu vehículo por km, separado del mantenimiento.',
    },
  },

  step3: {
    title:     'Gastos activos',
    stepLabel: 'Paso 3 de 3',
    infoText:  'El radar manejate usará estos datos para calcular tu ROI en tiempo real.',
    finishButton: 'Iniciar Radar',
    expenseDescriptions: {
      fuel:         (price: string) => `Calculado a $${price}/L`,
      maintenance:  (perKm: string) => `Reserva de $${perKm}/km para gastos corrientes`,
      amortization: (vv: string, vkm: string) =>
        vv && vkm ? `~$${Math.round(parseFloat(vv) / parseFloat(vkm))}/km (÷ vida útil)` : 'Depreciación del vehículo por km recorrido',
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────
// PRODUCTIVITY INDEX
// ─────────────────────────────────────────────────────────────
export const PRODUCTIVITY = {
  title:      'Productividad',
  producing:  (h: string | number) => `Produciendo (${h}h)`,
  idle:       (h: string | number) => `Tiempo Muerto (${h}h)`,
  ephLabel:   'EPH — Ganancia por hora',
} as const;

// ─────────────────────────────────────────────────────────────
// HOME SCREEN — Dashboard de Jornada
// ─────────────────────────────────────────────────────────────
export const HOME_SCREEN = {
  greeting:       (name: string) => `Arrancaste, ${name} 🚀`,
  greetingNoName: '¡A romperla!',

  dailyGoal: {
    title:       'META DEL DÍA',
    editHint:    'Tocá para editar tu meta',
    placeholder: '10000',
    achieved:    '¡Meta cumplida! 🏆',
  },

  stats: {
    trips:    { label: 'VIAJES', unit: '' },
    earned:   { label: 'GANADO', unit: '$' },
    eph:      { label: 'EPH', unit: '$/h' },
    wait:     { label: 'ESPERA', unit: 'min' },
    active:   { label: 'ACTIVO', unit: 'min' },
    streak:   { label: 'RACHA', unit: '🔥' },
  },
  
  timePeriods: {
    morning: 'MAÑANA',
    afternoon: 'TARDE',
    night: 'NOCHE',
    dawn: 'MADRUGADA',
  },

  dateOverride: {
    title:        'Cargar viaje retroactivo',
    warning:      'El viaje se asignará a la jornada del día seleccionado.',
    dateLabel:    'Fecha del viaje',
    cancelBtn:    'Cancelar',
    confirmBtn:   'Continuar',
  },

  journey: {
    startLabel: 'Inicio jornada',
    endLabel:   'Cierre estimado',
    totalLabel: 'Total activo',
  },
} as const;

// ─────────────────────────────────────────────────────────────
// STATS DASHBOARD — SessionAnalysis v3
// ─────────────────────────────────────────────────────────────
export const STATS = {
  // Empty & Partial States
  emptyTitle:   'Garage vacío',
  emptyBody:    'Anotá tus viajes del día para activar el radar Manejate.',
  partialTitle: 'Calentando motores',
  partialBody:  (remaining: number) => `Anotá ${remaining} viaje${remaining > 1 ? 's' : ''} más para activar el análisis completo.`,

  // Level / Rank
  rankNames: ['NOVATO', 'CONDUCTOR', 'ACTIVO', 'PROFESIONAL', 'VETERANO', 'MAESTRO', 'LEYENDA'],
  xpLabel:       'RANGO',
  xpToNext:      (pts: number) => `${pts} pts para subir`,

  // Hero Metric
  heroLabel:     'GANADO HOY',
  heroVsYest:    (diff: number, pct: number) =>
    diff >= 0
      ? `+${diff.toLocaleString('es-AR')} vs ayer (+${pct}%) ↑`
      : `${diff.toLocaleString('es-AR')} vs ayer (${pct}%) ↓`,

  // Quick Stats
  quickEph:   'EPH',
  quickTrips: 'VIAJES',
  quickAim:   'PUNTERÍA',

  // Meta
  metaLabel:   'META DEL DÍA',
  metaMissing: (amount: string) => `Faltan ${amount}`,
  metaDone:    '¡Meta cumplida! 🏆',
  metaSuffix:  (pct: number) => `${pct}% completado`,

  // Tips
  tipCritical:  '🚨 ACCIÓN PRIORITARIA',
  tipOptimize:  '📈 OPTIMIZACIONES',
  tipPositive:  '💡 BIEN HECHO',
  tipDismiss:   'Entendido',

  // Badges
  badgesTitle:       'MIS LOGROS',
  badgesUnlocked:    (n: number) => `DESBLOQUEADOS (${n})`,
  badgesInProgress:  'EN PROGRESO',
  badgesRemaining:   (n: number) => `Faltan ${n} más`,

  // Premium
  premiumTitle:    'ANÁLISIS PRO',
  weeklyLabel:     'ESTA SEMANA',
  weeklyVsPrev:    (pct: number) => pct >= 0 ? `+${pct}% vs semana anterior` : `${pct}% vs semana anterior`,
  peakHoursTitle:  'MEJORES HORARIOS',
  peakHoursRec:    (slot: string, gain: string) => `Trabajá más en ${slot}. Potencial: +${gain}`,
  projectionTitle: 'PROYECCIÓN DEL DÍA',
  projectionBody:  (total: string) => `A este ritmo, cerrarías el día con ${total}`,
  verticalTitle:   'POR VERTICAL',
  verticalRec:     (name: string, pct: number) => `${name} te rinde +${pct}% más. Priorizalo.`,
} as const;
