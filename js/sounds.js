/* ============================================
   Sound Effects for Valentine's Week Website
   Generated via Web Audio API (No external files)
   ============================================ */

window.SoundManager = (() => {
    let audioCtx = null;
    let isMuted = false;

    // Lazy initialize AudioContext
    function init() {
        if (!audioCtx) {
            console.log('SoundManager: Initializing AudioContext');
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            console.log('SoundManager: Resuming AudioContext');
            audioCtx.resume();
        }
    }

    // Generate a simple tone with oscillator
    function playTone(freq, type = 'sine', duration = 0.1, vol = 0.1, startTime = 0) {
        if (!audioCtx || isMuted) return;
        // console.log(`SoundManager: Playing tone ${freq}Hz (${type})`);

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

        // Envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
        gainNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + startTime);
        osc.stop(audioCtx.currentTime + startTime + duration);
    }

    // Generate noise burst (white noise)
    function playNoise(duration = 0.1, vol = 0.1) {
        if (!audioCtx || isMuted) return;
        // console.log('SoundManager: Playing noise');

        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        // Simple lowpass filter to soften it
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start();
    }

    // --- Day 1: Rose Day ---
    function petalReveal() {
        init();
        // Soft ascending chime: C5->E5->G5
        playTone(523.25, 'sine', 0.3, 0.08, 0);       // C5
        playTone(659.25, 'sine', 0.3, 0.07, 0.08);    // E5
        playTone(783.99, 'sine', 0.3, 0.06, 0.16);    // G5
    }

    function roseFinal() {
        init();
        // Magical sparkle arpeggio
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C Major arpeggio
        let delay = 0;
        freqs.forEach((f, i) => {
            playTone(f, 'sine', 0.6 - (i * 0.05), 0.06 - (i * 0.005), delay);
            delay += 0.08;
        });
    }

    // --- Day 2: Propose Day ---
    function milestoneReveal() {
        init();
        // Very subtle soft pop: 880Hz -> 1100Hz
        playTone(880, 'sine', 0.08, 0.04, 0);
        playTone(1100, 'sine', 0.05, 0.02, 0.08);
    }

    // --- Day 3: Chocolate Day ---
    function chocolateFlip() {
        init();
        // Snappy flip: Noise + Triangle
        playNoise(0.05, 0.1);
        playTone(740, 'triangle', 0.1, 0.05, 0.02);
    }

    function chocolateComplete() {
        init();
        // Sweet jingle: E5->G5->B5->D6
        playTone(659.25, 'sine', 0.2, 0.08, 0);
        playTone(783.99, 'sine', 0.2, 0.08, 0.1);
        playTone(987.77, 'sine', 0.2, 0.08, 0.2);
        playTone(1174.66, 'sine', 0.3, 0.08, 0.3);
    }

    // --- Day 4: Teddy Day ---
    function teddySqueeze() {
        init();
        if (!audioCtx || isMuted) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        // Pitch bend 600 -> 900 -> 750
        const now = audioCtx.currentTime;
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.1);
        osc.frequency.linearRampToValueAtTime(750, now + 0.2);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05); // attack
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2); // decay

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // --- Day 5: Promise Day ---
    function promiseReveal() {
        init();
        // Very quiet pen-stroke swoosh
        playNoise(0.1, 0.03);
        playTone(440, 'sine', 0.05, 0.015, 0); // barely audible tone
    }

    function promiseSeal() {
        init();
        // Wax seal stamp: 220Hz + 330Hz + noise
        playTone(220, 'sine', 0.3, 0.1, 0);
        playTone(330, 'sine', 0.25, 0.05, 0);
        playNoise(0.05, 0.08); // Impact
    }

    // --- Day 6: Hug Day ---
    function orbTap() {
        init();
        // Warm glow tone: 396Hz & 528Hz
        playTone(396, 'sine', 0.4, 0.06, 0);
        playTone(528, 'sine', 0.4, 0.06, 0.05); // delayed slightly
    }

    // --- Day 7: Kiss Day ---
    function kissLineAppear() {
        init();
        // Ethereal shimmer: 880Hz & 1320Hz
        playTone(880, 'sine', 0.8, 0.03, 0);
        playTone(1320, 'sine', 0.8, 0.03, 0.05);
    }

    function shootingStar() {
        init();
        if (!audioCtx || isMuted) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        // Sweep 2000 -> 200
        const now = audioCtx.currentTime;
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.04, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    // --- Day 8: Valentine's Day ---
    let heartbeatInterval = null;
    function startHeartbeat() {
        init(); // Ensure context is ready
        if (heartbeatInterval) return;

        const playPulse = () => {
            playTone(60, 'sine', 0.1, 0.12, 0); // Lub
            playTone(80, 'sine', 0.1, 0.1, 0.15); // Dub
        };

        // Play immediately then loop
        playPulse();
        heartbeatInterval = setInterval(playPulse, 1200);
    }

    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
    }

    return {
        init,
        sfxPetalReveal: petalReveal,
        sfxRoseFinal: roseFinal,
        sfxMilestoneReveal: milestoneReveal,
        sfxChocolateFlip: chocolateFlip,
        sfxChocolateComplete: chocolateComplete,
        sfxTeddySqueeze: teddySqueeze,
        sfxPromiseReveal: promiseReveal,
        sfxPromiseSeal: promiseSeal,
        sfxOrbTap: orbTap,
        sfxKissLineAppear: kissLineAppear,
        sfxShootingStar: shootingStar,
        sfxHeartbeat: startHeartbeat,
        sfxStopHeartbeat: stopHeartbeat
    };
})();

console.log('SoundManager loaded');

// Auto-init on page interaction to unlock AudioContext
['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
    document.addEventListener(event, () => {
        SoundManager.init();
    }, { once: true });
});
