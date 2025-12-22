'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SyllableGrid } from '@/components/game/SyllableGrid';
import { Button } from '@/components/ui/Button';
import { generateGameSet } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, AlertTriangle, Trophy, Brain, Flame } from 'lucide-react';
import { cn } from '@/components/ui/Button';

// Helper to prevent hydration mismatch for client-only random data
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  return mounted;
}

export default function Home() {
  const mounted = useMounted();
  const {
    status,
    puzzles,
    currentRound,
    timer,
    strikes,
    score,
    selectedSyllables,
    feedback,
    startGame,
    selectSyllable,
    tick,
    resetGame
  } = useGameStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tick]);

  const handleStart = () => {
    const newSet = generateGameSet();
    startGame(newSet);
  };

  const currentPuzzle = puzzles[currentRound];

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-[80vh]">

      <AnimatePresence mode="wait">

        {/* IDLE STATE */}
        {status === 'idle' && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 glass-panel p-10 rounded-3xl w-full"
          >
            <div className="space-y-2">
              <h1 className="text-6xl font-black tracking-tight text-gradient">LexiLink</h1>
              <p className="text-xl text-[hsl(var(--muted-foreground))]">The Syllabic Speed-Word Challenge</p>
            </div>

            <div className="flex justify-center gap-8 py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))]/20 flex items-center justify-center text-[hsl(var(--primary))]">
                  <Brain size={32} />
                </div>
                <span className="text-sm font-semibold">Brain Training</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--accent))]/20 flex items-center justify-center text-[hsl(var(--accent))]">
                  <Trophy size={32} />
                </div>
                <span className="text-sm font-semibold">Speed Run</span>
              </div>
            </div>

            <Button size="lg" onClick={handleStart} className="w-full text-xl h-16">
              Start Challenge
            </Button>
          </motion.div>
        )}

        {/* PLAYING STATE */}
        {status === 'playing' && currentPuzzle && (
          <motion.div
            key="game-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-6"
          >
            {/* HUD */}
            <header className="flex items-center justify-between glass-panel p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center text-[hsl(var(--accent))] font-bold relative overflow-hidden">
                  <span className="absolute inset-0 bg-[hsl(var(--accent))] opacity-20 animate-[spin_3s_linear_infinite]" />
                  <Timer size={20} className="relative z-10" />
                </div>
                <span className={cn("text-2xl font-mono font-bold", timer < 10 && "text-[hsl(var(--destructive))] animate-pulse")}>
                  {timer}s
                </span>
              </div>

              {/* Streak & Round */}
              <div className="flex flex-col items-center min-w-[80px]">
                <AnimatePresence mode="popLayout">
                  {useGameStore.getState().streak > 1 ? (
                    <motion.div
                      key="streak"
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1 text-[hsl(var(--accent))]"
                    >
                      <span className="text-xl font-black">{useGameStore.getState().streak}</span>
                      <Flame size={20} className="fill-current animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="round-label"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]"
                    >
                      Round
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="text-xl font-bold">{currentRound + 1}/10</span>
              </div>

              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <AlertTriangle
                    key={i}
                    size={24}
                    className={cn(
                      "transition-all",
                      i < strikes ? "text-[hsl(var(--destructive))] fill-[hsl(var(--destructive))]" : "text-[hsl(var(--muted))]"
                    )}
                  />
                ))}
              </div>
            </header>

            {/* Definition Card */}
            <div className="text-center space-y-2 py-4">
              <span className="text-sm font-bold text-[hsl(var(--primary))] uppercase tracking-widest">Definition</span>
              <p className="text-2xl font-medium leading-relaxed">
                &quot;{currentPuzzle.definition}&quot;
              </p>
            </div>

            {/* Word Construction Display */}
            <div className="h-20 flex items-center justify-center gap-2 relative">
              {selectedSyllables.map((s, i) => (
                <div key={i} className={cn(
                  "h-14 w-24 rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition-all",
                  s ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]" : "border-dashed border-[hsl(var(--border))]"
                )}>
                  {s ? s.text : ''}
                </div>
              ))}

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <div className="text-5xl font-black text-[hsl(var(--success))] bg-black/80 rounded-2xl px-8 py-2 border-2 border-[hsl(var(--success))] shadow-[0_0_50px_hsl(var(--success))]/50">
                      CORRECT!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid */}
            <SyllableGrid
              puzzle={currentPuzzle}
              selected={selectedSyllables}
              onSelect={selectSyllable}
              disabled={!!feedback}
            />

          </motion.div>
        )}

        {/* RESULTS STATE */}
        {(status === 'won' || status === 'lost') && (
          <motion.div
            key="result-screen"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center glass-panel p-10 rounded-3xl space-y-6 w-full max-w-md"
          >
            <h2 className={cn("text-4xl font-black", status === 'won' ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]")}>
              {status === 'won' ? "COMPLETE!" : "GAME OVER"}
            </h2>

            <div className="py-8 space-y-4">
              <div className="text-6xl font-bold">{score}</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Final Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-[hsl(var(--background))] p-4 rounded-xl">
                <div className="text-xs text-[hsl(var(--muted-foreground))]">Rounds</div>
                <div className="text-xl font-bold">{currentRound}/10</div>
              </div>
              <div className="bg-[hsl(var(--background))] p-4 rounded-xl">
                <div className="text-xs text-[hsl(var(--muted-foreground))]">Strikes</div>
                <div className="text-xl font-bold">{strikes}/3</div>
              </div>
            </div>

            <Button onClick={resetGame} variant="secondary" className="w-full h-14 text-lg mt-6">
              Play Again
            </Button>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

