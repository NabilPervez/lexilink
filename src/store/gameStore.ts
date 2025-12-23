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
    streak: 0,

    attempts: 0,
    disabledSyllables: [],

    selectedSyllables: [null, null, null],
    feedback: null,

    startGame: (puzzles) => set({
        status: 'playing',
        puzzles,
        currentRound: 0,
        timer: 60,
        strikes: 0,
        score: 0,
        streak: 0,
        attempts: 0,
        disabledSyllables: [],
        selectedSyllables: [null, null, null],
        feedback: null,
    }),

    selectSyllable: (syllable) => {
        const { status, selectedSyllables, puzzles, currentRound, strikes, streak, attempts, disabledSyllables } = get();
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
                const newStreak = streak + 1;

                set({ feedback: 'correct', streak: newStreak });

                setTimeout(() => {
                    if (isLastRound) {
                        set({ status: 'won', feedback: null });
                    } else {
                        set((state) => ({
                            currentRound: state.currentRound + 1,
                            selectedSyllables: [null, null, null],
                            feedback: null,
                            score: state.score + 100 + (state.timer * 10) + (newStreak * 50), // Bonus for streak
                            attempts: 0,
                            disabledSyllables: []
                        }));
                    }
                }, 500);
            } else {
                // Incorrect
                const currentAttempts = attempts + 1;

                if (currentAttempts < 3) {
                    // Find distractor to remove
                    const c0s = currentPuzzle.columns[0];
                    const c1s = currentPuzzle.columns[1];
                    const c2s = currentPuzzle.columns[2];
                    const correctIds = new Set<string>();

                    // Identify correct syllables
                    for (const s0 of c0s) {
                        for (const s1 of c1s) {
                            for (const s2 of c2s) {
                                if ((s0.text + s1.text + s2.text).toLowerCase() === currentPuzzle.targetWord.toLowerCase()) {
                                    correctIds.add(s0.id);
                                    correctIds.add(s1.id);
                                    correctIds.add(s2.id);
                                }
                            }
                        }
                    }

                    const allSyllables = [...c0s, ...c1s, ...c2s];
                    const candidates = allSyllables.filter(s => !correctIds.has(s.id) && !disabledSyllables.includes(s.id));

                    let newDisabled = [...disabledSyllables];
                    if (candidates.length > 0) {
                        const randomDistractor = candidates[Math.floor(Math.random() * candidates.length)];
                        newDisabled.push(randomDistractor.id);
                    }

                    set({ feedback: 'wrong', streak: 0 });

                    setTimeout(() => {
                        set({
                            attempts: currentAttempts,
                            disabledSyllables: newDisabled,
                            selectedSyllables: [null, null, null],
                            feedback: null
                        });
                    }, 500);

                } else {
                    // 3rd attempt -> Strike and Next
                    const newStrikes = strikes + 1;
                    set({ feedback: 'wrong', streak: 0 }); // Reset streak

                    setTimeout(() => {
                        if (newStrikes >= 3) {
                            set({ status: 'lost', strikes: 3, feedback: null });
                        } else {
                            // Next round or finish
                            const isLastRound = currentRound === 9;
                            if (isLastRound) {
                                set({ status: 'won', feedback: null });
                            } else {
                                set({
                                    strikes: newStrikes,
                                    currentRound: currentRound + 1,
                                    selectedSyllables: [null, null, null],
                                    feedback: null,
                                    attempts: 0,
                                    disabledSyllables: []
                                });
                            }
                        }
                    }, 500);
                }
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
