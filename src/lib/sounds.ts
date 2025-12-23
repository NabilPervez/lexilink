export const playSound = (type: 'select' | 'correct' | 'wrong' | 'tick' | 'win' | 'levelUp') => {
    if (typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const createOscillator = (type: OscillatorType, freq: number, duration: number, startTime: number = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
    };

    switch (type) {
        case 'select':
            // Short high blip
            createOscillator('sine', 800, 0.1);
            break;

        case 'correct':
            // High ding (major third)
            createOscillator('sine', 880, 0.3); // A5
            createOscillator('sine', 1108.73, 0.4, 0.1); // C#6
            break;

        case 'wrong':
            // Low buzz/thud
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch (e) {
                console.error(e);
            }
            break;

        case 'tick':
            // Short tick (woodblock-ish)
            createOscillator('triangle', 600, 0.05);
            break;

        case 'levelUp':
            // Ascending major arpeggio
            createOscillator('sine', 523.25, 0.2, 0); // C5
            createOscillator('sine', 659.25, 0.2, 0.1); // E5
            createOscillator('sine', 783.99, 0.3, 0.2); // G5
            createOscillator('sine', 1046.50, 0.6, 0.3); // C6
            break;

        case 'win':
            // Victory fanfare
            [0, 0.15, 0.3, 0.45].forEach((delay, i) => {
                createOscillator('square', 440 + (i * 100), 0.5, delay);
            });
            break;
    }
};
