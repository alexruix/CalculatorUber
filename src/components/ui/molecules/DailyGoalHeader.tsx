/**
 * DailyGoalHeader.tsx — Header con Meta del Día
 * ─────────────────────────────────────────────────────────────
 * Muestra progreso hacia la meta diaria con modo de edición inline.
 * Dispara visuales de éxito al alcanzar el 100%.
 *
 * @molecule
 */
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils';
import { HOME_SCREEN } from '../../../data/ui-strings';
import { Target, Pencil } from '../../../lib/icons';

interface DailyGoalHeaderProps {
    earned: number;
    goal: number;
    onGoalChange: (newGoal: number) => void;
    className?: string;
}

export const DailyGoalHeader: React.FC<DailyGoalHeaderProps> = ({
    earned,
    goal,
    onGoalChange,
    className,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localGoal, setLocalGoal] = useState(goal.toString());
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Fallback de strings por si HOME_SCREEN no está disponible en este scope
    const g = HOME_SCREEN?.dailyGoal || { title: 'Meta del día', editHint: 'Editar meta', achieved: '¡Meta superada!' };

    const progress = goal > 0 ? Math.min(100, Math.round((earned / goal) * 100)) : 0;
    const achieved = progress >= 100;

    // 1. ANTI-STALE STATE: Mantiene el input sincronizado si el goal externo cambia
    useEffect(() => {
        if (!isEditing) {
            setLocalGoal(goal.toString());
        }
    }, [goal, isEditing]);

    // Autofocus al editar
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    // 2. PARSING ROBUSTO
    const commitEdit = () => {
        const parsed = parseFloat(localGoal);
        if (!isNaN(parsed) && parsed > 0) {
            onGoalChange(parsed);
        } else {
            // Revertir a la meta anterior si el input es inválido
            setLocalGoal(goal.toString());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') commitEdit();
        if (e.key === 'Escape') {
            setLocalGoal(goal.toString()); // Revertir cambios
            setIsEditing(false);
        }
    };

    // 3. OPTIMIZACIÓN DE RENDER
    const getBarColor = () => {
        if (progress >= 100) return 'bg-success shadow-[0_0_10px_var(--color-success-dim)]';
        if (progress >= 60) return 'bg-primary shadow-[0_0_10px_var(--color-primary-glow)]';
        if (progress >= 30) return 'bg-accent shadow-[0_0_8px_var(--color-accent-glow)]';
        return 'bg-white/30';
    };

    return (
        <div
            className={cn(
                'rounded-3xl p-5 border-2 transition-all duration-500 relative overflow-hidden',
                achieved
                    ? 'border-success bg-success/10 shadow-[0_0_30px_var(--color-success-dim)]'
                    : 'border-white/10 bg-white/3',
                className
            )}
            aria-label="Meta diaria"
        >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-white/60 uppercase tracking-widest font-bold text-[10px]">
                        {g.title}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    aria-label={g.editHint}
                    className="p-2 -mr-2 text-white/40 hover:text-white transition-colors rounded-lg"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Centro: Earned vs Goal */}
            <div className="flex items-end justify-between mb-3">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                            {formatCurrency(earned)}
                        </span>
                        <span className="text-white/30 font-bold text-sm mx-1">/</span>
                        
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="number"
                                inputMode="decimal"
                                value={localGoal}
                                onChange={(e) => setLocalGoal(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={handleKeyDown}
                                className="w-24 bg-transparent text-primary font-extrabold text-xl outline-none border-b-2 border-primary focus:border-primary/80 transition-colors p-0"
                                aria-label="Nueva meta"
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="text-primary font-extrabold text-xl hover:text-primary/80 transition-colors"
                                aria-label={g.editHint}
                            >
                                {formatCurrency(goal)}
                            </button>
                        )}
                    </div>
                    {achieved && (
                        <p className="text-success text-xs font-extrabold uppercase tracking-widest mt-1 animate-in fade-in slide-in-from-bottom-1">
                            {g.achieved}
                        </p>
                    )}
                </div>

                {/* Porcentaje */}
                <span className={cn(
                    'text-3xl font-black tabular-nums tracking-tighter',
                    achieved ? 'text-success' : 'text-white/60'
                )}>
                    {progress}%
                </span>
            </div>

            {/* Barra de Progreso (A11y Mejorada) */}
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <div
                    className={cn('h-full transition-all duration-1000 ease-out rounded-full', getBarColor())}
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={`${progress} por ciento completado`}
                />
            </div>
        </div>
    );
};

DailyGoalHeader.displayName = 'DailyGoalHeader';