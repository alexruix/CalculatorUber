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
import { Modal } from './Modal';
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Viaje"
      icon={<Save className="w-5 h-5" />}
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
      <div className="grid grid-cols-2 gap-6">
        {/* Fare */}
        <div className="space-y-2">
          <Label>Tarifa Bruta ($)</Label>
          <Input
            type="number"
            value={formData.fare}
            onChange={(e) =>
              setFormData({ ...formData, fare: e.target.value })
            }
            icon={<DollarSign className="w-5 h-5" />}
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
            icon={<Navigation className="w-5 h-5" />}
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
            icon={<Clock className="w-5 h-5" />}
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
            icon={<Timer className="w-5 h-5" />}
          />
        </div>
      </div>
    </Modal>
  );
};

EditTripModal.displayName = 'EditTripModal';