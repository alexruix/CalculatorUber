import React from 'react';
import { Clock } from 'lucide-react';
import { Input } from '../atoms/Input';

interface TimeInputProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
    id = "time-input",
    value,
    onChange,
    className,
    disabled = false
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;

        // 1. Limpiamos todo lo que no sea número y limitamos a 4 dígitos
        let raw = inputVal.replace(/\D/g, '').slice(0, 4);

        if (raw.length === 0) {
            onChange('');
            return;
        }

        // 2. UX Hack: Si tipean del 3 al 9 al principio, asumimos que es "03" a "09"
        if (raw.length === 1 && parseInt(raw[0]) > 2) {
            raw = `0${raw[0]}`;
        }

        // 3. Validar Horas (Max 23)
        if (raw.length >= 2) {
            const hours = parseInt(raw.slice(0, 2));
            if (hours > 23) {
                // Si intenta poner 24 o más, lo clavamos en 23
                raw = `23${raw.slice(2)}`;
            }
        }

        // 4. Validar Minutos (Max 59)
        if (raw.length >= 3) {
            const minTens = parseInt(raw[2]);
            if (minTens > 5) {
                // Si intenta poner 6x, 7x, 8x o 9x en minutos, lo bajamos a 5x
                raw = `${raw.slice(0, 2)}5${raw.slice(3)}`;
            }
        }

        // 5. Aplicar la máscara HH:MM
        let formatted = raw;
        if (raw.length >= 2) {
            // Si el usuario está borrando (backspace) y queda justo en los 2 dígitos, no le agregamos los dos puntos
            // Si está escribiendo y pasa los 2 dígitos, agregamos los dos puntos
            if (inputVal.endsWith(':') && raw.length === 2) {
                formatted = raw; // Permite borrar los dos puntos
            } else if (raw.length > 2) {
                formatted = `${raw.slice(0, 2)}:${raw.slice(2)}`;
            } else if (inputVal.length > value.length && raw.length === 2) {
                // Agrega los dos puntos automáticamente al llegar a 2 dígitos escribiendo
                formatted = `${raw}:`;
            }
        }

        onChange(formatted);
    };

    return (
        <Input
            id={id}
            type="text" // Debe ser text para controlar la máscara
            inputMode="numeric" // 🚀 MAGIA UX: Levanta el teclado numérico gigante en móviles
            placeholder="00:00"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            icon={<Clock className="w-5 h-5 text-starlight" />}
            suffix={<span className="text-[10px] font-black text-moon tracking-widest uppercase">24h</span>}
            maxLength={5}
            className={className}
        />
    );
};