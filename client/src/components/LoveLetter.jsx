import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';

const letterParagraphs = [
  "Meri pyaari jaan,",

  "Kabhi kabhi shayad main cheezon ko zyada soch leta hoon… overthink kar leta hoon. Kabhi zyada care kar deta hoon, aur kabhi us care ka tareeka thoda rude lag jata hoga.",

  "Par ek baat sach hai — jitna main express nahi kar pata, usse kahin zyada main feel karta hoon. Tum meri life ka woh hissa ban chuki ho jiske bina sab kuch thoda adhoora sa lagta hai.",

  "2020 ka woh din church mein aaj bhi yaad hai. Tumhari simplicity, tumhara calm sa presence… pata nahi kyun us moment mein laga ki kuch special hai.",

  "Rudrapur ka woh time, saath bitaye hue woh simple moments… honestly unme koi bada plan nahi tha, par phir bhi woh mere liye bahut special ban gaye.",

  "Kabhi kabhi main galat tareeke se react kar deta hoon, kabhi unnecessarily overprotective ho jata hoon. Shayad isliye kyunki tum mere liye bahut important ho.",

  "Main perfect nahi hoon… par ek cheez main hamesha sach rakhunga — mera pyaar tumhare liye. Woh kabhi fake nahi tha, kabhi kam nahi hoga.",

  "Bas itna hi kehna tha… jo bhi ho, jitni bhi misunderstandings aayein, mere dil mein tumhari jagah hamesha special rahegi.",

  "Hamesha tumhara.",
  "— me ❤️",
];
/* ─── Falling rose petals canvas ─────────────────────────────────────────── */
function PetalsCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const COLORS = ['#d4607a', '#e8698a', '#c9a84c', '#f4b8c8', '#b5451b'];
    const petals = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rx: Math.random() * 7 + 4,
      ry: Math.random() * 12 + 6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      speedY: Math.random() * 0.55 + 0.18,
      drift: (Math.random() - 0.5) * 0.35,
      wobble: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.22 + 0.06,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.wobble += 0.013; p.y += p.speedY; p.x += p.drift + Math.sin(p.wobble) * 0.4; p.rot += p.rotSpeed;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}

/* ─── Warm golden firefly field ───────────────────────────────────────────── */
const FIREFLIES = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2.5 + 0.8,
  delay: Math.random() * 5,
  duration: Math.random() * 3.5 + 2,
  color: ['#c9a84c', '#f4d03f', '#e8698a', '#d4a5a5', '#f4b8c8'][Math.floor(Math.random() * 5)],
  dy: Math.random() * 10 + 4,
}));

function FireflyField() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {FIREFLIES.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full"
          style={{ top: f.top, left: f.left, width: f.size, height: f.size, background: f.color, boxShadow: `0 0 ${f.size * 4}px ${f.color}` }}
          animate={{ opacity: [0.04, 0.85, 0.04], scale: [1, 1.7, 1], y: [0, -f.dy, 0] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Envelope opening reveal — gold & crimson ────────────────────────────── */
function EnvelopeReveal({ onDone }) {
  const [flapOpen, setFlapOpen] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFlapOpen(true), 800);
    const t2 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <motion.div
      key="envelope-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'radial-gradient(ellipse at center, #1c0608 0%, #0a0204 72%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 36,
      }}
    >
      <FireflyField />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ position: 'relative', width: 300, height: 190, zIndex: 2 }}
      >
        {/* Body */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 10,
          background: 'linear-gradient(145deg, #3d0a0a 0%, #240505 100%)',
          border: '1.5px solid rgba(201,168,76,0.55)',
          boxShadow: '0 0 80px rgba(201,168,76,0.25), 0 20px 80px rgba(139,26,26,0.3)',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg style={{ position: 'absolute', bottom: 0, left: 0 }} width="300" height="110" viewBox="0 0 300 110">
            <polygon points="0,110 150,22 300,110" fill="rgba(139,26,26,0.2)" />
            <polyline points="0,110 150,22 300,110" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1.2" />
          </svg>
          <motion.span
            animate={{ scale: flapOpen ? [1, 1.3, 1] : 1, opacity: flapOpen ? 1 : 0, y: flapOpen ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.7, type: 'spring' }}
            style={{ fontSize: 56, filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.9))', zIndex: 1, position: 'relative' }}
          >
            💌
          </motion.span>
        </div>

        {/* Flap */}
        <motion.div
          animate={{ rotateX: flapOpen ? -160 : 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute', top: 0, left: 0, width: 300, height: 100,
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            background: 'linear-gradient(180deg, #5a1a1a 0%, #3d0a0a 100%)',
            transformOrigin: '50% 0%',
            transformStyle: 'preserve-3d',
            zIndex: 3,
          }}
        />
        <svg style={{ position: 'absolute', top: 0, left: 0, zIndex: 4, pointerEvents: 'none' }} width="300" height="100" viewBox="0 0 300 100">
          <polyline points="0,0 150,100 300,0" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" />
        </svg>

        {/* Wax seal — gold */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 280 }}
          style={{
            position: 'absolute', top: 48, left: '50%', transform: 'translateX(-50%)',
            width: 34, height: 34, borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c 0%, #7a3a00 100%)',
            boxShadow: '0 0 22px rgba(201,168,76,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, zIndex: 5,
          }}
        >
          ❤️
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ color: '#c9a84c', fontSize: 12, letterSpacing: '0.42em', textTransform: 'uppercase', zIndex: 2, fontFamily: 'Georgia, serif' }}
      >
        {flapOpen ? 'opening just for you…' : 'a letter from the heart'}
      </motion.p>
    </motion.div>
  );
}

