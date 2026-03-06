import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/* ─── Sparkle field ─── */
function SparkleField() {
  const [sparks] = useState(() =>
    Array.from({ length: 42 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 16 + 7,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 7,
      char: ['✨', '💫', '⭐', '🌸', '🌺', '🌟'][i % 6],
    }))
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1.4, 0.3], rotate: [0, 360] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, display: 'block', lineHeight: 1 }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Rising bubble particles ─── */
function BubbleParticles() {
  const [bubbles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: 3 + Math.random() * 94,
      size: Math.random() * 28 + 10,
      duration: Math.random() * 7 + 5,
      delay: Math.random() * 9,
      hue: [330, 280, 310, 260, 340, 320][i % 6],
    }))
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          animate={{
            y: [0, -(window.innerHeight + 100)],
            x: [0, Math.sin(b.id * 1.3) * 55, 0],
            opacity: [0, 0.55, 0.55, 0],
            scale: [0.4, 1, 1.15, 0.7],
          }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: -60, left: `${b.left}%`,
            width: b.size, height: b.size, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, hsla(${b.hue},100%,90%,0.55), hsla(${b.hue},80%,60%,0.15))`,
            border: `1.5px solid hsla(${b.hue},80%,75%,0.45)`,
            boxShadow: `inset 0 0 8px hsla(${b.hue},100%,95%,0.3)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Glitter trail on mouse ─── */
function GlitterTrail() {
  const [glitters, setGlitters] = useState([]);
  const counter = useRef(0);
  useEffect(() => {
    const onMove = (e) => {
      const id = counter.current++;
      setGlitters((p) => [
        ...p.slice(-20),
        { id, x: e.clientX, y: e.clientY, char: ['✨','💕','🌸','💫','⭐','💗'][id % 6], size: Math.random() * 14 + 9 },
      ]);
      setTimeout(() => setGlitters((p) => p.filter((g) => g.id !== id)), 900);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
      <AnimatePresence>
        {glitters.map((g) => (
          <motion.span
            key={g.id}
            initial={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 0.1, y: -44, rotate: 200 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{ position: 'fixed', left: g.x - 8, top: g.y - 8, fontSize: g.size, pointerEvents: 'none', lineHeight: 1 }}
          >
            {g.char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Drifting clouds ─── */
function FloatingClouds() {
  const clouds = [
    { emoji: '☁️', top: '6%',  size: '2.8rem', duration: 28, delay: 0,  dir: 1 },
    { emoji: '☁️', top: '14%', size: '2rem',   duration: 35, delay: 5,  dir: -1 },
    { emoji: '⛅', top: '4%',  size: '2.4rem', duration: 22, delay: 10, dir: 1 },
    { emoji: '☁️', top: '20%', size: '1.6rem', duration: 40, delay: 2,  dir: -1 },
    { emoji: '☁️', top: '10%', size: '3rem',   duration: 32, delay: 8,  dir: 1 },
    { emoji: '⛅', top: '18%', size: '1.8rem', duration: 26, delay: 15, dir: -1 },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {clouds.map((c, i) => (
        <motion.span
          key={i}
          initial={{ x: c.dir === 1 ? -220 : window.innerWidth + 220 }}
          animate={{ x: c.dir === 1 ? window.innerWidth + 220 : -220 }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: c.top, fontSize: c.size, opacity: 0.38 }}
        >
          {c.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Floating hearts background ─── */
function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 6 + 7,
      delay: Math.random() * 12,
      size: Math.random() * 20 + 12,
      drift: Math.floor((Math.random() - 0.5) * 120),
      emoji: ['❤️', '💕', '💖', '💗', '💓', '🩷', '💝'][Math.floor(Math.random() * 7)],
    }))
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: 'absolute', top: '-60px', left: `${h.left}%`,
            fontSize: h.size, opacity: 0,
            animation: `petalFall ${h.duration}s ${h.delay}s linear infinite`,
            '--drift': `${h.drift}px`, '--spin': '0deg',
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

/* ─── Confetti burst on YES ─── */
function ConfettiBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: 85 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * window.innerWidth * 1.2,
      y: -(Math.random() * window.innerHeight * 1.1 + 100),
      rotate: Math.random() * 720 - 360,
      color: ['#f72585', '#c084fc', '#7b2fff', '#ff0655', '#4cc9f0', '#b5179e'][i % 6],
      size: Math.random() * 10 + 6,
      shape: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '10%',
    }))
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 0 }}
          transition={{ duration: Math.random() * 1.5 + 1.2, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: p.shape,
          }}
        />
      ))}
    </div>
  );
}

