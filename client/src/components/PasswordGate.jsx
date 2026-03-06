import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import bgImage from '../Images/upscaled_8k_image.jpg';

// ─── Static star field (generated once so it never re-shuffles) ──────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  width: Math.random() * 2.5 + 0.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  opacity: Math.random() * 0.6 + 0.1,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 4,
}));

// SVG lock with glowing keyhole
function LockSVG({ unlocked }) {
  return (
    <svg viewBox="0 0 100 130" className="w-28 h-28 mx-auto mb-6" aria-hidden="true">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Shackle */}
      <motion.path
        d="M 28 52 L 28 32 Q 28 8 50 8 Q 72 8 72 32 L 72 52"
        fill="none"
        stroke="#e8698a"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#glow)"
        animate={unlocked ? { d: 'M 28 52 L 28 22 Q 28 -2 50 -2 Q 72 -2 72 22 L 72 52', opacity: 0 } : {}}
        transition={{ duration: 0.5 }}
      />
      {/* Body */}
      <rect x="12" y="50" width="76" height="68" rx="8" fill="#0c1122" stroke="#e8698a" strokeWidth="1.5" />
      {/* Keyhole circle */}
      <circle cx="50" cy="78" r="9" fill="#e8698a" filter="url(#glow)" />
      {/* Keyhole stem */}
      <rect x="46" y="85" width="8" height="16" rx="2" fill="#e8698a" filter="url(#glow)" />
    </svg>
  );
}

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  // Burst particles generated once per unlock attempt
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        tx: (Math.random() - 0.5) * 120 + 'vw',
        ty: (Math.random() - 0.5) * 120 + 'vh',
        delay: Math.random() * 0.4,
        size: Math.random() * 6 + 4,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unlocking]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || unlocking) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/api/auth/unlock', { password });
      localStorage.setItem('mg_token', res.data.token);
      setUnlocking(true);
      setTimeout(() => onUnlock(), 1600);
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "That's not the magic word... 💔"
          : 'Something went wrong. Try again.';
      setErrorMsg(msg);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      {/* Dark scrim over the photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(5,6,15,0.78)' }}
      />

      {/* Star field */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle pointer-events-none"
          style={{
            width: s.width,
            height: s.width,
            top: `${s.top}%`,
            left: `${s.left}%`,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Particle burst on unlock */}
      {unlocking &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blood pointer-events-none"
            style={{ width: p.size, height: p.size, left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0 }}
            transition={{ duration: 1.4, delay: p.delay, ease: 'easeOut' }}
          />
        ))}

      {/* Card */}
      <motion.div
        animate={shaking ? { x: [-12, 12, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className={`relative w-full max-w-sm mx-4 px-8 py-12 text-center rounded-2xl border border-blood/30 bg-ember/80 backdrop-blur-md z-10 ${
          unlocking ? 'pointer-events-none' : ''
        }`}
        style={{ boxShadow: '0 0 60px rgba(232, 105, 138, 0.18), 0 8px 40px rgba(5,6,15,0.8)' }}>
        {/* Animated glow ring */}
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          animate={{ boxShadow: ['0 0 20px #e8698a33', '0 0 50px #a78bfa44', '0 0 20px #e8698a33'] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* Lock icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.2 }}
        >
          <LockSVG unlocked={unlocking} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="font-cinzel text-2xl text-gold tracking-widest mb-1 text-gold-glow"
        >
          Mission Girlfriend
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="font-dancing text-mist/60 text-2xl mb-8"
        >
          Only for you, my love
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the secret..."
            autoComplete="current-password"
            className="w-full bg-night border border-blood/40 text-white px-5 py-3 rounded-lg text-center font-playfair text-base placeholder-gray-600 focus:outline-none focus:border-blood transition-colors"
            style={{ caretColor: '#8B0000' }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading || unlocking}
            className="mt-4 w-full bg-blood text-white py-3 rounded-lg font-cinzel text-sm tracking-[0.2em] hover:bg-red-900 transition-colors box-glow disabled:opacity-50"
          >
            {loading ? '...' : unlocking ? 'Opening ❤' : 'UNLOCK'}
          </motion.button>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {errorMsg && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-red-400 text-sm font-playfair italic"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
