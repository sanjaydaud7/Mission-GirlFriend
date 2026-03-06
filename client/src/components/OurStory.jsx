import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import img1 from '../Images/WhatsApp Image 2026-03-06 at 6.33.30 PM (9).jpeg';
import img2 from '../Images/IMG-20240717-WA0001.jpg';
import img3 from '../Images/WhatsApp Image 2026-03-06 at 6.33.30 PM (14).jpeg';
import img4 from '../Images/WhatsApp Image 2026-03-06 at 6.33.30 PM.jpeg';

const STORY_EVENTS = [
  {
    id: 1, emoji: '✨', date: 'The Beginning', title: 'The Day We Met',
    description: "Some stories start with a crash, others with a smile. Ours started with a moment I knew I'd never forget. You walked in and the whole room shifted.",
    image: img1,
    accent: '#e8698a',
    bg: 'linear-gradient(145deg,#1e0416 0%,#2d0520 55%,#160412 100%)',
    glow: 'rgba(232,105,138,0.22)',
    tag: '#e8698a',
  },
  {
    id: 2, emoji: '🌹', date: 'A Month Later', title: 'Our First Date',
    description: 'Nervous hands, warm laughter, and the slow realization that I could spend forever just listening to you talk about everything and nothing at all.',
    image: img2,
    accent: '#c9a84c',
    bg: 'linear-gradient(145deg,#120808 0%,#2a1005 55%,#0e0605 100%)',
    glow: 'rgba(201,168,76,0.2)',
    tag: '#c9a84c',
  },
  {
    id: 3, emoji: '🌍', date: 'Growing Together', title: 'Adventures Begin',
    description: 'Road trips with no plan, late nights with no end, and inside jokes no one else would ever understand. Just us, against the whole wide world.',
    image: img3,
    accent: '#7b8fff',
    bg: 'linear-gradient(145deg,#060820 0%,#0c1035 55%,#060810 100%)',
    glow: 'rgba(123,143,255,0.22)',
    tag: '#7b8fff',
  },
  {
    id: 4, emoji: '💫', date: 'Every Single Day', title: 'The Ordinary Magic',
    description: 'The ordinary moments became the most extraordinary ones. Coffee in the morning, your laugh in the afternoon, and you beside me at night. Perfect.',
    image: img4,
    accent: '#ff8c69',
    bg: 'linear-gradient(145deg,#180a02 0%,#2a1005 55%,#120600 100%)',
    glow: 'rgba(255,140,105,0.2)',
    tag: '#ff8c69',
  },
];

/* ─── Typewriter hook ─── */
function useTypewriter(text, speed = 22, active = false) {
  const [displayed, setDisplayed] = useState('');
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [active, text, speed]);
  return displayed;
}

function TimelineCard({ event, index }) {
  const isLeft = index % 2 === 0;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.18 });
  const typedDesc = useTypewriter(event.description, 20, inView);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div ref={ref} className={`flex items-center gap-6 md:gap-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-20 relative`}>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -70 : 70, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 max-w-sm"
        style={{ filter: inView ? `drop-shadow(0 8px 40px ${event.glow})` : 'none' }}
      >
        <div
          className="rounded-2xl relative overflow-hidden"
          style={{
            background: event.bg,
            border: `1px solid ${event.accent}38`,
            boxShadow: `0 0 0 1px ${event.accent}12, inset 0 1px 0 rgba(255,255,255,0.07)`,
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${event.accent}, transparent)` }} />

          {/* Image section */}
          <div className="relative overflow-hidden" style={{ height: 200 }}>
            <motion.img
              src={event.image}
              alt={event.title}
              onLoad={() => setImgLoaded(true)}
              className="w-full h-full object-cover"
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            {/* Gradient overlay on image */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, transparent 40%, ${event.bg.match(/#[0-9a-f]+/i)?.[0] ?? '#0e0405'} 100%)` }}
            />
            {/* Emoji badge */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.35, type: 'spring', stiffness: 260 }}
              className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-xl"
              style={{
                background: `radial-gradient(circle, ${event.accent}30, rgba(0,0,0,0.6))`,
                border: `1.5px solid ${event.accent}60`,
                backdropFilter: 'blur(6px)',
                boxShadow: `0 0 14px ${event.accent}80`,
              }}
            >
              {event.emoji}
            </motion.div>
            {/* Date tag */}
            <div
              className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs tracking-widest uppercase"
              style={{
                background: `${event.accent}22`,
                border: `1px solid ${event.accent}50`,
                color: event.accent,
                backdropFilter: 'blur(8px)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
              }}
            >
              {event.date}
            </div>
          </div>

          {/* Text body */}
          <div className="p-6 pt-5">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-xl font-semibold mb-3 tracking-wide"
              style={{
                fontFamily: 'Georgia, serif',
                color: '#fff',
                textShadow: `0 0 16px ${event.accent}55`,
              }}
            >
              {event.title}
            </motion.h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(255,235,235,0.62)', minHeight: '3.6em', fontFamily: 'Palatino, serif' }}
            >
              {typedDesc || '\u00A0'}
            </p>

            {/* Bottom divider with accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-5 h-px"
              style={{ background: `linear-gradient(to right, ${event.accent}70, transparent)`, transformOrigin: 'left' }}
            />
          </div>

          {/* Corner glow */}
          <div
            className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none rounded-br-2xl"
            style={{ background: `radial-gradient(circle at bottom right, ${event.accent}14 0%, transparent 70%)` }}
          />
        </div>
      </motion.div>

      {/* ── Center timeline dot ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        className="hidden md:flex flex-shrink-0 w-6 h-6 rounded-full items-center justify-center z-10"
        style={{ background: event.accent, boxShadow: `0 0 16px ${event.accent}, 0 0 38px ${event.glow}` }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.div>

      {/* Empty side */}
      <div className="flex-1 max-w-sm hidden md:block" />
    </div>
  );
}

export default function OurStory() {
  return (
    <section id="story" className="min-h-screen w-full py-8">
      {/* Header */}
      <div className="pt-16 pb-14 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.45em] mb-4"
          style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
        >
          chapter by chapter
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 7vw, 4rem)',
            background: 'linear-gradient(135deg, #fff 0%, #fce7ff 40%, #e8698a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 20px rgba(232,105,138,0.35))',
          }}
        >
          Our Story
        </motion.h1>
        <div className="flex items-center justify-center gap-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="h-px w-24"
            style={{ background: 'linear-gradient(to right, transparent, #e8698a)', transformOrigin: 'right' }}
          />
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.75, type: 'spring' }}
            style={{ color: '#e8698a', fontSize: '0.9rem' }}
          >✦</motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="h-px w-24"
            style={{ background: 'linear-gradient(to left, transparent, #e8698a)', transformOrigin: 'left' }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 pb-24">
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{ background: 'linear-gradient(to bottom, transparent, #e8698a 10%, #c9a84c 35%, #7b8fff 65%, #ff8c69 90%, transparent)' }}
        />
        {STORY_EVENTS.map((event, i) => (
          <TimelineCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
