import React, { useState, useEffect } from 'react';
import { X, Save, Car, Fuel, DollarSign } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Button } from '../atoms/Button';

interface EditVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { vehicleName: string; fuelPrice: number; kmPerLiter: number }) => void;
    initialData: {
        vehicleName: string;
        fuelPrice: number;
        kmPerLiter: number;
    };
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        vehicleName: initialData.vehicleName || '',
        fuelPrice: initialData.fuelPrice.toString(),
        kmPerLiter: initialData.kmPerLiter.toString(),
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                vehicleName: initialData.vehicleName || '',
                fuelPrice: initialData.fuelPrice.toString(),
                kmPerLiter: initialData.kmPerLiter.toString(),
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            vehicleName: formData.vehicleName,
            fuelPrice: parseFloat(formData.fuelPrice) || 0,
            kmPerLiter: parseFloat(formData.kmPerLiter) || 0,
        });
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4 pointer-events-none">
                <div
                    className={cn(
                        'w-full max-w-lg pointer-events-auto',
                        'bg-slate border-2 border-primary/30',
                        'rounded-t-4xl sm:rounded-4xl',
                        'p-8',
                        'shadow-[0_0_40px_var(--color-primary-glow)]',
                        'animate-in slide-in-from-bottom-4 duration-300'
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-vehicle-title"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 id="edit-vehicle-title" className="text-xl font-extrabold text-starlight uppercase flex items-center gap-3">
                            <Car className="w-5 h-5 text-primary" />
                            Editar Vehículo
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-lg text-moon hover:text-starlight hover:bg-white/10 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="space-y-2">
                            <Label>Modelo o apodo</Label>
                            <Input
                                value={formData.vehicleName}
                                onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                                placeholder="Ej: Fiat Cronos"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Precio Nafta ($/L)</Label>
                                <Input
                                    type="number"
                                    value={formData.fuelPrice}
                                    onChange={(e) => setFormData({ ...formData, fuelPrice: e.target.value })}
                                    icon={<DollarSign size={20} />}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Consumo (KM/L)</Label>
                                <Input
                                    type="number"
                                    value={formData.kmPerLiter}
                                    onChange={(e) => setFormData({ ...formData, kmPerLiter: e.target.value })}
                                    icon={<Fuel size={20} />}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={onClose} className="flex-1">
                            Cancelar
                        </Button>
                        <Button variant="neon" onClick={handleSave} className="flex-1">
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
