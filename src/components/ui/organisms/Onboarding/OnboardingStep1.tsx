import React, { useState } from 'react';
import { HelpCircle, ChevronRight } from '../../../../lib/icons';
import { cn } from '../../../../lib/utils';
import type { VerticalType } from '../../../../types/calculator.types';
import { VERTICAL_OPTIONS, ONBOARDING_TEXTS } from '../../../../data/onboardingContent';

interface OnboardingStep1Props {
    vertical: VerticalType | null;
    onSelect: (id: VerticalType) => void;
    onNext: () => void;
}

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ vertical, onSelect, onNext }) => {
    const [showHelp, setShowHelp] = useState(false);
    const textConfig = ONBOARDING_TEXTS.step1;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-black text-starlight tracking-tight uppercase">
                    {textConfig.header}
                    <span className="block text-primary text-xl mt-1 tracking-widest">{textConfig.caption}</span>
                </h1>
                <p className="text-moon font-medium text-lg mt-4">
                    {textConfig.title}
                </p>
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-widest uppercase mt-4">
                    {textConfig.subtitle}
                </div>
            </div>

            {/* Vertical Cards Selection */}
            <div className="space-y-4">
                {VERTICAL_OPTIONS.map((option) => {
                    const isSelected = vertical === option.id;
                    const Icon = option.icon;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onSelect(option.id)}
                            className={cn(
                                'w-full p-5 rounded-3xl border-2 transition-all duration-300',
                                'flex items-center gap-5 text-left',
                                isSelected ? (
                                    `${option.color.bg} ${option.color.border} ${option.color.glow} scale-[1.02]`
                                ) : (
                                    'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                )
                            )}
                        >
                            {/* Icon Container */}
                            <div className={cn(
                                'w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors',
                                isSelected ? `${option.color.bg} ${option.color.border}` : 'bg-white/5'
                            )}>
                                <Icon className={cn('w-8 h-8', isSelected ? option.color.text : 'text-moon')} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    'text-xl font-extrabold tracking-tight mb-1',
                                    isSelected ? 'text-starlight' : 'text-moon'
                                )}>
                                    {option.title}
                                </h3>
                                <p className={cn(
                                    'text-sm font-semibold mb-2',
                                    isSelected ? option.color.text : 'text-moon/60'
                                )}>
                                    {option.subtitle}
                                </p>
                                {/* App Pills */}
                                <div className="flex flex-wrap gap-2">
                                    {option.apps.map((app: string) => (
                                        <span
                                            key={app}
                                            className={cn(
                                                'px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-extrabold',
                                                isSelected ? 'bg-black/40 text-starlight' : 'bg-white/10 text-moon/60'
                                            )}
                                        >
                                            {app}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Help & Continue */}
            <div className="pt-6 space-y-4">
                <button
                    type="button"
                    onClick={() => setShowHelp(!showHelp)}
                    className="flex items-center justify-center gap-2 w-full text-secondary hover:text-secondary-glow transition-colors"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                        {textConfig.helpTitle}
                    </span>
                </button>

                {showHelp && (
                    <div className="p-4 bg-secondary/10 border-2 border-secondary/30 rounded-2xl animate-fade-in">
                        <p className="text-sm font-medium text-starlight/80 leading-relaxed">
                            {textConfig.helpContent}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!vertical}
                    className={cn(
                        'w-full py-5 px-6 rounded-3xl font-extrabold text-base uppercase tracking-wide',
                        'flex items-center justify-center gap-3',
                        'transition-all duration-300',
                        vertical ? (
                            'bg-primary text-black shadow-[0_0_30px_var(--color-primary-glow)] hover:scale-105 active:scale-95'
                        ) : (
                            'bg-white/10 text-moon cursor-not-allowed'
                        )
                    )}
                >
                    {textConfig.continue}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
