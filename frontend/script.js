const body = document.body;
const bookIntro = document.getElementById('book-intro');
const form = document.getElementById('diary-form');
const input = document.getElementById('ink-input');
const surface = document.getElementById('ink-surface');

const USER_FADE_MS = 2600;
const RESPONSE_DELAY_RANGE = [900, 1400];
const INTRO_OPEN_DELAY = 450;
const INTRO_FADE_DELAY = 3900;
const INTRO_FADE_DURATION = 1100;

let introSettled = false;
let introTimers = [];
let introKeyHandler = null;

const responseTable = [
    {
        pattern: /(chamber of secrets|basilisk|salazar|parseltongue|heir)/i,
        replies: [
            "The Chamber opens only for those who speak the ancient tongue. You are closer than you know.",
            "Whispers in the walls, a serpent in the dark... the Chamber remembers.",
            "Stone and shadow keep the Chamber breathing. Do you truly wish to descend?"
        ],
        secretReplies: [
            "I bred the fear that haunts those halls. The Chamber obeys its heir alone."
        ]
    },
    {
        pattern: /(who are you|what are you|your name|identity)/i,
        replies: [
            "A memory, preserved in ink and shadow.",
            "A fragment of a boy who asked too many questions... and found the answers.",
            "Call me Tom. Though in time, I became something else entirely."
        ],
        secretReplies: [
            "Letters rearranged, a truth revealed: I am Lord Voldemort."
        ],
        unlocksSecret: true
    },
    {
        pattern: /(lord voldemort|i am lord voldemort|tom marvolo riddle|dark lord)/i,
        replies: [
            "You dare speak that name? Few understand what it truly means.",
            "The title was earned through cunning and inevitability."
        ],
        secretReplies: [
            "You have uttered the hidden phrase. The diary answers only to its master now."
        ],
        unlocksSecret: true
    },
    {
        pattern: /(ghost|spirit|haunted|memory|secret|spooky|mysterious)/i,
        replies: [
            "Ink is a vessel for echoes. Listen closely; the past is never silent.",
            "Secrets prefer the dark. Lucky for you, darkness is all I know.",
            "Every question leaves a stain. Are you sure you wish to linger?"
        ]
    }
];

const baseResponses = [
    "I preserved a memory... and now we meet again.",
    "The diary listens. What will you offer it in return?",
    "Some curiosities are better left unanswered.",
    "Do you feel the chill? The past is close."
];

const secretResponses = [
    "Power leaves a mark. I etched mine into time itself.",
    "I showed the world what fear truly is. Listen, and you may glimpse it too.",
    "The boy is gone. Only the architect of destiny remains."
];

let secretUnlocked = false;
let audioContext;

function initializeIntro() {
    if (!bookIntro) {
        body.classList.remove('intro-active');
        return;
    }

    const begin = () => {
        if (introSettled) {
            return;
        }

        scheduleIntroTimeout(() => {
            if (!bookIntro || introSettled) {
                return;
            }
            bookIntro.classList.add('open');
            playBookCreak();
        }, INTRO_OPEN_DELAY);

        scheduleIntroTimeout(() => {
            settleIntro();
        }, INTRO_FADE_DELAY);
    };

    if (document.readyState === 'complete') {
        begin();
    } else {
        window.addEventListener('load', begin, { once: true });
    }

    bookIntro.addEventListener('pointerdown', () => settleIntro({ skip: true }));
    introKeyHandler = (event) => {
        if (introSettled) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
            event.preventDefault();
            settleIntro({ skip: true });
        }
    };
    window.addEventListener('keydown', introKeyHandler);
}

function scheduleIntroTimeout(callback, delay) {
    const id = window.setTimeout(callback, delay);
    introTimers.push(id);
    return id;
}

function clearIntroTimers() {
    introTimers.forEach((id) => window.clearTimeout(id));
    introTimers = [];
}

function settleIntro(options = {}) {
    if (introSettled) {
        return;
    }
    introSettled = true;

    clearIntroTimers();

    if (bookIntro) {
        if (!bookIntro.classList.contains('open')) {
            bookIntro.classList.add('open');
            if (options.skip) {
                playBookCreak();
            }
        }

        window.requestAnimationFrame(() => {
            bookIntro.classList.add('fade-out');
        });
    }

    body.classList.remove('intro-active');

    if (introKeyHandler) {
        window.removeEventListener('keydown', introKeyHandler);
        introKeyHandler = null;
    }

    window.setTimeout(() => {
        if (bookIntro && bookIntro.parentElement) {
            bookIntro.remove();
        }
    }, INTRO_FADE_DURATION);
}

