/**
 * ui-strings.ts
 * ─────────────────────────────────────────────────────────────
 * Single Source of Truth para todos los textos de la UI.
 * Principio: los componentes son 100% presentacionales. Nunca
 * deben contener strings hardcodeados de negocio o UX.
 *
 * Namespaces:
 *  · PROFITABILITY  → ProfitabilityScore
 *  · SHIFT_FORM     → TripInputForm (Cierre de Turno)
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
    excellent: {
      delivery:  '¡Propina salvadora! Este viaje es oro puro.',
      default:   'Una joyita. Meté un par más de estos y cortás temprano.',
    },
    fair: {
      default:   'Suma y no castiga el auto. Es por acá, seguí metiéndole.',
    },
    poor: {
      transport: 'Ojo que es un viaje trampa. Casi ni cubrís los gastos.',
      default:   'Margen muy ajustado. Evaluá si el esfuerzo vale la pena.',
    },
  },

  // Labels de métricas en el card
  netLabel:   'En mano',
  costLabel:  'Costo',
  roiUnit:    'ROI',
  currency:   '$',
  perKm:      '/KM',
} as const;

// ─────────────────────────────────────────────────────────────
// SHIFT FORM — Cierre de Turno
// ─────────────────────────────────────────────────────────────
export const SHIFT_FORM = {
  sectionTitle:   'Carga Diaria',
  sectionSubtitle: 'Resumen final de tu jornada de trabajo',

  fields: {
    fare: {
      label:       'Recaudación Total',
      adjustMinus: 'Restar 5000',
      adjustPlus:  'Sumar 5000',
    },
    distance: {
      label:       'Kilómetros Totales',
      placeholder: 'KM de tu odómetro',
    },
    duration: {
      label:       'Horas Conectado',
      placeholder: 'Hs totales',
    },
    activeTime: {
      label:       'Horas en Viaje',
      placeholder: 'Hs activas',
      hint:        'Del resumen de tu app (Uber, Rappi, etc.)',
    },
    tips: {
      label:       'Propinas',
      placeholder: '0',
    },
    expenses: {
      label:       'Gastos Extras',
      placeholder: '0',
      hint:        'Peajes, comida, etc.',
    },
  },

  saveButton: 'Cerrar Turno',
  clearButton: 'Limpiar Formulario',
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
