import { motion } from 'framer-motion';
import { Puzzle, Syllable } from '@/types';
import { cn } from '@/components/ui/Button';

interface SyllableGridProps {
    puzzle: Puzzle;
    selected: [Syllable | null, Syllable | null, Syllable | null];
    onSelect: (s: Syllable) => void;
    disabled: boolean;
}

export function SyllableGrid({ puzzle, selected, onSelect, disabled }: SyllableGridProps) {
    return (
        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-4 p-4">
            {puzzle.columns.map((column, colIndex) => (
                <div key={`col-${colIndex}`} className="flex flex-col gap-4">
                    <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        {colIndex === 0 ? 'Start' : colIndex === 1 ? 'Middle' : 'End'}
                    </div>
                    {column.map((syllable) => {
                        const isSelected = selected[colIndex]?.id === syllable.id;

                        return (
                            <motion.button
                                key={syllable.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(syllable)}
                                disabled={disabled}
                                className={cn(
                                    "relative h-20 w-full rounded-2xl text-xl font-bold transition-all duration-200",
                                    "flex items-center justify-center border-2",
                                    isSelected
                                        ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_0_20px_hsl(var(--primary))]"
                                        : "glass-button border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]/50"
                                )}
                            >
                                {syllable.text}
                            </motion.button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