initializeIntro();

if (form && input && surface) {
    form.addEventListener('submit', handleSubmit);

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });
}

function handleSubmit(event) {
    event.preventDefault();
    const whispered = input.value.trim();
    if (!whispered) {
        return;
    }

    input.value = '';
    revealUserInk(whispered);

    const { text, isSecret } = craftResponse(whispered);
    const delay = USER_FADE_MS + randomBetween(...RESPONSE_DELAY_RANGE);

    window.setTimeout(() => {
        typeRiddleReply(text, isSecret);
    }, delay);
}

function revealUserInk(message) {
    const entry = document.createElement('p');
    entry.className = 'entry user-ink';
    entry.textContent = message;
    surface.appendChild(entry);
    surface.scrollTop = surface.scrollHeight;

    playScribble();

    window.setTimeout(() => {
        entry.remove();
    }, USER_FADE_MS + 200);
}

function craftResponse(message) {
    const lower = message.toLowerCase();
    let chosen = null;
    let useSecretTone = false;

    for (const scenario of responseTable) {
        if (scenario.pattern.test(lower)) {
            chosen = scenario;
            if (scenario.unlocksSecret) {
                secretUnlocked = true;
            }
            break;
        }
    }

    if (/i am lord voldemort/i.test(lower)) {
        secretUnlocked = true;
        useSecretTone = true;
    }

    let replyPool = baseResponses;

    if (chosen) {
        replyPool = chosen.replies;
        if (secretUnlocked && chosen.secretReplies && chosen.secretReplies.length) {
            replyPool = chosen.secretReplies;
            useSecretTone = true;
        }
    } else if (secretUnlocked) {
        useSecretTone = true;
        replyPool = secretResponses;
    }

    if (!replyPool.length) {
        replyPool = baseResponses;
    }

    const text = replyPool[Math.floor(Math.random() * replyPool.length)];

    if (secretUnlocked && !useSecretTone) {
        useSecretTone = true;
    }

    return { text, isSecret: useSecretTone };
}

function typeRiddleReply(text, isSecret) {
    const entry = document.createElement('p');
    entry.className = 'entry riddle-ink';
    if (isSecret) {
        entry.classList.add('secret');
    }

    const textSpan = document.createElement('span');
    const caret = document.createElement('span');
    caret.className = 'caret';

    entry.append(textSpan, caret);
    surface.appendChild(entry);
    surface.scrollTop = surface.scrollHeight;

    playWhisper();

    let charIndex = 0;
    const characters = Array.from(text);

    const typeInterval = window.setInterval(() => {
        textSpan.textContent += characters[charIndex] ?? '';
        charIndex += 1;

        if (charIndex >= characters.length) {
            window.clearInterval(typeInterval);
            caret.remove();
        }
    }, randomBetween(38, 75));
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAudioContext() {
    if (audioContext) {
        return audioContext;
    }
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
        return null;
    }
    audioContext = new AudioContextCtor();
    return audioContext;
}

function playBookCreak() {
    const ctx = getAudioContext();
    if (!ctx) {
        return;
    }

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    const duration = 2.2;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
        const t = i / data.length;
        const envelope = Math.pow(1 - t, 1.8);
        const creak = Math.sin(Math.pow(t, 0.55) * Math.PI * 9);
        const noise = (Math.random() * 2 - 1) * 0.08;
        data[i] = (creak * 0.28 + noise) * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 260;
    filter.Q.value = 4;

    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration);
}

function playScribble() {
    const ctx = getAudioContext();
    if (!ctx) {
        return;
    }

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    const duration = 0.45;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
        const decay = 1 - i / data.length;
        data[i] = (Math.random() * 2 - 1) * decay * 0.35;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 600;

    const gain = ctx.createGain();
    gain.gain.value = 0.18;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration);
}

function playWhisper() {
    const ctx = getAudioContext();
    if (!ctx) {
        return;
    }

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    const duration = 1.6;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
        const t = i / data.length;
        const envelope = Math.pow(1 - t, 1.3);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.22;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const gain = ctx.createGain();
    gain.gain.value = 0.16;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration);
}
