import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { id: 'hero',      label: 'Home',        icon: '🏠' },
  { id: 'story',     label: 'Our Story',   icon: '📖' },
  { id: 'memories',  label: 'Memories',    icon: '🖼️' },
  { id: 'letter',    label: 'Love Letter', icon: '💌' },
  { id: 'countdown', label: 'Countdown',   icon: '⏳' },
];

export default function Navbar({ onLock }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) { setActive(link.id); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.45) 0%,transparent 100%)',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: 'none',
          boxShadow: 'none',
          transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-3 md:py-4 max-w-[1400px] mx-auto">

          {/* ── Logo ── */}
          <motion.button
            onClick={() => scrollTo('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <motion.span
              animate={{ rotate: [0, 12, -8, 12, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 0 8px #f72585)' }}
            >
              ❤️
            </motion.span>
            <span
              className="font-serif text-lg md:text-xl tracking-wide"
              style={{
                background: 'linear-gradient(135deg,#f72585 0%,#ff85b3 45%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 12px rgba(247,37,133,0.5))',
              }}
            >
              Mission GF
            </span>
          </motion.button>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  whileHover={{ y: -1 }}
                  className="relative px-3 py-2 text-xs tracking-[0.15em] uppercase font-medium rounded-lg transition-colors duration-200"
                  style={{
                    color: isActive ? '#fff' : 'rgba(252,231,255,0.55)',
                  }}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(247,37,133,0.15)', border: '1px solid rgba(247,37,133,0.3)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  {/* Hover glow */}
                  <span className="relative z-10">{link.label}</span>
                  {/* Active dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#f72585', boxShadow: '0 0 6px #f72585', bottom: '3px' }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ── Right side: Valentine + Lock ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Valentine button — gradient fill */}
            <motion.button
              onClick={() => navigate('/valentine')}
              whileHover={{ scale: 1.06, boxShadow: '0 0 22px rgba(247,37,133,0.55)' }}
              whileTap={{ scale: 0.94 }}
              className="text-xs tracking-[0.12em] uppercase px-5 py-2 rounded-full font-semibold"
              style={{
                background: 'linear-gradient(135deg,#f72585 0%,#c2185b 60%,#9c27b0 100%)',
                color: '#fff',
                boxShadow: '0 0 14px rgba(247,37,133,0.35), 0 2px 8px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.12)',
                letterSpacing: '0.12em',
              }}
            >
              💝 Valentine
            </motion.button>

            {/* Lock — icon pill */}
            <motion.button
              onClick={onLock}
              whileHover={{ scale: 1.08, color: '#f72585' }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase px-3 py-2 rounded-lg transition-colors duration-300"
              style={{
                color: 'rgba(252,231,255,0.35)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              🔒 <span>Lock</span>
            </motion.button>
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg"
            style={{ background: 'rgba(247,37,133,0.1)', border: '1px solid rgba(247,37,133,0.25)' }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block w-4 h-0.5 rounded-full"
              style={{ background: '#f72585', transition: 'all 0.25s' }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-4 h-0.5 rounded-full"
              style={{ background: 'rgba(247,37,133,0.6)', transition: 'all 0.25s' }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="block w-4 h-0.5 rounded-full"
              style={{ background: '#f72585', transition: 'all 0.25s' }}
            />
          </motion.button>
        </div>

        {/* ── Mobile Dropdown ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom,rgba(5,2,18,0.98),rgba(12,4,24,0.99))',
                borderTop: '1px solid rgba(247,37,133,0.18)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div className="px-5 py-3 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(link.id)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs tracking-[0.14em] uppercase text-left transition-all duration-200"
                    style={{
                      color: active === link.id ? '#fff' : 'rgba(252,231,255,0.5)',
                      background: active === link.id ? 'rgba(247,37,133,0.12)' : 'transparent',
                      borderLeft: active === link.id ? '2px solid #f72585' : '2px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: '0.95rem' }}>{link.icon}</span>
                    {link.label}
                  </motion.button>
                ))}

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(247,37,133,0.12)', margin: '6px 0' }} />

                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: NAV_LINKS.length * 0.05 }}
                  onClick={() => { setMenuOpen(false); navigate('/valentine'); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs tracking-[0.14em] uppercase"
                  style={{
                    background: 'linear-gradient(135deg,rgba(247,37,133,0.18),rgba(156,39,176,0.14))',
                    border: '1px solid rgba(247,37,133,0.3)',
                    color: '#f72585',
                  }}
                >
                  <span style={{ fontSize: '0.95rem' }}>💝</span> Valentine
                </motion.button>

                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (NAV_LINKS.length + 1) * 0.05 }}
                  onClick={() => { setMenuOpen(false); onLock && onLock(); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs tracking-[0.14em] uppercase"
                  style={{ color: 'rgba(252,231,255,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span style={{ fontSize: '0.95rem' }}>🔒</span> Lock Site
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