/* ─── No button positions (run away!) ─── */
function getRandomPos(avoidRect) {
  const margin = 20;
  const bw = window.innerWidth - 160;
  const bh = window.innerHeight - 80;
  let x, y;
  let attempts = 0;
  do {
    x = margin + Math.random() * (bw - margin * 2);
    y = margin + Math.random() * (bh - margin * 2);
    attempts++;
  } while (
    attempts < 20 &&
    avoidRect &&
    x > avoidRect.left - 120 && x < avoidRect.right + 20 &&
    y > avoidRect.top - 60 && y < avoidRect.bottom + 20
  );
  return { x, y };
}

export default function ValentinePage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(null); // null | 'yes' | 'no'
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: null, y: null });
  const [showConfetti, setShowConfetti] = useState(false);
  const yesBtnRef = useRef(null);

  // Position NO button away from YES
  useEffect(() => {
    if (yesBtnRef.current) {
      const r = yesBtnRef.current.getBoundingClientRect();
      setNoPos(getRandomPos(r));
    }
  }, []);

  const noMessages = [
    'Are you sure? 🥺',
    'Please reconsider… 💔',
    'Think again! 🙏',
    "Don't do this to me 😭",
    'My heart is breaking 💔',
    "I'll cry… 😢",
    'One more chance? 🥺',
    'PLEASE 🫶',
    "You're breaking my heart!!",
    "…okay fine. But are you SURE? 🥺",
  ];

  const handleNo = () => {
    // click still counts in case they somehow manage it on mobile tap
    const newCount = noCount + 1;
    setNoCount(newCount);
    const r = yesBtnRef.current?.getBoundingClientRect();
    setNoPos(getRandomPos(r));
  };

  const runAway = () => {
    const r = yesBtnRef.current?.getBoundingClientRect();
    setNoPos(getRandomPos(r));
  };

  // Auto-scroll continuously so it never stays still
  useEffect(() => {
    if (answer !== null) return;
    const interval = setInterval(() => {
      const r = yesBtnRef.current?.getBoundingClientRect();
      setNoPos(getRandomPos(r));
    }, 900);
    return () => clearInterval(interval);
  }, [answer]);

  const handleYes = () => {
    setAnswer('yes');
    setShowConfetti(true);
    setTimeout(() => navigate('/hero'), 4500);
  };

  const yesScale = 1 + noCount * 0.15;
  const noLabel = noCount < noMessages.length ? noMessages[noCount] : '…still no? 😭';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(160deg, #87CEEB 0%, #b0e0ff 40%, #cce8ff 70%, #ffe0ec 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Animated colour blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 55% 45% at 20% 85%, rgba(247,37,133,0.22) 0%, transparent 70%)',
              'radial-gradient(ellipse 55% 45% at 80% 15%, rgba(123,47,255,0.22) 0%, transparent 70%)',
              'radial-gradient(ellipse 55% 45% at 60% 60%, rgba(255,105,180,0.18) 0%, transparent 70%)',
              'radial-gradient(ellipse 55% 45% at 20% 85%, rgba(247,37,133,0.22) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        />
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 40% 50% at 85% 40%, rgba(192,132,252,0.2) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 50% at 10% 60%, rgba(255,150,200,0.2) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 50% at 50% 10%, rgba(167,139,250,0.2) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 50% at 85% 40%, rgba(192,132,252,0.2) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <FloatingClouds />
      <FloatingHearts />
      <SparkleField />
      <BubbleParticles />
      <GlitterTrail />
      {showConfetti && <ConfettiBurst key={Date.now()} />}

      <AnimatePresence mode="wait">
        {answer === 'yes' ? (
          /* ── YES response ── */
          <motion.div
            key="yes-response"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ textAlign: 'center', zIndex: 10, padding: '0 24px' }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              style={{ fontSize: 96, marginBottom: 24, display: 'inline-block' }}
            >
              ❤️
            </motion.div>
            <h1
              style={{
                fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                color: '#f72585',
                WebkitTextStroke: '3px #2D1040',
                textShadow: '4px 4px 0 #2D1040',
                marginBottom: 16,
                lineHeight: 1.15,
              }}
            >
              YAY!! 🎉
            </h1>
            <p
              style={{
                fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: '#2D1040',
                opacity: 0.8,
              }}
            >
              I knew you would! Taking you somewhere special… 💕
            </p>
          </motion.div>
        ) : (
          /* ── Main question ── */
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              textAlign: 'center',
              zIndex: 10,
              position: 'relative',
              padding: '0 24px',
              maxWidth: 700,
            }}
          >
            {/* Bear / heart emoji header */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-8, 8, -8], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              style={{ fontSize: 80, marginBottom: 12 }}
            >
              🧸
            </motion.div>

            {/* Main title */}
            <motion.h1
              animate={{
                textShadow: [
                  '4px 4px 0 #2D1040, 0 0 20px rgba(247,37,133,0.4)',
                  '4px 4px 0 #2D1040, 0 0 50px rgba(247,37,133,1), 0 0 80px rgba(247,37,133,0.5)',
                  '4px 4px 0 #2D1040, 0 0 20px rgba(123,47,255,0.5)',
                  '4px 4px 0 #2D1040, 0 0 50px rgba(247,37,133,1), 0 0 80px rgba(247,37,133,0.5)',
                  '4px 4px 0 #2D1040, 0 0 20px rgba(247,37,133,0.4)',
                ],
                color: ['#f72585', '#ff69b4', '#c084fc', '#f72585', '#f72585'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
                fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                WebkitTextStroke: '2px #2D1040',
                lineHeight: 1.15,
                marginBottom: 12,
              }}
            >
              WILL YOU BE MY
              <br />
              VALENTINE?
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
                fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                color: '#2D1040',
                opacity: 0.7,
                marginBottom: 40,
              }}
            >
              {noCount === 0
                ? '…pretty please? 🥺💕'
                : noCount < 5
                ? noMessages[noCount - 1]
                : noMessages[Math.min(noCount - 1, noMessages.length - 1)]}
            </motion.p>

            {/* YES button with sonar pulse rings */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 3], opacity: [0.65, 0] }}
                  transition={{ duration: 2, delay: i * 0.65, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', width: '100%', height: '100%',
                    borderRadius: 50, border: '3px solid #f72585',
                    pointerEvents: 'none', boxSizing: 'border-box',
                  }}
                />
              ))}
              <motion.button
                ref={yesBtnRef}
                onClick={handleYes}
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.1 }}
                whileTap={{ scale: yesScale * 0.93 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  background: 'linear-gradient(135deg, #f72585 0%, #7b2fff 100%)',
                  color: '#fff',
                  border: '3px solid #2D1040',
                  borderRadius: 50,
                  padding: '14px 52px',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0 #2D1040, 0 0 35px rgba(247,37,133,0.55)',
                  display: 'inline-block',
                  position: 'relative', zIndex: 1,
                }}
              >
                Yes! 💖
              </motion.button>
            </div>

            {/* Decorative hearts row */}
            <div style={{ marginBottom: 12, fontSize: 20, letterSpacing: 8 }}>
              {['💕','💖','💕','💗','💕'].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-block' }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NO button — floats away! (only shown while not answered) */}
      {answer === null && (
        <motion.button
          key={noCount}
          initial={
            noCount === 0
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.8 }
          }
          animate={{
            opacity: 1,
            scale: 1,
            x: noPos.x !== null ? noPos.x - window.innerWidth / 2 : 180,
            y: noPos.y !== null ? noPos.y - window.innerHeight / 2 : 120,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: noCount === 0 ? 0.6 : 0 }}
          onClick={handleNo}
          onMouseEnter={runAway}
          onTouchStart={runAway}
          style={{
            position: 'fixed',
            fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
            fontSize: `${Math.max(0.75, 1.2 - noCount * 0.07)}rem`,
            background: 'rgba(255,255,255,0.85)',
            color: '#2D1040',
            border: '2px solid rgba(0,10,20,0.3)',
            borderRadius: 50,
            padding: '10px 32px',
            cursor: 'pointer',
            boxShadow: '2px 2px 0 rgba(0,10,20,0.2)',
            zIndex: 20,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          {noCount === 0 ? 'No 😢' : noLabel}
        </motion.button>
      )}
    </div>
  );
}
