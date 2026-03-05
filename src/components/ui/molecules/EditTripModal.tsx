//
import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Navigation, Clock, Timer } from '../../../lib/icons';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Button } from '../atoms/Button';
import type { SavedTrip } from '../../../types/calculator.types';

interface EditTripModalProps {
    trip: SavedTrip;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number | string, data: Partial<SavedTrip>) => Promise<void>;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({ trip, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fare: trip.fare.toString(),
        distance: trip.distance.toString(),
        duration: trip.duration.toString(),
        startTime: trip.startTime || '',
        tip: (trip.tip || 0).toString(),
        tolls: (trip.tolls || 0).toString(),
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                fare: trip.fare.toString(),
                distance: trip.distance.toString(),
                duration: trip.duration.toString(),
                startTime: trip.startTime || '',
                tip: (trip.tip || 0).toString(),
                tolls: (trip.tolls || 0).toString(),
            });
        }
    }, [isOpen, trip]);

    if (!isOpen) return null;

    const handleSave = async () => {
        // Mapeo de tipos para asegurar consistencia
        const updatedData: Partial<SavedTrip> = {
            fare: Number(formData.fare),
            distance: Number(formData.distance),
            duration: Number(formData.duration),
            startTime: formData.startTime,
            tip: Number(formData.tip),
            tolls: Number(formData.tolls),
        };

        await onSave(trip.id, updatedData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-t-4xl sm:rounded-4xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-white uppercase flex items-center gap-3">
                        <Save className="w-5 h-5 text-info" />
                        Editar Viaje
                    </h2>
                    <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <Label>Tarifa Bruta ($)</Label>
                        <Input 
                            type="number" 
                            value={formData.fare} 
                            onChange={(e) => setFormData({...formData, fare: e.target.value})}
                            // icon={DollarSign}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Distancia (KM)</Label>
                        <Input 
                            type="number" 
                            value={formData.distance} 
                            onChange={(e) => setFormData({...formData, distance: e.target.value})}
                            // icon={Navigation}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Duración (Min)</Label>
                        <Input 
                            type="number" 
                            value={formData.duration} 
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            // icon={Clock}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Inicio (HH:MM)</Label>
                        <Input 
                            type="time" 
                            value={formData.startTime} 
                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                            // icon={Timer}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
                    <Button variant="primary" onClick={handleSave} className="flex-1">Guardar Cambios</Button>
                </div>
            </div>
        </div>
    );
};