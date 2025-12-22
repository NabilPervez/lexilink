import { Puzzle, Syllable } from '@/types';

function createSyllable(text: string, col: 0 | 1 | 2, idPrefix: string): Syllable {
    return { id: `${idPrefix}-${text}`, text, column: col };
}

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export const MOCK_PUZZLES: Puzzle[] = [
    {
        id: 'p1',
        targetWord: 'banana',
        definition: 'A long curved fruit which grows in clusters.',
        difficulty: 'easy',
        columns: [
            [createSyllable('ba', 0, 'p1'), createSyllable('ca', 0, 'p1'), createSyllable('fo', 0, 'p1')],
            [createSyllable('na', 1, 'p1'), createSyllable('me', 1, 'p1'), createSyllable('li', 1, 'p1')],
            [createSyllable('na', 2, 'p1'), createSyllable('no', 2, 'p1'), createSyllable('sa', 2, 'p1')]
        ]
    },
    {
        id: 'p2',
        targetWord: 'computer',
        definition: 'An electronic device for storing and processing data.',
        difficulty: 'medium',
        columns: [
            [createSyllable('com', 0, 'p2'), createSyllable('pro', 0, 'p2'), createSyllable('in', 0, 'p2')],
            [createSyllable('pu', 1, 'p2'), createSyllable('gra', 1, 'p2'), createSyllable('vo', 1, 'p2')],
            [createSyllable('ter', 2, 'p2'), createSyllable('tor', 2, 'p2'), createSyllable('tion', 2, 'p2')]
        ]
    },
    {
        id: 'p3',
        targetWord: 'galaxy',
        definition: 'A system of millions or billions of stars.',
        difficulty: 'hard',
        columns: [
            [createSyllable('gal', 0, 'p3'), createSyllable('sol', 0, 'p3'), createSyllable('uni', 0, 'p3')],
            [createSyllable('ax', 1, 'p3'), createSyllable('ar', 1, 'p3'), createSyllable('or', 1, 'p3')],
            [createSyllable('y', 2, 'p3'), createSyllable('is', 2, 'p3'), createSyllable('on', 2, 'p3')]
        ]
    }
];

export function generateGameSet(): Puzzle[] {
    // Return mocked 10 puzzles (repeating for demo)
    return Array(10).fill(null).map((_, i) => ({
        ...MOCK_PUZZLES[i % 3],
        id: `game-p-${i}`,
        // Shuffle columns for randomness
        columns: [
            shuffle([...MOCK_PUZZLES[i % 3].columns[0]]),
            shuffle([...MOCK_PUZZLES[i % 3].columns[1]]),
            shuffle([...MOCK_PUZZLES[i % 3].columns[2]])
        ]
    }));
}
