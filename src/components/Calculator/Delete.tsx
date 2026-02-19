import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Settings, Trophy, ChevronUp } from 'lucide-react';

// Hooks personalizados
import { useProfitability } from '../../hooks/useProfitability';
import { useSessionStorage } from '../../hooks/useSessionStorage';

// Componentes
import { Onboarding } from './Onboarding';
import { ProfileSettings } from './ProfileSettings';
import { SessionControls } from './SessionControls';
import { ProfitabilityScore } from './ProfitabilityScore';
import { TripInputForm } from './TripInputForm';
import { SessionSummary } from './SessionSummary';
import { SessionAnalysis } from './SessionAnalysis';
import { BottomTabNavigation } from '../BottomNavigation';

// Types
import type { SavedTrip, ExpenseToggle } from '../../types/calculator.types';

/**
 * Componente principal del Calculador de Rentabilidad NODO
 * Orquesta todos los sub-componentes y maneja el estado global de la aplicación
 */
const Calculator: React.FC = () => {
  // ========================================================================
  // ESTADO: Onboarding & Configuración
  // ======================================================================== const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [vehicleName, setVehicleName] = useState('Chevrolet Spin 2018');
  const [kmPerLiter, setKmPerLiter] = useState(9);
  const [maintPerKm, setMaintPerKm] = useState(10);
  const [expenseSettings, setExpenseSettings] = useState<ExpenseToggle[]>([
    { id: 'fuel', label: 'Combustible', enabled: true },
    { id: 'maintenance', label: 'Mantenimiento', enabled: true },
    { id: 'amortization', label: 'Amortización', enabled: false },
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
  // ESTADO: Vistas Dinámicas
  // ========================================================================
  const [showAnalysis, setShowAnalysis] = useState(false);


  // ========================================================================
  // CÁLCULO: Métricas de Rentabilidad
  // ========================================================================

  useEffect(() => {
    const savedConfig = localStorage.getItem('nodo_config_v1');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setIsConfigured(true);
        setVehicleName(config.vehicleName);
        setKmPerLiter(config.kmPerLiter);
        setMaintPerKm(config.maintPerKm);
        setExpenseSettings(config.expenseSettings);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

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

  /* Completa el onboarding y guarda la configuración     */
  const handleOnboardingComplete = (config: {
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
    expenseSettings: ExpenseToggle[];
  }) => {
    setVehicleName(config.vehicleName);
    setKmPerLiter(config.kmPerLiter);
    setMaintPerKm(config.maintPerKm);
    setExpenseSettings(config.expenseSettings);

    // Guardar en localStorage
    localStorage.setItem('nodo_config_v1', JSON.stringify(config));
    setIsConfigured(true);
  };

  /**
   * Guarda el viaje actual en la sesión y reinicia los inputs
   */
  const saveTrip = () => {
    if (!metrics.isValid) return;
    const newTrip: SavedTrip = {
      id: Date.now(),
      fare: parseFloat(fare),
      margin: metrics.netMargin,
      distance: parseFloat(distTrip) + (parseFloat(distPickup) || 0), // Guardamos distancia total
      duration: parseFloat(duration), // Guardamos duración
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

  /**
     * Elimina un viaje individual del historial
     */
  const deleteTrip = (id: number) => {
    setSessionTrips(prev => prev.filter(trip => trip.id !== id));
  };


  const [activeTab, setActiveTab] = useState<TabId>('calculator');

  /**
     * Actualiza la configuración desde ProfileSettings
     */
  const updateConfiguration = (updates: {
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
    expenseSettings: ExpenseToggle[];
  }) => {
    setVehicleName(updates.vehicleName);
    setKmPerLiter(updates.kmPerLiter);
    setMaintPerKm(updates.maintPerKm);
    setExpenseSettings(updates.expenseSettings);

    // Actualizar en localStorage
    localStorage.setItem('nodo_config_v1', JSON.stringify(updates));
  };

  // ========================================================================
  // RENDER: Onboarding
  // ========================================================================
  if (!isConfigured) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }


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
          maintPerKm={maintPerKm}
          setMaintPerKm={setMaintPerKm}
          expenseSettings={expenseSettings}
          setExpenseSettings={setExpenseSettings}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          onSave={updateConfiguration}
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
          onDeleteTrip={deleteTrip}
        />

        {/* Análisis de Sesión con Insights y Gamificación */}
        {/* ========================================================= */}
        {sessionTrips.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all touch-target flex items-center justify-center gap-2 border ${showAnalysis
                ? 'bg-white/5 border-white/10 text-white/60'
                : 'bg-gradient-to-r from-nodo-petrol/20 to-nodo-petrol/5 border-nodo-petrol/30 text-nodo-petrol hover:bg-nodo-petrol/30'
                }`}
            >
              {showAnalysis ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Ocultar Análisis
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Ver Análisis de Sesión
                </>
              )}
            </button>
          </div>
        )}

        {/* El componente se muestra solo si el botón fue presionado */}
        {showAnalysis && sessionTrips.length > 0 && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <SessionAnalysis trips={sessionTrips} />
          </div>
        )}

        {/* Botón de Reinicio */}
        <button
          onClick={resetInputs}
          className="w-full py-4 text-[10px] font-black text-white/20 hover:text-white flex items-center justify-center gap-2 tracking-widest transition-all uppercase"
        >
          {/* <RotateCcw className="w-3 h-3" /> Reiniciar Calculadora */}
        </button>
      </main>

      <BottomTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badgeCount={sessionTrips.length}
      />

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



