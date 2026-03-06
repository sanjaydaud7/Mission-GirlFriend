import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from './Lightbox';

// ─── Load every image from the Images folder except background assets ─────────
const ctx = require.context('../Images', false, /\.(jpe?g|jpg|png|gif|webp)$/i);
const PHOTOS = ctx
  .keys()
  .filter(
    (k) =>
      !k.toLowerCase().includes('upscaled_8k_image') &&
      !k.toLowerCase().includes('img_8508')
  )
  .map((k, i) => ({ id: i, src: ctx(k), filename: k.replace('./', '') }));

// ─── Single photo card ────────────────────────────────────────────────────────
function PhotoCard({ photo, index, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: 'easeOut' }}
      whileHover={{ scale: 1.025 }}
      className="relative overflow-hidden rounded-xl cursor-pointer border border-[#f72585]/15 hover:border-[#f72585]/50 transition-colors duration-300 group"
      style={{ breakInside: 'avoid', marginBottom: '1rem' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(photo)}
    >
      <img
        src={photo.src}
        alt={`memory-${photo.id}`}
        className="w-full object-cover"
        style={{
          display: 'block',
          filter: hovered ? 'blur(0px) brightness(1) sepia(0)' : 'blur(7px) brightness(0.6) sepia(0.3)',
          transform: hovered ? 'scale(1.05)' : 'scale(1.01)',
          transition: 'filter 0.75s ease, transform 0.5s ease',
        }}
      />

      {/* Overlay */}
      <AnimatePresence mode="wait">
        {hovered ? (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-end justify-center pb-5"
            style={{ background: 'linear-gradient(to top, rgba(5,6,15,0.85) 0%, transparent 60%)' }}
          >
            <span className="text-[#f72585] text-2xl drop-shadow-lg">🖼️</span>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: 'rgba(3,1,10,0.15)' }}
          >
            <motion.span
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 8px rgba(232,105,138,0.85))' }}
            >
              ✨
            </motion.span>
            <span style={{ fontSize: '0.52rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(232,105,138,0.65)' }}>
              hover to reveal
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Memory Wall section ──────────────────────────────────────────────────────
export default function MemoryWall() {
  const [lightboxItem, setLightboxItem] = useState(null);

  return (
    <section
      id="memories"
      className="relative py-24 px-6"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <p className="font-dancing text-blood text-2xl mb-2">Captured Moments</p>
        <h2 className="font-cinzel text-4xl md:text-5xl text-white mb-5">Memory Wall</h2>
        <div className="section-divider w-48 mx-auto" />
      </motion.div>

      {/* Masonry photo grid */}
      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {PHOTOS.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} index={i} onOpen={setLightboxItem} />
        ))}
      </div>

      {PHOTOS.length === 0 && (
        <p className="text-center text-gray-600 font-playfair italic py-24">
          No photos found in the Images folder.
        </p>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
