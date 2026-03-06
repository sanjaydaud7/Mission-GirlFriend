import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import OurStory from '../components/OurStory';
import MemoryWall from '../components/MemoryWall';
import LoveLetter from '../components/LoveLetter';
import Countdown from '../components/Countdown';
import api from '../utils/api';
import bgImage from '../Images/IMG_8508.JPG.jpeg';

export default function Home({ onLock }) {
  const [settings, setSettings] = useState(null);
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    api
      .get('/api/settings')
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen"
    >
      {/* ── Scrolling full-page background image ── */}
      <div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
        }}
      />
      {/* Dark scrim — rich gradient overlay */}
      <div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{
          background:
            'linear-gradient(to bottom,rgba(0,0,0,0.48) 0%,rgba(4,2,14,0.38) 40%,rgba(6,1,18,0.48) 70%,rgba(0,0,0,0.60) 100%)',
        }}
      />
      {/* Fixed ambient navigation */}
      <Navbar onLock={onLock} />

      {/* ── Single-page sections ── */}
      <Hero settings={settings} />

      {/* Section separator */}
      <div className="section-divider mx-auto max-w-xs opacity-40" />

      <OurStory />

      <div className="section-divider mx-auto max-w-xs opacity-40" />

      <MemoryWall />

      <div className="section-divider mx-auto max-w-xs opacity-40" />

      {/* Love Letter trigger */}
      <section id="letter" className="py-24 flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.4em] mb-4"
          style={{ color: '#c084fc' }}
        >
          written from the heart
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-serif text-4xl md:text-5xl text-white mb-8"
          style={{ textShadow: '0 0 30px rgba(247,37,133,0.5)' }}
        >
          A Love Letter
        </motion.h2>
        <motion.button
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLetterOpen(true)}
          className="text-4xl mb-4 cursor-pointer"
          style={{ filter: 'drop-shadow(0 0 18px rgba(247,37,133,0.9))' }}
        >
          💌
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/50 tracking-widest uppercase"
        >
          tap to open
        </motion.p>
      </section>

      {/* Love Letter modal */}
      <AnimatePresence>
        {letterOpen && <LoveLetter onClose={() => setLetterOpen(false)} />}
      </AnimatePresence>

      <div className="section-divider mx-auto max-w-xs opacity-40" />

      <Countdown />

      {/* Footer */}
      <footer className="py-12 text-center border-t border-blood/15"
        style={{ background: 'linear-gradient(to top, rgba(12,17,34,0.6), transparent)' }}>
        <motion.p
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="font-dancing text-blood text-3xl"
        >
          Made with ❤ — only for you
        </motion.p>
        <p className="font-cinzel text-mist/30 text-xs tracking-widest mt-2">
          Mission Girlfriend
        </p>
      </footer>
    </motion.div>
  );
}
