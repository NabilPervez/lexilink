export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Syllable {
    id: string;
    text: string;
    column: 0 | 1 | 2; // 0 = start, 1 = middle, 2 = end
}

export interface Puzzle {
    id: string;
    targetWord: string;
    definition: string;
    difficulty: Difficulty;
    // Columns: [Start[], Middle[], End[]]
    columns: [Syllable[], Syllable[], Syllable[]];
}

export interface GameState {
    status: 'idle' | 'playing' | 'won' | 'lost';
    puzzles: Puzzle[]; // The 10 puzzles for this session
    currentRound: number; // 0 to 9
    timer: number;
    strikes: number;
    score: number;
    streak: number;

    // Selection state
    selectedSyllables: [Syllable | null, Syllable | null, Syllable | null];
    feedback: 'neutral' | 'correct' | 'wrong' | null;

    // Actions
    startGame: (puzzles: Puzzle[]) => void;
    selectSyllable: (syllable: Syllable) => void;
    tick: () => void;
    resetGame: () => void;
}
