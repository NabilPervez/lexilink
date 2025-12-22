import { NextResponse } from 'next/server';
import { generateGameSet } from '@/lib/mockData';

export async function GET() {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const gameSet = generateGameSet();
    return NextResponse.json(gameSet);
}
