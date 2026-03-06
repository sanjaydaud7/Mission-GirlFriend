import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

// ─── Animated starfield canvas ────────────────────────────────────────────────
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      opacity: Math.random() * 0.8 + 0.1,
      drift: (Math.random() - 0.5) * 0.2,
      twinklePeriod: Math.random() * 200 + 80,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      stars.forEach((s) => {
        const brightness =
          s.opacity * (0.6 + 0.4 * Math.sin((frame / s.twinklePeriod) * Math.PI * 2 + s.phase));
        ctx.beginPath();
        ctx.globalAlpha = brightness;
        ctx.fillStyle = '#ffffff';
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.x += s.drift;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Single time unit block ───────────────────────────────────────────────────
function TimeUnit({ value, label }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-xl relative"
        style={{
          background: 'linear-gradient(135deg, rgba(232,105,138,0.08) 0%, rgba(167,139,250,0.06) 100%)',
          border: '1px solid rgba(232,105,138,0.4)',
          boxShadow: '0 0 22px rgba(232,105,138,0.25), inset 0 0 22px rgba(167,139,250,0.05)',
        }}
      >
        {/* Flip-style change animation */}
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-cinzel text-3xl md:text-4xl font-bold text-white text-glow tabular-nums"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="font-cinzel text-xs tracking-widest text-blood mt-3 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Countdown section ────────────────────────────────────────────────────────
export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState(null);
  const [passed, setPassed] = useState(false);

  // Fetch countdown date from settings
  useEffect(() => {
    api
      .get('/api/settings')
      .then((res) => {
        if (res.data.countdownDate) {
          setTargetDate(new Date(res.data.countdownDate));
        }
      })
      .catch(() => {});
  }, []);

  // Tick every second
  useEffect(() => {
    if (!targetDate) return;

    const calc = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <section
      id="countdown"
      className="relative py-28 px-6 min-h-[60vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <Starfield />

      {/* Violet-rose center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(232,105,138,0.06) 0%, rgba(167,139,250,0.04) 40%, transparent 65%)',
        }}
      />

      <div className="relative z-10 text-center w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="font-dancing text-blood text-2xl mb-2">Until we meet again</p>
          <h2 className="font-cinzel text-4xl md:text-5xl text-white mb-5">
            {passed ? "We're Together ❤" : 'Counting Every Moment'}
          </h2>
          <div className="section-divider w-48 mx-auto" />
        </motion.div>

        {/* Timer or celebration */}
        {!passed ? (
          <div className="flex items-end justify-center gap-3 md:gap-7 flex-wrap">
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="font-cinzel text-blood text-3xl mb-6 animate-pulse">:</span>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <span className="font-cinzel text-blood text-3xl mb-6 animate-pulse">:</span>
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <span className="font-cinzel text-blood text-3xl mb-6 animate-pulse">:</span>
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, type: 'spring' }}
            className="text-center"
          >
            {/* Confetti burst */}
            <div className="relative flex items-center justify-center" style={{ height: 120, marginBottom: '1.5rem' }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * 360;
                const dist = 55 + (i % 3) * 20;
                const colors = ['#f72585','#c9a84c','#7b8fff','#ff8c69','#e8698a','#fff'];
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{ width: i % 3 === 0 ? 10 : 6, height: i % 3 === 0 ? 10 : 6, background: colors[i % colors.length] }}
                    animate={{
                      x: [0, Math.cos((angle * Math.PI) / 180) * dist],
                      y: [0, Math.sin((angle * Math.PI) / 180) * dist],
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.3, 1, 0],
                    }}
                    transition={{ duration: 2.2, delay: (i % 8) * 0.12, repeat: Infinity, repeatDelay: 1.2, ease: 'easeOut' }}
                  />
                );
              })}
              <motion.div
                animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 18px #f72585)', 'drop-shadow(0 0 48px #f72585)', 'drop-shadow(0 0 18px #f72585)'] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ fontSize: '4rem', position: 'relative', zIndex: 10 }}
              >
                🎉
              </motion.div>
            </div>
            <motion.h2
              animate={{ color: ['#f72585', '#c9a84c', '#7b8fff', '#f72585'] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="font-dancing text-5xl md:text-6xl mb-4"
              style={{ textShadow: '0 0 40px rgba(247,37,133,0.6)' }}
            >
              We Made It! ✨
            </motion.h2>
            <p className="font-playfair text-lg italic mb-6" style={{ color: 'rgba(255,235,255,0.65)' }}>
              The wait is over. This moment belongs to us.
            </p>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="font-dancing text-4xl text-gold text-gold-glow"
            >
              ❤ Together at Last ❤
            </motion.div>
          </motion.div>
        )}

        {/* Mystery teaser — only when counting down */}
        {!passed && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [-6, 6, -6], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 0 14px rgba(232,105,138,0.75))' }}
            >
              🔒
            </motion.div>
            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="font-dancing text-xl italic text-center"
              style={{ color: 'rgba(232,105,138,0.55)', maxWidth: 320 }}
            >
              Something special unlocks when this reaches zero…
            </motion.p>
          </motion.div>
        )}

        {/* Tagline */}
        <motion.p
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="font-dancing text-gray-500 text-2xl mt-10 italic"
        >
          "Every second counts..."
        </motion.p>
      </div>
    </section>
  );
}
