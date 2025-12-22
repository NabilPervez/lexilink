# LexiLink Implementation Plan

## 1. Setup & Configuration
- [x] Initialize Next.js Project (App Router, TypeScript, Tailwind)
- [ ] Configure Tailwind Theme (Vibrant colors, dark mode defaults, typography)
- [ ] Install dependencies: `zustand` (State), `lucide-react` (Icons), `clsx`, `tailwind-merge` (Utils), `framer-motion` (Animations)

## 2. Design System (Foundation)
- [ ] Update `globals.css` with CSS variables for HSL colors.
- [ ] Create `components/ui` folder for reusable atomic components.
  - [ ] `Button`: Variants (primary, secondary, ghost) with hover effects.
  - [ ] `Card`: Glassmorphism style.
  - [ ] `Grid`: For the 3x3 syllable layout.
  - [ ] `ProgressBar`: For the timer and strikes.

## 3. Core Logic (Game Engine)
- [ ] `lib/syllables.ts`: Helper to break words or validate syllables (Mock initially).
- [ ] `store/gameStore.ts`: Zustand store for:
  - Timer (60s global)
  - Strikes (max 3)
  - Current Puzzle Index
  - Score
  - Selected Syllables
  - Word Bank (fetched from API)

## 4. API & Data
- [ ] `app/api/words/route.ts`: API Endpoint to return word sets based on difficulty.
- [ ] Define the Word Bank schema and mock data for 10 rounds (Elem -> College).

## 5. UI Implementation
- [ ] `app/page.tsx`: Main Game Container.
  - Intro Screen (Start Button)
  - Game Loop Screen (Timer, Score, Syllable Grid, Definition)
  - Game Over / Success Screen
- [ ] `components/game/SyllableGrid.tsx`: Interactive 3x3 grid.
- [ ] `components/game/Timer.tsx`: Visual countdown.
- [ ] `components/game/Feedback.tsx`: Visual cues for correct/wrong.

## 6. PWA & Optimization
- [ ] Add `manifest.json`.
- [ ] Configure SEO metadata in `layout.tsx`.

## 7. Refinement
- [ ] Micro-animations (Framer Motion).
- [ ] Haptic feedback hooks.
