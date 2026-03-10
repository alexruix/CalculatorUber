import { Car, Fuel, Settings, CheckCircle2, ChevronRight, DollarSign, Info, Package, Bike, Truck, HelpCircle, ChevronLeft, Rocket, Zap, Wrench, ShieldCheck } from '../lib/icons';
import type { VerticalType } from '../types/calculator.types';

export interface VerticalOption {
    id: VerticalType;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    apps: string[];
    color: {
        text: string;
        bg: string;
        border: string;
        glow: string;
    };
}
export const AMORTIZATION_DEFAULTS = {
    transport: {
        vehicleValue: 4500000,
        vehicleLifetimeKm: 250000,
        perKm: 18,
    },
    delivery: {
        vehicleValue: 1800000,
        vehicleLifetimeKm: 80000,
        perKm: 22,
    },
    logistics: {
        vehicleValue: 8000000,
        vehicleLifetimeKm: 400000,
        perKm: 20,
    },
};

export const EXPENSE_META: Record<
    string,
    { Icon: React.ElementType; label: string; description: string }
> = {
    fuel: {
        Icon: Fuel,
        label: 'Combustible',
        description: 'Gasto de nafta por KM recorrido',
    },
    maintenance: {
        Icon: Wrench,
        label: 'Mantenimiento',
        description: 'Lavado, aceite y gastos corrientes',
    },
    amortization: {
        Icon: ShieldCheck,
        label: 'Amortización',
        description: 'Ahorro para mecánico y desgaste',
    },
};

export const VERTICAL_OPTIONS: VerticalOption[] = [
    {
        id: 'transport',
        icon: Car,
        title: 'Transporte',
        subtitle: 'Viajes con pasajeros',
        apps: ['Uber', 'Cabify', 'DiDi'],
        color: {
            text: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/30',
            glow: 'var(--color-primary-glow)'
        }
    },
    {
        id: 'delivery',
        icon: Package,
        title: 'Delivery',
        subtitle: 'Reparto urbano',
        apps: ['PedidosYa', 'Rappi'],
        color: {
            text: 'text-secondary',
            bg: 'bg-secondary/10',
            border: 'border-secondary/30',
            glow: 'var(--color-secondary-glow)'
        }
    },
    {
        id: 'logistics',
        icon: Truck,
        title: 'Logística',
        subtitle: 'Cargas y fletes',
        apps: ['Mercado Libre', 'Fletes'],
        color: {
            text: 'text-info',
            bg: 'bg-info/10',
            border: 'border-info/30',
            glow: 'rgba(56, 189, 248, 0.4)'
        }
    }
];

export const ONBOARDING_TEXTS = {
    step1: {
        header: 'Manejate',
        caption: 'Configuración',
        title: '¿En qué rubro trabajás?',
        subtitle: 'Paso 1 de 3',
        helpTitle: '¿No sabés cuál elegir?',
        helpContent: 'Si trabajás con más de un rubro, elegí el que hacés más seguido. Después podés cambiar esto en Configuración.',
        continue: 'Continuar'
    },
    step2: {
        header: 'Manejate',
        caption: 'Configuración',
        titleSubtitle: 'Paso 2 de 3',
        bikeTitle: 'Tu Bicicleta',
        vehicleTitleFallback: 'Tu Vehículo',
        subselectorBike: 'Bici',
        subselectorMoto: 'Moto',
        
        fields: {
            vehicleName: {
                label: 'Modelo o apodo del vehículo',
                options: {
                    logistics: 'Ej: Renault Kangoo',
                    default: 'Ej: Honda Wave 110, Fiat Cronos'
                },
                placeholderMoto: 'Ej: Honda Wave',
                placeholderCar: 'Ej: Peugeot 208'
            },
            fuelPrice: {
                label: 'Nafta/GNC ($/L)',
                placeholder: '1600'
            },
            kmPerLiter: {
                label: 'Consumo (km/L)',
                placeholderMoto: '35',
                placeholderCar: '9'
            },
            maintenance: {
                labelBike: 'Reserva de mantenimiento',
                labelDefault: 'Gasto de mantenimiento',
                hintBike: 'Cámaras, frenos, cubierta',
                hintDefault: 'Aceite, frenos, neumáticos, etc.',
                suffixBike: '$/SEM',
                suffixDefault: '$/KM'
            },
            amortization: {
                label: 'Amortización vehicular',
                recommended: '(Recomendado)',
                optional: '(opcional)',
                help: 'Dejalo en automático y ajustalo después en Configuración.',
                autoTitle: 'Cálculo Automático',
                autoP1: 'Estimamos',
                autoP2: 'de amortización basado en un vehículo de',
                autoP3: 'promedio.',
                autoP4: 'Podés ajustarlo después en Configuración → Mi Vehículo',
                
                valueLabel: 'Valor del vehículo ($)',
                valueHint: 'Precio de mercado actual',
                
                lifetimeLabel: 'Vida útil (km)',
                lifetimeHint: 'KM totales estimados'
            }
        }
    },
    step3: {
        title: 'Gastos Activos',
        subtitle: 'Paso 3 de 3',
        infoCard: 'El radar MANEJATE usará estos datos para calcular tu ROI en tiempo real.',
        educationNote: 'Podés activar/desactivar estos gastos en cualquier momento desde Configuración. Al apagar un gasto, tu margen sube en tiempo real.',
        backButton: 'Atrás',
        finishButton: 'Comenzar'
    }
}
