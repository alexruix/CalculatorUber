import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Settings, Trophy, ChevronUp } from 'lucide-react';

// Hooks personalizados
import { useProfitability } from '../../hooks/useProfitability';
import { useSessionStorage } from '../../hooks/useSessionStorage';

// Componentes de Estructura
import { Onboarding } from './Onboarding';
import { BottomTabNavigation, type TabId } from '../BottomNavigation';

// Componentes de Pestañas (Tabs)
import { CalculatorTab } from '../Tabs/CalculatorTabs';
import { ProfileTab } from '../Tabs/ProfileTab';
import { SessionAnalysis } from './SessionAnalysis';
import { SessionSummary } from './SessionSummary';
// import { DailyGoals } from './DailyGoals';

// Types
import type { SavedTrip, ExpenseToggle } from '../../types/calculator.types';

const Calculator: React.FC = () => {
  // ========================================================================
  // ESTADO: Onboarding & Configuración (Perfil)
  // ========================================================================
  const [isConfigured, setIsConfigured] = useState(false);
  const [vehicleName, setVehicleName] = useState('Name');
  const [kmPerLiter, setKmPerLiter] = useState(9);
  const [maintPerKm, setMaintPerKm] = useState(10);
  const [expenseSettings, setExpenseSettings] = useState<ExpenseToggle[]>([
    { id: 'fuel', label: 'Combustible', enabled: true },
    { id: 'maintenance', label: 'Mantenimiento', enabled: true },
    { id: 'amortization', label: 'Amortización', enabled: false },
  ]);

  // ========================================================================
  // ESTADO: Datos de Entrada del Viaje (Calculadora)
  // ========================================================================
  const [fare, setFare] = useState('');
  const [distTrip, setDistTrip] = useState('');
  const [distPickup, setDistPickup] = useState('');
  const [duration, setDuration] = useState('');

  // ========================================================================
  // ESTADO: Parámetros de Jornada
  // ========================================================================
  const [fuelPrice, setFuelPrice] = useState(1600);
  const [isHeavyTraffic, setIsHeavyTraffic] = useState(false);

  // ========================================================================
  // ESTADO: Navegación y Persistencia
  // ========================================================================
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const [sessionTrips, setSessionTrips] = useSessionStorage('nodo_session_v1', []);

  // Cargar configuración inicial
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

  // Algoritmo de rentabilidad (Cerebro de la App)
  const metrics = useProfitability(
    fare, distTrip, distPickup, kmPerLiter,
    maintPerKm, fuelPrice, isHeavyTraffic, expenseSettings
  );

  // Nivel del conductor basado en experiencia (Gamificación)
  const driverLevel = useMemo(() => Math.floor(sessionTrips.length / 5) + 1, [sessionTrips]);

  // ========================================================================
  // HANDLERS
  // ========================================================================
  const handleOnboardingComplete = (config: any) => {
    updateConfiguration(config);
    setIsConfigured(true);
  };

  const updateConfiguration = (updates: any) => {
    setVehicleName(updates.vehicleName);
    setKmPerLiter(updates.kmPerLiter);
    setMaintPerKm(updates.maintPerKm);
    setExpenseSettings(updates.expenseSettings);
    localStorage.setItem('nodo_config_v1', JSON.stringify(updates));
  };

  const saveTrip = () => {
    if (!metrics.isValid) return;
    const newTrip: SavedTrip = {
      id: Date.now(),
      fare: parseFloat(fare),
      margin: metrics.netMargin,
      distance: parseFloat(distTrip) + (parseFloat(distPickup) || 0),
      duration: parseFloat(duration),
      timestamp: Date.now()
    };
    setSessionTrips([newTrip, ...sessionTrips]);
    resetInputs();
  };

  const resetInputs = () => {
    setFare(''); setDistTrip(''); setDistPickup(''); setDuration('');
  };

  const clearSession = () => {
    if (confirm('¿Borrar historial del día?')) setSessionTrips([]);
  };

  const deleteTrip = (id: number) => {
    setSessionTrips(prev => prev.filter(t => t.id !== id));
  };

  // ========================================================================
  // RENDER: Lógica de Pestañas
  // ========================================================================
  if (!isConfigured) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header Fijo con Branding NODO */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Maguito</h1>
            <p className="text-xs text-slate-400 mt-0.5">Calculadora de rentabilidad</p>
          </div>
          {/* <div className="flex items-center gap-2 px-3 py-1 bg-nodo-sand/10 rounded-full border border-nodo-petrol/20">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-nodo-petrol uppercase">Live</span>
          </div> */}
        </div>
      </header>

      {/* Contenedor Principal de Pestañas */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-4">
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* <DailyGoals totalMargin={sessionTrips.reduce((acc, t) => acc + t.margin, 0)} /> */}
            <CalculatorTab
              metrics={metrics}
              fare={fare} setFare={setFare}
              distTrip={distTrip} setDistTrip={setDistTrip}
              distPickup={distPickup} setDistPickup={setDistPickup}
              duration={duration} setDuration={setDuration}
              fuelPrice={fuelPrice} setFuelPrice={setFuelPrice}
              isHeavyTraffic={isHeavyTraffic} setIsHeavyTraffic={setIsHeavyTraffic}
              onSaveTrip={saveTrip}
              onReset={resetInputs}
            />
          </div>
        )}

        {activeTab === 'session' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6">
            <SessionAnalysis trips={sessionTrips} />
            <SessionSummary trips={sessionTrips} onClear={clearSession} onDeleteTrip={deleteTrip} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProfileTab
              vehicleName={vehicleName} setVehicleName={setVehicleName}
              kmPerLiter={kmPerLiter} setKmPerLiter={setKmPerLiter}
              maintPerKm={maintPerKm} setMaintPerKm={setMaintPerKm}
              fuelPrice={fuelPrice} setFuelPrice={setFuelPrice}
              expenseSettings={expenseSettings} setExpenseSettings={setExpenseSettings}
              isHeavyTraffic={isHeavyTraffic} setIsHeavyTraffic={setIsHeavyTraffic}
              onSaveConfig={updateConfiguration}
              onResetAll={() => { localStorage.clear(); window.location.reload(); }}
              totalTrips={sessionTrips.length}
              driverLevel={driverLevel}
            />
          </div>
        )}
      </main>

      {/* Navegación Inferior */}
      <BottomTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badgeCount={sessionTrips.length}
      />
    </div>
  );
};

export default Calculator;