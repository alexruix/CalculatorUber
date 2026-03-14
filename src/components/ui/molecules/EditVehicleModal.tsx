import React, { useState, useEffect } from 'react';
import { X, Save, Car, Fuel, DollarSign } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Button } from '../atoms/Button';
import { Modal } from './Modal';

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Vehículo"
            icon={<Car className="w-5 h-5" />}
            footer={
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button variant="neon" onClick={handleSave} className="flex-1">
                        Guardar Cambios
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
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
        </Modal>
    );
};
