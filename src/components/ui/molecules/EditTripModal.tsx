/**
 * EditTripModal.tsx - Refactored Molecule
 * Trip editing modal with gaming aesthetics
 * 
 * Uses Park UI Dialog (recommended) or custom modal
 * Integrates with refactored Input, Label, Button atoms
 */

import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Navigation, Clock, Timer } from 'lucide-react';
import { cn } from '../../../lib/utils';
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

export const EditTripModal: React.FC<EditTripModalProps> = ({
  trip,
  isOpen,
  onClose,
  onSave,
}) => {
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 pointer-events-none">
        <div
          className={cn(
            'w-full max-w-lg pointer-events-auto',
            'bg-slate border-2 border-primary/30',
            'rounded-t-4xl sm:rounded-4xl',
            'p-8',
            'shadow-[0_0_40px_var(--color-primary-glow)]',
            'animate-zoom-in animate-slide-in-top'
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2
              id="modal-title"
              className="text-xl font-extrabold text-starlight uppercase flex items-center gap-3"
            >
              <Save className="w-5 h-5 text-secondary" />
              Editar Viaje
            </h2>
            
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg',
                'text-moon hover:text-starlight',
                'hover:bg-white/10',
                'transition-colors duration-200'
              )}
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Fare */}
            <div className="space-y-2">
              <Label>Tarifa Bruta ($)</Label>
              <Input
                type="number"
                value={formData.fare}
                onChange={(e) =>
                  setFormData({ ...formData, fare: e.target.value })
                }
                icon={DollarSign}
                placeholder="0"
              />
            </div>

            {/* Distance */}
            <div className="space-y-2">
              <Label>Distancia (KM)</Label>
              <Input
                type="number"
                value={formData.distance}
                onChange={(e) =>
                  setFormData({ ...formData, distance: e.target.value })
                }
                icon={Navigation}
                placeholder="0"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duración (Min)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                icon={Clock}
                placeholder="0"
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label>Inicio (HH:MM)</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                icon={Timer}
              />
            </div>
          </div>

          {/* Actions */}
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

EditTripModal.displayName = 'EditTripModal';