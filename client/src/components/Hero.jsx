import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ─── Floating petal canvas ────────────────────────────────────────────────────
function PetalCanvas() {
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

    const petals = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 9 + 4,
      speedY: Math.random() * 0.55 + 0.15,
      drift: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      opacity: Math.random() * 0.45 + 0.08,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#e8698a';
        ctx.fill();
        ctx.restore();

        p.y += p.speedY;
        p.x += p.drift + Math.sin(p.y * 0.012) * 0.35;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 14) {
          p.y = -14;
          p.x = Math.random() * canvas.width;
        }
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

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 55, startDelay = 2800) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─── Letter-by-letter name reveal ────────────────────────────────────────────
function NameReveal({ name }) {
  return (
    <div className="mb-6 flex flex-wrap justify-center">
      {name.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -28, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: i * 0.09 + 0.4, type: 'spring', stiffness: 110 }}
          className="font-dancing text-white inline-block"
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            textShadow: '0 0 30px rgba(232,105,138,0.9), 0 0 60px rgba(167,139,250,0.4)',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero({ settings }) {
  const heroName = settings?.heroName || 'My Love';
  const heroMessage =
    settings?.heroMessage || 'Every moment with you is a story worth telling...';

  const { displayed, done } = useTypewriter(heroMessage, 52, 2600);

  const scrollToStory = () =>
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Petal canvas — floats above the photo */}
      <PetalCanvas />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <NameReveal name={heroName} />

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.9 }}
          className="h-px mb-8 mx-auto max-w-xs"
          style={{
            background: 'linear-gradient(to right, transparent, #e8698a, #a78bfa, #e8698a, transparent)',
          }}
        />

        {/* Typewriter message */}
        <div className="min-h-[56px] mb-10">
          <p className="font-playfair text-lg md:text-xl text-white italic leading-relaxed" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            {displayed}
            {!done && (
              <span className="text-blood animate-pulse font-light">|</span>
            )}
          </p>
        </div>

        {/* CTA */}
        {done && (
          <motion.button
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            onClick={scrollToStory}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="relative font-cinzel text-xs tracking-[0.22em] text-white px-9 py-4 rounded-full overflow-hidden border border-blood/40 hover:border-blood/80 transition-colors group"
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgba(232,105,138,0.15) 0%, rgba(167,139,250,0.15) 100%)' }}
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
            <span className="relative z-10">Begin Our Story →</span>
          </motion.button>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-5 h-9 border border-blood/35 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-blood/70 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
