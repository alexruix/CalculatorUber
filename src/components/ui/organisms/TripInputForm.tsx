import React from 'react';
import { DollarSign, Navigation, Navigation2, Clock, Minus, Plus, NotebookPen } from 'lucide-react';
import { useCalculatorStore } from '../../../store/useCalculatorStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { GlassCard } from '../molecules/GlassCard';
import { Badge } from '../atoms/Badge';
import { Coins, Map as MapIcon } from 'lucide-react';

interface TripInputFormProps {
    onSave: () => void;
    isValid: boolean;
}

export const TripInputForm: React.FC<TripInputFormProps> = ({ onSave, isValid }) => {
    const { vertical } = useProfileStore();
    const {
        fare, setFare,
        distTrip, setDistTrip,
        distPickup, setDistPickup,
        duration, setDuration,
        tip, setTip,
        tolls, setTolls
    } = useCalculatorStore();

    const quickDistances = [0, 0.5, 1.5, 3];

    const adjustValue = (value: string, setter: (v: string) => void, step: number) => {
        const current = parseFloat(value) || 0;
        setter(Math.max(0, current + step).toString());
    };

    return (
        <div className="card-main space-y-6">
            <div className={`grid gap-4 ${vertical === 'delivery' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div className="field-wrapper">
                    <label className="label-base ml-2">{vertical === 'logistics' ? 'Pago del Bloque' : 'Tarifa sugerida app'}</label>
                    <div className="flex items-center gap-3">
                        {vertical !== 'delivery' && (
                            <Button variant="icon" className="border border-white/10" onClick={() => adjustValue(fare, setFare, -500)} aria-label="Restar 500">
                                <Minus className="w-5 h-5" />
                            </Button>
                        )}
                        <div className="field-input-wrapper flex-1">
                            <DollarSign className="field-icon-left" aria-hidden="true" />
                            <Input type="number" inputMode="decimal" placeholder="0" value={fare} onChange={(e) => setFare(e.target.value)} className={`pl-12 font-black text-center ${vertical === 'delivery' ? 'text-2xl py-6' : 'text-3xl'}`} />
                        </div>
                        {vertical !== 'delivery' && (
                            <Button variant="icon" className="border border-white/10" onClick={() => adjustValue(fare, setFare, 500)} aria-label="Sumar 500">
                                <Plus className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                {vertical === 'delivery' && (
                    <div className="field-wrapper">
                        <label className="label-base ml-2">Propina Estimada</label>
                        <div className="field-input-wrapper flex-1">
                            <Coins className="field-icon-left text-nodo-accent" aria-hidden="true" />
                            <Input type="number" inputMode="decimal" placeholder="0" value={tip} onChange={(e) => setTip(e.target.value)} className="pl-12 text-2xl py-6 font-black text-center border-nodo-accent/30 bg-nodo-accent/5" />
                        </div>
                    </div>
                )}
            </div>

            {vertical === 'logistics' && (
                <div className="field-wrapper">
                    <label className="label-base ml-2">Gastos de Peaje / Estacionamiento</label>
                    <div className="field-input-wrapper">
                        <MapIcon className="field-icon-left" aria-hidden="true" />
                        <Input type="number" inputMode="decimal" placeholder="0" value={tolls} onChange={(e) => setTolls(e.target.value)} className="pl-12 text-lg font-bold" />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="field-wrapper">
                    <label className="label-base ml-2">Recorrido</label>
                    <div className="field-input-wrapper">
                        <Navigation className="field-icon-left" aria-hidden="true" />
                        <Input type="number" placeholder="KM" value={distTrip} onChange={(e) => setDistTrip(e.target.value)} className="pl-9 text-lg" />
                    </div>
                </div>
                <div className="field-wrapper">
                    <label className="label-base ml-2">Minutos de reloj</label>
                    <div className="field-input-wrapper">
                        <Clock className="field-icon-left" aria-hidden="true" />
                        <Input type="number" placeholder="0" value={duration} onChange={(e) => setDuration(e.target.value)} className="pl-9 text-lg" />
                    </div>
                </div>
            </div>

            <GlassCard
                summary={
                    <>
                        <div className="flex items-center gap-2">
                            <Navigation2 className="w-4 h-4 text-white/20" />
                            <span className="text-sm font-bold text-white">Distancia hasta el pasajero</span>
                        </div>
                        {parseFloat(distPickup) > 0 && <Badge variant="accent">{distPickup} KM</Badge>}
                    </>
                }
            >
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {quickDistances.map((val) => (
                        <button key={val} onClick={() => setDistPickup(val.toString())} className={distPickup === val.toString() ? 'filter-chip-active' : 'filter-chip-inactive'}>
                            {val === 0 ? 'EN EL LUGAR' : `${val} KM`}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="icon" className="border border-white/10 w-10 h-10" onClick={() => adjustValue(distPickup, setDistPickup, -0.5)}>
                        <Minus className="w-4 h-4" />
                    </Button>
                    <Input type="number" placeholder="Manual" value={distPickup} onChange={(e) => setDistPickup(e.target.value)} className="flex-1 text-sm text-center" />
                    <Button variant="icon" className="border border-white/10 w-10 h-10" onClick={() => adjustValue(distPickup, setDistPickup, 0.5)}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </GlassCard>

            <Button disabled={!isValid} onClick={onSave} variant="primary">
                <NotebookPen className="w-5 h-5" /> Anotar viaje
            </Button>
        </div>
    );
};
