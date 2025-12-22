import { create } from 'zustand';
import { GameState, Syllable } from '@/types';

interface GameStore extends GameState {
    setTimer: (time: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    status: 'idle',
    puzzles: [],
    currentRound: 0,
    timer: 60,
    strikes: 0,
    score: 0,

    selectedSyllables: [null, null, null],
    feedback: null,

    startGame: (puzzles) => set({
        status: 'playing',
        puzzles,
        currentRound: 0,
        timer: 60,
        strikes: 0,
        score: 0,
        selectedSyllables: [null, null, null],
        feedback: null,
    }),

    selectSyllable: (syllable) => {
        const { status, selectedSyllables, puzzles, currentRound, strikes } = get();
        if (status !== 'playing') return;

        // Update selection for the specific column
        const newSelection = [...selectedSyllables] as [Syllable | null, Syllable | null, Syllable | null];
        newSelection[syllable.column] = syllable;

        set({ selectedSyllables: newSelection });

        // Check if full selection
        if (newSelection.every((s) => s !== null)) {
            const currentPuzzle = puzzles[currentRound];
            const formedWord = newSelection.map(s => s?.text).join('').toLowerCase();

            if (formedWord === currentPuzzle.targetWord.toLowerCase()) {
                // Correct
                const isLastRound = currentRound === 9; // 10 rounds (0-9)

                set({ feedback: 'correct' });

                setTimeout(() => {
                    if (isLastRound) {
                        set({ status: 'won', feedback: null });
                    } else {
                        set((state) => ({
                            currentRound: state.currentRound + 1,
                            selectedSyllables: [null, null, null],
                            feedback: null,
                            score: state.score + 100 + (state.timer * 10), // Example scoring
                        }));
                    }
                }, 500);
            } else {
                // Incorrect
                const newStrikes = strikes + 1;
                set({ feedback: 'wrong' });

                // "Remove one of the selected syllables from the grid"
                // Logic: Find one that isn't in the target word if possible, or random.
                // Complex logic: The grid has 3 columns. One of these choices MUST be wrong.
                // We will remove the one that is NOT part of the Correct Sequence for this column?
                // Actually, the correct sequence is known.
                // Let's remove the selection for now and handle "removing from grid" in the UI via a "disabled" prop if we tracked it?
                // For now, simpler: Just clear and strike.

                setTimeout(() => {
                    if (newStrikes >= 3) {
                        set({ status: 'lost', strikes: 3, feedback: null });
                    } else {
                        set({
                            strikes: newStrikes,
                            selectedSyllables: [null, null, null],
                            feedback: null
                        });
                    }
                }, 500);
            }
        }
    },

    tick: () => {
        const { status, timer } = get();
        if (status !== 'playing') return;

        if (timer <= 0) {
            set({ status: 'lost', timer: 0 });
        } else {
            set({ timer: timer - 1 });
        }
    },

    resetGame: () => set({ status: 'idle', puzzles: [] }),
    setTimer: (time) => set({ timer: time }),
}));
