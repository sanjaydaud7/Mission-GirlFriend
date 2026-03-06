import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Lightbox({ item, onClose }) {
  // item may be a photo object { src } or legacy { mediaUrl, mediaType }
  const src = item.src || item.mediaUrl || '';
  const isVideo = item.mediaType === 'video';
  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/96 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.82, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        {isVideo ? (
          <video
            src={src}
            autoPlay
            muted
            controls
            className="w-full max-h-[78vh] rounded-lg border border-blood/30 object-contain"
          />
        ) : (
          <img
            src={src}
            alt={item.title}
            className="w-full max-h-[78vh] rounded-lg border border-blood/30 object-contain"
          />
        )}

        {/* Caption (only shown for legacy API memories) */}
        {(item.title || item.caption) && (
          <div className="mt-4 text-center">
            {item.title && <h3 className="font-playfair text-white text-xl">{item.title}</h3>}
            {item.caption && (
              <p className="font-dancing text-gold text-xl mt-1 italic">{item.caption}</p>
            )}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-4 -right-4 w-10 h-10 bg-blood rounded-full flex items-center justify-center text-white text-sm hover:bg-red-800 transition-colors box-glow"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
