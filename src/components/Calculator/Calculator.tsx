import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

// Hooks personalizados
import { useProfitability } from '../../hooks/useProfitability';
import { useSessionStorage } from '../../hooks/useSessionStorage';

// Componentes
import { ProfileSettings } from './ProfileSettings';
import { SessionControls } from './SessionControls';
import { ProfitabilityScore } from './ProfitabilityScore';
import { TripInputForm } from './TripInputForm';
import { SessionSummary } from './SessionSummary';

// Types
import type { SavedTrip, ExpenseToggle } from '../../types/calculator.types';

/**
 * Componente principal del Calculador de Rentabilidad NODO
 * Orquesta todos los sub-componentes y maneja el estado global de la aplicación
 */
const Calculator: React.FC = () => {
  
  // ========================================================================
  // ESTADO: Configuración de Vehículo y Gastos
  // ========================================================================
  const [vehicleName, setVehicleName] = useState('Chevrolet Spin 2018');
  const [kmPerLiter, setKmPerLiter] = useState(9);
  const [maintPerKm] = useState(10); // Costo de mantenimiento por KM
  const [showSettings, setShowSettings] = useState(false);
  
  // Configuración de gastos (actualmente solo combustible activo)
  const [expenseSettings] = useState<ExpenseToggle[]>([
    { id: 'fuel', label: 'Combustible', enabled: true },
    // Descomentar para activar otros gastos:
    // { id: 'maintenance', label: 'Mantenimiento', enabled: false },
    // { id: 'amortization', label: 'Amortización', enabled: false },
  ]);

  // ========================================================================
  // ESTADO: Datos de Entrada del Viaje
  // ========================================================================
  const [fare, setFare] = useState('');
  const [distTrip, setDistTrip] = useState('');
  const [distPickup, setDistPickup] = useState('');
  const [duration, setDuration] = useState('');

  // ========================================================================
  // ESTADO: Parámetros de Jornada
  // ========================================================================
  const [fuelPrice, setFuelPrice] = useState(1600); // Precio por litro
  const [isHeavyTraffic, setIsHeavyTraffic] = useState(false); // Reduce eficiencia 20%

  // ========================================================================
  // ESTADO: Persistencia de Sesión
  // ========================================================================
  const [sessionTrips, setSessionTrips] = useSessionStorage('nodo_session_v1', []);

  // ========================================================================
  // CÁLCULO: Métricas de Rentabilidad
  // ========================================================================
  const metrics = useProfitability(
    fare,
    distTrip,
    distPickup,
    kmPerLiter,
    maintPerKm,
    fuelPrice,
    isHeavyTraffic,
    expenseSettings
  );

  // ========================================================================
  // HANDLERS: Acciones del Usuario
  // ========================================================================
  
  /**
   * Guarda el viaje actual en la sesión y reinicia los inputs
   */
  const saveTrip = () => {
    if (!metrics.isValid) return;
    
    const newTrip: SavedTrip = {
      id: Date.now(),
      fare: parseFloat(fare),
      margin: metrics.netMargin,
      timestamp: Date.now()
    };
    
    setSessionTrips([newTrip, ...sessionTrips]);
    resetInputs();
  };

  /**
   * Reinicia todos los campos de entrada a valores vacíos
   */
  const resetInputs = () => {
    setFare('');
    setDistTrip('');
    setDistPickup('');
    setDuration('');
  };

  /**
   * Limpia el historial de viajes de la sesión (con confirmación)
   */
  const clearSession = () => {
    if (confirm('¿Borrar historial del día?')) {
      setSessionTrips([]);
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      
      {/* Header fijo con branding */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">NODO</h1>
              <p className="text-xs text-slate-400 mt-0.5">Calculadora de Rentabilidad</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-4">
        
        {/* Configuración de Perfil de Vehículo */}
        <ProfileSettings 
          vehicleName={vehicleName}
          setVehicleName={setVehicleName}
          kmPerLiter={kmPerLiter}
          setKmPerLiter={setKmPerLiter}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        {/* Controles de Sesión (Tráfico y Combustible) */}
        <SessionControls 
          isHeavyTraffic={isHeavyTraffic}
          setIsHeavyTraffic={setIsHeavyTraffic}
          fuelPrice={fuelPrice}
          setFuelPrice={setFuelPrice}
        />

        {/* Score Visual de Rentabilidad */}
        <ProfitabilityScore metrics={metrics} />

        {/* Formulario de Entrada de Datos */}
        <TripInputForm 
          fare={fare}
          setFare={setFare}
          distTrip={distTrip}
          setDistTrip={setDistTrip}
          distPickup={distPickup}
          setDistPickup={setDistPickup}
          duration={duration}
          setDuration={setDuration}
          onSave={saveTrip}
          isValid={metrics.isValid}
        />

        {/* Resumen de Sesión del Día */}
        <SessionSummary 
          trips={sessionTrips}
          onClear={clearSession}
        />

        {/* Botón de Reinicio */}
        <button 
          onClick={resetInputs} 
          className="w-full py-4 text-[10px] font-black text-white/20 hover:text-white flex items-center justify-center gap-2 tracking-widest transition-all uppercase"
        >
          <RotateCcw className="w-3 h-3" /> Reiniciar Calculadora
        </button>
      </main>

      {/* Footer fijo */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <p className="text-xs text-slate-500">Listo para OAuth de Uber</p>
          <p className="text-xs text-slate-600">NODO Studio © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;