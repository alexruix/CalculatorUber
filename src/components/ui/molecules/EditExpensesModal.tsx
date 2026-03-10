import React, { useState, useEffect } from 'react';
import { X, Wrench, ShieldCheck, Fuel, DollarSign } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Button } from '../atoms/Button';
import type { ExpenseToggle } from '../../../types/calculator.types';

interface EditExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { expenseSettings: ExpenseToggle[]; maintPerKm: number }) => void;
    initialData: {
        expenseSettings: ExpenseToggle[];
        maintPerKm: number;
    };
}

export const EditExpensesModal: React.FC<EditExpensesModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [expenseSettings, setExpenseSettings] = useState<ExpenseToggle[]>(initialData.expenseSettings);
    const [maintPerKm, setMaintPerKm] = useState(initialData.maintPerKm.toString());

    useEffect(() => {
        if (isOpen) {
            setExpenseSettings(initialData.expenseSettings);
            setMaintPerKm(initialData.maintPerKm.toString());
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleToggle = (id: string) => {
        setExpenseSettings(prev =>
            prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item))
        );
    };

    const handleSave = () => {
        onSave({
            expenseSettings,
            maintPerKm: parseFloat(maintPerKm) || 0,
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
                    aria-labelledby="edit-expenses-title"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 id="edit-expenses-title" className="text-xl font-extrabold text-starlight uppercase flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-secondary" />
                            Gastos y Costos
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-lg text-moon hover:text-starlight hover:bg-white/10 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6 mb-8">
                        {/* Toggles */}
                        <div className="space-y-3">
                            {expenseSettings.map((expense) => (
                                <button
                                    key={expense.id}
                                    onClick={() => handleToggle(expense.id)}
                                    className={cn(
                                        'w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300',
                                        expense.enabled ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/10'
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            'w-10 h-10 rounded-xl flex items-center justify-center border-2',
                                            expense.enabled ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-moon'
                                        )}>
                                            {expense.id === 'fuel' && <Fuel size={20} />}
                                            {expense.id === 'maintenance' && <Wrench size={20} />}
                                            {expense.id === 'amortization' && <ShieldCheck size={20} />}
                                        </div>
                                        <span className={cn('font-bold', expense.enabled ? 'text-starlight' : 'text-moon')}>
                                            {expense.label}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        'w-12 h-6 rounded-full relative transition-colors duration-300',
                                        expense.enabled ? 'bg-primary' : 'bg-white/20'
                                    )}>
                                        <div className={cn(
                                            'absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-300',
                                            expense.enabled ? 'left-7' : 'left-1'
                                        )} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Maint Input */}
                        <div className="space-y-2">
                            <Label>Mantenimiento ($/KM)</Label>
                            <Input
                                type="number"
                                value={maintPerKm}
                                onChange={(e) => setMaintPerKm(e.target.value)}
                                icon={<Wrench size={20} />}
                                placeholder="0"
                            />
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