/* ─── Typewriter paragraph — parchment ink ────────────────────────────────── */
function TypewriterLine({ text, isFirst, isSignature, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let i = 0;
    const delay = index * 120;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, isFirst ? 80 : 28);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, text, index, isFirst]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -14 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mb-7"
    >
      {isFirst && (
        <motion.div
          className="absolute -left-4 top-0 bottom-0 w-0.5 rounded-full"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(to bottom, #c9a84c, #b5451b)', transformOrigin: 'top' }}
        />
      )}
      <p
        className={`leading-relaxed ${
          isFirst
            ? 'text-2xl md:text-3xl pl-4'
            : isSignature
            ? 'text-xl text-right mt-6'
            : 'text-base md:text-lg'
        }`}
        style={{
          color: isFirst ? '#7a1515' : isSignature ? '#7a3a00' : '#2c1a1a',
          fontFamily: isFirst || isSignature ? 'Georgia, "Times New Roman", serif' : '"Palatino Linotype", Palatino, serif',
          fontStyle: isFirst || isSignature ? 'italic' : 'normal',
          fontWeight: isFirst ? 600 : 400,
          letterSpacing: isFirst ? '0.02em' : '0.01em',
          minHeight: '1.5em',
        }}
      >
        {displayed}
        {!done && inView && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: '#8b1a1a', fontWeight: 300 }}
          >|</motion.span>
        )}
      </p>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export default function LoveLetter({ onClose }) {
  const glowRef = useRef(null);

  useEffect(() => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, {
      opacity: 0.75,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, []);

  const [envelopeDone, setEnvelopeDone] = useState(false);

  return (
    <motion.div
      key="love-letter-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1c0508 0%, #0d0204 45%, #060102 100%)' }}
    >
      <FireflyField />
      <PetalsCanvas />

      {/* Close */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.15 }}
        className="fixed top-5 right-6 z-[70] text-3xl leading-none"
        style={{ color: 'rgba(201,168,76,0.45)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,168,76,0.45)')}
        aria-label="Close letter"
      >
        ✕
      </motion.button>

      <AnimatePresence>
        {!envelopeDone && <EnvelopeReveal onDone={() => setEnvelopeDone(true)} />}
      </AnimatePresence>

      {/* Warm ambient glow */}
      <div
        ref={glowRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 45% at 50% 92%, rgba(201,168,76,0.07) 0%, transparent 70%)',
          zIndex: 2,
        }}
      />

      <AnimatePresence>
        {envelopeDone && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            {/* ── Header ── */}
            <div className="pt-16 pb-8 text-center px-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: ['drop-shadow(0 0 10px rgba(201,168,76,0.55))', 'drop-shadow(0 0 28px rgba(201,168,76,1))', 'drop-shadow(0 0 10px rgba(201,168,76,0.55))'],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-5 inline-block"
              >
                💌
              </motion.div>

              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.48em' }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-xs uppercase mb-4 block"
                style={{ color: '#c9a84c', fontFamily: 'Georgia, serif', letterSpacing: '0.48em' }}
              >
                written from the heart
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-6"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.4rem,7vw,4rem)',
                  background: 'linear-gradient(135deg, #c9a84c 0%, #f4d03f 35%, #d4a030 65%, #8b5a0a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 14px rgba(201,168,76,0.35))',
                }}
              >
                I Miss You
              </motion.h1>

              {/* Gold ornament divider */}
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-px w-28"
                  style={{ background: 'linear-gradient(to right, transparent, #c9a84c)', transformOrigin: 'right' }}
                />
                <motion.span
                  initial={{ scale: 0, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 260 }}
                  style={{ color: '#c9a84c', fontSize: '1.05rem' }}
                >
                  ✦
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-px w-28"
                  style={{ background: 'linear-gradient(to left, transparent, #c9a84c)', transformOrigin: 'left' }}
                />
              </div>
            </div>

            {/* ── Parchment paper card ── */}
            <div className="max-w-2xl mx-auto px-4 md:px-6 pb-28">
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, #fdf8f0 0%, #faeedd 50%, #fdf6e8 100%)',
                  border: '1px solid rgba(201,168,76,0.45)',
                  boxShadow: '0 0 60px rgba(201,168,76,0.12), 0 25px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                {/* Corner SVG ornaments */}
                {[
                  { cls: 'top-2.5 left-2.5', d: 'M0,18 L0,0 L18,0' },
                  { cls: 'top-2.5 right-2.5', d: 'M18,18 L18,0 L0,0' },
                  { cls: 'bottom-2.5 left-2.5', d: 'M0,0 L0,18 L18,18' },
                  { cls: 'bottom-2.5 right-2.5', d: 'M18,0 L18,18 L0,18' },
                ].map(({ cls, d }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.08, type: 'spring' }}
                    className={`absolute ${cls} pointer-events-none`}
                    style={{ zIndex: 2 }}
                  >
                    <svg width="20" height="20" fill="none">
                      <path d={d} stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                ))}

                {/* Parchment ruled lines */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{ zIndex: 0 }}>
                  {Array.from({ length: 22 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-px"
                      style={{ top: `${52 + i * 38}px`, background: 'rgba(160,110,60,0.09)' }}
                    />
                  ))}
                  {/* Left margin rule — pink like real notebooks */}
                  <div
                    className="absolute top-0 bottom-0 w-px"
                    style={{ left: 60, background: 'rgba(180,60,60,0.18)' }}
                  />
                </div>

                {/* Shimmer sweep */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ delay: 0.7, duration: 1.4, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', zIndex: 3 }}
                />

                <div className="relative z-10 p-8 md:p-14">
                  {/* Top triple-rule ornament */}
                  <div className="flex items-center gap-3 mb-10">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.55))' }} />
                    <span style={{ color: '#c9a84c', fontSize: '0.7rem', letterSpacing: '0.35em', fontFamily: 'serif' }}>✦ ✦ ✦</span>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.55))' }} />
                  </div>

                  {/* Letter body */}
                  <div className="pl-6">
                    {letterParagraphs.map((para, i) => (
                      <TypewriterLine
                        key={i}
                        text={para}
                        isFirst={i === 0}
                        isSignature={i === letterParagraphs.length - 1 || i === letterParagraphs.length - 2}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* Bottom ornament rule */}
                  <div className="flex items-center gap-3 mt-8 mb-10">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.55))' }} />
                    <span style={{ color: '#c9a84c', fontSize: '0.7rem', letterSpacing: '0.35em', fontFamily: 'serif' }}>✦</span>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.55))' }} />
                  </div>

                  {/* Wax seal — gold */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.8, type: 'spring', stiffness: 180, damping: 12 }}
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 16px rgba(201,168,76,0.45)',
                            '0 0 40px rgba(201,168,76,0.9)',
                            '0 0 16px rgba(201,168,76,0.45)',
                          ],
                        }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{ background: 'radial-gradient(circle, #c9a84c 0%, #7a3a00 55%, #4a1800 100%)' }}
                      >
                        ❤️
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
