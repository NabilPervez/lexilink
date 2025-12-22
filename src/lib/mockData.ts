import { Puzzle, Syllable, Difficulty } from '@/types';
import rawPuzzles from './puzzles.json';

// Define the raw JSON shape
interface RawPuzzle {
    id: string;
    targetWord: string;
    definition: string;
    difficulty: string;
    columns: string[][];
}

function createSyllable(text: string, col: 0 | 1 | 2, idPrefix: string): Syllable {
    return { id: `${idPrefix}-${text}-${Math.random().toString(36).substr(2, 5)}`, text, column: col };
}

// Convert JSON data to typed Puzzles
const ALL_PUZZLES: Puzzle[] = (rawPuzzles as RawPuzzle[]).map((p) => ({
    id: p.id,
    targetWord: p.targetWord,
    definition: p.definition,
    difficulty: p.difficulty as Difficulty,
    columns: [
        p.columns[0].map(text => createSyllable(text, 0, p.id)),
        p.columns[1].map(text => createSyllable(text, 1, p.id)),
        p.columns[2].map(text => createSyllable(text, 2, p.id))
    ]
}));

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export function generateGameSet(): Puzzle[] {
    // Select 10 random unique puzzles
    const shuffled = shuffle([...ALL_PUZZLES]);
    const selected = shuffled.slice(0, 10);

    return selected.map(p => ({
        ...p,
        // Shuffle columns for randomness within the grid
        columns: [
            shuffle([...p.columns[0]]),
            shuffle([...p.columns[1]]),
            shuffle([...p.columns[2]])
        ]
    }));
}
